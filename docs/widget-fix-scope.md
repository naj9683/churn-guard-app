# Widget Fix Scope — Decision Support

_Audit date: 2026-07-28. Read-only code trace. Appendix added 2026-07-28._

---

## Q1 — How big is the fix to make /api/track write engagement fields?

**Small. 10–15 lines added to an existing handler. No restructuring.**

The customer record is already resolved before the fix point. The handler at `app/api/track/route.ts` looks up the customer at lines 30–47, then runs an `update()` at lines 67–74. The engagement fields just need to join that update.

The exact data available at the fix point:

```typescript
// Already resolved by line 47:
customer.lastLoginAt        // Date | null — the previous last visit
customer.loginCountThisMonth // number | null — running session counter
```

What the fix would add, for `page_view` events only:

```typescript
const now = new Date();
const isNewDay = !customer.lastLoginAt ||
  customer.lastLoginAt.toDateString() !== now.toDateString();

const isNewMonth = !customer.lastLoginAt ||
  customer.lastLoginAt.getMonth() !== now.getMonth() ||
  customer.lastLoginAt.getFullYear() !== now.getFullYear();

const engagementUpdate = event === 'page_view' ? {
  lastLoginAt: now,
  loginCountThisMonth: isNewDay
    ? (isNewMonth ? 1 : (customer.loginCountThisMonth ?? 0) + 1)
    : customer.loginCountThisMonth,
} : {};
```

Then merge `engagementUpdate` into the existing `prisma.customer.update()` call. That's the entire change.

**Why count days, not page views:** The formula's `loginCountThisMonth` is scored as:
- 0 → 25 pts (no logins — high risk)
- 1–2 → 12 pts (low frequency — moderate risk)
- 3+ → 0 pts (active — healthy)

If you increment on every page view, any user who browses two pages crosses to "active" and stays there. Counting unique days visited this month gives meaningful signal: 1–2 days/month = disengaged, 3+ days/month = healthy.

**Bonus fix included at no extra cost:** There is currently no monthly reset for `loginCountThisMonth` anywhere in the codebase. The counter only increments (in `app/api/events/segment/route.ts:54`) and is never zeroed. The monthly digest cron that might plausibly reset it is broken (exports `POST`, cron sends `GET` — confirmed in `docs/slack-status.md`). The inline reset (`isNewMonth ? 1 : ...`) above fixes this permanently.

---

## Q2 — Is there any honest value in the anonymous, no-code install?

**Yes — specifically for the in-app popup path. That path requires no email and no identity.**

The in-app popup (`/api/widget/messages`) works as follows:

```typescript
// app/api/widget/messages/route.ts
if (msg.trigger === 'manual') return true;
if (msg.trigger === 'high_risk' && customer.riskScore >= 70) return true;
```

The widget calls this endpoint with `apiKey` + `customerId`. The auto-generated `cg_timestamp_randomstr` ID from localStorage works as `customerId`. No real identity needed. The popup shows inside the subscriber's app, so no email delivery is involved.

What the anonymous path genuinely provides after the fix:

- **Behavioral tracking**: every page view sets `lastLoginAt`, sessions counted per day
- **Risk scoring**: formula computes recency + frequency from the page_view data; billing events stay 0 (no Stripe match) but engagement alone can push scores to 35–60
- **In-app popup when risk crosses 70**: fires automatically on the customer's next visit
- **Persistent identity across sessions**: the `cg_xyz` localStorage ID is stable per browser

What requires real identity (`customerId` + email):
- Retention emails (Resend → `cg_xyz@unknown.com` bounces)
- Stripe billing event matching (webhook matches by email)
- Named customers in the dashboard (subscriber sees `cg_1234_abc123` not "Alice at Acme")
- Dunning sequences

**The anonymous value proposition is real but narrow:** it handles early-warning intervention for customers who are still visiting but disengaging. The popup is shown during an active session, so it can only reach customers who haven't fully churned yet. For customers who have already stopped coming, the popup can't reach them — there's no email fallback. That's the honest ceiling of the no-code path.

---

## Q3 — After the /api/track fix, what works for an anonymous install?

Assuming the fix to `/api/track` described in Q1 is applied. Tracing each claim:

### Risk scoring — WORKS

**Before fix:** `lastLoginAt = null` → formula gates all engagement scoring → score = 0 always.

