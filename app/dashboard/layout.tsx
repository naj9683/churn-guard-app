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
    redirect('/auth/login');
  }

  // Admin always has access
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? '';
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return <div style={{ minHeight: '100vh', background: '#0f172a' }}>{children}</div>;
  }

  // Check for an active subscription
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

  if (!user || user.subscriptions.length === 0) {
    redirect('/pricing?msg=subscribe');
  }

  return <div style={{ minHeight: '100vh', background: '#0f172a' }}>{children}</div>;
}
