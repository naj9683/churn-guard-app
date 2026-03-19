import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!user.stripeCustomerId) {
      return NextResponse.json({ subscription: null, invoices: [], hasStripeCustomer: false });
    }

    // Fetch subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method', 'data.items.data.price.product'],
    });

    const sub = subscriptions.data[0] || null;

    let subscription = null;
    if (sub) {
      const item = sub.items.data[0];
      const price = item?.price;
      const product = price?.product as Stripe.Product | null;
      const pm = sub.default_payment_method as Stripe.PaymentMethod | null;

      subscription = {
        id: sub.id,
        status: sub.status,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
        currentPeriodStart: new Date(sub.current_period_start * 1000).toISOString(),
        planName: product?.name || 'Unknown Plan',
        priceId: price?.id,
        amount: price?.unit_amount || 0,
        interval: price?.recurring?.interval || 'month',
        paymentMethod: pm?.card ? {
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year,
        } : null,
      };
    }

    // Fetch invoices from Stripe
    const invoiceList = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 10,
    });

    const invoices = invoiceList.data.map(inv => ({
      id: inv.id,
      date: new Date(inv.created * 1000).toISOString(),
      amount: inv.amount_paid,
      status: inv.status,
      pdfUrl: inv.invoice_pdf,
      hostedUrl: inv.hosted_invoice_url,
    }));

    return NextResponse.json({ subscription, invoices, hasStripeCustomer: true });
  } catch (error) {
    console.error('Billing GET error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
