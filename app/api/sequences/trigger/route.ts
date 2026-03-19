import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { enrollInSequence, runSequences } from '@/lib/sequences';

/**
 * POST /api/sequences/trigger
 * Manually enroll a customer in a sequence and run it immediately.
 * Used for end-to-end testing.
 * Body: { customerId: string, sequenceType: 'dunning' | 'risk_retention' | 'welcome' }
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { customerId, sequenceType } = body;

  if (!customerId || !sequenceType) {
    return NextResponse.json({ error: 'customerId and sequenceType are required' }, { status: 400 });
  }

  const validTypes = ['dunning', 'risk_retention', 'welcome'];
  if (!validTypes.includes(sequenceType)) {
    return NextResponse.json({ error: `sequenceType must be one of: ${validTypes.join(', ')}` }, { status: 400 });
  }

  // Verify customer belongs to this user
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, userId: user.id },
  });
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

  // Enroll (cancels any existing active enrollment for this type)
  await enrollInSequence(user.id, customerId, sequenceType as any, {
    triggeredManually: true,
    triggeredAt: new Date().toISOString(),
  });

  // Run sequences immediately so step 0 fires now instead of waiting for cron
  const result = await runSequences();

  return NextResponse.json({
    enrolled: true,
    sequenceType,
    customerId,
    customer: { name: customer.name, email: customer.email },
    runResult: result,
  });
}
