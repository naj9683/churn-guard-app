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

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          metadata: {
            userId: userId,
            mrr: mrr?.toString() || '0',
          },
        });
        customerId = customer.id;

        // Save to database
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
      } catch (stripeError) {
        console.error('Stripe customer creation error:', stripeError);
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
      }
    }

    // Create checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${request.headers.get('origin') || 'https://churn-guard-app.vercel.app'}/dashboard?success=true`,
        cancel_url: `${request.headers.get('origin') || 'https://churn-guard-app.vercel.app'}/pricing?canceled=true`,
        subscription_data: {
          metadata: {
            userId: userId,
            mrr: mrr?.toString() || '0',
          },
        },
      });

      return NextResponse.json({ sessionId: session.id });
    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}