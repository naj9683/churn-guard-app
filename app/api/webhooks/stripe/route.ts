import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {} as any);
const prisma = new PrismaClient();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: any;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        await prisma.user.upsert({
          where: { email: session.customer_email },
          update: {
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            status: 'ACTIVE',
          },
          create: {
            email: session.customer_email,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            status: 'ACTIVE',
          },
        });

        await prisma.event.create({
          data: {
            type: 'USER_SIGNUP',
            userId: (await prisma.user.findUnique({ where: { email: session.customer_email } }))!.id,
            metadata: JSON.stringify(session),
          },
        });

        console.log('✅ User created:', session.customer_email);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customer = await stripe.customers.retrieve(invoice.customer);
        
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: invoice.customer },
        });

        if (user) {
          await prisma.event.create({
            data: {
              type: 'PAYMENT_FAILED',
              userId: user.id,
              metadata: JSON.stringify({ invoiceId: invoice.id, amount: invoice.amount_due }),
            },
          });

          await prisma.playbookRun.create({
            data: {
              userId: user.id,
              playbookType: 'PAYMENT_SAVER',
              status: 'PENDING',
            },
          });

          console.log('⚠️ Payment failed');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: subscription.customer },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { status: 'CHURNED' },
          });

          await prisma.event.create({
            data: {
              type: 'SUBSCRIPTION_CANCELED',
              userId: user.id,
              metadata: JSON.stringify(subscription),
            },
          });

          console.log('❌ Subscription cancelled');
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}