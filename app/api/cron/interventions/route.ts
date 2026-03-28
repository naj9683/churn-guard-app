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

    if (paymentEvent) {
      await prisma.interventionOutcome.update({
        where: { id: intervention.id },
        data: {
          status: 'saved',
          successful: true,
          mrrSaved: intervention.mrrAtRisk,
          completedAt: new Date(),
          notes: (intervention.notes ? intervention.notes + ' | ' : '') +
            'Auto-resolved: payment received after intervention',
        },
      });
      saved++;
      continue;
    }

    // Timeout: no response after 7 days
    if (new Date(intervention.startedAt) < cutoff) {
      await prisma.interventionOutcome.update({
        where: { id: intervention.id },
        data: {
          status: 'churned',
          successful: false,
          mrrLost: intervention.mrrAtRisk,
          churnedAt: new Date(),
          completedAt: new Date(),
          notes: (intervention.notes ? intervention.notes + ' | ' : '') +
            'Auto-closed: no customer response after 7 days',
        },
      });
      churned++;
    }
  }

  console.log(`[interventions-cron] checked=${active.length} saved=${saved} churned=${churned}`);
  return NextResponse.json({ success: true, checked: active.length, saved, churned });
}
