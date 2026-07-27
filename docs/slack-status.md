# Slack Integration Status

_Audit date: 2026-07-27. Read-only code trace._

---

## 1. What the Slack integration does

All Slack messages go to the **subscriber's** channel (not to their end-customers). There are five distinct fire paths:

**Path A — Revenue and VIP alerts (`/api/alerts/monitor`, hourly cron)**
`app/api/alerts/monitor/route.ts`
- Revenue at risk ≥ $5,000 → `🚨 Revenue at Risk Alert: $X of your MRR is at risk`
- Any customer with MRR > $500 and risk score ≥ 70 → `⚠️ VIP Customer Alert: [name] has a risk score of [n]`
- These are plain-text messages (no attachments)

**Path B — Monthly digest (`/api/digest/generate`, 1st of month at 9am)**
`app/api/digest/generate/route.ts`
- Count of at-risk customers, high-risk count, total MRR at risk
- Single summary message with bullet points

**Path C — Automation rule action (every 15 min)**
`lib/automation-engine.ts:execSendSlack`
- Fires when a subscriber creates an automation rule with action type `send_slack`
- Formatted attachment: customer name, risk score, MRR
- Content is configurable via the rule's `actionConfig.message`

**Path D — Sequence steps (hourly cron)**
`lib/sequences.ts`
- `risk_retention` step 1 (48 h): subscriber alert if customer hasn't logged in after retention email — `lib/sequences.ts:172`
- `vip_early_warning` step 0 (immediate): fires alongside the VIP email — `lib/sequences.ts:350`
- `downgrade_prevention` step 1 (day 3): team follow-up alert — `lib/sequences.ts:585`
- `support_followup` step 1 (48 h): no-engagement alert after check-in email — `lib/sequences.ts:643`

**Path E — Critical interventions**
`app/api/interventions/route.ts:195`
- Fires on `high_priority_call` and `critical_call_required` intervention types

---

## 2. How a subscriber turns it on

Settings → Notifications (`app/settings/notifications/page.tsx`):
- Toggle "Slack notifications enabled"
- URL input appears (hidden when toggle off)
- Paste `https://hooks.slack.com/services/...`
- Save button → `POST /api/settings/notifications` → writes `User.slackWebhookUrl`

The route validates nothing about the URL format. A second route (`app/api/integrations/slack/route.ts`) enforces that the URL starts with `https://hooks.slack.com/` — but this is only called from a separate integration UI, not from the notifications settings page. Both write to the same `User.slackWebhookUrl` field.

The settings page is built and functional. No missing UI.

---

## 3. Fire path trace — does it actually send?

**Path A (hourly monitor): WORKS**
```
vercel.json cron "0 * * * *" → GET /api/alerts/monitor
  → checks user.slackWebhookUrl (line 36)
  → if present: POST to webhook URL
  → fetch call, no return value checked (fire and forget)
```
Correct HTTP method (GET). Guard is only `slackWebhookUrl`. Works end to end.

**Path B (monthly digest): BROKEN**
```
vercel.json cron "0 9 1 * *" → GET /api/digest/generate
  → route only exports: export async function POST()
  → Vercel cron sends GET → 405 Method Not Allowed
  → digest never sends
```
The cron hits GET; the route only exports `POST`. This has silently failed every month since the route was written. There is no `GET` export in `app/api/digest/generate/route.ts`.

**Path C (automation rules): WORKS**
```
vercel.json cron "*/15 * * * *" → GET /api/cron/automation
  → runAutomationEngine() → execSendSlack()
  → checks slackWebhookUrl (line 176)
  → POST to webhook
```
Full path works. Requires subscriber to have created a rule with `send_slack` action.

**Path D (sequences): WORKS**
All four sequence Slack steps guard on `user.slackWebhookUrl` and POST directly to it. No other condition. All four reach the `fetch()` call if the URL is set.

The `vip_early_warning` step fires the Slack call with `.catch(() => {})` — errors are silently swallowed and don't affect the step result. The other three check the response.

**Path E (interventions): WORKS**
Checks `user.slackWebhookUrl` at line 195, then POSTs. No additional gates.

---

## 4. Data dependency

Unlike SMS (blocked by `customer.phone = null`), Slack has no per-customer data requirement. The only thing needed is `User.slackWebhookUrl` being set. No customer-level field, no env var, no additional config.

**The `notifSlack` flag:** `User.notifSlack` is stored and toggled by the settings page, but it is never read by any of the five sending paths. `lib/sequences.ts`, `lib/automation-engine.ts`, `app/api/alerts/monitor/route.ts`, and `app/api/interventions/route.ts` all gate exclusively on `slackWebhookUrl`. Setting `notifSlack = true` without a webhook URL does nothing; setting `notifSlack = false` with a webhook URL does not suppress alerts. The flag is effectively decorative.

**Current state of the subscriber account:**
```
slackWebhookUrl: null
notifSlack: false
```
No Slack alerts have ever fired for this account.

---

## 5. Bottom line

**If a subscriber pasted their Slack webhook URL right now:**

| Path | Works | Notes |
|---|---|---|
| Hourly revenue/VIP alerts | **Yes** | Fires within the hour if any customer hits thresholds |
| Monthly digest | **No** | Cron sends GET, route exports POST only — never fires |
| Automation rule alerts | **Yes** | Requires subscriber to also create a rule with `send_slack` action |
| Sequence step alerts | **Yes** | Fire automatically as sequences progress |
| Critical intervention alerts | **Yes** | Fire automatically when intervention created |

Four out of five paths work. The monthly digest is silently broken and has never sent. The fix is one line: change `export async function POST()` to `export async function GET()` in `app/api/digest/generate/route.ts`, or add a GET export that calls the same logic. No credentials, no data, no migration needed — purely a method name bug.
