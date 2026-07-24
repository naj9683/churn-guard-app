import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getTrialInfo, paywallCookieValue, TRIAL_DAYS } from "@/lib/trial";

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';
const PAYWALL_COOKIE = { path: '/', httpOnly: true, maxAge: 3600, sameSite: 'lax' as const };

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;

    // Admin email bypass — always grant full access and reset any stale blocked cookie
    if (email === ADMIN_EMAIL) {
      const res = NextResponse.json({ hasAccess: true, isAdmin: true });
      res.cookies.set('cg_paywall', 'active', PAYWALL_COOKIE);
      return res;
    }

    // Statuses that grant dashboard access. past_due = Stripe retry window; the subscriber
    // paid and must not be locked out. canceled with a future currentPeriodEnd = they paid
    // through that date and access continues until it passes.
    const OPEN_STATUSES = ['active', 'trialing', 'past_due', 'paused'];

    // Fetch the most recent subscription regardless of status so we can evaluate period-end access.
    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      // New signup — provision record and grant full trial access
      const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || undefined;
      try {
        await prisma.user.upsert({
          where: { clerkId: userId },
          update: {},
          create: {
            clerkId: userId,
            email: email ?? `${userId}@unknown.com`,
            ...(name ? { name } : {}),
          },
        });
      } catch {
        // Race condition — safe to ignore
      }
      const res = NextResponse.json({
        hasAccess: true,
        onTrial: true,
        trialDaysLeft: TRIAL_DAYS,
        graceDaysLeft: 0,
        hasPaidPlan: false,
        status: 'trial',
        blocked: false,
        subscriptionStatus: null,
        hadAnySubscription: false,
      });
      res.cookies.set('cg_paywall', 'active', PAYWALL_COOKIE);
      return res;
    }

    const now = new Date();
    const latestSub = user.subscriptions[0] ?? null;
    const hasPaidSubscription = latestSub !== null && (
      OPEN_STATUSES.includes(latestSub.status) ||
      (latestSub.status === 'canceled' && latestSub.currentPeriodEnd !== null && latestSub.currentPeriodEnd > now)
    );
    const hadAnySubscription = user.subscriptions.length > 0;
    const trialInfo = getTrialInfo(user.createdAt, hasPaidSubscription);
    const cookieVal = paywallCookieValue(trialInfo);

    const res = NextResponse.json({
      hasAccess: true, // Existing users always have dashboard access — layout/middleware enforce paywall
      onTrial: trialInfo.status === 'trial',
      trialDaysLeft: trialInfo.trialDaysLeft,
      graceDaysLeft: trialInfo.graceDaysLeft,
      hasPaidPlan: hasPaidSubscription,
      status: trialInfo.status,
      blocked: trialInfo.blocked,
      subscriptionStatus: latestSub?.status ?? null,
      hadAnySubscription,
    });
    res.cookies.set('cg_paywall', cookieVal, PAYWALL_COOKIE);
    return res;
  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json({ hasAccess: true }, { status: 500 });
  }
}
