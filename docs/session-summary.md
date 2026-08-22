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

---

## Session 2026-07-27/28 — What Was Done

### Landing page copy rewrite
Replaced all marketing claims with audited-honest versions. Removed unconditional SMS claims, removed fabricated statistics, removed "AI predicts churn" framing. Copy now reflects what the product actually does today. Deployed.

### Batch integrity fixes (5 findings)
Applied to `app/api/webhooks/stripe/route.ts` and `prisma/schema.prisma`. See `docs/batch-fixes.md`. Deployed as commit `76ec1e7`.

### Widget onboarding — new first-run page
New users now land at `/onboarding/widget` instead of `/onboarding`. The page shows the no-code snippet (apiKey only, customerId optional), auto-polls for detection, and has a manual Verify button. Skip sets `cg_widget_skipped` in localStorage; the page bounces returning skipped users. `widgetInstalled Boolean @default(false)` added to schema; `/api/track` flips it on first call. Deployed as commit `241f040`.

### Audits written (docs/)
- `docs/product-reality.md` — what ChurnGuard actually does today
- `docs/twilio-status.md` — Twilio credentials ARE in Vercel production; blocker is `customer.phone = null` for all 348 customers
- `docs/slack-status.md` — 4/5 fire paths work; monthly digest broken (cron sends GET, route exports POST)
- `docs/widget-pages-audit.md` — full map of widget-related pages; found that `/api/track` does not write `lastLoginAt`, so widget-only customers never get behavioral risk scores
- `docs/widget-fix-scope.md` — scope and decision support for making the widget actually feed the score

---

## Next Build — Path A (widget actually feeds the score)

**Decision made:** rolling 30-day window (not counter-only), popup threshold 50.

Rationale: the counter-only approach has a calendar-month boundary artifact that fires the popup on healthy customers with 3-week visit cadences. The rolling window eliminates this cleanly. The data already exists — every `page_view` is in the `Event` table with a BigInt timestamp. No new storage needed. Full analysis in `docs/widget-fix-scope.md`.

**Five files to change** (scored small in `docs/widget-fix-scope.md`):

| File | Change |
|---|---|
| `app/api/track/route.ts` | On `page_view`: write `lastLoginAt = now`, increment daily session counter, reset monthly |
| `lib/risk-formula.ts` | Replace `loginCountThisMonth` with distinct-day count from `page_view` events in last 30 days |
| `app/api/cron/risk-analysis/route.ts` | Fetch 30-day events per customer instead of last 10 |
| `app/api/widget/messages/route.ts` | Change `>= 70` to `>= 50` |
| `prisma/schema.prisma` | Add `@@index([customerId, timestamp])` to Event model + db push |

**Build protocol — scoring-engine change, treat carefully:**
1. Show full diff before applying — one reviewed diff, no piecemeal edits
2. Deploy on explicit confirm only
3. After deploy: **test live** — paste widget on a scratch page, wait for behavioral score to appear in the dashboard (up to 6 hours for cron, or trigger manually via `/api/risk/analyze/batch`), confirm in-app popup fires at the new threshold
4. Verify existing named/Segment customers are unaffected (their scores should not regress)

**After the build — two follow-on tasks:**
1. Reconcile `/onboarding/widget` and `/widget-install` — these two pages currently give contradictory instructions on whether `customerId` is required. After this build, the honest story is: omit `customerId` for anonymous engagement tracking + in-app popups; add it for named customers and email. Both pages need to say that.
2. Landing page copy — currently promises "no code" in a way that is only fully true after this build ships. After the build, that claim is honest. Update copy accordingly.

---

## Still Deferred

### externalId dunning matching — bulk backfill for imported customers
The resolver covers new events going forward via the email fallback. The 348 existing customers imported from HubSpot/Salesforce carry CRM externalIds (`hubspot_*`, `salesforce_*`) and have no `stripeCustomerId` yet. Their field populates lazily on the first matching webhook event. Until then, payment-failure and cancellation events for those customers won't match in Steps 1 or 2 and Step 3 only runs if a Stripe integration is connected for that user. A backfill script (look up each customer by email in their Stripe account, write `stripeCustomerId`) would eliminate the lazy-populate window. Not written — low urgency at current scale, higher urgency once multiple merchants are connected.

### Plaintext credential storage
`CrmIntegration.accessToken` (live Stripe secret keys, `sk_live_…`) and `webhookSecret` (`whsec_…`) are stored as plaintext. An encryption helper exists at `lib/encrypt.ts` (AES-256-GCM). The fix touches every integration read/write path and warrants its own PR and test pass. Full plan in `docs/security-todo.md`. Current blast radius: 1 connected account.
