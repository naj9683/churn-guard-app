import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

const DEFAULT_PLAYBOOKS = [
  {
    name: 'High Risk Alert',
    description: 'Automatically alerts when customer risk score exceeds 70%. Triggers email to success team and creates intervention task.',
    triggerType: 'risk_score',
    triggerValue: '70',
    actionType: 'email',
    actionConfig: {
      subject: 'High Risk Alert: {{customer.name}} needs attention',
      body: 'Customer {{customer.email}} has a risk score of {{customer.riskScore}}%. Recommended action: Schedule check-in call.'
    },
    isActive: true,
    isSystem: true
  },
  {
    name: 'Login Drop Alert',
    description: 'Detects when customer has not logged in for 7+ days. Sends re-engagement email with helpful resources.',
    triggerType: 'days_since_login',
    triggerValue: '7',
    actionType: 'email',
    actionConfig: {
      subject: 'We miss you at ChurnGuard',
      body: 'Hi {{customer.name}}, we noticed you haven\'t logged in recently. Here are some quick tips to get value from our platform...'
    },
    isActive: true,
    isSystem: true
  },
  {
    name: 'Feature Adoption Boost',
    description: 'Triggers when customer uses less than 3 core features. Sends onboarding guide for unused features.',
    triggerType: 'feature_usage',
    triggerValue: '3',
    actionType: 'email',
    actionConfig: {
      subject: 'Unlock more value with these features',
      body: 'Hi {{customer.name}}, you\'re using {{features.used}} of {{features.total}} features. Here\'s how to get more value...'
    },
    isActive: true,
    isSystem: true
  },
  {
    name: 'Revenue At Risk',
    description: 'Monitors MRR changes. Triggers when MRR drops by 20% or more. Alerts sales team for immediate intervention.',
    triggerType: 'mrr_drop',
    triggerValue: '20',
    actionType: 'slack',
    actionConfig: {
      channel: '#revenue-alerts',
      message: '🚨 Revenue Alert: {{customer.name}} MRR dropped by {{mrr.change}}%. Immediate action required.'
    },
    isActive: true,
    isSystem: true
  },
  {
    name: 'Expansion Opportunity',
    description: 'Identifies power users (high engagement, low risk) and sends upgrade offers automatically.',
    triggerType: 'expansion_ready',
    triggerValue: '90',
    actionType: 'email',
    actionConfig: {
      subject: 'Ready to scale? 🚀',
      body: 'Hi {{customer.name}}, we\'ve noticed you\'re getting amazing results. Here\'s how you can scale even further...'
    },
    isActive: true,
    isSystem: true
  },
  {
    name: 'Churn Recovery',
    description: 'Last-ditch effort when cancellation is initiated. Offers discount and connects to retention specialist.',
    triggerType: 'cancellation_intent',
    triggerValue: '1',
    actionType: 'webhook',
    actionConfig: {
      url: '/api/webhooks/retention',
      data: { priority: 'urgent', offer_discount: true }
    },
    isActive: true,
    isSystem: true
  }
];

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.playbook.findMany({
      where: { isSystem: true }
    });

    if (existing.length > 0) {
      return NextResponse.json({ 
        message: 'AI Playbooks already initialized',
        playbooks: existing 
      });
    }

    const created = await Promise.all(
      DEFAULT_PLAYBOOKS.map(pb => 
        prisma.playbook.create({
          data: {
            ...pb,
            userId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      )
    );

    return NextResponse.json({
      message: 'AI Playbooks initialized successfully',
      playbooks: created
    });
  } catch (error) {
    console.error('Error seeding playbooks:', error);
    return NextResponse.json({ error: 'Failed to initialize' }, { status: 500 });
  }
}
