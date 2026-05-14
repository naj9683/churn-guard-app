import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found.' }, { status: 400 });
    }

    const subs = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    if (!subs.data.length) {
      return NextResponse.json({ error: 'No active subscription found.' }, { status: 400 });
    }

    const sub = subs.data[0];
    const pauseUntil = new Date();
    pauseUntil.setDate(pauseUntil.getDate() + 30);

    await stripe.subscriptions.update(sub.id, {
      pause_collection: { behavior: 'void' },
      metadata: { pausedUntil: pauseUntil.toISOString() },
    });

    return NextResponse.json({ success: true, pausedUntil: pauseUntil.toISOString() });
  } catch (error) {
    console.error('Pause subscription error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
