import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

const DEFAULT_PLAYBOOKS = [
  {
    name: 'High Risk Alert',
    description: 'Automatically alerts when customer risk score exceeds 70%. Triggers email to success team and creates intervention task.',
    trigger: 'risk_score>=70',
    actions: {
      type: 'email',
      subject: 'High Risk Alert: Customer needs attention',
      body: 'Customer has a risk score above 70%. Recommended action: Schedule check-in call.'
    },
    isActive: true
  },
  {
    name: 'Login Drop Alert',
    description: 'Detects when customer has not logged in for 7+ days. Sends re-engagement email with helpful resources.',
    trigger: 'days_since_login>=7',
    actions: {
      type: 'email',
      subject: 'We miss you at ChurnGuard',
      body: 'We noticed you haven\'t logged in recently. Here are some quick tips to get value...'
    },
    isActive: true
  },
  {
    name: 'Feature Adoption Boost',
    description: 'Triggers when customer uses less than 3 core features. Sends onboarding guide for unused features.',
    trigger: 'feature_usage<3',
    actions: {
      type: 'email',
      subject: 'Unlock more value with these features',
      body: 'Here\'s how to get more value from unused features...'
    },
    isActive: true
  },
  {
    name: 'Revenue At Risk',
    description: 'Monitors MRR changes. Triggers when MRR drops by 20% or more. Alerts sales team for immediate intervention.',
    trigger: 'mrr_drop>=20',
    actions: {
      type: 'slack',
      channel: '#revenue-alerts',
      message: '🚨 Revenue Alert: MRR dropped significantly. Immediate action required.'
    },
    isActive: true
  },
  {
    name: 'Expansion Opportunity',
    description: 'Identifies power users (high engagement, low risk) and sends upgrade offers automatically.',
    trigger: 'health_score>=90',
    actions: {
      type: 'email',
      subject: 'Ready to scale? 🚀',
      body: 'We\'ve noticed you\'re getting amazing results. Here\'s how you can scale...'
    },
    isActive: true
  },
  {
    name: 'Churn Recovery',
    description: 'Last-ditch effort when cancellation is initiated. Offers discount and connects to retention specialist.',
    trigger: 'cancellation_intent',
    actions: {
      type: 'webhook',
      url: '/api/webhooks/retention',
      priority: 'urgent'
    },
    isActive: true
  }
];

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has playbooks
    const existing = await prisma.playbook.findMany({
      where: { userId: userId }
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
            userId: userId
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
