import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { analyzeCustomerRisk } from '@/lib/risk-analyzer';
import { enrollInSequence } from '@/lib/sequences';

const BATCH_SIZE = 20;
const CONCURRENCY = 3;

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

/**
 * POST /api/risk/analyze/batch
 * Manually triggers risk analysis for all customers belonging to the current user.
 * Protected by Clerk auth — no cron secret needed.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
  }

  const user = await prisma.user.findFirst({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const customers = await prisma.customer.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'asc' },
    take: BATCH_SIZE,
    include: {
      events: { orderBy: { timestamp: 'desc' }, take: 10 },
      interventions: { where: { status: 'pending' } },
    },
  });

  const details: Array<{ customerId: string; email: string; riskScore: number; error?: string }> = [];
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
      featuresUsed: Array.isArray(customer.featuresUsed) ? (customer.featuresUsed as string[]) : [],
      recentEvents: customer.events.map(e => ({ event: e.event, timestamp: Number(e.timestamp) })),
      activeInterventions: customer.interventions.length,
    });

    await prisma.customer.update({
      where: { id: customer.id },
      data: { riskScore: result.churnProbability, riskReason: result.summary },
    });

    if (result.churnProbability >= 80 && previousScore < 80) {
      await enrollInSequence(user.id, customer.id, 'risk_retention', {
        riskScore: result.churnProbability,
        riskReason: result.summary,
      });
    }

    return { customerId: customer.id, email: customer.email, riskScore: result.churnProbability, summary: result.summary };
  });

  for (const r of results) {
    if (r.ok && r.result) {
      updated++;
      details.push({ customerId: r.result.customerId, email: r.result.email, riskScore: r.result.riskScore });
    } else {
      failed++;
      details.push({ customerId: 'unknown', email: 'unknown', riskScore: 0, error: r.error });
    }
  }

  return NextResponse.json({ success: true, analyzed: customers.length, updated, failed, details });
}
