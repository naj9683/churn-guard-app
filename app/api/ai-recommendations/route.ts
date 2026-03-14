import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

// Only initialize OpenAI if API key exists (prevents build crash)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) return Response.json([], { status: 200 });

    // Get high-risk customers
    const customers = await prisma.customer.findMany({
      where: {
        userId: user.id,
        riskScore: { gte: 60 }
      },
      orderBy: { riskScore: 'desc' },
      take: 5
    });

    if (!customers || customers.length === 0) {
      return Response.json([], { status: 200 });
    }

    // If OpenAI not configured, use fallback
    if (!openai) {
      console.log('OpenAI not configured, using rule-based recommendations');
      const recommendations = customers.map(c => getFallbackRecommendation(c, 30));
      return Response.json(recommendations);
    }

    // Generate AI-powered recommendations
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
    const daysSinceLogin = await getDaysSinceLogin(customer.id);
    
    const prompt = `
Analyze this at-risk customer and recommend the best intervention.

CUSTOMER:
- Name: ${customer.name || 'Unknown'}
- Plan: ${customer.plan || 'unknown'}
- MRR: $${customer.mrr || 0}
- Risk Score: ${customer.riskScore}/100
- Days Since Login: ${daysSinceLogin}

INTERVENTIONS: discount_offer, ceo_call, training_session, check_in_call, webinar_invite

Respond in JSON:
{
  "action": "intervention_name",
  "confidence": 75,
  "reasoning": "why this fits",
  "personalizedMessage": "message to customer"
}`;

    const completion = await openai!.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a churn prevention expert." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 400
    });

    const aiResponse = completion.choices[0].message.content;
    let aiRecommendation;
    
    try {
      aiRecommendation = JSON.parse(aiResponse || '{}');
    } catch (e) {
      aiRecommendation = {};
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
        reasoning: aiRecommendation.reasoning || 'Proactive outreach recommended',
        personalizedMessage: aiRecommendation.personalizedMessage || 'We want to ensure your success.',
        estimatedMrrSaved: Math.round((customer.mrr || 0) * 0.8),
        isAIGenerated: true
      }
    };

  } catch (error) {
    console.error('AI Generation Error:', error);
    return getFallbackRecommendation(customer, await getDaysSinceLogin(customer.id));
  }
}

async function getDaysSinceLogin(customerId: string): Promise<number> {
  try {
    const lastLogin = await prisma.event.findFirst({
      where: { customerId, event: 'login' },
      orderBy: { timestamp: 'desc' }
    });
    if (lastLogin?.timestamp) {
      return Math.floor((Date.now() - Number(lastLogin.timestamp)) / (1000 * 60 * 60 * 24));
    }
  } catch (e) {}
  return 30;
}

function getFallbackRecommendation(customer: any, daysSinceLogin: number) {
  const riskScore = customer.riskScore || 50;
  const mrr = customer.mrr || 0;

  let action = 'check_in_call';
  let reasoning = 'Proactive outreach recommended';
  let confidence = 65;

  if (riskScore >= 85 && mrr > 1000) {
    action = 'ceo_call';
    reasoning = `High-value customer ($${mrr} MRR) at critical risk (${riskScore}%)`;
    confidence = 85;
  } else if (riskScore >= 80) {
    action = 'discount_offer';
    reasoning = `Strong churn signals (${riskScore}% risk)`;
    confidence = 75;
  } else if (daysSinceLogin > 14) {
    action = 'training_session';
    reasoning = `Inactive for ${daysSinceLogin} days`;
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
      personalizedMessage: 'We value your business and want to ensure your success.',
      estimatedMrrSaved: Math.round(mrr * 0.7),
      isAIGenerated: false
    }
  };
}
