import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mrr } = await request.json();

    // Try to find user, create if not exists
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Create minimal user
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `user-${userId}@example.com`,
        },
      });
    }

    let customerId = user.stripeCustomerId;

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: userId },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ 
        price: process.env.STRIPE_PRICE_ID, 
        quantity: 1 
      }],
      mode: 'subscription',
      success_url: `https://churn-guard-app.vercel.app/dashboard?success=true`,
      cancel_url: `https://churn-guard-app.vercel.app/pricing?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ 
      error: 'Checkout failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}