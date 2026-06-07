import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      select: { id: true, slackWebhookUrl: true, stripeCustomerId: true },
    });

    if (!user) {
      return NextResponse.json({
        hubspot: { connected: false, syncStatus: null },
        connected: false, type: null,
        slackConnected: false, stripeConnected: false,
      });
    }

    const integrations = await prisma.crmIntegration.findMany({
      where: { userId: user.id },
    });

    const hs  = integrations.find(i => i.type === 'hubspot');
    const str = integrations.find(i => i.type === 'stripe');

    return NextResponse.json({
      hubspot: { connected: hs?.enabled ?? false, syncStatus: hs?.syncStatus ?? null },
      // Legacy fields kept for backward compat
      connected:  hs?.enabled ?? false,
      type:       hs?.enabled ? 'hubspot' : null,
      syncStatus: hs?.syncStatus ?? null,
      slackConnected:  !!user.slackWebhookUrl,
      // stripeConnected = user has provided their OWN Stripe secret key for Revenue at Risk
      stripeConnected: !!(str?.enabled && str.accessToken),
    });
  } catch (error) {
    console.error('Integration status error:', error);
    return NextResponse.json({
      hubspot: { connected: false, syncStatus: null },
      connected: false, type: null, syncStatus: null,
      slackConnected: false, stripeConnected: false,
    });
  }
}
