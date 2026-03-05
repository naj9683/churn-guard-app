import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

function calculateBill(mrr: number) {
  if (mrr <= 50000) return 29;
  const excess = mrr - 50000;
  const units = Math.ceil(excess / 1000);
  return 29 + (units * 0.50);
}

// POST /api/stripe/usage - Report MRR usage to Stripe
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mrr } = await request.json();

    if (!mrr || mrr < 0) {
      return NextResponse.json({ error: 'Invalid MRR value' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    const units = Math.ceil(mrr / 1000);

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 404 });
    }

    const subscription = subscriptions.data[0];
    const usageItem = subscription.items.data.find(
      item => item.price.id === process.env.STRIPE_PRICE_ID
    );

    if (!usageItem) {
      return NextResponse.json({ error: 'Usage pricing not found' }, { status: 404 });
    }

    await stripe.subscriptionItems.createUsageRecord(
      usageItem.id,
      {
        quantity: units,
        timestamp: Math.floor(Date.now() / 1000),
        action: 'set',
      }
    );

    await stripe.customers.update(user.stripeCustomerId, {
      metadata: {
        mrr: mrr.toString(),
        lastUpdated: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      mrr: mrr,
      units: units,
      estimatedBill: calculateBill(mrr),
    });
  } catch (error) {
    console.error('Usage report error:', error);
    return NextResponse.json({ 
      error: 'Failed to report usage',
      details: String(error)
    }, { status: 500 });
  }
}

// GET - Get current usage/billing info
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const customer = await stripe.customers.retrieve(user.stripeCustomerId);
    
    if ('deleted' in customer && customer.deleted) {
      return NextResponse.json({ error: 'Customer deleted' }, { status: 404 });
    }
    
    const stripeCustomer = customer as Stripe.Customer;
    const mrr = parseInt(stripeCustomer.metadata?.mrr || '0');

    return NextResponse.json({
      mrr: mrr,
      estimatedBill: calculateBill(mrr),
      units: Math.ceil(mrr / 1000),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get usage' }, { status: 500 });
  }
}
