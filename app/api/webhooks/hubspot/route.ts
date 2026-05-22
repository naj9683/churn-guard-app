/**
 * POST /api/webhooks/hubspot
 *
 * Receives real-time contact change events from HubSpot and immediately
 * refreshes the affected customer records in ChurnGuard.
 *
 * Setup in HubSpot:
 *   1. In your HubSpot developer app → Webhooks → Add subscription
 *   2. Event type: contact.propertyChange (choose relevant properties)
 *   3. Target URL: https://churnguardapp.com/api/webhooks/hubspot
 *   4. The HUBSPOT_CLIENT_SECRET env var is used for signature verification.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getValidHubSpotToken } from '@/lib/crm/hubspot';

const HUBSPOT_API = 'https://api.hubapi.com';

interface HubSpotWebhookEvent {
  objectId: number;
  propertyName?: string;
  propertyValue?: string;
  subscriptionType: string;
  occurredAt: number;
  portalId?: number;
}

function verifySignature(secret: string, rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(secret + rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  if (clientSecret) {
    const signature = request.headers.get('X-HubSpot-Signature');
    if (!verifySignature(clientSecret, rawBody, signature)) {
      console.warn('[HubSpot Webhook] Invalid signature — rejected');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let events: HubSpotWebhookEvent[];
  try {
    events = JSON.parse(rawBody);
    if (!Array.isArray(events)) events = [events];
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (events.length === 0) return NextResponse.json({ ok: true, processed: 0 });

  // Deduplicate contact IDs
  const seen = new Set<string>();
  const contactIds: string[] = [];
  for (const e of events) {
    const id = String(e.objectId);
    if (!seen.has(id)) { seen.add(id); contactIds.push(id); }
  }

  let processed = 0;
  const errors: string[] = [];

  for (const contactId of contactIds) {
    const customer = await prisma.customer.findFirst({
      where: { externalId: `hubspot_${contactId}` },
      select: { id: true, userId: true, email: true },
    });
    if (!customer) continue;

    try {
      const token = await getValidHubSpotToken(customer.userId);
      const props = 'email,firstname,lastname,company,phone,mobilephone,amount,lifecyclestage,notes_last_contacted';
      const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${contactId}?properties=${props}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        errors.push(`contact ${contactId}: HTTP ${res.status}`);
        continue;
      }

      const contact = await res.json();
      const p = contact.properties ?? {};
      const name = [p.firstname, p.lastname].filter(Boolean).join(' ') || customer.email;
      const mrr  = parseFloat(p.amount ?? '0') || undefined;

      const parseTs = (raw: string | undefined): Date | null => {
        if (!raw) return null;
        const ms = parseInt(raw, 10);
        return isNaN(ms) || ms < 946684800000 ? null : new Date(ms);
      };

      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name,
          crmId: contactId,
          updatedAt: new Date(),
          ...(mrr !== undefined ? { mrr } : {}),
          ...(parseTs(p.notes_last_contacted) ? { lastLoginAt: parseTs(p.notes_last_contacted)! } : {}),
        },
      });

      await prisma.crmSyncLog.create({
        data: {
          userId: customer.userId,
          crmType: 'hubspot',
          direction: 'inbound',
          entityType: 'contact',
          entityId: contactId,
          status: 'success',
          message: `Webhook: updated customer ${customer.email}`,
        },
      });

      processed++;
    } catch (e: any) {
      errors.push(`contact ${contactId}: ${e.message}`);
      console.error('[HubSpot Webhook] Error processing contact', contactId, e.message);
    }
  }

  return NextResponse.json({ ok: true, processed, errors });
}
