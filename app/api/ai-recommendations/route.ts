import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) return Response.json([], { status: 200 });

    // Get high-risk customers (60%+ risk score)
    const customers = await prisma.customer.findMany({
      where: {
        userId: user.id,
        riskScore: { gte: 60 }
      },
      orderBy: { riskScore: 'desc' },
      take: 5 // Limit to 5 for AI processing speed
    });

    if (!customers || customers.length === 0) {
      return Response.json([], { status: 200 });
    }

    // Generate AI-powered recommendations for each customer
    const recommendations = await Promise.all(
      customers.map(c => generateAIRecommendation(user.id, c))
    );

    return Response.json(recommendations);
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    return Response.json([], { status: 200 });
  }
}

async function generateAIRecommendation(userId: string, customer: any) {
  try {
    // Get customer context
    const daysSinceLogin = await getDaysSinceLogin(customer.id);
    const recentEvents = await getRecentEvents(customer.id);
    
    // Build prompt for GPT-4
    const prompt = `
You are a customer success expert. Analyze this at-risk customer and recommend the best intervention.

CUSTOMER DATA:
- Name: ${customer.name || 'Unknown'}
- Email: ${customer.email}
- Plan: ${customer.plan || 'unknown'}
- MRR: $${customer.mrr || 0}
- Risk Score: ${customer.riskScore}/100
- Days Since Last Login: ${daysSinceLogin}
- Health Score: ${customer.healthScore || 50}/100
- Recent Activity: ${recentEvents.join(', ') || 'No recent activity'}

AVAILABLE INTERVENTIONS:
1. discount_offer - Offer 20-30% discount for next 3 months
2. ceo_call - Executive reaches out personally (for high-value customers)
3. training_session - Schedule 1-on-1 product training
4. check_in_call - Casual check-in call from account manager
5. webinar_invite - Invite to exclusive customer success webinar

RESPOND IN THIS EXACT JSON FORMAT:
{
  "action": "one_of_the_interventions_above",
  "confidence": 75,
  "reasoning": "2-3 sentences explaining why this intervention fits this specific customer",
  "personalizedMessage": "A custom message to send to this customer",
  "expectedOutcome": "What we expect to happen"
}

Rules:
- If MRR > $1000 and risk > 80, recommend ceo_call
- If inactive > 21 days, recommend training_session
- If risk 60-75, recommend check_in_call or discount_offer
- Confidence should be 60-95 based on how clear the signals are
`;

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a churn prevention expert. Analyze customer data and recommend interventions. Always respond in valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const aiResponse = completion.choices[0].message.content;
    let aiRecommendation;
    
    try {
      aiRecommendation = JSON.parse(aiResponse || '{}');
    } catch (e) {
      // Fallback if AI doesn't return valid JSON
      aiRecommendation = getFallbackRecommendation(customer, daysSinceLogin);
    }

    // Get pattern data for comparison
    let patterns: any[] = [];
    try {
      patterns = await prisma.recommendationPattern.findMany({
        where: {
          userId,
          customerSegment: customer.plan || 'unknown',
          riskRangeMin: { lte: customer.riskScore },
          riskRangeMax: { gte: customer.riskScore }
        },
        orderBy: { successRate: 'desc' },
        take: 2
      });
    } catch (e) {
      // Pattern table might not exist
    }

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
        action: aiRecommendation.action || 'check_in_call',
        confidence: aiRecommendation.confidence || 70,
        reasoning: aiRecommendation.reasoning || 'AI analysis suggests proactive outreach',
        personalizedMessage: aiRecommendation.personalizedMessage || 'We noticed you might need help getting the most out of our platform.',
        expectedOutcome: aiRecommendation.expectedOutcome || 'Re-engagement and reduced churn risk',
        estimatedMrrSaved: Math.round((customer.mrr || 0) * 0.8),
        isAIGenerated: true,
        alternativeActions: patterns.map(p => ({
          action: p.recommendedAction,
          successRate: Math.round((p.successRate || 0) * 100)
        }))
      }
    };

  } catch (error) {
    console.error('AI Generation Error:', error);
    // Fallback to rule-based
    return getFallbackRecommendation(customer, await getDaysSinceLogin(customer.id));
  }
}

async function getDaysSinceLogin(customerId: string): Promise<number> {
  try {
    const lastLogin = await prisma.event.findFirst({
      where: {
        customerId,
        event: 'login'
      },
      orderBy: { timestamp: 'desc' }
    });

    if (lastLogin && lastLogin.timestamp) {
      return Math.floor((Date.now() - Number(lastLogin.timestamp)) / (1000 * 60 * 60 * 24));
    }
  } catch (e) {
    // Ignore error
  }
  return 30; // Default
}

async function getRecentEvents(customerId: string): Promise<string[]> {
  try {
    const events = await prisma.event.findMany({
      where: { customerId },
      orderBy: { timestamp: 'desc' },
      take: 5
    });
    return events.map(e => e.event);
  } catch (e) {
    return [];
  }
}

function getFallbackRecommendation(customer: any, daysSinceLogin: number) {
  const riskScore = customer.riskScore || 50;
  const mrr = customer.mrr || 0;

  let action = 'check_in_call';
  let reasoning = 'Standard proactive outreach recommended';
  let confidence = 65;

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
    confidence = 70;
  }

  return {
    customer: {
      id: customer.id,
      name: customer.name || 'Unknown',
      email: customer.email || '',
      mrr,
      riskScore,
      plan: customer.plan || 'unknown',
      daysSinceLogin
    },
    recommendation: {
      action,
      confidence,
      reasoning,
      personalizedMessage: 'We value your business and want to ensure you are getting the most out of our platform.',
      expectedOutcome: 'Re-engagement and feature adoption',
      estimatedMrrSaved: Math.round(mrr * 0.7),
      isAIGenerated: false,
      alternativeActions: []
    }
  };
}
