/**
 * ChurnGuard ↔ Salesforce bidirectional sync
 *
 * Pull: Salesforce Contacts → ChurnGuard customers (upsert by email)
 * Push: ChurnGuard riskScore / healthScore / riskReason → Salesforce Contact fields
 *
 * Standard fields used (no custom fields required):
 *   Pull: Id, FirstName, LastName, Email, Phone, Account.Name, Account.AnnualRevenue
 *   Push: Description field carries risk summary (no custom fields needed)
 *
 * Optional custom fields (create in Salesforce Setup if desired):
 *   ChurnGuard_Risk_Score__c  (Number)
 *   ChurnGuard_Health_Score__c (Number)
 *   ChurnGuard_Risk_Reason__c  (Text Area)
 */

import { prisma } from '@/lib/prisma';

const CLIENT_ID     = process.env.SALESFORCE_CLIENT_ID!;
const CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET!;
const API_VERSION   = 'v59.0';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SyncResult {
  pulled: number;
  pushed: number;
  created: number;
  updated: number;
  errors: string[];
}

interface SFContact {
  Id: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone?: string;
  MobilePhone?: string;
  Account?: {
    Name?: string;
    AnnualRevenue?: number;
  };
}

// ─── Token management ─────────────────────────────────────────────────────────

export async function getValidSalesforceToken(userId: string): Promise<{ token: string; instanceUrl: string }> {
  const integration = await prisma.crmIntegration.findFirst({ where: { userId, type: 'salesforce' } });
  if (!integration?.accessToken || !integration.instanceUrl) {
    throw new Error('Salesforce not connected for this user');
  }

  const needsRefresh = integration.expiresAt
    ? integration.expiresAt.getTime() < Date.now() + 5 * 60 * 1000
    : false;

  if (!needsRefresh) {
    return { token: integration.accessToken, instanceUrl: integration.instanceUrl };
  }

  if (!integration.refreshToken) throw new Error('No refresh token — user must reconnect Salesforce');

  const res = await fetch(`${integration.instanceUrl}/services/oauth2/token`, {
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
  if (!res.ok) throw new Error(`Salesforce token refresh failed: ${data.error_description ?? res.status}`);

  const newInstanceUrl = data.instance_url ?? integration.instanceUrl;

  await prisma.crmIntegration.update({
    where: { id: integration.id },
    data: {
      accessToken: data.access_token,
      instanceUrl: newInstanceUrl,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // SF tokens last ~2h
    },
  });

  return { token: data.access_token as string, instanceUrl: newInstanceUrl };
}

// ─── Salesforce API helpers ───────────────────────────────────────────────────

async function sfQuery(soql: string, token: string, instanceUrl: string) {
  const url = `${instanceUrl}/services/data/${API_VERSION}/query?q=${encodeURIComponent(soql)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Salesforce query failed (${res.status}): ${JSON.stringify((err as any[])[0]?.message ?? err)}`);
  }
  return res.json();
}

async function sfPatch(path: string, token: string, instanceUrl: string, body: unknown) {
  const res = await fetch(`${instanceUrl}/services/data/${API_VERSION}${path}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  // PATCH 204 = success (no body)
  if (res.status === 204) return;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Salesforce PATCH ${path} (${res.status}): ${JSON.stringify(err)}`);
  }
}

// ─── Check if custom fields exist ────────────────────────────────────────────

async function hasCustomField(fieldName: string, token: string, instanceUrl: string): Promise<boolean> {
  try {
    const data = await sfQuery(
      `SELECT QualifiedApiName FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName = 'Contact' AND QualifiedApiName = '${fieldName}'`,
      token, instanceUrl
    );
    return (data?.totalSize ?? 0) > 0;
  } catch {
    return false;
  }
}

// ─── Main sync function ───────────────────────────────────────────────────────

