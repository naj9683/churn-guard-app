import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') || '';

  try {
    // In production, verify Stripe signature here
    const event = JSON.parse(body);

    if (event.type === 'invoice.payment_failed') {
      const customerEmail = event.data.object.customer_email;
      
      // Find customer in database
      const customer = await prisma.customer.findFirst({
        where: { email: customerEmail },
        include: { user: { include: { playbooks: true } } }
      });

      if (customer && customer.user) {
        // Check if Payment Savior playbook is active
        const paymentSaver = customer.user.playbooks.find(
          p => p.trigger === 'PAYMENT_SAVER' && p.isActive
        );

        if (paymentSaver) {
          // Trigger Payment Savior action
          await prisma.playbookEvent.create({
            data: {
              userId: customer.userId,
              playbookType: 'PAYMENT_SAVER',
              status: 'triggered',
              customerId: customer.id,
              message: `Payment failed for ${customerEmail}`,
            }
          });

          // TODO: Send "pause subscription" email
          console.log(`Payment Savior triggered for ${customerEmail}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}