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

export class HubSpotReconnectError extends Error {
  constructor() { super('RECONNECT_REQUIRED'); this.name = 'HubSpotReconnectError'; }
}

export async function getValidHubSpotToken(userId: string): Promise<string> {
  const integration = await prisma.crmIntegration.findFirst({ where: { userId, type: 'hubspot' } });
  if (!integration?.accessToken) throw new HubSpotReconnectError();

  // Refresh if expired (or within 5 minutes of expiry)
  const needsRefresh = integration.expiresAt
    ? integration.expiresAt.getTime() < Date.now() + 5 * 60 * 1000
    : false;

  if (!needsRefresh) return integration.accessToken;

  if (!integration.refreshToken) throw new HubSpotReconnectError();
  if (!CLIENT_ID || !CLIENT_SECRET) {
    // Missing env vars — return current token and let the API call surface the real error
    console.warn('[HubSpot] HUBSPOT_CLIENT_ID/SECRET not set, skipping refresh');
    return integration.accessToken;
  }

  const res = await fetch(`${HUBSPOT_API}/oauth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: integration.refreshToken,
    }),
  });
  const data = await res.json();

  if (!res.ok) {
    // 401/400 from HubSpot means the refresh token itself is invalid — need to reconnect
    if (res.status === 401 || res.status === 400) throw new HubSpotReconnectError();
    throw new Error(`HubSpot token refresh failed: ${data.message ?? res.status}`);
  }

  await prisma.crmIntegration.update({
    where: { id: integration.id },
    data: {
      accessToken:  data.access_token,
      refreshToken: data.refresh_token ?? integration.refreshToken,
      expiresAt:    new Date(Date.now() + (data.expires_in ?? 1800) * 1000),
      lastError:    null,
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

// Returns { available: Set of confirmed property names, errors: creation failure messages }
export async function ensureCustomProperties(token: string): Promise<{ available: Set<string>; errors: string[] }> {
  const PROPS = [
    { name: 'churnguard_risk_score',   label: 'ChurnGuard Risk Score',   type: 'number',  fieldType: 'number' },
    { name: 'churnguard_health_score', label: 'ChurnGuard Health Score',  type: 'number',  fieldType: 'number' },
    { name: 'churnguard_risk_reason',  label: 'ChurnGuard Risk Reason',   type: 'string',  fieldType: 'textarea' },
    { name: 'churnguard_last_sync',    label: 'ChurnGuard Last Sync',     type: 'string',  fieldType: 'text' },
  ];

  const available = new Set<string>();
  const errors: string[] = [];

  console.log('[HubSpot] ensureCustomProperties: checking 4 properties');

  for (const prop of PROPS) {
    // 1. Check if property already exists
    try {
      await hsGet(`/crm/v3/properties/contacts/${prop.name}`, token);
      console.log(`[HubSpot] Property exists: ${prop.name}`);
      available.add(prop.name);
      continue;
    } catch (getErr: any) {
      console.log(`[HubSpot] Property not found (${prop.name}): ${getErr.message} — attempting creation`);
    }

    // 2. Try to create it
    try {
      await hsPost('/crm/v3/properties/contacts', token, {
        name: prop.name,
        label: prop.label,
        type: prop.type,
        fieldType: prop.fieldType,
        groupName: 'contactinformation',
      });
      console.log(`[HubSpot] Property created: ${prop.name}`);
      available.add(prop.name);
    } catch (createErr: any) {
      const msg: string = createErr.message ?? '';
      if (msg.includes('409') || msg.includes('already exists')) {
        console.log(`[HubSpot] Property already exists (409): ${prop.name}`);
        available.add(prop.name);
      } else {
        console.error(`[HubSpot] Failed to create property ${prop.name}: ${msg}`);
        errors.push(`${prop.name}: ${msg}`);
      }
    }
  }

  console.log(`[HubSpot] ensureCustomProperties done — available: [${Array.from(available).join(', ')}], errors: ${errors.length}`);
  return { available, errors };
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

  // Ensure our custom properties exist; get back which ones are available
  const { available: availableProps, errors: propErrors } = await ensureCustomProperties(token);
  if (propErrors.length > 0) {
    result.errors.push(`Property setup: ${propErrors.join('; ')} — ensure crm.schemas.contacts.write scope is enabled in your HubSpot app, then reconnect.`);
  }

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
  // Only push customers that originated from HubSpot (externalId = "hubspot_<numericId>").
  // Derive the HubSpot contact ID from externalId directly — never from crmId, which
  // may have been overwritten by a Salesforce sync.
  const customers = await prisma.customer.findMany({
    where: {
      userId: internalUserId,
      externalId: { startsWith: 'hubspot_' },
    },
    select: { id: true, externalId: true, email: true, riskScore: true, healthScore: true, riskReason: true },
  });

  for (const customer of customers) {
    const hubspotContactId = customer.externalId.replace('hubspot_', '');
    if (!hubspotContactId) continue;

    try {
      const props: Record<string, string> = {};
      if (availableProps.has('churnguard_risk_score'))   props['churnguard_risk_score']   = String(customer.riskScore ?? 50);
      if (availableProps.has('churnguard_health_score')) props['churnguard_health_score'] = String(customer.healthScore ?? 80);
      if (availableProps.has('churnguard_risk_reason'))  props['churnguard_risk_reason']  = customer.riskReason ?? '';
      if (availableProps.has('churnguard_last_sync'))    props['churnguard_last_sync']    = new Date().toISOString();

      if (Object.keys(props).length === 0) {
        result.errors.push(`Push ${customer.email}: No custom properties exist in HubSpot yet — check the property setup error above for details.`);
        continue;
      }

      await hsPatch(`/crm/v3/objects/contacts/${hubspotContactId}`, token, { properties: props });
      result.pushed++;

      await prisma.crmSyncLog.create({
        data: {
          userId: internalUserId,
          crmType: 'hubspot',
          direction: 'outbound',
          entityType: 'contact',
          entityId: hubspotContactId,
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
          entityId: hubspotContactId,
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
