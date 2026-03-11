import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      // Return all high-risk customers that need recommendations
      const customers = await prisma.customer.findMany({
        where: {
          userId: user.id,
          riskScore: { gte: 60 }
        },
        orderBy: { riskScore: 'desc' },
        take: 10
      });

      const recommendations = await Promise.all(
        customers.map(c => generateRecommendation(user.id, c))
      );
      
      return Response.json(recommendations);
    } else {
      // Recommendation for specific customer
      const customer = await prisma.customer.findFirst({
        where: { id: customerId, userId: user.id }
      });
      
      if (!customer) return Response.json({ error: 'Customer not found' }, { status: 404 });
      
      const recommendation = await generateRecommendation(user.id, customer);
      return Response.json(recommendation);
    }
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function generateRecommendation(userId: string, customer: any) {
  // Calculate days since login
  const lastLogin = await prisma.event.findFirst({
    where: {
      customerId: customer.id,
      event: 'login'
    },
    orderBy: { timestamp: 'desc' }
  });
  
  const daysSinceLogin = lastLogin 
    ? Math.floor((Date.now() - Number(lastLogin.timestamp)) / (1000 * 60 * 60 * 24))
    : 30;

  // Find matching patterns
  const patterns = await prisma.recommendationPattern.findMany({
    where: {
      userId,
      customerSegment: customer.plan || 'unknown',
      riskRangeMin: { lte: customer.riskScore },
      riskRangeMax: { gte: customer.riskScore },
      timesAttempted: { gte: 3 }, // Need at least 3 attempts for statistical significance
      isActive: true
    },
    orderBy: { successRate: 'desc' },
    take: 3
  });

  // If no patterns exist yet, use rule-based fallback
  if (patterns.length === 0) {
    return getRuleBasedRecommendation(customer, daysSinceLogin);
  }

  // Calculate confidence score based on pattern data
  const topPattern = patterns[0];
  const confidence = Math.round(topPattern.successRate * 100);
  
  // Build reasoning
  const reasoning = buildReasoning(customer, topPattern, daysSinceLogin);
  
  // Estimate impact
  const estimatedMrrSaved = Math.round(topPattern.avgMrrSaved * (topPattern.successRate));
  
  return {
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      mrr: customer.mrr,
      riskScore: customer.riskScore,
      plan: customer.plan,
      daysSinceLogin
    },
    recommendation: {
      action: topPattern.recommendedAction,
      confidence,
      reasoning,
      estimatedMrrSaved,
      historicalSuccessRate: Math.round(topPattern.successRate * 100),
      similarCasesAttempted: topPattern.timesAttempted,
      similarCasesSaved: topPattern.timesSuccessful,
      alternativeActions: patterns.slice(1).map(p => ({
        action: p.recommendedAction,
        successRate: Math.round(p.successRate * 100),
        estimatedMrrSaved: Math.round(p.avgMrrSaved * p.successRate)
      }))
    },
    isPatternBased: true
  };
}

function getRuleBasedRecommendation(customer: any, daysSinceLogin: number) {
  // Fallback rules when no historical data exists
  let action = 'personal_outreach';
  let reasoning = '';
  let confidence = 70;

  if (customer.riskScore >= 85 && customer.mrr > 1000) {
    action = 'ceo_call';
    reasoning = `High-value customer (${customer.mrr} MRR) at critical risk (${customer.riskScore}%). Executive intervention recommended.`;
    confidence = 85;
  } else if (customer.riskScore >= 80) {
    action = 'discount_offer';
    reasoning = `Customer showing strong churn signals (${customer.riskScore}% risk). Immediate retention offer recommended.`;
    confidence = 75;
  } else if (daysSinceLogin > 14) {
    action = 'training_session';
    reasoning = `Customer inactive for ${daysSinceLogin} days. Training session may re-engage.`;
    confidence = 65;
  } else {
    action = 'check_in_call';
    reasoning = `Moderate risk detected. Proactive check-in recommended before escalation.`;
    confidence = 60;
  }

  const estimatedMrrSaved = Math.round(customer.mrr * 0.7); // Estimate 70% save rate

  return {
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      mrr: customer.mrr,
      riskScore: customer.riskScore,
      plan: customer.plan,
      daysSinceLogin
    },
    recommendation: {
      action,
      confidence,
      reasoning,
      estimatedMrrSaved,
      historicalSuccessRate: null,
      similarCasesAttempted: 0,
      similarCasesSaved: 0,
      alternativeActions: []
    },
    isPatternBased: false,
    note: 'Based on initial rules - patterns will improve as more data is collected'
  };
}

function buildReasoning(customer: any, pattern: any, daysSinceLogin: number) {
  const parts = [
    `Similar ${customer.plan || 'customers'} with risk scores ${pattern.riskRangeMin}-${pattern.riskRangeMax}%`,
    `have been saved ${Math.round(pattern.successRate * 100)}% of the time`,
    `using ${pattern.recommendedAction.replace('_', ' ')}.`,
    `Average MRR saved: $${pattern.avgMrrSaved}.`
  ];
  
  if (daysSinceLogin > 7) {
    parts.push(`Customer inactive for ${daysSinceLogin} days increases urgency.`);
  }
  
  return parts.join(' ');
}
