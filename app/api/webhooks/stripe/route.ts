import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { runAutomationEngine } from '@/lib/automation-engine';
import { enrollInSequence } from '@/lib/sequences';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// ChurnGuard's own Stripe account — verifies our platform billing events.
const platformWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    // Verification strategy: try the platform secret first (fast path for our own billing),
    // then try each per-account secret stored for connected integrations.
    // constructEvent throws on any mismatch — we catch per attempt and keep trying.
    // event remains null if nothing verifies; we reject below.
    let event: Stripe.Event | null = null;
    let verifiedUserId: string | null = null;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, platformWebhookSecret);
    } catch {
      // Not signed with our platform secret — try per-account secrets below
    }

    if (!event) {
      const integrations = await prisma.crmIntegration.findMany({
        where: { type: 'stripe', webhookSecret: { not: null } },
        select: { userId: true, webhookSecret: true },
      });
      for (const row of integrations) {
        try {
          event = stripe.webhooks.constructEvent(payload, signature, row.webhookSecret!);
          verifiedUserId = row.userId;
          break; // verified — stop trying
        } catch {
          // Wrong secret for this account — keep trying
        }
      }
    }

    // ── Security boundary ──────────────────────────────────────────────────────
    // No secret verified this request. Reject with 400. There is no code path below
    // this point that accepts an event that did not pass constructEvent.
    if (!event) {
      console.error('Webhook rejected: signature matched no known secret');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle successful payment
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      const stripeCustomerId = invoice.customer as string;
      console.log('Payment succeeded for customer:', stripeCustomerId);

      // Resolve the ChurnGuard userId to scope the intervention lookup.
      // Per-account event: verifiedUserId is the integration owner.
      // Platform event: look up User by their Stripe customer ID.
      let scopedUserId: string | null = verifiedUserId;
      if (!scopedUserId) {
        const payer = await prisma.user.findFirst({
          where: { stripeCustomerId },
          select: { id: true },
        });
        scopedUserId = payer?.id ?? null;
      }
      await markInterventionAsSaved(scopedUserId);
    }

    // Handle checkout completion — THIS is where we provision the subscription in our DB.
    // The checkout session metadata carries the Clerk userId set at session creation time.
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const stripeCustomerId = session.customer as string;
      const clerkUserId = session.metadata?.userId;

      console.log('Checkout completed for customer:', stripeCustomerId, 'clerkUserId:', clerkUserId);

      // Scope intervention to the subscribing user
      let checkoutUserId: string | null = null;
      if (clerkUserId) {
        const checkoutUser = await prisma.user.findFirst({
          where: { clerkId: clerkUserId },
          select: { id: true },
        });
        checkoutUserId = checkoutUser?.id ?? null;
      }
      await markInterventionAsSaved(checkoutUserId);

      if (clerkUserId && session.mode === 'subscription') {
        await provisionSubscription(clerkUserId, stripeCustomerId, session.subscription as string | null);
      }
    }

    // Subscription status changes (upgrades, downgrades, reactivations) — keep DB in sync.
    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription;
      const prev = event.data.previous_attributes as Record<string, unknown> | undefined;
      await syncSubscriptionStatus(sub);
      if (prev) await maybeRecordDowngrade(sub, prev, verifiedUserId);
    }

    // Handle payment failure — record event + fire automation rules
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      const stripeCustomerId = invoice.customer as string;
      const customer = await resolveCustomerByStripeId(stripeCustomerId, verifiedUserId);
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

    // Handle subscription cancelled — mark both the platform subscription and tracked customers
    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      const stripeCustomerId = sub.customer as string;
      console.log('Subscription cancelled for Stripe customer:', stripeCustomerId);

      // Pass the full sub object so cancelPlatformSubscription can record current_period_end,
      // allowing access to continue until the end of the paid period.
      await cancelPlatformSubscription(stripeCustomerId, sub);

      // Also mark any ChurnGuard-tracked customers as cancelled
      await cancelCustomer(stripeCustomerId, verifiedUserId);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

