import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';
const TRIAL_DAYS = 30;

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;

    // Admin email bypass — always grant full access
    if (email === ADMIN_EMAIL) {
      return NextResponse.json({ hasAccess: true, isAdmin: true });
    }

    // Check for active subscription in DB
    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ hasAccess: false });
    }

    const hasPaidSubscription = user.subscriptions.length > 0;

    // Trial check: within 30 days of account creation, no payment required
    const ageMs = Date.now() - user.createdAt.getTime();
    const ageDays = ageMs / 86_400_000;
    const onTrial = !hasPaidSubscription && ageDays < TRIAL_DAYS;
    const trialDaysLeft = onTrial ? Math.ceil(TRIAL_DAYS - ageDays) : 0;

    const hasAccess = hasPaidSubscription || onTrial;

    return NextResponse.json({ hasAccess, onTrial, trialDaysLeft });
  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json({ hasAccess: false }, { status: 500 });
  }
}
