import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'najwa.saadi1@hotmail.com';

/**
 * POST /api/admin/backfill-subscriptions
 *
 * One-time repair: iterates every active Stripe subscription, finds the matching
 * DB user via the Clerk userId stored in subscription metadata, and creates any
 * missing Subscription rows. Safe to call multiple times — skips users that
 * already have an active subscription in the DB.
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? '';
  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const results: Array<{ clerkUserId: string; userId: string; action: string }> = [];
  let errors = 0;

  try {
    // Paginate all active Stripe subscriptions
    for await (const stripeSub of stripe.subscriptions.list({ status: 'active', limit: 100 })) {
      const stripeCustomerId = stripeSub.customer as string;
      const clerkUserId: string = stripeSub.metadata?.userId ?? '';

      if (!clerkUserId) {
        results.push({ clerkUserId: '(none)', userId: stripeCustomerId, action: 'skipped — no userId in metadata' });
        continue;
      }

      try {
        const user = await prisma.user.findFirst({
          where: { clerkId: clerkUserId },
          select: { id: true },
        });

        if (!user) {
          results.push({ clerkUserId, userId: '(not in DB)', action: 'skipped — user not found in DB' });
          continue;
        }

        // Stamp stripeCustomerId so future cancellation webhooks can find this user
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId },
        });

        const existing = await prisma.subscription.findFirst({
          where: { userId: user.id, status: 'active' },
        });

        if (existing) {
          results.push({ clerkUserId, userId: user.id, action: 'skipped — already has active subscription' });
          continue;
        }

        const priceId = stripeSub.items.data[0]?.price?.id ?? '';
        await prisma.subscription.create({
          data: { userId: user.id, status: 'active', priceId },
        });

        results.push({ clerkUserId, userId: user.id, action: `created subscription (priceId: ${priceId})` });
      } catch (inner: any) {
        errors++;
        results.push({ clerkUserId, userId: stripeCustomerId, action: `error: ${inner.message}` });
      }
    }
  } catch (outer: any) {
    return NextResponse.json({ error: `Stripe list error: ${outer.message}` }, { status: 500 });
  }

  const created = results.filter(r => r.action.startsWith('created')).length;
  const skipped = results.filter(r => r.action.startsWith('skipped')).length;

  return NextResponse.json({ created, skipped, errors, results });
}
