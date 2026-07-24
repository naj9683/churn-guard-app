# ChurnGuard Live Production Audit
**Date:** 2026-07-24  
**Scope:** Read-only. No changes deployed during this audit.  
**Focus:** Anything that affects a real paying subscriber today.

---

## REAL SUBSCRIBER IMPACT — Ranked by Severity

---

### 1. CRITICAL — `past_due` maps to `canceled`: subscriber locked out on first card decline

**File:** `app/api/webhooks/stripe/route.ts`, `syncSubscriptionStatus` function (lines 164–185)

```typescript
const status = stripeSub.status === 'active' ? 'active' : 'canceled';
```

Every non-`active` Stripe subscription status (`past_due`, `unpaid`, `trialing`, `incomplete`, `incomplete_expired`, `paused`) is written to the DB as `'canceled'`. The `/api/subscription/status` route then finds zero active subscriptions, evaluates `hasPaidSubscription = false`, and sets the `cg_paywall` cookie to `blocked`. Middleware reads `blocked` and redirects to `/upgrade`.

**Trigger:** `customer.subscription.updated` — this event was registered on the Stripe webhook endpoint during the previous session. Before that, the bug was latent (event wasn't registered). It is now **live**.

**Exact user impact:** A subscriber's first card decline causes Stripe to:
1. Mark the subscription `past_due`
2. Fire `customer.subscription.updated` with status `past_due`
3. ChurnGuard webhook writes `status = 'canceled'` to DB
4. On next page load or within ≤1 hour (cookie TTL), subscriber is redirected to `/upgrade` — the same page a free trial shows when it expires

Stripe's default retry schedule is 3–7 days. The subscriber is locked out for that entire window, even if their card is retried successfully.

**Is it happening now?** Yes. The event is registered and the mapping is wrong.

**Fix risk:** Isolated. Change `syncSubscriptionStatus` to map each Stripe status explicitly:
```typescript
const statusMap: Record<string, string> = {
  active: 'active',
  trialing: 'active',
  past_due: 'past_due',
  unpaid: 'unpaid',
  canceled: 'canceled',
  incomplete: 'incomplete',
  incomplete_expired: 'canceled',
  paused: 'paused',
};
const status = statusMap[stripeSub.status] ?? 'canceled';
```
Then update the Subscription schema, `hasPaidSubscription` check in `status/route.ts`, and trial logic to treat `past_due` as still-active (with a warning banner). Touches 3 files but each change is contained.

---

### 2. HIGH — Cancellation cuts access immediately; no billing-period end

**Files:** `lib/trial.ts`, `app/api/subscription/status/route.ts`

When a subscriber cancels (either via ChurnGuard's billing portal flow or directly in Stripe), `customer.subscription.updated` fires with `status: canceled` (or `customer.subscription.deleted`). Both webhook handlers write `status = 'canceled'` to the DB. `hasPaidSubscription` becomes false immediately. The subscriber is locked out of their dashboard the moment they cancel — even if they paid for the current month and have 20 days left.

**Exact user impact:** A subscriber who cancels on July 5th of a month they paid through July 31st loses access on July 5th. No grace, no period-end access. They're redirected to `/upgrade` — the same page shown to unpaid trial expiries.

**Is it happening now?** Yes. No period-end logic exists anywhere in the codebase.

**Fix risk:** Medium. Requires storing `current_period_end` from the Stripe subscription object when writing to DB, then using it in `hasPaidSubscription` logic. Adds a nullable field to the Subscription schema (migration required) and changes `status/route.ts`. Isolated to subscription access logic.

---

### 3. HIGH — Platform dunning (ChurnGuard's own subscriber payment failure) never fires

**Files:** `app/api/webhooks/stripe/route.ts` (`invoice.payment_failed` handler), `lib/sequences.ts`

The `invoice.payment_failed` handler looks up `customer.externalId = stripeCustomerId` in the Customer table. But ChurnGuard's own paying subscribers — the users of ChurnGuard — are in the `User` table (not `Customer`). The `User` model has a `stripeCustomerId` field, but the dunning handler queries `Customer.externalId`, which is a completely different table for end-customers of ChurnGuard's users.

**Exact user impact:** When a ChurnGuard subscriber's card declines, they receive no dunning emails and no recovery sequence. The only effect is issue #1 (lockout via `past_due → canceled`). No "your payment failed, please update your card" email is ever sent to them.

**Is it happening now?** Yes. Zero dunning enrollments exist in the DB for the User table.

**Fix risk:** Medium. Requires a parallel code path in the `invoice.payment_failed` handler that checks if `stripeCustomerId` matches a `User.stripeCustomerId` and if so, sends a platform-level recovery email directly (not via the Customer dunning sequence). Isolated to the webhook handler, but requires a new email template or adapting the existing one.

---

### 4. MODERATE — User-connected Stripe webhook events fail signature verification

**Files:** `app/api/integrations/stripe/route.ts`, `app/api/webhooks/stripe/route.ts`

When a ChurnGuard subscriber connects their own Stripe account (via `/api/integrations/stripe`), ChurnGuard auto-registers a webhook on that user's Stripe account pointing to `https://churnguardapp.com/api/webhooks/stripe`. Stripe generates a unique webhook signing secret for that endpoint.

The webhook handler verifies all incoming events with `STRIPE_WEBHOOK_SECRET` — ChurnGuard's **platform** secret. Events from user-connected Stripe accounts carry their own signing secret, which differs per user. The signature check fails with 400 for every event from every user-connected Stripe account.

**Exact user impact:**
- `invoice.payment_failed` on a user's customer → no dunning enrollment, no email
- `customer.subscription.updated` on a user's customer → risk score not updated
- `checkout.session.completed` on a user's account → not processed

The core ChurnGuard value proposition (churn detection from user Stripe data) is non-functional for Stripe-connected accounts via webhooks.

**Is it happening now?** Yes. The `CrmIntegration` table has Stripe connections. All webhook events from those accounts are rejected.

**Fix risk:** High. Requires either: (a) storing the per-user webhook secret in the `CrmIntegration` table and routing by `account` header in the webhook handler, or (b) switching to Stripe Connect with account-level event subscriptions. Either approach touches the integration registration flow, the webhook handler routing, and adds a new secret storage concern.

---

### 5. MODERATE — `markInterventionAsSaved` is unscoped to customer or user

**File:** `app/api/webhooks/stripe/route.ts`, `markInterventionAsSaved` function

Called on `invoice.payment_succeeded` and `checkout.session.completed`. Finds the most recent `PENDING` intervention globally:
```typescript
await prisma.intervention.findFirst({
  where: { status: 'PENDING' },
  orderBy: { createdAt: 'desc' },
})
```

**Exact user impact:** If two subscribers check out near-simultaneously, or if a payment succeeds for subscriber A while subscriber B has a pending intervention, the wrong intervention is marked as saved. Corrupts the intervention history table — an ops/analytics concern more than a subscriber-facing one, but it means "what actually recovered this subscriber" reporting is wrong.

**Is it happening now?** Potentially. With only one live subscriber, collision probability is low but the code is incorrect.

**Fix risk:** Isolated. Add `userId` or `customerId` to the `where` clause. The `checkout.session.completed` payload contains `metadata.userId`; `invoice.payment_succeeded` contains the Stripe customer ID which can be resolved to a user.

---

### 6. MODERATE — No unique constraint on Subscription.userId; duplicate rows possible

**File:** `prisma/schema.prisma`, `Subscription` model

```prisma
model Subscription {
  id        String   @id @default(cuid())
  userId    String
  status    String
  priceId   String
  ...
}
```

No `@@unique([userId])` constraint. The `provisionSubscription` function does a code-level check for an existing active subscription before creating one, but this is not atomic. Two simultaneous `checkout.session.completed` events (e.g., webhook retry) can both pass the check and create two rows.

**Exact user impact:** Two active Subscription rows for one user. Not immediately visible but causes double-counting in any billing analytics, and if one row is later canceled it doesn't affect the other — so cancellation may not take effect.

**Is it happening now?** No current duplicates exist (Subscription table was empty until the test run). Risk is low at current volume but grows with traffic.

**Fix risk:** Low-medium. Adding `@@unique([userId, status])` is a non-breaking migration (one active sub per user). The `provisionSubscription` code becomes an upsert instead of a find-then-create.

---

### 7. LOW — "Free trial ended" copy shown unconditionally on /upgrade

**File:** `app/upgrade/page.tsx`, lines 123–146

The badge and headline render regardless of why the user is on `/upgrade`:
```tsx
<span>Free trial ended</span>
...
<h1>Your free trial has ended</h1>
```

A subscriber who was locked out due to `past_due` (issue #1), or who canceled and lost access at period end (issue #2), or who was blocked for any other reason, sees "Your free trial has ended" — which is factually wrong and confusing.

**Exact user impact:** Subscriber whose card declined sees "Your free trial has ended" and upgrade pricing. They may attempt to re-subscribe instead of updating their payment method. This also obscures that they're paying customers whose card needs updating.

**Is it happening now?** Yes. The middleware passes `?expired=true` to the URL but the page ignores the query param.

**Fix risk:** Very low. Read the `reason` query param (e.g., `expired`, `payment_failed`, `canceled`) and render appropriate copy. Purely frontend, no API changes.

---

### 8. LOW — Up to 1-hour stale paywall window after status change

**File:** `middleware.ts`, `app/api/subscription/status/route.ts`

The `cg_paywall` cookie has `maxAge: 3600` (1 hour). Middleware reads the cookie without re-validating against the DB. After a subscription is activated (payment succeeds) or canceled, the old cookie state persists for up to 1 hour.

**Exact user impact:**
- Subscriber who just paid: may still see 402 API responses for up to 1 hour (the `/upgrade` page has a `useEffect` that checks status and redirects if active, which partially mitigates this for the web UI but not for API calls)
- Subscriber who just canceled: remains able to access the dashboard for up to 1 hour post-cancellation

**Is it happening now?** Yes, by design. The 1-hour window is a deliberate performance choice but the tradeoff is real.

**Fix risk:** Low. Can reduce `maxAge` to 300s (5 min) with no logic changes. Can also force a revalidation by clearing the cookie in webhook handlers post-status-change and relying on the next `/api/subscription/status` call to re-set it.

---

### 9. LOW — `priceId` can be empty string if Stripe retrieval fails during provisioning

**File:** `app/api/webhooks/stripe/route.ts`, `provisionSubscription` function

```typescript
let priceId = '';
try {
  const fullSub = await stripe.subscriptions.retrieve(stripeSubId);
  priceId = fullSub.items.data[0]?.price?.id ?? '';
} catch {
  // silent
}
await prisma.subscription.create({ data: { ..., priceId } });
```

If the Stripe API call fails (timeout, rate limit), `priceId` is written as `''`. This record is still treated as an active subscription for access purposes, but tier-based feature gating (if added later) would break for that subscriber.

**Exact user impact:** None today (priceId isn't used for feature gating yet). Becomes a problem when tier-based limits are enforced.

**Is it happening now?** Possible but silent. No monitoring on empty priceId.

**Fix risk:** Very low. Throw instead of silently falling back to empty string, or retry once. Isolated to webhook handler.

---

## TEST/IMPORTED DATA ONLY — Not affecting real subscribers

- **ExternalId matching gap for user-connected Stripe accounts:** The dunning handler's `customer.externalId` lookup fails to match ChurnGuard's imported customers (all have `salesforce_*` or `hubspot_*` externalIds, not Stripe customer IDs). This means dunning for end-customers never fires — but this only matters once a user has both Stripe connected AND real customer data flowing. Current 348 Customer rows are all demo/imported data with no live Stripe connection.

- **User accounts with 348 demo Customer rows:** All demo data. No real Stripe customer IDs. No real payment events. The risk scoring, sequences, and email flows for these records are test-only.

---

## Summary Table

| # | Finding | Real subscriber affected now? | Subscriber impact | Fix risk |
|---|---------|-------------------------------|-------------------|----------|
| 1 | `past_due → canceled` maps to locked out | **Yes — active regression** | Locked out during card retry window | Isolated |
| 2 | Cancellation kills access at cancel time not period end | **Yes** | Loses prepaid days | Medium |
| 3 | Platform dunning never fires for ChurnGuard subscribers | **Yes** | No recovery emails on payment failure | Medium |
| 4 | User-connected Stripe webhooks fail signature check | Yes (for webhook-based features) | Customer churn data silent | High |
| 5 | `markInterventionAsSaved` unscoped | Low probability now | Wrong intervention tracking | Isolated |
| 6 | No unique constraint on Subscription | Low probability now | Duplicate subscription rows | Low-medium |
| 7 | Wrong copy on /upgrade for non-trial lockouts | **Yes** | Confusing/misleading UI | Very low |
| 8 | 1-hour stale cookie window | **Yes** | Delayed access after payment | Low |
| 9 | Empty priceId on Stripe timeout | Possible, silent | No impact today | Very low |
