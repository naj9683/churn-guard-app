import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { syncSalesforce } from '@/lib/crm/salesforce';

// POST /api/integrations/salesforce/sync — run full bidirectional sync
export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const integration = await prisma.crmIntegration.findFirst({
    where: { userId: user.id, type: 'salesforce' },
  });
  if (!integration?.enabled) {
    return NextResponse.json({ error: 'Salesforce not connected. Connect it in Settings → Integrations.' }, { status: 400 });
  }

  try {
    const result = await syncSalesforce(user.id);
    return NextResponse.json({ success: true, ...result });
  } catch (e: any) {
    await prisma.crmIntegration.updateMany({
      where: { userId: user.id, type: 'salesforce' },
      data: { syncStatus: 'error', lastError: e.message },
    });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET /api/integrations/salesforce/sync — get last sync info + recent logs
export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const [integration, logs] = await Promise.all([
    prisma.crmIntegration.findFirst({ where: { userId: user.id, type: 'salesforce' } }),
    prisma.crmSyncLog.findMany({
      where: { userId: user.id, crmType: 'salesforce' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  return NextResponse.json({
    connected: integration?.enabled ?? false,
    syncStatus: integration?.syncStatus ?? 'disconnected',
    lastSyncAt: integration?.lastSyncAt ?? null,
    lastError: integration?.lastError ?? null,
    logs,
  });
}
