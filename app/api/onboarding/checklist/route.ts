import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId }, select: { id: true } });
    if (!user) return NextResponse.json({ stripe: false, customers: false, playbook: false, alert: false });

    const [stripeIntegration, customerCount, playbookCount, alertCount] = await Promise.all([
      prisma.crmIntegration.findUnique({
        where: { userId_type: { userId: user.id, type: 'stripe' } },
        select: { enabled: true, accessToken: true },
      }),
      prisma.customer.count({ where: { userId: user.id } }),
      prisma.playbook.count({ where: { userId: user.id, isActive: true } }),
      prisma.interventionOutcome.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      stripe: !!(stripeIntegration?.enabled && stripeIntegration.accessToken),
      customers: customerCount > 0,
      playbook: playbookCount > 0,
      alert: alertCount > 0,
    });
  } catch (error) {
    console.error('Checklist error:', error);
    return NextResponse.json({ stripe: false, customers: false, playbook: false, alert: false });
  }
}
