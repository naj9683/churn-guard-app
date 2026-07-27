# Session Summary — 2026-07-25

## What Was Fixed

### Scoring engine
Risk score formula was producing uniform scores because the event-weight lookup was using the wrong key. Fixed weighting so `payment_failed`, `downgrade_detected`, and inactivity signals feed the score correctly.

### Payment lockout cluster
Several users were being locked out of the dashboard immediately after paying. Root cause: the `cg_paywall` cookie had a one-hour TTL (`maxAge: 3600`) and the old `blocked` value persisted through the payment window. Combined fix: cookie TTL reduced to 60 seconds, and `provisionSubscription` now upserts (not blindly creates) so a resubscribe after cancel reactivates the existing row rather than throwing a unique-violation that the outer catch swallowed silently.

### Webhook signature verification
The verification loop was already multi-secret-capable, but `verifiedUserId` wasn't being captured from whichever per-account secret matched. Without it, `resolveCustomerByStripeId` could not reach Step 3 (Stripe API email fallback) and `markInterventionAsSaved` had no userId to scope the query. Fixed: `verifiedUserId` is now set in the loop and threaded through to every downstream helper.

### Five data-integrity findings (batch, `docs/batch-fixes.md`)

Applied to `app/api/webhooks/stripe/route.ts` and `prisma/schema.prisma`:

1. **externalId dunning matching** — Added `resolveCustomerByStripeId` helper: 3-step lookup (externalId → cached `stripeCustomerId` field → Stripe API email fallback with lazy store). `stripeCustomerId String?` + index added to Customer. All dunning and cancellation handlers use the resolver.

2. **Duplicate Subscription rows** — `@@unique([userId])` added to Subscription. `provisionSubscription` converted from `findFirst + create` to `upsert({ update: { status, priceId } })`. The `update` must not be empty — an empty object leaves a canceled row unchanged on resubscribe. Migration applied via `npx prisma db push`.

3. **`markInterventionAsSaved` global scope** — Was `where: { status: 'pending' }` with no user scoping — would mark a random pending intervention across all users. Changed to `where: { status: 'pending', userId }`. Both `invoice.payment_succeeded` and `checkout.session.completed` now resolve and pass a scoped userId.

4. **Stale paywall cookie** — `maxAge: 3600 → 60`. After a payment, the gate lifts within one minute rather than up to one hour.

5. **Silent priceId swallow** — `stripe.subscriptions.retrieve` was wrapped in try/catch that logged and continued, storing `priceId = ''`. Removed the catch; added explicit guard: `if (!priceId) throw`. The upsert is never reached with a blank priceId; Stripe retries on 5xx.

### Missing webhook event registrations
The production endpoint (`churnguard-webhook` in `acct_1QSTSkDl3EmQuwiI`) was registered for only 2 of 5 needed events: `invoice.payment_failed` and `customer.subscription.deleted`. `checkout.session.completed`, `invoice.payment_succeeded`, and `customer.subscription.updated` were absent — meaning no real checkout had ever provisioned a Subscription row. All three were added in the Stripe dashboard.

---

## Live Checkout Test — PASSED

Real live-mode checkout for najwasaadi1@gmail.com (Seed plan), 2026-07-25 13:49:47 UTC:

| Check | Result |
|---|---|
| Subscription row | 1 row · `status: active` · `priceId: price_1T8o79Dl3EmQuwiIrU3zEyUk` · `currentPeriodEnd: 2026-08-25` |
| User record | `stripeCustomerId: cus_UwzxE4JqRxY9ed` stored |
| Webhook logs | 3 events delivered at 14:49:47 UTC+1, all HTTP 200, no errors (`checkout.session.completed` → `customer.subscription.updated` → `invoice.payment_succeeded`) |
| Paywall | `hasPaidSubscription: true` · `cg_paywall=active` · gate lifted |

---

## Still Deferred

### externalId dunning matching — bulk backfill for imported customers
The resolver covers new events going forward via the email fallback. The 348 existing customers imported from HubSpot/Salesforce carry CRM externalIds (`hubspot_*`, `salesforce_*`) and have no `stripeCustomerId` yet. Their field populates lazily on the first matching webhook event. Until then, payment-failure and cancellation events for those customers won't match in Steps 1 or 2 and Step 3 only runs if a Stripe integration is connected for that user. A backfill script (look up each customer by email in their Stripe account, write `stripeCustomerId`) would eliminate the lazy-populate window. Not written — low urgency at current scale, higher urgency once multiple merchants are connected.

### Plaintext credential storage
`CrmIntegration.accessToken` (live Stripe secret keys, `sk_live_…`) and `webhookSecret` (`whsec_…`) are stored as plaintext. An encryption helper exists at `lib/encrypt.ts` (AES-256-GCM). The fix touches every integration read/write path and warrants its own PR and test pass. Full plan in `docs/security-todo.md`. Current blast radius: 1 connected account.
