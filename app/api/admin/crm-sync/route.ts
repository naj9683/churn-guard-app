import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { syncHubSpot } from '@/lib/crm/hubspot';

/** GET /api/admin/crm-sync — sync stats for all integrations */
export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const integrations = await prisma.crmIntegration.findMany({
    where: { enabled: true },
    select: {
      userId: true, type: true, syncStatus: true,
      lastSyncAt: true, lastFullSyncAt: true, lastSyncCount: true, lastError: true,
    },
    orderBy: { lastSyncAt: 'desc' },
  });

  const since1h = new Date(Date.now() - 60 * 60 * 1000);
  const recentSyncs = await prisma.crmSyncLog.count({
    where: { createdAt: { gte: since1h } },
  });

  return NextResponse.json({ integrations, recentSyncs });
}

/** POST /api/admin/crm-sync — trigger full sync for all (or one) integration */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const targetType = body.type as 'hubspot' | undefined;

  const integrations = await prisma.crmIntegration.findMany({
    where: {
      enabled: true,
      ...(targetType ? { type: targetType } : {}),
    },
    select: { userId: true, type: true },
  });

  const results: Array<{ userId: string; type: string; status: string; details: any }> = [];

  for (const integration of integrations) {
    try {
      let result;
      if (integration.type === 'hubspot') {
        result = await syncHubSpot(integration.userId, { fullSync: true });
      } else continue;

      results.push({ userId: integration.userId, type: integration.type, status: 'ok', details: result });
    } catch (e: any) {
      results.push({ userId: integration.userId, type: integration.type, status: 'error', details: e?.message });
    }
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    succeeded: results.filter(r => r.status === 'ok').length,
    failed: results.filter(r => r.status === 'error').length,
    results,
  });
}
