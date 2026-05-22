/**
 * POST /api/webhooks/salesforce
 *
 * REST webhook for real-time Salesforce contact updates.
 * Called from a Salesforce Flow (or Apex trigger with HTTP callout) whenever
 * a Contact record changes.
 *
 * Salesforce Flow setup:
 *   1. Create a new Flow triggered by Record-Changed (Contact object)
 *   2. Add an HTTP Callout action → POST to https://churnguardapp.com/api/webhooks/salesforce
 *   3. Body: { "contactId": "{!Contact.Id}", "email": "{!Contact.Email}",
 *              "firstName": "{!Contact.FirstName}", "lastName": "{!Contact.LastName}",
 *              "annualRevenue": "{!Contact.Account.AnnualRevenue}" }
 *   4. Add header X-ChurnGuard-Secret: <value of SALESFORCE_WEBHOOK_SECRET env var>
 *
 * Auth: X-ChurnGuard-Secret header (set SALESFORCE_WEBHOOK_SECRET env var).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const secret = process.env.SALESFORCE_WEBHOOK_SECRET;
  if (secret) {
    const provided = request.headers.get('X-ChurnGuard-Secret');
    if (provided !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const contactId   = String(body.contactId ?? '').trim();
  const email       = String(body.email ?? '').trim().toLowerCase();
  const firstName   = String(body.firstName ?? '').trim();
  const lastName    = String(body.lastName ?? '').trim();
  const annualRev   = parseFloat(String(body.annualRevenue ?? '0')) || 0;

  if (!contactId && !email) {
    return NextResponse.json({ error: 'contactId or email required' }, { status: 400 });
  }

  const customer = await prisma.customer.findFirst({
    where: contactId
      ? { externalId: `salesforce_${contactId}` }
      : { email },
    select: { id: true, userId: true, email: true },
  });

  if (!customer) {
    return NextResponse.json({ ok: true, updated: false, reason: 'contact not in ChurnGuard' });
  }

  const name = [firstName, lastName].filter(Boolean).join(' ') || customer.email;
  const mrr  = Math.round(annualRev / 12);

  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      name,
      ...(contactId ? { crmId: contactId } : {}),
      ...(mrr > 0 ? { mrr } : {}),
      updatedAt: new Date(),
    },
  });

  await prisma.crmSyncLog.create({
    data: {
      userId: customer.userId,
      crmType: 'salesforce',
      direction: 'inbound',
      entityType: 'contact',
      entityId: contactId || customer.id,
      status: 'success',
      message: `Webhook: updated customer ${customer.email}`,
    },
  });

  return NextResponse.json({ ok: true, updated: true });
}
