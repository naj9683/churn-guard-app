import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncHubSpot } from '@/lib/crm/hubspot';

const SIX_HOURS_MS   = 6  * 60 * 60 * 1000;

/**
 * GET /api/cron/crm-sync
 * Runs every 30 minutes. Smart routing:
 *   - Push-only (fast): if last full sync was < 6 h ago, only push customers
 *     whose risk scores changed since last sync.
 *   - Full sync: if last full sync was > 6 h ago, pull all contacts + push all.
 *   - Skip: if nothing changed and full sync not due.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const integrations = await prisma.crmIntegration.findMany({
    where: { enabled: true },
    select: { userId: true, type: true, lastSyncAt: true, lastFullSyncAt: true },
  });

  const results: Array<{
    userId: string; type: string; status: string; mode?: string; details?: any
  }> = [];

  for (const integration of integrations) {
    const now = Date.now();
    const lastFull = integration.lastFullSyncAt?.getTime() ?? 0;
    const lastSync = integration.lastSyncAt;

    const needsFullSync = (now - lastFull) >= SIX_HOURS_MS;

    // For push-only runs, skip if nothing changed since last sync
    if (!needsFullSync && lastSync) {
      const changedCount = await prisma.customer.count({
        where: { userId: integration.userId, updatedAt: { gt: lastSync } },
      });
      if (changedCount === 0) {
        results.push({ userId: integration.userId, type: integration.type, status: 'skipped', mode: 'no_changes' });
        continue;
      }
    }

    const mode   = needsFullSync ? 'full' : 'push_only';
    const opts   = needsFullSync
      ? { fullSync: true }
      : { fullSync: false, sinceDate: lastSync ?? undefined };

    try {
      let result;
      if (integration.type === 'hubspot') {
        result = await syncHubSpot(integration.userId, opts);
      } else {
        continue;
      }
      results.push({ userId: integration.userId, type: integration.type, status: 'ok', mode, details: result });
    } catch (e: any) {
      console.error(`[crm-sync] Failed userId=${integration.userId} type=${integration.type}:`, e?.message);
      results.push({ userId: integration.userId, type: integration.type, status: 'error', mode, details: e?.message });
    }
  }

  const succeeded = results.filter(r => r.status === 'ok').length;
  const failed    = results.filter(r => r.status === 'error').length;
  const skipped   = results.filter(r => r.status === 'skipped').length;
  console.log(`[crm-sync] total=${results.length} succeeded=${succeeded} failed=${failed} skipped=${skipped}`);

  return NextResponse.json({ success: true, total: results.length, succeeded, failed, skipped, results });
}