**After fix:** `page_view` sets `lastLoginAt = now` and increments daily session counter. The formula then has real inputs:
- `hasEngagementData = true` (because `lastLoginAt !== null`)
- `recencyPts`: rises as days pass without a visit (0–35)
- `activityPts`: based on sessions this month (0–25)
- `billingPts`: stays 0 for anonymous (no Stripe match)

Maximum score for anonymous install: **60 pts** (35 recency + 25 activity). A customer who visited 30+ days ago and had zero sessions this month hits 60. They won't cross 70 without billing events, but at 60 they're approaching the threshold.

One consequence: the `high_risk` in-app popup trigger at 70 is out of reach on engagement signals alone (max 60). A subscriber would need to either lower their popup trigger threshold or add Stripe for billing signals to push customers over 70.

**This is a scoring ceiling problem for the no-code path.** The popup fires at 70; engagement alone caps at 60.

### In-app popup — PARTIALLY WORKS (depends on threshold)

The widget checks `riskScore >= 70` for the `high_risk` trigger. With no billing events, max score is 60. The popup never fires via `high_risk` for a purely anonymous install.

The `manual` trigger fires unconditionally. A subscriber who creates a `manual` message will show it to all visitors, regardless of risk. This is a promotional banner, not targeted retention.

**Honest state of the popup after the fix:** Targeted retention popups require either (a) Stripe connected so billing events can push scores past 60, or (b) the subscriber to lower the trigger threshold — which is not currently a configurable UI option.

### 6-hour cron recomputation — WORKS

`/api/cron/risk-analysis` fetches `lastLoginAt` and `loginCountThisMonth` from the DB and runs `computeRiskScore()`. After the fix these fields are populated. The cron will produce meaningful scores and write them back. No change to the cron is needed.

### Score visible in dashboard — WORKS (but anonymous names)

Customers appear in the dashboard with their `externalId` (`cg_1234_abc`) as name. Subscriber can see score trends, but can't tell who the customer is without passing `customerId` + metadata (name, email) in the widget init call.

### Retention email sequences — DOES NOT WORK

Sequences send to `customer.email`. For anonymous customers: `cg_1234@unknown.com`. This bounces. No change to this path — it fundamentally requires a real email address, which requires identity.

### Stripe billing events — DOES NOT WORK

Stripe webhook matches customers by email. Anonymous customers have fake emails. No Stripe event will match them.

### Summary table

| Feature | After fix — anonymous install |
|---|---|
| Engagement data written to DB | Yes — page_view sets lastLoginAt, daily sessions counted |
| Behavioral risk score | Yes — up to 60 max (no billing) |
| 6h cron computes real score | Yes |
| In-app popup (manual trigger) | Yes — fires unconditionally |
| In-app popup (high_risk trigger, threshold 70) | No — score caps at 60 without Stripe |
| Named customers in dashboard | No — shows as cg_xyz IDs |
| Retention emails | No — fake email, bounces |
| Dunning sequences | No — no Stripe match |
| Stripe billing signals | No — no email match |

---

## Q4 — Can we honestly claim "paste one line, scoring starts, in-app save-offers appear"?

**Mostly honest for the first half. Not honest for the in-app save-offer part.**

The fix makes "paste one line and scoring starts" accurate:
- Risk scores update every 6 hours reflecting real engagement data
- The dashboard shows customers with behavioral scores
- This is a real, meaningful signal

The "in-app save-offers appear" claim breaks because of the 60-point ceiling:
- The `high_risk` popup trigger is set at 70
- Engagement-only scoring caps at 60
- Without billing events, the popup never fires via `high_risk` trigger
- The popup DOES fire via `manual` trigger — but that's a broadcast to all visitors, not a targeted save-offer

**To make the save-offer claim honest, one of these must be true:**
1. Stripe is connected (billing events push scores past 70) — but Stripe requires identity and developer integration
2. The popup trigger threshold is lowered to 50 or 60 — but that UI doesn't exist yet
3. The copy says "save-offers to customers who miss payments" (which does work with Stripe but not with anonymous tracking)

**Revised honest positioning after the fix:**

> "Paste one line and ChurnGuard starts tracking which customers are becoming inactive. Engagement scores update every 6 hours. Connect Stripe or pass your customer ID for email outreach and in-app save offers."

This is accurate. The no-code path gives: tracking + scoring. The save-offer popup (at the current 70 threshold) requires Stripe or `customerId`.

