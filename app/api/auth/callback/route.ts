import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://churnguardapp.com';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL('/login', BASE_URL));
  }

  // Admin shortcut
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? '';
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'najwa.saadi1@hotmail.com';
  if (email.toLowerCase() === adminEmail.toLowerCase()) {
    return NextResponse.redirect(new URL('/dashboard', BASE_URL));
  }

  // Existing user → dashboard (subscription gating is handled there)
  // New user (no DB record yet) → onboarding
  const user = await prisma.user.findFirst({
    where: { clerkId: userId },
    select: { id: true },
  });

  return NextResponse.redirect(
    new URL(user ? '/dashboard' : '/onboarding', BASE_URL)
  );
}
