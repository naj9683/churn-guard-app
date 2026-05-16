import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { analyzeStripe, getIndustryPercentile } from '@/lib/calculations/stripe';

// GET — run a live Stripe analysis using the user's stored API key.
// Returns the same StripeAuditResult shape as the free audit tool so
// the dashboard "Revenue at Risk" number is identical to what the prospect saw.
export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId }, select: { id: true } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Also compute engagement-based risk from our own DB for comparison
  const customers = await prisma.customer.findMany({
    where: { userId: user.id },
    select: { mrr: true, riskScore: true },
  });

  const engagementRiskMrr   = customers.filter(c => (c.riskScore ?? 0) >= 70).reduce((n, c) => n + (c.mrr ?? 0), 0);
  const engagementRiskCount = customers.filter(c => (c.riskScore ?? 0) >= 70).length;
  const totalDbMrr          = customers.reduce((n, c) => n + (c.mrr ?? 0), 0);

  const integration = await prisma.crmIntegration.findUnique({
    where: { userId_type: { userId: user.id, type: 'stripe' } },
    select: { accessToken: true, enabled: true },
  });

  if (!integration?.accessToken || !integration.enabled) {
    // No Stripe key — return engagement metrics only so dashboard can degrade gracefully
    return NextResponse.json({
      stripeConnected: false,
      stripe: null,
      engagement: { revenueAtRisk: engagementRiskMrr, customerCount: engagementRiskCount, totalMrr: totalDbMrr },
    });
  }

  try {
    const stripe = await analyzeStripe(integration.accessToken);

    // Update lastSyncAt on the integration record
    await prisma.crmIntegration.update({
      where: { userId_type: { userId: user.id, type: 'stripe' } },
      data: { lastSyncAt: new Date(), syncStatus: 'connected' },
    });

    return NextResponse.json({
      stripeConnected: true,
      stripe,
      engagement: { revenueAtRisk: engagementRiskMrr, customerCount: engagementRiskCount, totalMrr: totalDbMrr },
    });
  } catch (err: any) {
    const msg = err?.message ?? 'Stripe analysis failed';
    await prisma.crmIntegration.update({
      where: { userId_type: { userId: user.id, type: 'stripe' } },
      data: { syncStatus: 'error', lastError: msg },
    }).catch(() => {});

    return NextResponse.json({
      stripeConnected: false,
      stripeError: msg,
      stripe: null,
      engagement: { revenueAtRisk: engagementRiskMrr, customerCount: engagementRiskCount, totalMrr: totalDbMrr },
    });
  }
}