**If you want "no-code installs see save-offers," the smallest additional change is:** add a configurable trigger threshold to the widget message system, and default new accounts to a lower threshold (e.g., 50). That's a separate feature, not part of the `/api/track` fix, but it would make the no-code positioning complete.

---

## Decision summary

| Option | What ships | Copy claim |
|---|---|---|
| Fix /api/track (Q1 change only) | Engagement scoring works. Dashboard populates. Save-offers don't fire (ceiling 60, threshold 70). | "Paste one line to start seeing which customers are disengaging." Honest. |
| Fix /api/track + lower popup threshold to 50 | Everything above + targeted in-app popups for disengaging customers. Email still needs identity. | "Paste one line. ChurnGuard scores engagement risk and shows in-app save offers to customers who stop logging in." Honest. |
| Keep /api/track as-is, change copy | No code change. Copy correctly says customerId is required for anything useful. | "/widget-install page copy already says this. Marketing needs updating." |
| Both (fix + honest copy) | Most correct option. Anonymous = scoring + popups. Named = all the above + email. | Tiered story: no-code gives engagement signals and in-app offers; adding customerId unlocks email. |

---

## Appendix — Rolling 30-Day Window vs. Calendar Counter

### Q1 — How is `loginCountThisMonth` stored and computed?

It is a **stored integer counter** on the `Customer` model (`schema.prisma:66`):

```
loginCountThisMonth  Int  @default(0)
```

It is not computed on read. It is incremented in exactly one place — `app/api/events/segment/route.ts:54`:

```typescript
updates.loginCountThisMonth = (resolvedCustomer.loginCountThisMonth ?? 0) + 1;
```

There is **no reset logic anywhere in the codebase.** No cron zeros it out. The monthly digest cron that might plausibly do a reset is broken (exports `POST`, Vercel cron sends `GET` — confirmed in `docs/slack-status.md`). The counter accumulates forever.

After the `/api/track` fix is applied, that route would also increment it (once per day, with a monthly reset inline). Without the `/api/track` fix it only increments via Segment named-customer events — which means widget-only anonymous customers currently have `loginCountThisMonth = 0` always.

---

### Q2 — What would a rolling 30-day window require?

**The underlying data already exists.** Every event that `/api/track` receives — including every `page_view` — is written to the `Event` table (`schema.prisma:82–90`):

```
model Event {
  id         String   @id @default(cuid())
  customerId String
  event      String
  metadata   Json?
  timestamp  BigInt               ← millisecond epoch, already present
  createdAt  DateTime @default(now())
}
```

No new storage is needed. A rolling 30-day session count is a query over existing data:

```typescript
const thirtyDaysAgo = BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000);
const pageViews = await prisma.event.findMany({
  where: { customerId: customer.id, event: 'page_view', timestamp: { gte: thirtyDaysAgo } },
  select: { timestamp: true },
});
const uniqueDays = new Set(
  pageViews.map(e => new Date(Number(e.timestamp)).toDateString())
).size;
```

`uniqueDays` = distinct calendar days with at least one page_view in the last 30 days. This is a true rolling count with no month-boundary artifact.

**One gap:** the `Event` model has no index on `timestamp`, only on the implicit `customerId` FK. A query filtering by both `customerId` and `timestamp` hits an unindexed column. For the current scale (348 customers, ~10–50 events each) this is not a problem. If the widget generates thousands of page_views per customer it will slow. The fix is one schema line: `@@index([customerId, timestamp])` on the `Event` model — a non-blocking index creation, no data migration.

The alternative to a live query is to pass the events already being fetched to the formula. The 6-hour cron at `app/api/cron/risk-analysis/route.ts:43–48` already fetches events per customer:

```typescript
events: { orderBy: { timestamp: 'desc' }, take: 10 },
```

Changing `take: 10` to `where: { timestamp: { gte: thirtyDaysAgo } }` passes the right data through the existing pipeline. No new query path. The formula already receives `recentEvents` — it just needs to use them for frequency instead of relying on `loginCountThisMonth`.

---

### Q3 — Full scope of Path A build

All five changes together. Total effort: **small**.

