import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTrialInfo, paywallCookieValue } from '@/lib/trial';

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://churnguardapp.com';

const PAYWALL_COOKIE = { path: '/', httpOnly: true, maxAge: 3600, sameSite: 'lax' as const };

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL('/login', BASE_URL));
  }

  // Admin shortcut — unchanged
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? '';
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'najwa.saadi1@hotmail.com';
  if (email.toLowerCase() === adminEmail.toLowerCase()) {
    return NextResponse.redirect(new URL('/dashboard', BASE_URL));
  }

  // Existing user → check trial before deciding destination
  // New user (no DB record) → onboarding
  const user = await prisma.user.findFirst({
    where: { clerkId: userId },
    include: {
      subscriptions: { where: { status: 'active' }, take: 1 },
    },
  });

  if (!user) {
    // New signup — grant trial access
    const res = NextResponse.redirect(new URL('/onboarding/widget', BASE_URL));
    res.cookies.set('cg_paywall', 'active', PAYWALL_COOKIE);
    return res;
  }

  const trialInfo = getTrialInfo(user.createdAt, user.subscriptions.length > 0);
  const cookieVal = paywallCookieValue(trialInfo);

  if (trialInfo.blocked) {
    // Trial expired + grace period over + no paid plan → paywall
    const res = NextResponse.redirect(new URL('/upgrade?expired=true', BASE_URL));
    res.cookies.set('cg_paywall', 'blocked', PAYWALL_COOKIE);
    return res;
  }

  // Active trial or paid subscriber → dashboard (unchanged)
  const res = NextResponse.redirect(new URL('/dashboard', BASE_URL));
  res.cookies.set('cg_paywall', cookieVal, PAYWALL_COOKIE);
  return res;
}
