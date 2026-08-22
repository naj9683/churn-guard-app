# Widget Pages Audit

_Audit date: 2026-07-28. Read-only code trace._

---

## Q1 — Did tonight's onboarding work touch /widget-install?

**No.** Tonight's changes created a new page at `/onboarding/widget` and left `/widget-install` completely untouched. Seeing `/widget-install` look unchanged after the deploy is correct — not a deploy failure.

---

## Q2 — Every widget-related page that now exists

| URL | What it is | Reachable from |
|---|---|---|
| `/onboarding/widget` | **New.** Forced first-run step. Shows the minimal no-code snippet (apiKey only). Auto-polls for detection. Manual Verify button. Skip link. | Auth callback only (new user, no DB record). NOT in sidebar. A logged-in returning user can reach it at the direct URL, but the skip guard bounces them to `/dashboard` if `cg_widget_skipped` is set. |
| `/widget-install` | **Old. Unchanged.** The permanent sidebar page for widget setup. Shows the 3-step flow: copy snippet (HTML/React/NPM tabs) → replace `USER_ID_FROM_YOUR_APP` → create retention messages. Also shows your API key at the bottom. | Sidebar "Install Widget" link. Also linked from the customer detail page and two places inside the dashboard. |
| `/widget-messages` | Manage the retention popup messages that the widget displays in-app. Linked from Step 3 of `/widget-install`. | From `/widget-install`'s "Manage Widget Messages →" button. Not in sidebar directly. |
| `/widget-demo` | Live preview of what the widget retention popup looks like (fake risk slider, animated popup). Has a back link to `/widget-install`. | Linked from `/widget-install` and from `robots.ts` (which disallows it from search). Not in sidebar. |

---

## Q3 — Where does the sidebar "Install Widget" link point?

`app/components/Sidebar.tsx:40`:

```
{ href: '/widget-install', label: 'Install Widget', ... }
```

The sidebar points to `/widget-install`. It does **not** point to `/onboarding/widget`.

---

## Q4 — Can a logged-in user reach both pages, and do they give different instructions?

**Yes, current state:**

A logged-in user can navigate directly to `/onboarding/widget` by URL. If they previously clicked "I'll do this later," the skip guard (`cg_widget_skipped`) bounces them to `/dashboard`. Otherwise the page loads.

The two pages give **contradictory instructions:**

| | `/onboarding/widget` (new) | `/widget-install` (old) |
|---|---|---|
| customerId | "Optional — omit it to track anonymous sessions" | Required — Step 2 is explicitly "Replace `USER_ID_FROM_YOUR_APP`" |
| Snippet shown | apiKey only | apiKey + customerId placeholder |
| Tabs | None | HTML / React / NPM |
| Where to paste | Not specified | "before `</head>` on every page" |

---

## Q5 — What does the product actually do without customerId (anonymous sessions)?

### How `lastLoginAt` gets set — the key fact

