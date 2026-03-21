import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { syncHubSpot, HubSpotReconnectError } from '@/lib/crm/hubspot';

// POST /api/integrations/hubspot/sync — run full bidirectional sync
export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const integration = await prisma.crmIntegration.findFirst({
    where: { userId: user.id, type: 'hubspot' },
  });
  if (!integration?.enabled) {
    return NextResponse.json({ error: 'HubSpot not connected. Connect it in Settings → Integrations.' }, { status: 400 });
  }

  try {
    const result = await syncHubSpot(user.id);
    return NextResponse.json({ success: true, ...result });
  } catch (e: any) {
    if (e instanceof HubSpotReconnectError) {
      await prisma.crmIntegration.updateMany({
        where: { userId: user.id, type: 'hubspot' },
        data: { syncStatus: 'error', lastError: 'Token expired — please reconnect HubSpot.' },
      });
      return NextResponse.json({ error: 'Please reconnect HubSpot — your authorization has expired.', reconnectRequired: true }, { status: 400 });
    }
    await prisma.crmIntegration.updateMany({
      where: { userId: user.id, type: 'hubspot' },
      data: { syncStatus: 'error', lastError: e.message },
    });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET /api/integrations/hubspot/sync — get last sync info + recent logs
export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const [integration, logs] = await Promise.all([
    prisma.crmIntegration.findFirst({ where: { userId: user.id, type: 'hubspot' } }),
    prisma.crmSyncLog.findMany({
      where: { userId: user.id, crmType: 'hubspot' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  const reconnectRequired = integration?.expiresAt
    ? integration.expiresAt.getTime() < Date.now()
    : false;

  return NextResponse.json({
    connected: integration?.enabled ?? false,
    syncStatus: integration?.syncStatus ?? 'disconnected',
    lastSyncAt: integration?.lastSyncAt ?? null,
    lastError: integration?.lastError ?? null,
    reconnectRequired,
    logs,
  });
}
