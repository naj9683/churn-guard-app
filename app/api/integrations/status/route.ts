import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      select: { id: true, slackWebhookUrl: true, stripeCustomerId: true, crmType: true },
    });

    if (!user) {
      return NextResponse.json({
        connected: false, type: null, syncStatus: null,
        slackConnected: false, stripeConnected: false,
      });
    }

    const integration = await prisma.crmIntegration.findFirst({
      where: { userId: user.id },
    });

    return NextResponse.json({
      connected:     integration?.enabled ?? false,
      type:          integration?.type ?? user.crmType ?? null,
      syncStatus:    integration?.syncStatus ?? null,
      slackConnected:  !!user.slackWebhookUrl,
      stripeConnected: !!user.stripeCustomerId,
    });
  } catch (error) {
    console.error('Integration status error:', error);
    return NextResponse.json({
      connected: false, type: null, syncStatus: null,
      slackConnected: false, stripeConnected: false,
    });
  }
}
