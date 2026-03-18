import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeCustomerRisk } from '@/lib/risk-analyzer';
import { enrollInSequence } from '@/lib/sequences';

// Max customers to process per cron run to avoid Vercel function timeout (60s)
const BATCH_SIZE = 50;
// Concurrency: analyze N customers simultaneously
const CONCURRENCY = 5;

async function processInBatches<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<Array<{ ok: boolean; result?: R; error?: string }>> {
  const results: Array<{ ok: boolean; result?: R; error?: string }> = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const settled = await Promise.allSettled(batch.map(fn));
    for (const s of settled) {
      if (s.status === 'fulfilled') results.push({ ok: true, result: s.value });
      else results.push({ ok: false, error: String(s.reason) });
    }
  }
  return results;
}

export async function GET(req: NextRequest) {
  // Vercel injects Authorization: Bearer <CRON_SECRET> for scheduled invocations
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
  }

  try {
    // Fetch the most-recently-analyzed customers last (prioritise stale records)
    const customers = await prisma.customer.findMany({
      orderBy: { updatedAt: 'asc' },
      take: BATCH_SIZE,
      include: {
        events: { orderBy: { timestamp: 'desc' }, take: 10 },
        interventions: { where: { status: 'pending' } },
      },
    });

    let updated = 0;
    let failed = 0;

    const results = await processInBatches(customers, CONCURRENCY, async (customer) => {
      const previousScore = customer.riskScore;
      const result = await analyzeCustomerRisk({
        email: customer.email,
        mrr: customer.mrr,
        plan: customer.plan,
        healthScore: customer.healthScore,
        currentRiskScore: customer.riskScore,
        lastLoginAt: customer.lastLoginAt,
        loginCountThisMonth: customer.loginCountThisMonth,
        featuresUsed: Array.isArray(customer.featuresUsed)
          ? (customer.featuresUsed as string[])
          : [],
        recentEvents: customer.events.map(e => ({ event: e.event, timestamp: Number(e.timestamp) })),
        activeInterventions: customer.interventions.length,
      });

      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          riskScore: result.churnProbability,
          riskReason: result.summary,
        },
      });

      // Enroll in risk-retention sequence when score crosses 80
      if (result.churnProbability >= 80 && previousScore < 80) {
        await enrollInSequence(customer.userId, customer.id, 'risk_retention', {
          riskScore: result.churnProbability,
          riskReason: result.summary,
        });
      }

      return { customerId: customer.id, churnProbability: result.churnProbability };
    });

    for (const r of results) {
      if (r.ok) updated++;
      else failed++;
    }

    return NextResponse.json({
      success: true,
      analyzed: customers.length,
      updated,
      failed,
    });
  } catch (error) {
    console.error('Risk analysis cron error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
