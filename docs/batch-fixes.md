# Batch Fixes — 2026-07-25

Five findings from docs/live-audit.md (findings #1/#2/#7/#4 already fixed in prior session).

---

## Finding #1 — externalId dunning matching

**Status:** DONE

**Confirmed present:** `invoice.payment_failed` handler queried `where: { externalId: stripeCustomerId }`.
All 348 existing customers have `salesforce_*` or `hubspot_*` externalIds — direct match always misses.

**Fix:**
- `prisma/schema.prisma`: added `stripeCustomerId String?` to Customer + `@@index([stripeCustomerId])`
- `app/api/webhooks/stripe/route.ts`:
  - Verification loop now selects `userId` from integrations, stores as `verifiedUserId`
  - Added `resolveCustomerByStripeId(stripeCustomerId, verifiedUserId)` helper:
    1. Try `externalId = stripeCustomerId` (existing path)
    2. Try `stripeCustomerId = stripeCustomerId` (lazily cached field)
    3. Fetch email from Stripe API using verifiedUserId's access token, match by `{ email, userId }`,
       lazily store `stripeCustomerId` for future O(1) lookups
  - `invoice.payment_failed`, `maybeRecordDowngrade`, `cancelCustomer` all use the resolver

**Migration:** `npx prisma db push` — applied. Column `stripeCustomerId` now exists on Customer.
**TypeScript:** clean
**Build:** passed

---

## Finding #2 — Duplicate Subscription rows

**Status:** DONE

**Confirmed present:** No `@@unique` constraint on Subscription. `provisionSubscription` used
non-atomic `findFirst` + `create`. No existing duplicates (table was empty).

**Which column:** `@@unique([userId])` — not `stripeSubscriptionId` (column doesn't exist).
The codebase treats subscriptions as one-per-user everywhere: `syncSubscriptionStatus` and
`cancelPlatformSubscription` both use `updateMany({ where: { userId } })`, status route
fetches `take: 1`. `@@unique([userId])` enforces what the code already assumes.

**Fix:**
- `prisma/schema.prisma`: `userId String @unique` on Subscription model
- `app/api/webhooks/stripe/route.ts` `provisionSubscription`: converted to `upsert({ where: { userId } })`.
  `update: { status: 'active', priceId }` — handles new subscribe, double-webhook (idempotent),
  and resubscribe after cancel (reactivates existing canceled row). Original `update: {}` would
  have silently left a canceled row unchanged on resubscribe — caught and corrected pre-deploy.

**Migration:** `npx prisma db push` — applied.
**TypeScript:** clean
**Build:** passed

---

## Finding #3 — markInterventionAsSaved scoping

**Status:** DONE

**Confirmed present:** `markInterventionAsSaved` accepted `stripeCustomerId` but never used it.
Query was `where: { status: 'pending' }` globally — would mark a random pending intervention.

**Fix:** `app/api/webhooks/stripe/route.ts`
- Changed signature to `markInterventionAsSaved(userId: string | null)`. Returns early if null.
- `invoice.payment_succeeded`: resolves userId — if per-account event uses `verifiedUserId`,
  if platform event looks up `User.stripeCustomerId`
- `checkout.session.completed`: resolves userId from `clerkUserId` in session metadata
- Query now: `where: { status: 'pending', userId }`

**TypeScript:** clean
**Build:** passed

---

## Finding #4 — Stale cookie window

**Status:** DONE

**Confirmed present:** `app/api/subscription/status/route.ts` line 7: `maxAge: 3600`.

**Fix:** Changed to `maxAge: 60`. Cookie expires in 60 seconds; next page load triggers a fresh
DB check via `/api/subscription/status`. The upgrade page's existing `useEffect` already
re-checks status on mount, so the typical post-payment flow resolves in seconds, not minutes.

**TypeScript:** clean
**Build:** passed

---

## Finding #5 — Empty priceId on Stripe timeout

**Status:** DONE (applied as part of finding #2)

**Confirmed present:** `provisionSubscription` had `try { retrieve } catch { console.error }` —
swallowed Stripe API errors, saved subscription row with `priceId = ''`.

**Fix:** `app/api/webhooks/stripe/route.ts` `provisionSubscription`:
- Removed try/catch around `stripe.subscriptions.retrieve` — errors now propagate
- Explicit guard: `if (!priceId) throw new Error(...)` — Stripe retries on 5xx
- Row is never created with empty priceId because throw precedes upsert

**TypeScript:** clean
**Build:** passed

---

## Build result

`npx next build` — **PASSED**. No errors, no warnings beyond expected dynamic route markers.

---

## Summary table

| # | Finding | Still present | Fix | Test result | Migration |
|---|---------|---------------|-----|-------------|-----------|
| 1 | externalId dunning matching | YES | `resolveCustomerByStripeId` helper (3-step: externalId → cached field → Stripe API email fallback); `stripeCustomerId` column added to Customer | TS clean, build passed | YES — `Customer.stripeCustomerId` column |
| 2 | Duplicate Subscription rows | YES (no constraint) | `@@unique([userId])` on Subscription; `provisionSubscription` → upsert | TS clean, build passed | YES — unique constraint on `Subscription.userId` |
| 3 | `markInterventionAsSaved` scoping | YES (global query) | Scoped to `userId` resolved from `verifiedUserId` or `clerkUserId` | TS clean, build passed | No |
| 4 | Stale cookie window | YES (1 hour) | `maxAge: 3600 → 60` | TS clean, build passed | No |
| 5 | Empty priceId on Stripe timeout | YES (silent fallback) | Throw instead of swallow; upsert never reached with blank priceId | TS clean, build passed | No |
