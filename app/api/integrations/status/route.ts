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
        hubspot:    { connected: false, syncStatus: null },
        salesforce: { connected: false, syncStatus: null },
        connected: false, type: null,
        slackConnected: false, stripeConnected: false,
      });
    }

    const integrations = await prisma.crmIntegration.findMany({
      where: { userId: user.id },
    });

    const hs = integrations.find(i => i.type === 'hubspot');
    const sf = integrations.find(i => i.type === 'salesforce');

    return NextResponse.json({
      hubspot:    { connected: hs?.enabled ?? false, syncStatus: hs?.syncStatus ?? null },
      salesforce: { connected: sf?.enabled ?? false, syncStatus: sf?.syncStatus ?? null },
      // Legacy fields kept for backward compat
      connected: (hs?.enabled || sf?.enabled) ?? false,
      type: hs?.enabled ? 'hubspot' : sf?.enabled ? 'salesforce' : null,
      syncStatus: (hs ?? sf)?.syncStatus ?? null,
      slackConnected:  !!user.slackWebhookUrl,
      stripeConnected: !!user.stripeCustomerId,
    });
  } catch (error) {
    console.error('Integration status error:', error);
    return NextResponse.json({
      hubspot:    { connected: false, syncStatus: null },
      salesforce: { connected: false, syncStatus: null },
      connected: false, type: null, syncStatus: null,
      slackConnected: false, stripeConnected: false,
    });
  }
}
