import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://churnguardapp.com';
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'najwa.saadi1@hotmail.com';

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL('/login', BASE_URL));
  }

  // Admin bypass — always go straight to dashboard
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? '';
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.redirect(new URL('/dashboard', BASE_URL));
  }

  // Regular user — check subscription
  const user = await prisma.user.findFirst({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (user) {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id, status: 'active' },
    });
    if (subscription) {
      return NextResponse.redirect(new URL('/dashboard', BASE_URL));
    }
  }

  return NextResponse.redirect(
    new URL('/pricing?message=Please subscribe to continue', BASE_URL)
  );
}
