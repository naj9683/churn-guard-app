import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * GET /api/analytics/status
 *
 * Debug endpoint — returns the current state of the Segment integration:
 *  - Whether NEXT_PUBLIC_SEGMENT_WRITE_KEY and SEGMENT_WRITE_KEY are set
 *  - A live test POST to Segment's API to verify the write key is valid
 *  - Sample of recent customer behavior fields (lastLoginAt, loginCountThisMonth, featuresUsed)
 *  - Whether the OpenAI key is set for risk analysis
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId: userId } });

  // Config flags
  const browserKeySet  = !!process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;
  const serverKeySet   = !!process.env.SEGMENT_WRITE_KEY;
  const openaiKeySet   = !!process.env.OPENAI_API_KEY;

  // Live Segment API test (server write key)
  let segmentApiTest: { ok: boolean; status?: number; error?: string } = { ok: false, error: 'SEGMENT_WRITE_KEY not set' };
  if (serverKeySet) {
    try {
      const res = await fetch('https://api.segment.io/v1/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${process.env.SEGMENT_WRITE_KEY}:`).toString('base64')}`,
        },
        body: JSON.stringify({
          userId: user?.id ?? userId,
          event: 'ChurnGuard Analytics Status Check',
          properties: { source: 'debug-endpoint', timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString(),
        }),
      });
      segmentApiTest = { ok: res.ok, status: res.status };
    } catch (e: any) {
      segmentApiTest = { ok: false, error: e.message };
    }
  }

  // Sample of customer behavior data (most recently updated)
  let customerBehaviorSample: any[] = [];
  if (user) {
    const customers = await prisma.customer.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        email: true,
        lastLoginAt: true,
        loginCountThisMonth: true,
        featuresUsed: true,
        riskScore: true,
        riskReason: true,
        updatedAt: true,
      },
    });
    customerBehaviorSample = customers.map(c => ({
      email: c.email,
      lastLoginAt: c.lastLoginAt,
      loginCountThisMonth: c.loginCountThisMonth,
      featuresUsed: c.featuresUsed,
      riskScore: c.riskScore,
      hasRiskReason: !!c.riskReason,
      lastUpdated: c.updatedAt,
    }));
  }

  return NextResponse.json({
    config: {
      browserWriteKey: browserKeySet
        ? `${process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY!.slice(0, 8)}...`
        : null,
      serverWriteKey: serverKeySet
        ? `${process.env.SEGMENT_WRITE_KEY!.slice(0, 8)}...`
        : null,
      openaiApiKey: openaiKeySet,
      keysMatch: browserKeySet && serverKeySet &&
        process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY === process.env.SEGMENT_WRITE_KEY,
    },
    segmentApiTest,
    customerBehaviorSample,
    notes: [
      browserKeySet
        ? 'Segment Analytics.js will load in browser (snippet injected in layout)'
        : 'NEXT_PUBLIC_SEGMENT_WRITE_KEY not set — browser SDK will not load',
      serverKeySet
        ? 'Server-side Segment tracking is active (/api/events/segment will forward events)'
        : 'SEGMENT_WRITE_KEY not set — server-side forwarding disabled',
      openaiKeySet
        ? 'OpenAI key set — risk analysis cron will generate AI reasons'
        : 'OPENAI_API_KEY not set — risk analysis will use fallback scores only',
      !browserKeySet && !serverKeySet
        ? 'ACTION REQUIRED: Add NEXT_PUBLIC_SEGMENT_WRITE_KEY and SEGMENT_WRITE_KEY to Vercel env vars'
        : 'If events are not appearing in Segment Debugger, check that the Source type is "Node.js" for server events and "Browser (Analytics.js)" for browser events',
    ],
  });
}
