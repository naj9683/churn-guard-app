/**
 * scripts/backfill-stripe-webhook-secret.mjs
 *
 * For each Stripe CrmIntegration row where webhookSecret is null:
 *   1. List the webhook endpoints on that account via Stripe API.
 *   2. Find the one pointing to https://churnguardapp.com/api/webhooks/stripe.
 *   3. Delete it — Stripe does not return the secret for existing endpoints;
 *      deletion + recreation is the only way to obtain a new secret.
 *   4. Create a new endpoint and capture the secret from the response.
 *   5. Store it in CrmIntegration.webhookSecret.
 *
 * Stripe API note: `secret` is only returned in the CREATE response (POST).
 * GET /v1/webhook_endpoints/:id does not include `secret`. There is no roll-secret
 * endpoint in the standard API. Delete + recreate is the correct path.
 *
 * Usage:
 *   node scripts/backfill-stripe-webhook-secret.mjs --dry-run   # preview, no writes
 *   node scripts/backfill-stripe-webhook-secret.mjs              # execute
 */

import { PrismaClient } from '@prisma/client';

const DRY_RUN = process.argv.includes('--dry-run');
const WEBHOOK_URL = 'https://churnguardapp.com/api/webhooks/stripe';
const WEBHOOK_EVENTS = [
  'customer.subscription.deleted',
  'customer.subscription.updated',
  'invoice.payment_failed',
  'invoice.payment_succeeded',
  'checkout.session.completed',
];

const prisma = new PrismaClient();

async function stripeReq(method, path, apiKey, body) {
  const opts = {
    method,
    headers: { Authorization: `Bearer ${apiKey}` },
  };
  if (body) {
    opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    opts.body = body.toString();
  }
  const res = await fetch(`https://api.stripe.com${path}`, opts);
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → HTTP ${res.status}: ${text}`);
  return JSON.parse(text);
}

async function main() {
  if (DRY_RUN) console.log('[DRY RUN] No writes will be made.\n');

  const integrations = await prisma.crmIntegration.findMany({
    where: { type: 'stripe', webhookSecret: null, enabled: true },
    select: { userId: true, accessToken: true },
  });

  console.log(`Found ${integrations.length} stripe integration(s) with webhookSecret = null.\n`);

  let fixed = 0;
  let failed = 0;

  for (const row of integrations) {
    const { userId, accessToken: apiKey } = row;
    const keyHint = apiKey ? apiKey.slice(0, 8) + '…' : '(none)';
    console.log(`── userId=${userId}  key=${keyHint}`);

    if (!apiKey) {
      console.log('   No accessToken stored — skipping.\n');
      failed++;
      continue;
    }

    try {
      // List all webhook endpoints on this account
      const list = await stripeReq('GET', '/v1/webhook_endpoints?limit=100', apiKey);
      const existing = list.data?.find(e => e.url === WEBHOOK_URL);

      if (existing) {
        console.log(`   Existing endpoint: ${existing.id}  status=${existing.status}`);
        if (!DRY_RUN) {
          await stripeReq('DELETE', `/v1/webhook_endpoints/${existing.id}`, apiKey);
          console.log(`   Deleted ${existing.id}`);
        } else {
          console.log(`   [DRY RUN] Would delete ${existing.id}`);
        }
      } else {
        console.log(`   No existing endpoint at ${WEBHOOK_URL} — will create fresh.`);
      }

      if (DRY_RUN) {
        console.log(`   [DRY RUN] Would create new endpoint and store secret.\n`);
        continue;
      }

      // Create fresh endpoint — secret is in the CREATE response only
      const reqBody = new URLSearchParams({ url: WEBHOOK_URL });
      WEBHOOK_EVENTS.forEach((e, i) => reqBody.append(`enabled_events[${i}]`, e));
      const created = await stripeReq('POST', '/v1/webhook_endpoints', apiKey, reqBody);

      if (!created.secret) {
        console.log(`   ⚠️  Stripe did not include 'secret' in response. Endpoint id=${created.id}\n`);
        failed++;
        continue;
      }

      console.log(`   Created endpoint: ${created.id}  secret=${created.secret.slice(0, 12)}…`);

      await prisma.crmIntegration.update({
        where: { userId_type: { userId, type: 'stripe' } },
        data: { webhookSecret: created.secret },
      });
      console.log(`   ✅ webhookSecret stored.\n`);
      fixed++;

    } catch (err) {
      console.error(`   ❌ Error: ${err.message}\n`);
      failed++;
    }
  }

  console.log('─'.repeat(60));
  console.log(`Fixed: ${fixed}  |  Failed: ${failed}  |  Total: ${integrations.length}`);
  if (DRY_RUN) console.log('\n[DRY RUN] No writes were made.');
}

main()
  .catch(err => { console.error('Fatal:', err.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