// ── Provision subscription in DB after a successful checkout ─────────────────

async function provisionSubscription(
  clerkUserId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string | null,
) {
  try {
    const user = await prisma.user.findFirst({
      where: { clerkId: clerkUserId },
      select: { id: true },
    });

    if (!user) {
      console.error(`provisionSubscription: no DB user found for clerkId ${clerkUserId}`);
      return;
    }

    // Store the Stripe customer ID so we can look up by it later (cancellations, etc.)
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    });

    // Resolve the price ID from the Stripe subscription object.
    // Throw on failure — empty priceId must not be stored. Stripe will retry the webhook.
    let priceId = '';
    if (stripeSubscriptionId) {
      const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      priceId = stripeSub.items.data[0]?.price?.id ?? '';
    }
    if (!priceId) {
      throw new Error(`provisionSubscription: could not resolve priceId for subscription ${stripeSubscriptionId}`);
    }

    // Upsert — unique constraint on userId prevents duplicates from concurrent webhooks.
    // update sets status+priceId so resubscribes (existing canceled row) activate correctly.
    // On a double-webhook, the second upsert is idempotent: active→active, same priceId.
    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: { userId: user.id, status: 'active', priceId },
      update: { status: 'active', priceId },
    });
    console.log(`✅ Subscription provisioned for user ${user.id} (${stripeCustomerId})`);
  } catch (error) {
    console.error('Error provisioning subscription:', error);
  }
}

// ── Sync subscription status on updates ─────────────────────────────────────

// Stripe statuses that grant dashboard access. past_due = card retry window; subscriber
// is still a paying customer and must not be locked out. unpaid/canceled/incomplete = gated.
const OPEN_STATUSES = new Set(['active', 'trialing', 'past_due', 'paused']);

async function syncSubscriptionStatus(stripeSub: Stripe.Subscription) {
  try {
    const stripeCustomerId = stripeSub.customer as string;
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId },
      select: { id: true },
    });
    if (!user) return;

    const priceId = stripeSub.items.data[0]?.price?.id ?? '';
    const currentPeriodEnd = new Date(stripeSub.current_period_end * 1000);

    await prisma.subscription.updateMany({
      where: { userId: user.id },
      data: { status: stripeSub.status, priceId, currentPeriodEnd },
    });

    console.log(`✅ Subscription status synced for user ${user.id} → ${stripeSub.status}`);
  } catch (error) {
    console.error('Error syncing subscription status:', error);
  }
}

// ── Cancel the platform Subscription row ────────────────────────────────────

async function cancelPlatformSubscription(stripeCustomerId: string, stripeSub: Stripe.Subscription) {
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId },
      select: { id: true },
    });
    if (!user) {
      console.warn(`cancelPlatformSubscription: no user found for Stripe customer ${stripeCustomerId}`);
      return;
    }
    // Store current_period_end so the status route can keep access open until
    // the period the subscriber paid through, rather than cutting off immediately.
    const currentPeriodEnd = new Date(stripeSub.current_period_end * 1000);
    const updated = await prisma.subscription.updateMany({
      where: { userId: user.id, status: { not: 'canceled' } },
      data: { status: 'canceled', currentPeriodEnd },
    });
    console.log(`✅ Cancelled ${updated.count} platform subscription(s) for user ${user.id} (access until ${currentPeriodEnd.toISOString()})`);
  } catch (error) {
    console.error('Error cancelling platform subscription:', error);
  }
}

// ── Cancel ChurnGuard-tracked customers ─────────────────────────────────────

async function cancelCustomer(stripeCustomerId: string, verifiedUserId: string | null = null) {
  try {
    const customer = await resolveCustomerByStripeId(stripeCustomerId, verifiedUserId);
    if (customer) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { plan: 'cancelled' },
      });
      console.log(`✅ Marked customer ${customer.id} as cancelled for Stripe ID: ${stripeCustomerId}`);
    } else {
      console.warn(`⚠️ No customer found for Stripe ID: ${stripeCustomerId}`);
    }
  } catch (error) {
    console.error('Error cancelling customer:', error);
  }
}

