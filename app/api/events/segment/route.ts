import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/events/segment
 *
 * Body: { event: string, properties?: { customerId?: string, feature?: string, ... } }
 *
 * - If properties.customerId is provided, updates that Customer's behavior fields.
 * - For "User Logged In" events with a customerId: updates lastLoginAt, increments loginCountThisMonth.
 * - For "Feature Used" events with a customerId + feature: adds the feature to featuresUsed array.
 * - Optionally forwards the event to Segment's server-side Track API if SEGMENT_WRITE_KEY is set.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const event: string = body.event ?? '';
    const properties: Record<string, unknown> = body.properties ?? {};

    // Look up the internal DB user
    const user = await prisma.user.findFirst({ where: { clerkId: userId } });

    // Resolve customerId — use provided one, or fall back to the user's first customer
    let customerId = properties.customerId as string | undefined;
    let resolvedCustomer: { id: string; featuresUsed: unknown; loginCountThisMonth: number | null } | null = null;

    if (user) {
      if (customerId) {
        resolvedCustomer = await prisma.customer.findFirst({
          where: { id: customerId, userId: user.id },
          select: { id: true, featuresUsed: true, loginCountThisMonth: true },
        });
      } else {
        // No customerId provided — use the first customer belonging to this user
        resolvedCustomer = await prisma.customer.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'asc' },
          select: { id: true, featuresUsed: true, loginCountThisMonth: true },
        });
        if (resolvedCustomer) customerId = resolvedCustomer.id;
      }
    }

    if (resolvedCustomer && customerId) {
      const now = new Date();
      const updates: Record<string, unknown> = {};

      if (event === 'User Logged In') {
        updates.lastLoginAt = now;
        updates.loginCountThisMonth = (resolvedCustomer.loginCountThisMonth ?? 0) + 1;
      }

      const featureName = properties.feature as string | undefined;
      if (featureName) {
        const existing: string[] = Array.isArray(resolvedCustomer.featuresUsed)
          ? (resolvedCustomer.featuresUsed as string[])
          : [];
        if (!existing.includes(featureName)) {
          updates.featuresUsed = [...existing, featureName];
        }
        updates.lastFeatureUsedAt = now;
      }

      if (Object.keys(updates).length > 0) {
        await prisma.customer.update({
          where: { id: resolvedCustomer.id },
          data: updates,
        });
      }

      // Write an Event record so risk analyzer has recentEvents data
      await prisma.event.create({
        data: {
          customerId: resolvedCustomer.id,
          event,
          metadata: properties as any,
          timestamp: BigInt(Date.now()),
        },
      });
    }

    // Forward to Segment server-side Track API if write key is configured
    const writeKey = process.env.SEGMENT_WRITE_KEY;
    if (writeKey) {
      const segmentUserId = user?.id ?? userId;
      const segmentBody = {
        userId: segmentUserId,
        event,
        properties,
        timestamp: new Date().toISOString(),
        context: { library: { name: 'churnguard-server', version: '1.0.0' } },
      };
      // Fire-and-forget — don't await so we don't block the response
      fetch('https://api.segment.io/v1/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${writeKey}:`).toString('base64')}`,
        },
        body: JSON.stringify(segmentBody),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Segment event error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