| File | What changes | Lines |
|---|---|---|
| `app/api/track/route.ts` | On `page_view`: write `lastLoginAt = now`. Increment `loginCountThisMonth` once per new day; reset to 1 if new month. Customer already resolved at that point — merge into existing `update()` call. | ~15 |
| `lib/risk-formula.ts` | Replace `loginCountThisMonth` with `uniqueDaysLast30d` computed from `recentEvents`. Filter for `page_view` events within 30 days, count distinct calendar days via `Set`. Drop the `loginCountThisMonth` input field or keep it for backward compat with Segment-named customers. | ~12 |
| `app/api/cron/risk-analysis/route.ts` | Change `events: { orderBy: ..., take: 10 }` to `events: { where: { timestamp: { gte: thirtyDaysAgoBigInt } }, orderBy: ... }`. Removes the arbitrary 10-event cap and passes the correct rolling window. | ~5 |
| `app/api/widget/messages/route.ts` | Change `customer.riskScore >= 70` to `customer.riskScore >= 50`. One line. No schema change needed for a hardcoded default. (If per-message configurability is wanted later, add a `threshold` field to `WidgetMessage` as a follow-on.) | 1 |
| `prisma/schema.prisma` | Add `@@index([customerId, timestamp])` to the `Event` model. Prevents slow scans if event volume grows. `npx prisma db push` applies it. | 1 + push |

**What does NOT need to change:**
- The `FormulaInput` interface can keep `loginCountThisMonth` as an optional/unused field — backward compat with the Segment path for named customers
- `lib/risk-analyzer.ts` — passes `recentEvents` through unchanged; the formula change is internal
- The `WidgetMessage` schema — no new fields needed for a fixed threshold of 50
- Any other route, cron, or sequence

**Deployment steps:** one commit, one `db push` (index only, no column changes), one Vercel deploy.

---

### Q4 — Smaller alternative: keep the counter, mitigate the artifact

If you want to skip the rolling window and keep `loginCountThisMonth`, the artifact cannot be fully eliminated without a monthly reset. The honest mitigations:

**Option A — Inline monthly reset in `/api/track` (already included in the fix)**

The `/api/track` fix (Q3 above) already handles this: when writing `loginCountThisMonth`, it checks whether the previous `lastLoginAt` was in a different calendar month and resets to 1 if so. This does NOT require the cron or rolling events. It means: a customer's counter resets the first time they visit in a new month. No artifact for customers who visit at least once per month.

Residual artifact: customers who do NOT visit in a given month accumulate a stale counter from previous months. But since their `lastLoginAt` is also stale, they'll score high on recency anyway — the artifact makes their score slightly higher than it should be, not lower, which is conservative (errs toward intervention rather than missing a churned customer).

**Option B — Accept it; quantify the exposure**

The boundary artifact at threshold 50 only fires for customers who:
1. Have `loginCountThisMonth = 0` (have not yet visited this calendar month), AND
2. Have `lastLoginAt` ≥ 21 days ago

For a customer with a natural 3-week visit cadence, the artifact window is the days between "21 days after their last visit" and "their next visit." If they visit every 21 days exactly, the popup fires at the moment of their return — arguably not a false positive at all. The worst case is a customer who visits every 25 days: the popup fires for 4 days each cycle before they return.

**False-positive rate at threshold 50 without rolling window, with inline counter reset only:**

| Customer type | Artifact exposure | Practical impact |
|---|---|---|
| Visits 3+ days/month | `loginCountThisMonth ≥ 3` → `activityPts = 0` → max score 35. Never trips 50. Zero false positives. | None |
| Visits 1–2 days/month | `activityPts = 12` → max score 47. Never trips 50. Zero false positives. | None |
| Visits ~3 weeks (lands in 0-session window) | Can trip 50 at day 21 of absence. Popup fires until next visit (~4-day window for 25-day cadence users). | Low — popup fires early but customer returns soon |
| Genuinely disengaged (0 sessions, 21+ days gone) | Correct positive. | Intended behavior |

The only real false positives are customers with 3-week natural cycles crossing a month boundary. At threshold 50 with the inline monthly reset, this is **a small exposed population for a short window** — probably acceptable for an early-access product. The rolling window eliminates it cleanly; the counter-only approach accepts it.

**Recommendation:** The rolling 30-day approach is small (five files, no new tables, data already exists) and eliminates the artifact permanently. The counter-only approach with inline reset is even smaller (three files) and reduces the artifact to a narrow edge case. Either is viable. The rolling window is the cleaner long-term foundation if you intend to expose the frequency signal in the dashboard UI later.
