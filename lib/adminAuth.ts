import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';
// Clerk user ID for the admin — used as a reliable fallback
const ADMIN_CLERK_IDS = ['user_3AP7xokH0oin2NoqgK37ER9Y4su'];

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  // Primary check: match against known admin Clerk user IDs (no DB lookup needed)
  if (ADMIN_CLERK_IDS.includes(userId)) {
    const user = await prisma.user.findFirst({
      where: { OR: [{ clerkId: userId }, { email: ADMIN_EMAIL }] }
    });
    return { user: user ?? { id: '', email: ADMIN_EMAIL, clerkId: userId } };
  }

  // Fallback: fetch email from Clerk directly (avoids stale DB email)
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? '';

  if (email !== ADMIN_EMAIL) {
    return { error: NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 }) };
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ clerkId: userId }, { email }] }
  });
  return { user: user ?? { id: '', email, clerkId: userId } };
}
