import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // Not authenticated → send to login
  if (!userId) {
    redirect('/login');
  }

  // Admin always has access
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? '';
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return <div style={{ minHeight: '100vh', background: '#0f172a' }}>{children}</div>;
  }

  // Check subscription — fail open on any DB error so paying customers are never blocked
  try {
    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      select: {
        subscriptions: {
          where: { status: 'active' },
          take: 1,
          select: { id: true },
        },
      },
    });

    // Only redirect to pricing if we definitively found the user and they have no active subscription
    if (user && user.subscriptions.length === 0) {
      redirect('/login?error=subscription_required');
    }

    // user === null means no DB record yet (new sign-up, onboarding in progress) — let them through
  } catch {
    // DB error — fail open, never block a potentially paying customer
  }

  return <div style={{ minHeight: '100vh', background: '#0f172a' }}>{children}</div>;
}
