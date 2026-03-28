import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TIMEOUT_DAYS = 7;

/**
 * GET /api/cron/interventions
 * Runs every hour. Auto-resolves interventions:
 *  - Checks active interventions for payment_succeeded events → marks "saved"
 *  - Times out active interventions older than 7 days → marks "churned"
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - TIMEOUT_DAYS * 24 * 60 * 60 * 1000);

  const active = await prisma.interventionOutcome.findMany({
    where: { status: 'active' },
    include: { customer: { select: { id: true, email: true, mrr: true } } },
  });

  let saved = 0;
  let churned = 0;

  for (const intervention of active) {
    // Check for payment_succeeded event since intervention started
    const paymentEvent = await prisma.event.findFirst({
      where: {
        customerId: intervention.customerId,
        event: 'payment_succeeded',
        timestamp: { gte: BigInt(new Date(intervention.startedAt).getTime()) },
      },
    });

    const resolvedAt = new Date().toISOString();
    // Parse existing log or create a shell
    let log: any = {};
    try { log = intervention.notes ? JSON.parse(intervention.notes) : {}; } catch {}

    if (paymentEvent) {
      log.resolvedAt = resolvedAt;
      log.resolvedBy = 'payment_received';
      if (!log.timeline) log.timeline = [];
      log.timeline.push({ event: 'Recovered', timestamp: resolvedAt, detail: 'Customer payment received — MRR saved' });
      await prisma.interventionOutcome.update({
        where: { id: intervention.id },
        data: {
          status: 'saved',
          successful: true,
          mrrSaved: intervention.mrrAtRisk,
          completedAt: new Date(),
          notes: JSON.stringify(log),
        },
      });
      saved++;
      continue;
    }

    // Timeout: no response after 7 days
    if (new Date(intervention.startedAt) < cutoff) {
      log.resolvedAt = resolvedAt;
      log.resolvedBy = 'timeout_7_days';
      if (!log.timeline) log.timeline = [];
      log.timeline.push({ event: 'Timed out', timestamp: resolvedAt, detail: 'No customer response after 7 days — marked churned' });
      await prisma.interventionOutcome.update({
        where: { id: intervention.id },
        data: {
          status: 'churned',
          successful: false,
          mrrLost: intervention.mrrAtRisk,
          churnedAt: new Date(),
          completedAt: new Date(),
          notes: JSON.stringify(log),
        },
      });
      churned++;
    }
  }

  console.log(`[interventions-cron] checked=${active.length} saved=${saved} churned=${churned}`);
  return NextResponse.json({ success: true, checked: active.length, saved, churned });
}
