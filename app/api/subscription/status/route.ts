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
      });
      res.cookies.set('cg_paywall', 'active', PAYWALL_COOKIE);
      return res;
    }

    const hasPaidSubscription = user.subscriptions.length > 0;
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
    });
    res.cookies.set('cg_paywall', cookieVal, PAYWALL_COOKIE);
    return res;
  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json({ hasAccess: true }, { status: 500 });
  }
}
