import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncHubSpot } from '@/lib/crm/hubspot';
import { syncSalesforce } from '@/lib/crm/salesforce';

/**
 * GET /api/cron/crm-sync
 * Auto-syncs all connected CRM integrations every 6 hours.
 * Pulls contacts from HubSpot/Salesforce and pushes updated risk scores back.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const integrations = await prisma.crmIntegration.findMany({
    where: { enabled: true },
    select: { userId: true, type: true },
  });

  const results: Array<{ userId: string; type: string; status: string; details?: any }> = [];

  for (const integration of integrations) {
    try {
      let result;
      if (integration.type === 'hubspot') {
        result = await syncHubSpot(integration.userId);
      } else if (integration.type === 'salesforce') {
        result = await syncSalesforce(integration.userId);
      } else {
        continue;
      }
      results.push({ userId: integration.userId, type: integration.type, status: 'ok', details: result });
    } catch (e: any) {
      console.error(`[crm-sync] Failed for userId=${integration.userId} type=${integration.type}:`, e?.message);
      results.push({ userId: integration.userId, type: integration.type, status: 'error', details: e?.message });
    }
  }

  const succeeded = results.filter(r => r.status === 'ok').length;
  const failed = results.filter(r => r.status === 'error').length;
  console.log(`[crm-sync] total=${results.length} succeeded=${succeeded} failed=${failed}`);

  return NextResponse.json({ success: true, total: results.length, succeeded, failed, results });
}
