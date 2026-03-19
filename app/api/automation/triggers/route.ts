import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { runAutomationEngine } from '@/lib/automation-engine';

/**
 * GET /api/automation/triggers
 * Returns recent automation logs for the current user.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const logs = await prisma.automationLog.findMany({
    where: { userId: user.id },
    orderBy: { executedAt: 'desc' },
    take: 50,
    include: { rule: { select: { name: true, triggerType: true, actionType: true } } },
  });

  const summary = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    failed: logs.filter(l => l.status === 'failed').length,
    skipped: logs.filter(l => l.status === 'skipped').length,
  };

  return NextResponse.json({ summary, logs });
}

/**
 * POST /api/automation/triggers
 * Manually runs the automation engine. Accepts optional filters.
 *
 * Body: { triggerTypes?: string[], customerId?: string }
 *
 * Also used by internal webhooks (e.g. Stripe payment_failed) to fire
 * rules for a specific customer without going through the hourly cron.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { triggerTypes, customerId } = body as {
    triggerTypes?: string[];
    customerId?: string;
  };

  const result = await runAutomationEngine({
    userId: user.id,
    triggerTypes,
    customerId,
  });

  return NextResponse.json({ success: true, ...result });
}
