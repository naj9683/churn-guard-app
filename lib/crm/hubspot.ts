/**
 * ChurnGuard ↔ HubSpot bidirectional sync
 *
 * Pull: HubSpot contacts → ChurnGuard customers (upsert by email)
 * Push: ChurnGuard riskScore / healthScore / riskReason → HubSpot contact properties
 *
 * Custom HubSpot properties used (auto-created on first push):
 *   churnguard_risk_score    (number)
 *   churnguard_health_score  (number)
 *   churnguard_risk_reason   (string)
 *   churnguard_last_sync     (string / datetime)
 */

import { prisma } from '@/lib/prisma';

const HUBSPOT_API = 'https://api.hubapi.com';
const CLIENT_ID     = process.env.HUBSPOT_CLIENT_ID!;
const CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET!;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SyncResult {
  pulled: number;
  pushed: number;
  created: number;
  updated: number;
  errors: string[];
}

interface HsContact {
  id: string;
  properties: {
    email?: string;
    firstname?: string;
    lastname?: string;
    company?: string;
    phone?: string;
    mobilephone?: string;
    amount?: string;        // deal value / MRR proxy
    industry?: string;
    lifecyclestage?: string;
  };
}

// ─── Token management ─────────────────────────────────────────────────────────

export async function getValidHubSpotToken(userId: string): Promise<string> {
  const integration = await prisma.crmIntegration.findFirst({ where: { userId, type: 'hubspot' } });
  if (!integration?.accessToken) throw new Error('HubSpot not connected for this user');

  // Refresh if expired (or within 5 minutes of expiry)
  const needsRefresh = integration.expiresAt
    ? integration.expiresAt.getTime() < Date.now() + 5 * 60 * 1000
    : false;

  if (!needsRefresh) return integration.accessToken;

  if (!integration.refreshToken) throw new Error('No refresh token — user must reconnect HubSpot');

  const res = await fetch(`${HUBSPOT_API}/oauth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: integration.refreshToken,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`HubSpot token refresh failed: ${data.message ?? res.status}`);

  await prisma.crmIntegration.update({
    where: { id: integration.id },
    data: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? integration.refreshToken,
      expiresAt: new Date(Date.now() + (data.expires_in ?? 1800) * 1000),
    },
  });

  return data.access_token as string;
}

// ─── HubSpot API helpers ──────────────────────────────────────────────────────

async function hsGet(path: string, token: string) {
  const res = await fetch(`${HUBSPOT_API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`HubSpot GET ${path} → ${res.status}: ${(err as any).message ?? 'unknown'}`);
  }
  return res.json();
}

async function hsPatch(path: string, token: string, body: unknown) {
  const res = await fetch(`${HUBSPOT_API}${path}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`HubSpot PATCH ${path} → ${res.status}: ${(err as any).message ?? 'unknown'}`);
  }
  return res.json();
}

async function hsPost(path: string, token: string, body: unknown) {
  const res = await fetch(`${HUBSPOT_API}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`HubSpot POST ${path} → ${res.status}: ${(err as any).message ?? 'unknown'}`);
  }
  return res.json();
}

// ─── Ensure custom properties exist in HubSpot ───────────────────────────────

async function ensureCustomProperties(token: string): Promise<void> {
  const PROPS = [
    { name: 'churnguard_risk_score',   label: 'ChurnGuard Risk Score',   type: 'number',  fieldType: 'number' },
    { name: 'churnguard_health_score', label: 'ChurnGuard Health Score',  type: 'number',  fieldType: 'number' },
    { name: 'churnguard_risk_reason',  label: 'ChurnGuard Risk Reason',   type: 'string',  fieldType: 'textarea' },
    { name: 'churnguard_last_sync',    label: 'ChurnGuard Last Sync',     type: 'string',  fieldType: 'text' },
  ];

  for (const prop of PROPS) {
    try {
      await hsGet(`/crm/v3/properties/contacts/${prop.name}`, token);
    } catch {
      // Property doesn't exist — create it
      try {
        await hsPost('/crm/v3/properties/contacts', token, {
          name: prop.name,
          label: prop.label,
          type: prop.type,
          fieldType: prop.fieldType,
          groupName: 'contactinformation',
        });
      } catch (e: any) {
        // Ignore "already exists" errors
        if (!e.message?.includes('409') && !e.message?.includes('already exists')) {
          console.warn(`[HubSpot] Could not create property ${prop.name}:`, e.message);
        }
      }
    }
  }
}

