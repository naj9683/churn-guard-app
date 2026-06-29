import { NextResponse } from 'next/server';
import { prisma } from './prisma';
import { getTrialInfo } from './trial';

const WRITE_BLOCKED_STATUSES = new Set(['blocked', 'grace']);

export async function checkWriteAccess(clerkId: string): Promise<NextResponse | null> {
  try {
    const user = await prisma.user.findFirst({
      where: { clerkId },
      include: { subscriptions: { where: { status: 'active' }, take: 1 } },
    });
    if (!user) return null;

    const { status } = getTrialInfo(user.createdAt, user.subscriptions.length > 0);

    if (status === 'blocked') {
      return NextResponse.json(
        { error: 'Your free trial has expired. Upgrade to continue creating new items.' },
        { status: 402 }
      );
    }

    if (status === 'grace') {
      return NextResponse.json(
        { error: 'Trial grace period active — upgrade to create new items.' },
        { status: 402 }
      );
    }

    return null; // allowed
  } catch {
    return null; // fail open
  }
}
