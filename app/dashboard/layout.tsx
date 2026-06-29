import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTrialInfo } from '@/lib/trial';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'najwa.saadi1@hotmail.com';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  // Paywall: server-side safety net for first-load / cookie-less requests
  try {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? '';

    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      const user = await prisma.user.findFirst({
        where: { clerkId: userId! },
        include: { subscriptions: { where: { status: 'active' }, take: 1 } },
      });

      if (user) {
        const { blocked } = getTrialInfo(user.createdAt, user.subscriptions.length > 0);
        if (blocked) redirect('/upgrade?expired=true');
      }
    }
  } catch {
    // DB error — fail open, never block a paying customer
  }

  return <div style={{ minHeight: '100vh', background: '#0f172a' }}>{children}</div>;
}
