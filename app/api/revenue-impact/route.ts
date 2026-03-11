import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    // Get all intervention outcomes
    const outcomes = await prisma.interventionOutcome.findMany({
      where: { userId: user.id },
      include: { customer: { select: { name: true, email: true } } },
      orderBy: { startedAt: 'desc' }
    });

    // Calculate metrics
    const totalInterventions = outcomes.length;
    const saved = outcomes.filter(o => o.status === 'saved');
    const churned = outcomes.filter(o => o.status === 'churned');
    const pending = outcomes.filter(o => o.status === 'pending');
    
    const totalMrrSaved = saved.reduce((sum, o) => sum + o.mrrSaved, 0);
    const totalMrrAtRisk = outcomes.reduce((sum, o) => sum + o.mrrAtRisk, 0);
    const totalMrrLost = churned.reduce((sum, o) => sum + o.mrrLost, 0);
    
    const successRate = totalInterventions > 0 
      ? Math.round((saved.length / totalInterventions) * 100) 
      : 0;

    // Group by intervention type for reporting
    const byType = outcomes.reduce((acc, outcome) => {
      const type = outcome.interventionType;
      if (!acc[type]) {
        acc[type] = { count: 0, saved: 0, lost: 0, mrrSaved: 0 };
      }
      acc[type].count++;
      if (outcome.status === 'saved') {
        acc[type].saved++;
        acc[type].mrrSaved += outcome.mrrSaved;
      } else if (outcome.status === 'churned') {
        acc[type].lost++;
      }
      return acc;
    }, {} as Record<string, any>);

    // ROI calculation (assuming $50/month subscription cost)
    const subscriptionCost = 50; // Your SaaS price
    const netBenefit = totalMrrSaved - (totalInterventions * subscriptionCost);
    const roi = totalInterventions > 0 
      ? Math.round((netBenefit / (totalInterventions * subscriptionCost)) * 100) 
      : 0;

    return Response.json({
      summary: {
        totalInterventions,
        saved: saved.length,
        churned: churned.length,
        pending: pending.length,
        successRate,
        totalMrrSaved,
        totalMrrAtRisk,
        totalMrrLost,
        netBenefit,
        roi
      },
      byType,
      recentOutcomes: outcomes.slice(0, 10)
    });
  } catch (error) {
    console.error('Revenue Impact Error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
