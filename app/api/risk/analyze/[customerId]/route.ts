import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { analyzeCustomerRisk } from '@/lib/risk-analyzer';
import { enrollInSequence } from '@/lib/sequences';

export async function GET(
  req: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
    }

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const customer = await prisma.customer.findFirst({
      where: { id: params.customerId, userId: user.id },
      include: {
        events: { orderBy: { timestamp: 'desc' }, take: 10 },
        interventions: { where: { status: 'pending' } },
      },
    });

    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

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

    const previousScore = customer.riskScore;

    // Persist results back to the customer record
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        riskScore: result.churnProbability,
        riskReason: result.summary,
      },
    });

    // Enroll in risk-retention sequence when score crosses 80 for the first time
    if (result.churnProbability >= 80 && previousScore < 80) {
      await enrollInSequence(user.id, customer.id, 'risk_retention', {
        riskScore: result.churnProbability,
        riskReason: result.summary,
      });
    }

    return NextResponse.json({
      customerId: customer.id,
      email: customer.email,
      ...result,
    });
  } catch (error) {
    console.error('Risk analyze error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
