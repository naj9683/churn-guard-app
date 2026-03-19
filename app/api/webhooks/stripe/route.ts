import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { runAutomationEngine } from '@/lib/automation-engine';
import { enrollInSequence } from '@/lib/sequences';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle successful payment
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      console.log('Payment succeeded for customer:', customerId);
      await markInterventionAsSaved(customerId);
    }

    // Handle subscription created
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      console.log('Checkout completed for customer:', customerId);
      await markInterventionAsSaved(customerId);
    }

    // Handle payment failure — record event + fire automation rules
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      const stripeCustomerId = invoice.customer as string;
      const customer = await prisma.customer.findFirst({
        where: { externalId: stripeCustomerId },
      });
      if (customer) {
        // Record the failure as an Event so the automation engine can detect it
        await prisma.event.create({
          data: {
            customerId: customer.id,
            event: 'payment_failed',
            metadata: { invoiceId: invoice.id, amount: invoice.amount_due },
            timestamp: BigInt(Date.now()),
          },
        });
        // Fire single-step automation rules immediately
        await runAutomationEngine({
          triggerTypes: ['payment_failed'],
          customerId: customer.id,
        });
        // Enroll in the multi-step dunning sequence
        await enrollInSequence(customer.userId, customer.id, 'dunning', {
          invoiceId: invoice.id,
          amount: invoice.amount_due ? Math.round(invoice.amount_due / 100) : null,
        });
      }
    }

    // Handle subscription cancelled
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;
      console.log('Subscription cancelled for Stripe customer:', stripeCustomerId);
      await cancelCustomer(stripeCustomerId);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function cancelCustomer(stripeCustomerId: string) {
  try {
    const updated = await prisma.customer.updateMany({
      where: { externalId: stripeCustomerId },
      data: { plan: 'cancelled' },
    });
    if (updated.count > 0) {
      console.log(`✅ Marked ${updated.count} customer(s) as cancelled for Stripe ID: ${stripeCustomerId}`);
    } else {
      console.warn(`⚠️ No customer found with externalId: ${stripeCustomerId}`);
    }
  } catch (error) {
    console.error('Error cancelling customer:', error);
  }
}

async function markInterventionAsSaved(stripeCustomerId: string) {
  try {
    // Find most recent pending intervention and mark as saved
    const interventions = await prisma.interventionOutcome.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      take: 1
    });

    if (interventions.length > 0) {
      const intervention = interventions[0];
      
      await prisma.interventionOutcome.update({
        where: { id: intervention.id },
        data: {
          status: 'saved',
          successful: true,
          mrrSaved: intervention.mrrAtRisk,
          completedAt: new Date(),
          notes: 'Auto-marked as saved: Payment received via Stripe'
        }
      });
      
      console.log(`✅ Intervention ${intervention.id} marked as saved (payment received)`);
    }
  } catch (error) {
    console.error('Error marking intervention as saved:', error);
  }
}
