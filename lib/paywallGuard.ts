import { NextResponse } from 'next/server';
import { prisma } from './prisma';
import { getTrialInfo } from './trial';

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';

/**
 * Call this at the top of any write-action API handler (POST/PUT/PATCH/DELETE).
 * Returns a NextResponse with status 402 if the user's trial is expired,
 * or null if access is allowed.
 *
 * Admin email is always allowed regardless of trial status.
 * Fails open on DB errors so a bad connection never locks users out.
 */
export async function checkWriteAccess(clerkId: string): Promise<NextResponse | null> {
  try {
    const user = await prisma.user.findFirst({
      where: { clerkId },
      include: { subscriptions: { where: { status: 'active' }, take: 1 } },
    });
    if (!user) return null; // new user — allow

    // Admin bypass: permanent unconditional access
    if (user.email === ADMIN_EMAIL) return null;

    const { status } = getTrialInfo(user.createdAt, user.subscriptions.length > 0);

    if (status === 'blocked') {
      return NextResponse.json(
        { error: 'Your free trial has expired. Upgrade to continue.', upgrade: '/upgrade' },
        { status: 402 }
      );
    }

    if (status === 'grace') {
      return NextResponse.json(
        { error: 'Trial grace period — upgrade to unlock full write access.', upgrade: '/upgrade' },
        { status: 402 }
      );
    }

    return null; // trial active or paid subscription
  } catch {
    return null; // fail open on DB errors
  }
}