// ── Mark intervention as saved on payment ───────────────────────────────────

async function markInterventionAsSaved(userId: string | null) {
  if (!userId) return;
  try {
    // Find the most recent pending intervention scoped to this user
    const interventions = await prisma.interventionOutcome.findMany({
      where: { status: 'pending', userId },
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

// ── Detect and record subscription downgrades ─────────────────────────────────
// Fires when customer.subscription.updated carries a quantity or unit_amount reduction.
// Writes a downgrade_detected Event row so the risk formula can score on it.

async function maybeRecordDowngrade(
  sub: Stripe.Subscription,
  prev: Record<string, unknown>,
  verifiedUserId: string | null = null,
) {
  try {
    const prevItems = (prev.items as any)?.data;
    const prevQty: number | undefined = prevItems?.[0]?.quantity ?? (prev.quantity as number | undefined);
    const prevAmount: number | undefined = (prev.plan as any)?.amount ?? prevItems?.[0]?.plan?.amount;

    const newQty = sub.items.data[0]?.quantity ?? 1;
    const newAmount = sub.items.data[0]?.price?.unit_amount ?? null;

    const isQuantityReduction = typeof prevQty === 'number' && newQty < prevQty;
    const isAmountReduction =
      typeof prevAmount === 'number' && typeof newAmount === 'number' && newAmount < prevAmount;

    if (!isQuantityReduction && !isAmountReduction) return;

    const stripeCustomerId = sub.customer as string;
    const customer = await resolveCustomerByStripeId(stripeCustomerId, verifiedUserId);
    if (!customer) return;

    await prisma.event.create({
      data: {
        customerId: customer.id,
        event: 'downgrade_detected',
        metadata: {
          ...(isQuantityReduction && { previousQuantity: prevQty, newQuantity: newQty }),
          ...(isAmountReduction && { previousAmount: prevAmount, newAmount }),
        },
        timestamp: BigInt(Date.now()),
      },
    });

    console.log(`✅ downgrade_detected recorded for customer ${customer.id}`);
  } catch (error) {
    console.error('Error recording downgrade:', error);
  }
}

// ── Resolve a Stripe customer ID to a ChurnGuard Customer row ─────────────────
// Imported customers have CRM externalIds (hubspot_*, salesforce_*), not Stripe IDs.
// Three-step lookup: direct externalId → stored stripeCustomerId → email fallback via Stripe API.
// On email match, stores stripeCustomerId for O(1) future lookups.

async function resolveCustomerByStripeId(
  stripeCustomerId: string,
  verifiedUserId: string | null,
) {
  // Step 1: direct match (customers originally imported from Stripe)
  const byExternalId = await prisma.customer.findFirst({
    where: { externalId: stripeCustomerId },
  });
  if (byExternalId) return byExternalId;

  // Step 2: cached stripeCustomerId field (populated below on first email match)
  const byCachedId = await prisma.customer.findFirst({
    where: { stripeCustomerId },
  });
  if (byCachedId) return byCachedId;

  // Step 3: fetch email from user's Stripe account, match by email + userId
  if (!verifiedUserId) return null;

  const integration = await prisma.crmIntegration.findUnique({
    where: { userId_type: { userId: verifiedUserId, type: 'stripe' } },
    select: { accessToken: true },
  });
  if (!integration?.accessToken) return null;

  try {
    const userStripe = new Stripe(integration.accessToken, { apiVersion: '2023-10-16' });
    const stripeCust = await userStripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;
    if (stripeCust.deleted || !stripeCust.email) return null;

    const customer = await prisma.customer.findFirst({
      where: { email: stripeCust.email, userId: verifiedUserId },
    });
    if (customer) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { stripeCustomerId },
      }).catch(() => {});
    }
    return customer;
  } catch {
    return null;
  }
}