export async function syncSalesforce(internalUserId: string): Promise<SyncResult> {
  const result: SyncResult = { pulled: 0, pushed: 0, created: 0, updated: 0, errors: [] };

  const { token, instanceUrl } = await getValidSalesforceToken(internalUserId);

  // Check which custom fields are available (non-fatal if missing)
  const [hasRiskScore, hasHealthScore, hasRiskReason] = await Promise.all([
    hasCustomField('ChurnGuard_Risk_Score__c', token, instanceUrl),
    hasCustomField('ChurnGuard_Health_Score__c', token, instanceUrl),
    hasCustomField('ChurnGuard_Risk_Reason__c', token, instanceUrl),
  ]);

  // ── PULL: Salesforce Contacts → ChurnGuard customers ──────────────────────
  const soql = `
    SELECT Id, FirstName, LastName, Email, Phone, MobilePhone,
           Account.Name, Account.AnnualRevenue
    FROM Contact
    WHERE Email != null
    ORDER BY CreatedDate DESC
    LIMIT 200
  `.trim().replace(/\s+/g, ' ');

  let contacts: SFContact[] = [];
  try {
    const data = await sfQuery(soql, token, instanceUrl);
    contacts = data.records ?? [];
    result.pulled = contacts.length;
  } catch (e: any) {
    result.errors.push(`Pull contacts: ${e.message}`);
    return result;
  }

  for (const contact of contacts) {
    const email = contact.Email;
    if (!email) continue;

    const name = [contact.FirstName, contact.LastName].filter(Boolean).join(' ') || email;
    const mrr  = Math.round((contact.Account?.AnnualRevenue ?? 0) / 12);

    try {
      const existing = await prisma.customer.findFirst({
        where: { userId: internalUserId, email },
      });

      if (existing) {
        await prisma.customer.update({
          where: { id: existing.id },
          data: { name, crmId: contact.Id, updatedAt: new Date() },
        });
        result.updated++;
      } else {
        await prisma.customer.create({
          data: {
            userId: internalUserId,
            externalId: `salesforce_${contact.Id}`,
            email,
            name,
            mrr,
            crmId: contact.Id,
            riskScore: 50,
            healthScore: 80,
          },
        });
        result.created++;

        await prisma.crmSyncLog.create({
          data: {
            userId: internalUserId,
            crmType: 'salesforce',
            direction: 'inbound',
            entityType: 'contact',
            entityId: contact.Id,
            status: 'success',
            message: `Created customer from Salesforce Contact: ${email}`,
          },
        });
      }
    } catch (e: any) {
      result.errors.push(`Pull ${email}: ${e.message}`);
    }
  }

  // ── PUSH: ChurnGuard risk data → Salesforce Contact fields ────────────────
  const customers = await prisma.customer.findMany({
    where: { userId: internalUserId, crmId: { not: null } },
    select: { id: true, crmId: true, email: true, riskScore: true, healthScore: true, riskReason: true },
  });

  for (const customer of customers) {
    if (!customer.crmId) continue;
    try {
      // Always push a Description summary (standard field, always available)
      const riskSummary = `ChurnGuard Risk Score: ${customer.riskScore ?? 50}/100. Health: ${customer.healthScore ?? 80}/100. ${customer.riskReason ? 'Reason: ' + customer.riskReason : ''}`.trim();

      const updatePayload: Record<string, unknown> = {
        Description: riskSummary,
      };

      // Add custom fields if they exist
      if (hasRiskScore)   updatePayload['ChurnGuard_Risk_Score__c']   = customer.riskScore ?? 50;
      if (hasHealthScore) updatePayload['ChurnGuard_Health_Score__c'] = customer.healthScore ?? 80;
      if (hasRiskReason)  updatePayload['ChurnGuard_Risk_Reason__c']  = customer.riskReason ?? '';

      await sfPatch(`/sobjects/Contact/${customer.crmId}`, token, instanceUrl, updatePayload);
      result.pushed++;

      await prisma.crmSyncLog.create({
        data: {
          userId: internalUserId,
          crmType: 'salesforce',
          direction: 'outbound',
          entityType: 'contact',
          entityId: customer.crmId,
          status: 'success',
          message: `Pushed risk score ${customer.riskScore} to Salesforce Contact`,
        },
      });
    } catch (e: any) {
      result.errors.push(`Push ${customer.email}: ${e.message}`);
      await prisma.crmSyncLog.create({
        data: {
          userId: internalUserId,
          crmType: 'salesforce',
          direction: 'outbound',
          entityType: 'contact',
          entityId: customer.crmId!,
          status: 'error',
          message: e.message,
        },
      });
    }
  }

  await prisma.crmIntegration.updateMany({
    where: { userId: internalUserId, type: 'salesforce' },
    data: { lastSyncAt: new Date(), syncStatus: result.errors.length > 0 ? 'partial' : 'synced' },
  });

  return result;
}