`/api/track/route.ts` (the widget's endpoint) does **not** update `lastLoginAt` or `loginCountThisMonth`. Those fields are only written by:

- **`/api/events/segment/route.ts`** — the Segment webhook. Updates `lastLoginAt` and increments `loginCountThisMonth` on "User Logged In" events.
- **`lib/crm/hubspot.ts`** — uses HubSpot's `notes_last_contacted` field as a proxy for `lastLoginAt`.

Widget `page_view` and `heartbeat` events go to `/api/track`, which only updates `riskScore` (via inline adjustments) and `mrr`. `lastLoginAt` stays `null` unless the subscriber also runs Segment or HubSpot.

---

### Risk scoring — does it work without customerId?

**Partially, but not usefully.**

There are two risk-scoring mechanisms:

1. **Inline adjustments in `/api/track`** — fire immediately on each event. `login` event → -5 pts, `payment_failed` → +20, `downgrade_attempt` → +30. The `page_view` event has no inline adjustment (score unchanged).

2. **6-hour cron (`/api/cron/risk-analysis`)** — recomputes using `lib/risk-formula.ts`. Overwrites the stored score. This formula has three components:
   - Billing signals (0–40): from `payment_failed` / `downgrade_detected` events. These come from the Stripe webhook, which matches customers by email. Anonymous customers have email `cg_xyz@unknown.com` — no Stripe event will ever match them.
   - Login recency (0–35): requires `lastLoginAt !== null`. For anonymous widget-only customers, this is always null → always 0.
   - Login frequency (0–25): requires `lastLoginAt !== null` (the formula gates the entire engagement section on this). Always 0 for anonymous.

**Result:** An anonymous customer is created with `riskScore: 50`. After the next 6-hour cron, the formula recomputes to 0 (no billing events, no engagement data). The customer is never flagged as at-risk. They disappear from visibility.

---

### In-app widget messages — do they work without customerId?

**The code path works, but the trigger condition never fires for anonymous customers.**

`/api/widget/messages` requires both `apiKey` and `customerId`. The widget always sends a `customerId` (the auto-generated localStorage one), so the lookup succeeds. The code then checks:

```typescript
if (msg.trigger === 'manual') return true;
if (msg.trigger === 'high_risk' && customer.riskScore >= 70) return true;
```

- `manual` trigger: shows unconditionally to every customer, anonymous or not. If a subscriber creates a manual message, it fires to all customers regardless of identity or risk.
- `high_risk` trigger: requires `riskScore >= 70`. Since anonymous customers settle to 0 after the first cron, this never fires.

**In practice:** Anonymous customers will never see `high_risk` retention popups. They might see `manual` popups, but those aren't targeted — they fire to everyone.

---

### Retention emails — do they work without customerId?

**No.**

Sequences send email to `customer.email`. For anonymous customers, `/api/track` sets:

```typescript
email: metadata?.email || `${customerId}@unknown.com`
```

Since anonymous widget calls don't include an email in metadata, the email is `cg_1234567890_abc123@unknown.com`. Resend will reject or bounce this address. No retention email is delivered.

---

### Plain-terms verdict

| What you get without customerId | Works? |
|---|---|
| Customer record created in DB | Yes — but with fake email and auto-generated ID |
| Initial risk score of 50 | Yes — but it resets to 0 at the next 6h cron |
| Risk score reflects login behavior | No — `lastLoginAt` never set by widget events alone |
| Risk score reflects payment failures | No — Stripe webhook can't match fake email to real customer |
| At-risk customers appear in dashboard | No — scores settle to 0, nothing flags |
| In-app retention popup (high_risk trigger) | No — risk never reaches 70 |
| In-app retention popup (manual trigger) | Yes — fires unconditionally to all customers |
| Retention emails to at-risk customers | No — email is `cg_xyz@unknown.com`, delivery fails |
| Dunning emails on payment failure | No — Stripe can't match anonymous customer |

**The anonymous version is not genuinely useful for churn prevention.** It collects events and creates customer records, but those customers are never scored above 0 after the cron, never emailed, and never flagged. The product requires `customerId` to link widget events to real customer identities and email addresses.

**The implication for the onboarding page:** calling `customerId` "optional" is technically accurate (the snippet runs without it), but it misrepresents what the subscriber gets. A subscriber who follows the no-code path will see customer records appear in their dashboard (from widget events) but those customers will all show 0 risk and receive no emails. They'll think the product isn't working.

---

## Open question this surfaces

The two widget pages now give contradictory instructions, and both are available to logged-in users:

- `/widget-install` (sidebar): correctly tells the subscriber they need to pass a real user ID
- `/onboarding/widget` (new): says customerId is optional

The honest position, supported by this audit, is that `/widget-install` is right and `/onboarding/widget`'s "optional" note is misleading. A decision is needed on whether to:
1. Update `/onboarding/widget` to match `/widget-install` (require customerId, accept that setup is developer-only)
2. Update `/widget-install` to match `/onboarding/widget` (downplay customerId) — but this makes the product effectively unusable for the customer tracking it's sold on
3. Consolidate to one page that explains the tradeoff honestly
