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
    
    if (!user) return Response.json([], { status: 200 }); // Return empty if no user

    // Get high-risk customers (60%+ risk score)
    let customers: any[] = [];
    try {
      customers = await prisma.customer.findMany({
        where: {
          userId: user.id,
          riskScore: { gte: 60 }
        },
        orderBy: { riskScore: 'desc' },
        take: 10
      });
    } catch (dbError) {
      console.error('Database error fetching customers:', dbError);
      return Response.json([], { status: 200 }); // Return empty on DB error
    }

    // If no high-risk customers, return empty array (not error)
    if (!customers || customers.length === 0) {
      return Response.json([], { status: 200 });
    }

    // Generate recommendations for each customer
    const recommendations = await Promise.all(
      customers.map(c => generateRecommendation(user.id, c))
    );
    
    return Response.json(recommendations);
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    // Return empty array instead of error so UI shows "no customers" message
    return Response.json([], { status: 200 });
  }
}

async function generateRecommendation(userId: string, customer: any) {
  // Safely calculate days since login
  let daysSinceLogin = 30;
  try {
    const lastLogin = await prisma.event.findFirst({
      where: {
        customerId: customer.id,
        event: 'login'
      },
      orderBy: { timestamp: 'desc' }
    });
    
    if (lastLogin && lastLogin.timestamp) {
      daysSinceLogin = Math.floor((Date.now() - Number(lastLogin.timestamp)) / (1000 * 60 * 60 * 24));
    }
  } catch (e) {
    // Ignore error, use default
  }

  // Try to find patterns, but don't fail if table doesn't exist yet
  let patterns: any[] = [];
  try {
    patterns = await prisma.recommendationPattern.findMany({
      where: {
        userId,
        customerSegment: customer.plan || 'unknown',
        riskRangeMin: { lte: customer.riskScore },
        riskRangeMax: { gte: customer.riskScore },
        timesAttempted: { gte: 3 },
        isActive: true
      },
      orderBy: { successRate: 'desc' },
      take: 3
    });
  } catch (e) {
    // Pattern table might not exist yet, use rules
    console.log('Pattern lookup failed, using rules');
  }

  if (patterns.length === 0) {
    return getRuleBasedRecommendation(customer, daysSinceLogin);
  }

  const topPattern = patterns[0];
  const confidence = Math.round(topPattern.successRate * 100);
  
  return {
    customer: {
      id: customer.id,
      name: customer.name || 'Unknown',
      email: customer.email || '',
      mrr: customer.mrr || 0,
      riskScore: customer.riskScore || 50,
      plan: customer.plan || 'unknown',
      daysSinceLogin
    },
    recommendation: {
      action: topPattern.recommendedAction,
      confidence,
      reasoning: buildReasoning(customer, topPattern, daysSinceLogin),
      estimatedMrrSaved: Math.round((topPattern.avgMrrSaved || 0) * (topPattern.successRate || 0)),
      historicalSuccessRate: Math.round((topPattern.successRate || 0) * 100),
      similarCasesAttempted: topPattern.timesAttempted || 0,
      similarCasesSaved: topPattern.timesSuccessful || 0,
      alternativeActions: patterns.slice(1).map(p => ({
        action: p.recommendedAction,
        successRate: Math.round((p.successRate || 0) * 100)
      })),
      isPatternBased: true
    }
  };
}

function getRuleBasedRecommendation(customer: any, daysSinceLogin: number) {
  const riskScore = customer.riskScore || 50;
  const mrr = customer.mrr || 0;
  
  let action = 'personal_outreach';
  let reasoning = '';
  let confidence = 70;

  if (riskScore >= 85 && mrr > 1000) {
    action = 'ceo_call';
    reasoning = `High-value customer ($${mrr} MRR) at critical risk (${riskScore}%). Executive intervention recommended.`;
    confidence = 85;
  } else if (riskScore >= 80) {
    action = 'discount_offer';
    reasoning = `Customer showing strong churn signals (${riskScore}% risk). Immediate retention offer recommended.`;
    confidence = 75;
  } else if (daysSinceLogin > 14) {
    action = 'training_session';
    reasoning = `Customer inactive for ${daysSinceLogin} days. Training session may re-engage.`;
    confidence = 65;
  } else {
    action = 'check_in_call';
    reasoning = `Moderate risk detected (${riskScore}%). Proactive check-in recommended before escalation.`;
    confidence = 60;
  }

  return {
    customer: {
      id: customer.id,
      name: customer.name || 'Unknown',
      email: customer.email || '',
      mrr: mrr,
      riskScore: riskScore,
      plan: customer.plan || 'unknown',
      daysSinceLogin
    },
    recommendation: {
      action,
      confidence,
      reasoning,
      estimatedMrrSaved: Math.round(mrr * 0.7),
      historicalSuccessRate: null,
      similarCasesAttempted: 0,
      similarCasesSaved: 0,
      alternativeActions: [],
      isPatternBased: false
    }
  };
}

function buildReasoning(customer: any, pattern: any, daysSinceLogin: number) {
  const parts = [
    `Similar ${customer.plan || 'customers'} with risk scores ${pattern.riskRangeMin}-${pattern.riskRangeMax}%`,
    `have been saved ${Math.round((pattern.successRate || 0) * 100)}% of the time`,
    `using ${pattern.recommendedAction.replace(/_/g, ' ')}.`
  ];
  
  if (daysSinceLogin > 7) {
    parts.push(`Customer inactive for ${daysSinceLogin} days increases urgency.`);
  }
  
  return parts.join(' ');
}
