import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

async function getUser(clerkId: string) {
  return prisma.user.findFirst({ where: { clerkId } });
}

// GET /api/automation/rules — list all rules for the current user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const rules = await prisma.automationRule.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { logs: true } },
      logs: { orderBy: { executedAt: 'desc' }, take: 1, select: { executedAt: true, status: true } },
    },
  });

  return NextResponse.json({ rules });
}

// POST /api/automation/rules — create a new rule
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();
  const { name, triggerType, condition, actionType, actionConfig, isActive } = body;

  if (!name || !triggerType || !condition || !actionType || !actionConfig) {
    return NextResponse.json({ error: 'Missing required fields: name, triggerType, condition, actionType, actionConfig' }, { status: 400 });
  }

  const valid = {
    triggerTypes: [
      'risk_threshold', 'payment_failed', 'feature_abandonment', 'multi_condition',
      'days_since_login', 'mrr_value', 'plan_type', 'payment_status',
      'account_age', 'feature_not_used', 'support_tickets', 'trial_ending', 'no_activity',
    ],
    actionTypes: ['send_email', 'send_slack', 'create_intervention', 'send_sms', 'escalate_to_human', 'trigger_sequence'],
  };
  if (!valid.triggerTypes.includes(triggerType))
    return NextResponse.json({ error: `triggerType must be one of: ${valid.triggerTypes.join(', ')}` }, { status: 400 });
  if (!valid.actionTypes.includes(actionType))
    return NextResponse.json({ error: `actionType must be one of: ${valid.actionTypes.join(', ')}` }, { status: 400 });

  const rule = await prisma.automationRule.create({
    data: { userId: user.id, name, triggerType, condition, actionType, actionConfig, isActive: isActive ?? true },
  });

  return NextResponse.json({ rule }, { status: 201 });
}

// PATCH /api/automation/rules — update a rule (id in body)
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'Missing rule id' }, { status: 400 });

  const rule = await prisma.automationRule.updateMany({
    where: { id, userId: user.id },
    data: updates,
  });

  if (rule.count === 0) return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

// DELETE /api/automation/rules?id=... — delete a rule
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await getUser(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing rule id' }, { status: 400 });

  await prisma.automationRule.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ success: true });
}
