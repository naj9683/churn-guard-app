/**
 * GET /api/admin/backfill-webhook-events?dry_run=1
 * Authorization: Bearer <CRON_SECRET>
 *
 * One-time migration: ensures every connected Stripe account's ChurnGuard
 * webhook endpoint has the full current event list (including charge.refunded,
 * subscription_paused/resumed via subscription.updated).
 *
 * Per-account outcomes:
 *   updated        — endpoint found, enabled_events patched
 *   created        — endpoint was missing (registration failed at connect time),
 *                    new endpoint created and signing secret stored in DB
 *   already_current — endpoint already has all required events; no change
 *   not_found      — no enabled endpoint at our URL AND creation failed
 *   error          — Stripe API call failed (key invalid / rate limited)
 *
 * Add dry_run=1 to see what would change without touching Stripe.
 * Safe to run multiple times — already_current accounts are skipped.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const WEBHOOK_URL = 'https://churnguardapp.com/api/webhooks/stripe';

// Must stay in sync with the webhookEvents array in
// app/api/integrations/stripe/route.ts.
const REQUIRED_EVENTS = [
  'customer.subscription.deleted',
  'customer.subscription.updated',
  'invoice.payment_failed',
  'invoice.payment_succeeded',
  'checkout.session.completed',
  'charge.refunded',
];

type StripeEndpoint = {
  id: string;
  url: string;
  status: string;
  enabled_events: string[];
  secret?: string; // only present on create
};

type StripeListResponse = {
  data: StripeEndpoint[];
  has_more: boolean;
};

/** Fetches all webhook endpoints for an account, following pagination. */
async function listAllEndpoints(apiKey: string): Promise<StripeEndpoint[]> {
  const all: StripeEndpoint[] = [];
  let startingAfter: string | null = null;

  do {
    const url = new URL('https://api.stripe.com/v1/webhook_endpoints');
    url.searchParams.set('limit', '100');
    if (startingAfter) url.searchParams.set('starting_after', startingAfter);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) throw new Error(`Stripe list failed: ${res.status}`);

    const body: StripeListResponse = await res.json();
    all.push(...body.data);
    startingAfter = body.has_more ? body.data[body.data.length - 1].id : null;
  } while (startingAfter);

  return all;
}

type AccountResult = {
  userId: string;
  status: 'updated' | 'created' | 'already_current' | 'not_found' | 'error';
  endpointId?: string;
  message?: string;
};

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dryRun = req.nextUrl.searchParams.get('dry_run') === '1';

  const integrations = await prisma.crmIntegration.findMany({
    where: { type: 'stripe', enabled: true, accessToken: { not: null } },
    select: { id: true, userId: true, accessToken: true },
  });

  const results: AccountResult[] = [];

  for (const integration of integrations) {
    const apiKey = integration.accessToken!;

    try {
      const endpoints = await listAllEndpoints(apiKey);

      // Find the active ChurnGuard endpoint for this account.
      // Disabled endpoints are ignored — a re-connect will recreate them.
      const endpoint = endpoints.find(
        e => e.url === WEBHOOK_URL && e.status === 'enabled'
      );

      if (!endpoint) {
        // Webhook was never registered (registration failed at connect time).
        // Create it now and store the signing secret.
        if (dryRun) {
          results.push({ userId: integration.userId, status: 'not_found', message: 'dry_run — would create' });
          continue;
        }

        const body = new URLSearchParams({ url: WEBHOOK_URL });
        REQUIRED_EVENTS.forEach((e, i) => body.append(`enabled_events[${i}]`, e));

        const createRes = await fetch('https://api.stripe.com/v1/webhook_endpoints', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        });

        if (!createRes.ok) {
          const err = await createRes.json().catch(() => ({}));
          results.push({
            userId: integration.userId,
            status: 'not_found',
            message: `create failed: ${JSON.stringify(err)}`,
          });
          continue;
        }

        const created: StripeEndpoint = await createRes.json();
        if (created.secret) {
          await prisma.crmIntegration.update({
            where: { id: integration.id },
            data: { webhookSecret: created.secret },
          });
        }
        results.push({ userId: integration.userId, status: 'created', endpointId: created.id });
        continue;
      }

      // Wildcard registration covers all events — nothing to add.
      if (endpoint.enabled_events.includes('*')) {
        results.push({ userId: integration.userId, status: 'already_current', endpointId: endpoint.id });
        continue;
      }

      const missingEvents = REQUIRED_EVENTS.filter(e => !endpoint.enabled_events.includes(e));
      if (missingEvents.length === 0) {
        results.push({ userId: integration.userId, status: 'already_current', endpointId: endpoint.id });
        continue;
      }

      if (dryRun) {
        results.push({
          userId: integration.userId,
          status: 'updated',
          endpointId: endpoint.id,
          message: `dry_run — would add: ${missingEvents.join(', ')}`,
        });
        continue;
      }

      // Patch the endpoint: send the full merged event list.
      // Stripe replaces the entire enabled_events array on update.
      const mergedEvents = [...new Set([...endpoint.enabled_events, ...REQUIRED_EVENTS])];
      const body = new URLSearchParams();
      mergedEvents.forEach((e, i) => body.append(`enabled_events[${i}]`, e));

      const updateRes = await fetch(
        `https://api.stripe.com/v1/webhook_endpoints/${endpoint.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        }
      );

      if (!updateRes.ok) {
        const err = await updateRes.json().catch(() => ({}));
        results.push({
          userId: integration.userId,
          status: 'error',
          endpointId: endpoint.id,
          message: JSON.stringify(err),
        });
        continue;
      }

      results.push({ userId: integration.userId, status: 'updated', endpointId: endpoint.id });
    } catch (err) {
      results.push({ userId: integration.userId, status: 'error', message: String(err) });
    }
  }

  return NextResponse.json({
    dry_run: dryRun,
    summary: {
      total: integrations.length,
      updated: results.filter(r => r.status === 'updated').length,
      created: results.filter(r => r.status === 'created').length,
      already_current: results.filter(r => r.status === 'already_current').length,
      not_found: results.filter(r => r.status === 'not_found').length,
      errored: results.filter(r => r.status === 'error').length,
    },
    results,
  });
}