// ─── Fetch contacts from HubSpot ─────────────────────────────────────────────

async function fetchAllContacts(token: string): Promise<HsContact[]> {
  const contacts: HsContact[] = [];
  const properties = 'email,firstname,lastname,company,phone,mobilephone,amount,industry,lifecyclestage';
  let after: string | undefined;

  do {
    const url = `/crm/v3/objects/contacts?limit=100&properties=${properties}${after ? `&after=${after}` : ''}`;
    const data = await hsGet(url, token);
    contacts.push(...(data.results ?? []));
    after = data.paging?.next?.after;
  } while (after);

  return contacts;
}

// ─── Main sync function ───────────────────────────────────────────────────────

export async function syncHubSpot(internalUserId: string): Promise<SyncResult> {
  const result: SyncResult = { pulled: 0, pushed: 0, created: 0, updated: 0, errors: [] };

  const token = await getValidHubSpotToken(internalUserId);

  // Ensure our custom properties exist
  await ensureCustomProperties(token);

  // ── PULL: HubSpot contacts → ChurnGuard customers ─────────────────────────
  const contacts = await fetchAllContacts(token);
  result.pulled = contacts.length;

  for (const contact of contacts) {
    const email = contact.properties.email;
    if (!email) continue;

    const name = [contact.properties.firstname, contact.properties.lastname].filter(Boolean).join(' ') || email;
    const mrr  = parseFloat(contact.properties.amount ?? '0') || 0;

    try {
      const existing = await prisma.customer.findFirst({
        where: { userId: internalUserId, email },
      });

      if (existing) {
        await prisma.customer.update({
          where: { id: existing.id },
          data: { name, crmId: contact.id, updatedAt: new Date() },
        });
        result.updated++;
      } else {
        await prisma.customer.create({
          data: {
            userId: internalUserId,
            externalId: `hubspot_${contact.id}`,
            email,
            name,
            mrr,
            crmId: contact.id,
            riskScore: 50,
            healthScore: 80,
          },
        });
        result.created++;

        // Log sync
        await prisma.crmSyncLog.create({
          data: {
            userId: internalUserId,
            crmType: 'hubspot',
            direction: 'inbound',
            entityType: 'contact',
            entityId: contact.id,
            status: 'success',
            message: `Created customer from HubSpot contact: ${email}`,
          },
        });
      }
    } catch (e: any) {
      result.errors.push(`Pull ${email}: ${e.message}`);
    }
  }

  // ── PUSH: ChurnGuard risk data → HubSpot contact properties ──────────────
  const customers = await prisma.customer.findMany({
    where: { userId: internalUserId, crmId: { not: null } },
    select: { id: true, crmId: true, email: true, riskScore: true, healthScore: true, riskReason: true },
  });

  for (const customer of customers) {
    if (!customer.crmId) continue;
    try {
      await hsPatch(`/crm/v3/objects/contacts/${customer.crmId}`, token, {
        properties: {
          churnguard_risk_score:   String(customer.riskScore ?? 50),
          churnguard_health_score: String(customer.healthScore ?? 80),
          churnguard_risk_reason:  customer.riskReason ?? '',
          churnguard_last_sync:    new Date().toISOString(),
        },
      });
      result.pushed++;

      await prisma.crmSyncLog.create({
        data: {
          userId: internalUserId,
          crmType: 'hubspot',
          direction: 'outbound',
          entityType: 'contact',
          entityId: customer.crmId,
          status: 'success',
          message: `Pushed risk score ${customer.riskScore} to HubSpot contact`,
        },
      });
    } catch (e: any) {
      result.errors.push(`Push ${customer.email}: ${e.message}`);
      await prisma.crmSyncLog.create({
        data: {
          userId: internalUserId,
          crmType: 'hubspot',
          direction: 'outbound',
          entityType: 'contact',
          entityId: customer.crmId,
          status: 'error',
          message: e.message,
        },
      });
    }
  }

  // Update lastSyncAt on integration record
  await prisma.crmIntegration.updateMany({
    where: { userId: internalUserId, type: 'hubspot' },
    data: { lastSyncAt: new Date(), syncStatus: result.errors.length > 0 ? 'partial' : 'synced' },
  });

  return result;
}
