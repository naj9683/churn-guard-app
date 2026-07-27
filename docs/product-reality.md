# Product Reality — What ChurnGuard Actually Does Today

_Audit date: 2026-07-27. Based on code tracing, not intentions._

---

## 1. The pasted widget/script

**Status: WORKS**

`public/widget.js` collects and sends to `POST /api/track`:

- `page_view` — URL + title on each navigation
- `heartbeat` — fires after 60 s of idle (keeps session alive)
- `widget_shown`, `widget_dismissed`, `widget_accepted` — when a retention widget appears and the customer acts on it

Each call sends `{ apiKey, customerId, event, metadata, timestamp }` to `https://churnguardapp.com/api/track`.

The handler at `app/api/track/route.ts` does three things on every hit:
1. Creates or updates the `Customer` record in the DB
2. Writes an `Event` row
3. Recalculates `riskScore` inline (e.g. login = −5, payment_failed = +20, downgrade attempt = +30)

A second call polls `GET /api/widget/messages` to decide whether to surface a retention widget. Widgets show when trigger is `manual` OR `high_risk` and `riskScore >= 70`.

**Real data: yes.** The widget pushes live behavioral data into the DB on every page load. This is the only source of login frequency and recency data.

---

## 2. Customer risk list in the dashboard

**Status: PARTIAL**

The dashboard customer list reads `Customer.riskScore` — a stored integer — fetched from `app/api/customers/route.ts`. It is live in the sense that it updates whenever something writes to it; it is not a live calculation on page load.

**What feeds the score (`lib/risk-formula.ts`):**

| Component | Points | Source |
|---|---|---|
| Billing signals | 0–40 | `payment_failed` events (20 each), `downgrade_detected` (15) — from Stripe webhook |
| Days since last login | 0–35 | `Customer.lastLoginAt` — set only by the widget |
| Login frequency this month | 0–25 | `Customer.loginCountThisMonth` — set only by the widget |

**What updates the score:**
- Immediately on each widget event (inline in `/api/track`)
- Every 6 hours via cron (`/api/cron/risk-analysis`) — recomputes top 50 stale customers, adds an AI-written `riskReason` text summary, and auto-enrolls customers who cross 50 into a retention sequence

**The partial:** Without the widget installed, `lastLoginAt` and `loginCountThisMonth` stay null. The maximum possible score without widget data is 40 (billing events only). A customer who never pays late will score 0 and never be flagged, regardless of how disengaged they are. Behavioral churn signals require the widget.

---

## 3. Automated outreach to end-customers

**Status: WORKS (email only)**

This is real and fires automatically. The path:

1. A trigger writes a `SequenceEnrollment` row with `nextRunAt = now()`
2. An hourly cron (`/api/cron/sequences`) calls `runSequences()`
3. `runSequences()` picks up due enrollments and calls `executeStep()`
4. `executeStep()` sends email via Resend to **`customer.email`** — the end-customer, not the ChurnGuard subscriber

**Eight sequence types are implemented and fire:**

| Sequence | What it sends | When triggered |
|---|---|---|
| `dunning` | Day 0: payment failed notice. Day 3: follow-up. Day 7: CSM escalation | Stripe `invoice.payment_failed` webhook |
| `risk_retention` | Day 0: AI-personalized retention email. Day 1: Slack alert to subscriber (if webhook set). Day 7: escalation | Customer crosses risk score 50 on cron |
| `welcome` | Days 0/3/7: onboarding emails | New customer created |
| `win_back` | Lapsed customer re-engagement | Triggered by automation rules |
| `downgrade_prevention` | Offer/outreach before downgrade completes | `downgrade_detected` event |
| `new_customer_rescue` | Early-lifecycle intervention | Low engagement in first 30 days |
| `vip_early_warning` | High-MRR customer early signal | High-value customers crossing risk threshold |
| `support_followup` | Post-support engagement | Manually triggered or automation rule |

**Email sending:** Resend is configured and active. If a subscriber has their own Postmark key set, it uses that instead; otherwise falls back to the platform Resend account.

