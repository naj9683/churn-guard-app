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

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mrr } = await request.json();
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    await stripe.customers.update(user.stripeCustomerId, {
      metadata: { mrr: mrr.toString() },
    });

    return NextResponse.json({
      success: true,
      mrr: mrr,
      estimatedBill: calculateBill(mrr),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const mrr = 0; // Simplified for now

    return NextResponse.json({
      mrr: mrr,
      estimatedBill: calculateBill(mrr),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}