**SMS: never fires.** Twilio env vars (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`) are empty. SMS steps fail silently and the sequence continues. Any marketing copy claiming SMS outreach is currently inaccurate.

**Slack: fires only if subscriber has configured a webhook URL.** This is an optional user field; no subscriber is currently likely to have it set since the UI for it is minimal.

---

## 4. Failed-payment dunning

**Status: WORKS (email)**

The full chain runs today:

```
Stripe invoice.payment_failed
  → /api/webhooks/stripe resolves customer
  → writes Event row (payment_failed)
  → runAutomationEngine() — fires any matching single-step rules immediately
  → enrollInSequence(..., 'dunning', { invoiceId, amount })
  → [within the hour, on cron tick]
  → email sent to customer.email: "Your payment failed"
  → [day 3] follow-up email (SMS attempt silently skipped)
  → [day 7] InterventionOutcome row created, CSM notified
```

The email the end-customer receives comes from ChurnGuard's Resend account (or the subscriber's Postmark if configured). It references the actual invoice ID and amount.

**Caveat:** The outer `try/catch` in `provisionSubscription` means that if the sequence throw for a bad priceId happens, it's swallowed and Stripe gets a 200. That's a webhook-path issue documented in `docs/batch-fixes.md`. The dunning sequence itself is on a separate path and is not affected by that bug.

---

## 5. Other things that fire automatically

**Automation engine — WORKS (email + Slack), SMS never fires**

`lib/automation-engine.ts` runs every 15 minutes via cron. Subscribers create rules in the dashboard; the engine evaluates them against all their customers and fires actions.

Trigger types that work today:
- `risk_threshold` — customers at or above a risk score
- `payment_failed` — customers with recent payment failures
- `feature_abandonment` — `lastFeatureUsedAt` stale by N days
- `days_since_login` — `lastLoginAt` stale by N days
- `days_since_signup` — new customer early-lifecycle
- `mrr_threshold`, `plan_type`, `multi_condition`, and several others

Actions that work:
- `send_email` — sends to `customer.email` via Resend ✓
- `send_slack` — POSTs to subscriber's `slackWebhookUrl` if set ✓ (conditional on config)
- `create_intervention` — writes `InterventionOutcome` row for human follow-up ✓
- `escalate_to_human` — sets `csmStatus: 'critical_call_required'` on customer ✓
- `trigger_sequence` — enrolls customer in a sequence ✓
- `send_sms` — always fails silently (Twilio not configured) ✗

All automation actions are logged to `AutomationLog` with success/failed/skipped status. A per-rule cooldown prevents duplicate fires within the cooldown window.

**Risk analysis cron — WORKS**

Every 6 hours, `/api/cron/risk-analysis` re-scores the 50 most stale customers, writes an AI-generated `riskReason` summary sentence, and auto-enrolls high-risk customers in `risk_retention`. This is the mechanism that catches customers who are disengaging without any explicit event — relying on `lastLoginAt` staleness from widget data.

---

## Summary

| Feature | Works today | On real data | Gap |
|---|---|---|---|
| Widget data collection | Yes | Yes | None |
| Risk scores in dashboard | Partially | Yes, with widget | Score flat at ≤40 without widget |
| Automated emails to end-customers | Yes | Yes | — |
| Automated SMS to end-customers | No | — | Twilio not configured |
| Dunning emails | Yes | Yes | — |
| Dunning SMS (day 3) | No | — | Twilio not configured |
| Automation rules (email) | Yes | Yes | — |
| Automation rules (Slack) | Conditionally | Yes | Requires subscriber webhook config |
| AI risk summaries | Yes | Yes | Falls back gracefully if AI unavailable |
| Subscription provisioning | Yes | Yes | Fixed 2026-07-25 (missing webhook events) |

**What to claim in copy:** Email-based automated outreach to at-risk customers — real and working. Risk scoring with behavioral signals — real and working once widget is installed. Automated dunning — real and working. Slack notifications to the subscriber — real if configured. SMS — do not claim until Twilio is configured.
