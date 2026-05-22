# ChurnGuard — Complete Product Overview
> For marketing, video scripts, and customer onboarding. Based on production code.
> Last updated: May 2026

---

## TABLE OF CONTENTS
1. [What ChurnGuard Is](#what-churnguard-is)
2. [All Features & Modules](#all-features--modules)
3. [Feature Deep-Dives](#feature-deep-dives)
4. [Integration Guide](#integration-guide)
5. [The Three Automation Engines](#the-three-automation-engines)
6. [Customer Journey End-to-End](#customer-journey-end-to-end)
7. [Pricing Model](#pricing-model)
8. [Example Scenarios](#example-scenarios)

---

## WHAT CHURNGUARD IS

ChurnGuard is an automated customer retention platform for SaaS companies. It monitors every customer's behavior in real time, scores their likelihood to cancel, and fires personalized retention campaigns automatically — before the customer reaches the cancel button.

**The core promise:** Connect your Stripe account in 2 minutes, and ChurnGuard will identify which customers are about to leave and automatically attempt to save them — without you doing anything manually.

**Key differentiator:** Zero-touch after setup. Once rules and playbooks are configured, the system runs 24/7 without requiring manual approval for any action.

---

## ALL FEATURES & MODULES

| Module | What it does |
|--------|-------------|
| **Dashboard** | Central command center showing Revenue at Risk, saved MRR, active automations, and AI-generated insights about your customer base |
| **Customers** | Full customer database with risk scores, MRR, and activity data — filterable by risk level |
| **Risk Scoring** | Deterministic algorithm that calculates a 0–100 churn risk score for every customer based on login activity, health score, and engagement |
| **Playbooks** | Pre-built or custom automation recipes that define what happens when a customer crosses a risk threshold |
| **Interventions** | Log of every retention action taken (emails sent, calls scheduled, Slack alerts fired) with outcome tracking |
| **Automation Rules** | Custom trigger → action rules (e.g., "if payment fails → send SMS within 1 hour") |
| **Sequences** | Multi-step drip campaigns that run automatically over days or weeks |
| **Widget** | JavaScript snippet that embeds retention messages and offers directly in the client's own product |
| **Analytics** | Aggregated metrics on customers at risk, MRR saved, intervention success rate |
| **Integrations** | Connections to Stripe, HubSpot, Salesforce, Slack, Twilio, and Postmark |
| **Settings / Billing** | Account config, webhook management, API keys, and subscription management |
| **Free Audit Tool** | Public-facing tool at /audit — any SaaS founder pastes their Stripe key and gets an instant churn analysis (lead magnet) |
| **Admin Tools** | Internal tooling for formula debugging, integration health monitoring, and email template management |

---

## FEATURE DEEP-DIVES

---

### 1. DASHBOARD

**Problem it solves:** SaaS founders open their metrics tool each morning and don't know which customers are about to cancel. The dashboard converts raw data into an immediate "here's what needs your attention" view.

**What users see:**

**Four stat cards across the top:**
- **Total Customers** — count of all tracked accounts
- **Revenue at Risk** — dollar amount of MRR at risk of churning. If Stripe is connected, this pulls live data (past-due + paused subscriptions + trials expiring within 7 days). If not connected, it falls back to engagement-based risk (MRR of customers with a risk score ≥ 70). Both numbers display simultaneously when Stripe is connected.
- **Active Automations** — count of automation rules currently active
- **MRR Saved** — cumulative MRR recovered through interventions

**Customer Growth Chart:** 30-day bar chart showing customer count per day with hover tooltips.

**AI Insights Panel:** Auto-generated actionable callouts:
- "4 customers at high risk" → links to filtered customer list
- "6 customers haven't logged in for 7+ days" → direct action link
- "MRR grew by 12% this week" → links to analytics
- "High Risk Alert playbook saved 2 customers this week" → links to playbooks
- Each insight shows time elapsed (e.g., "5h ago") and a "View details" link

**AI Risk Analysis Section:** A persistent section showing up to the top 5 high-risk customers (risk score ≥ 60) with their AI-generated risk reason, MRR, and a "Re-analyze" option. A "Run AI Analysis Now" button triggers a batch OpenAI analysis of all customers to refresh risk reasons.

**Backend:** Dashboard calls `/api/dashboard/stats` (returns aggregated DB counts), `/api/stripe/snapshot` (if Stripe connected, calls live Stripe API), and `/api/automation/rules` (active rule count).

---

### 2. CUSTOMERS

**Problem it solves:** Customer success teams need to know who's at risk right now, ranked by urgency and revenue impact.

**User interaction:**
- View all customers in a table: Name/Email, Risk Score (color-coded badge), MRR, ARR, Created date
- Toggle between "All Customers" and "High Risk Only" (risk score ≥ 70)
- Stats bar shows total count, high-risk count, combined MRR at a glance
- Click any customer → individual detail page
- Add customers manually via "+ Add Customer"

**Risk score badges:**
- 🔴 70–100: CRITICAL
- 🟠 40–69: HIGH
- 🟡 20–39: MEDIUM
- 🟢 0–19: LOW

**Individual customer page** shows full timeline: login history, interventions run, risk score history, linked sequences, MRR, plan, and health score. Every action taken on that customer is logged chronologically.

---

### 3. RISK SCORING

**Problem it solves:** "Which customers are about to cancel?" is an impossible question to answer manually across hundreds of accounts. Risk scoring gives every customer a single number that reflects their true churn likelihood.

**The formula (deterministic — same inputs always produce the same score):**

```
Total Risk Score = Login Points + Health Points + Activity Points

Login Points (0–45):
  → Calculated from days since last login, capped at 30 days
  → Formula: (min(daysSinceLogin, 30) / 30) × 45
  → Never logged in = 45 points (maximum)

Health Points (0–30):
  → Inverted from the customer's health score (0–100)
  → Formula: ((100 - healthScore) / 100) × 30
  → healthScore of 100 = 0 risk points; healthScore of 0 = 30 risk points

Activity Points (0–25):
  → Based on login count this calendar month
  → 0 logins this month = 25 points
  → 1–2 logins = 12 points
  → 3+ logins = 0 points

Final score clamped to 0–100.
```

**What each range means:**
- **70–100 (CRITICAL):** Customer is highly likely to cancel. Immediate intervention recommended.
- **40–69 (HIGH):** Significant warning signs. Sequence enrollment recommended.
- **20–39 (MEDIUM):** Below-average engagement. Monitor closely.
- **0–19 (LOW):** Healthy, actively using the product.

**Data sources for scoring:**
- `lastLoginAt` — set by Stripe sync, CRM sync, or the JavaScript tracking API (`POST /api/track`)
- `healthScore` — synced from HubSpot/Salesforce, or set manually
- `loginCountThisMonth` — incremented by event tracking

**When scores update:** Scores recalculate on every CRM sync, Stripe webhook event, and when the admin runs "Re-analyze" from the dashboard. The automation cron also triggers re-scoring before evaluating rules.

---

### 4. PLAYBOOKS

**Problem it solves:** Every SaaS has the same churn patterns. Playbooks encode the response to those patterns once, so they fire automatically every time without manual intervention.

**What a playbook is:** A named recipe with a trigger condition and a set of actions. When the trigger fires for a customer, the actions execute immediately.

**Trigger types:**
- Risk Score threshold (e.g., ≥ 80)
- Days since last login
- Payment status (failed, past_due)
- Feature abandonment
- MRR value threshold
- Plan type
- Trial ending soon
- No activity for N days

**Pre-built playbook templates:**
1. **High Risk Alert** — When risk score ≥ 80 → send Slack alert to team channel
2. **Payment Recovery** — When payment fails → send recovery email within 1 hour
3. **Re-engagement Sequence** — When feature abandoned 14+ days → enroll in risk_retention sequence
4. **Critical Escalation** — When risk ≥ 75 AND MRR ≥ $500 → escalate to human (CSM flag)

**User workflow:**
1. Open Playbooks page → see all active/inactive playbooks
2. Click "+ New Playbook" or use a template
3. Set trigger type and threshold
4. Choose action (email, Slack, sequence, SMS)
5. Toggle Active — it's live immediately

**Execution:** The Playbook Engine (cron, every 6 hours) scans all active playbooks, evaluates every customer against each trigger condition, and fires actions for matches. Results are logged in InterventionOutcome.

---

### 5. INTERVENTIONS

**Problem it solves:** "Did our outreach actually save this customer?" Interventions close the loop by tracking whether each retention action resulted in a save or a churn.

**What an intervention is:** A record of a specific retention action taken on a specific customer, with a lifecycle that resolves to either "saved" or "churned."

**Status lifecycle:**
```
pending → active → saved (customer paid / re-engaged)
                → churned (7 days elapsed with no resolution)
```

**Intervention types:**
- `manual_outreach` — General customer contact
- `success_call` — Scheduled success/support call
- `high_priority_call` — Urgent CSM call (auto-created by dunning sequence)
- `critical_call_required` — Highest urgency escalation (auto-created for VIP at-risk customers)

**What the Interventions dashboard shows:**
- List of all interventions with customer, type, status, MRR at risk, and risk score at time of trigger
- Status filter: All / Pending / Active / Saved / Churned
- "+ New Intervention" for manual creation (executes immediately — sends email, SMS if critical type, Slack if configured)
- Clicking an intervention shows: channels used (email ✓, SMS ✓, Slack ✓), execution log, and outcome (MRR saved or lost)

**Auto-resolution:** The Intervention cron (hourly) checks all `active` interventions. If a payment event fires (`invoice.payment_succeeded`) → marks as `saved`, MRR credited to saved total. If 7 days pass with no resolution → marks as `churned`, MRR counted as lost.

---

### 6. AUTOMATION RULES

**Problem it solves:** Every business has unique thresholds for what constitutes "at risk." Automation Rules let you define your own triggers and responses without code.

**A rule has three parts:**
1. **Trigger type** — what condition to watch
2. **Condition** — the threshold or value (e.g., `riskScore >= 80`)
3. **Action** — what to do when matched

**All trigger types:**

| Trigger | Example condition |
|---------|------------------|
| `risk_threshold` | riskScore ≥ 80 |
| `payment_failed` | paymentStatus == "failed" |
| `feature_abandonment` | featureUsed not used for 14 days |
| `days_since_login` | daysSinceLogin > 7 |
| `mrr_value` | mrrValue ≥ 500 |
| `plan_type` | planType == "Pro" |
| `payment_status` | paymentStatus == "past_due" |
| `account_age` | accountAge > 90 days |
| `feature_not_used` | specific feature never used |
| `support_tickets` | supportTickets > 3 |
| `trial_ending` | trial ends in ≤ 3 days |
| `no_activity` | no activity for 30 days |

**All action types:**

| Action | What happens |
|--------|-------------|
| `send_email` | Sends email immediately via Postmark |
| `send_slack` | Posts to configured Slack webhook |
| `send_sms` | Sends SMS via Twilio |
| `create_intervention` | Creates an intervention record (tracked) |
| `escalate_to_human` | Sets customer.csmStatus = critical_call_required |
| `trigger_sequence` | Enrolls customer in a multi-step sequence |

**Cooldown system:** Each trigger type has a minimum re-fire interval to prevent spam:
- payment_failed: 1 hour minimum between fires
- risk_threshold: 24 hours
- days_since_login: 24 hours
- feature_abandonment: 48 hours
- no_activity: 48 hours
- account_age: 168 hours (7 days)

---

### 7. SEQUENCES

**Problem it solves:** A single email rarely saves a churning customer. Sequences apply pressure across multiple touchpoints over days, adapting based on customer response.

**What a sequence is:** A multi-step campaign where each step fires at a scheduled time after enrollment. Steps can send email, SMS, Slack, or create interventions. If a customer re-engages (logs in, pays), the sequence can auto-complete early.

**All 9 sequence types:**

**DUNNING** — For payment failures
- Hour 0: "Action required: Your payment failed" email
- Hour 72 (Day 3): SMS reminder if payment still unresolved (skipped if no phone number on file)
- Hour 168 (Day 7): Creates a `high_priority_call` intervention → marks sequence complete

**RISK_RETENTION** — For customers with risk score ≥ 80
- Hour 0: AI-personalized retention email (generated by GPT-4o-mini, unique per customer)
- Hour 48 (Day 2): If customer hasn't logged in since enrollment → Slack alert to team
- Hour 168 (Day 7): Mark customer `critical_call_required`, boost risk score to 95+, create intervention → sequence complete

**WELCOME** — For newly added customers
- Hour 0: Welcome email with onboarding steps
- Hour 72 (Day 3): If no CRM integration connected → "Connect your first integration" nudge email
- Hour 168 (Day 7): "Understanding your risk scores" explainer email → sequence complete

**VIP_EARLY_WARNING** — For high-MRR customers showing risk signals
- Hour 0: Personal email to customer + Slack alert to team
- Hour 24 (Day 1): If no login since enrollment → creates `success_call` intervention
- Hour 72 (Day 3): If still no login → escalates to `critical_call_required`, risk score set to 90+ → sequence complete

**NEW_CUSTOMER_RESCUE** — For new signups not engaging
- Hour 0: "Let's make sure you're getting started" email
- Hour 72 (Day 3): If no login → offer free 15-minute setup call
- Hour 168 (Day 7): If still no activity → creates `manual_outreach` intervention → sequence complete

**WIN_BACK** — For churned customers
- Hour 0: "We miss you" email with 40% discount offer
- Hour 168 (Day 7): Follow-up with social proof + offer expires warning
- Hour 336 (Day 14): Final "Discount expires today" email → sequence complete

**DOWNGRADE_PREVENTION** — When customer initiates a downgrade
- Hour 0: "Before you downgrade — let us help" email offering:
  - 3 months at 25% off
  - Free strategy call
  - Switch to annual billing (20% off)
- Hour 72 (Day 3): Slack team alert to follow up → sequence complete

**SUPPORT_FOLLOWUP** — For customers with high support ticket volume
- Hour 0: "Following up on your support experience" check-in email
- Hour 48 (Day 2): If no login since email → Slack team alert (skipped if no webhook)
- Hour 168 (Day 7): If still no engagement → creates `manual_outreach` intervention → sequence complete

**How enrollment works:** Any automation rule or playbook can trigger `enrollInSequence(userId, customerId, sequenceType)`. The Sequence Engine cron (hourly) then processes all active enrollments and fires the next step when its scheduled time arrives. Steps fire based on absolute time from enrollment start — each step has a hardcoded hour offset from `startedAt`.

---

### 8. WIDGET

**Problem it solves:** The best time to save a churning customer is while they're still inside your product. The widget displays retention messages and offers in real time without requiring the customer to contact support.

**How it works:** One JavaScript snippet added to the client's app. ChurnGuard loads customer data via the API key and can display targeted messages, offers, or prompts based on the customer's risk profile.

**Installation (three methods):**

```html
<!-- Method 1: Standard HTML — paste before </body> on every page -->
<script src="https://churnguardapp.com/widget.js"></script>
<script>
  ChurnGuard.init({
    apiKey: 'YOUR_API_KEY',        // from ChurnGuard → Settings → API Keys
    customerId: 'USER_ID_FROM_YOUR_APP'  // your app's user identifier
  });
</script>
```

```javascript
// Method 2: React — in a top-level component
useEffect(() => {
  if (window.ChurnGuard && currentUser?.id) {
    window.ChurnGuard.init({
      apiKey: 'YOUR_API_KEY',
      customerId: currentUser.id
    });
  }
}, [currentUser]);
```

```bash
# Method 3: NPM package
npm install @churnguard/widget
```
```javascript
import { ChurnGuard } from '@churnguard/widget';
ChurnGuard.init({ apiKey: 'YOUR_API_KEY', customerId: userId });
```

**Widget Messages:** Configured from ChurnGuard dashboard → Widget Messages. Each message has:
- Trigger conditions (show after X days inactive, show when risk score is high, etc.)
- Content (title, body, CTA button)
- Delivery timing and frequency cap

The widget is invisible until a trigger condition is met, then displays a non-intrusive message or offer to the end-user inside their own app.

---

### 9. ANALYTICS

**Problem it solves:** "Is ChurnGuard actually working?" Analytics gives a single source of truth on retention outcomes.

**Four core metrics:**

**Total Customers**
- Live count of all tracked customers
- Drilldown: full customer table with risk, MRR, created date

**Revenue at Risk**
- Sum of MRR for all customers with risk score ≥ 70
- Only counts verified risk, never estimates
- Drilldown: high-risk customer list with MRR and plan

**MRR Saved**
- Sum of `mrrSaved` from all interventions where `status = "saved"`
- Only counts verified outcomes — a payment that was actually recovered
- Drilldown: per-intervention breakdown (customer, type, amount saved)

**Success Rate**
- `(Successful interventions ÷ Total completed interventions) × 100%`
- Successful = status "saved"; Total = saved + churned (excludes still-pending)
- Drilldown: all interventions with outcomes listed

**Modal drilldowns:** Clicking any stat card opens a detailed modal showing the data source, calculation methodology, and a sortable table of the underlying records.

---

### 10. FREE AUDIT TOOL (public-facing lead magnet)

**Who this is for:** Potential customers who haven't signed up yet. It's a free, no-account-required tool at `/audit`.

**How it works:**

**Step 1:** Enter a Stripe secret key (read-only recommended) OR upload a customer CSV file (columns: email, mrr, status, days_inactive)

**Step 2:** 10-second analysis with animated progress through 7 steps

**Step 3 (Email Gate):** The analysis is complete, but results are blurred. User sees a locked preview of the 3 metric cards. Enters work email to unlock.

**Step 4 (Results):** Full report showing:
- Monthly churn rate with industry benchmark bar (Elite 0% → Avg 2% → Danger 5% → Critical 10%+)
- Revenue at risk (MRR at risk right now)
- Annualized revenue loss (if churn rate stays the same)
- Industry percentile (e.g., "Bottom 23%")
- Up to 5 highest-risk customers with name/email, MRR, urgency level, and reason
- "Download My Churn Report" button → generates branded PDF (jsPDF) with all metrics, benchmark bar, at-risk customer table, and 4 recommended actions

**Backend:** Stripe key is used only for the analysis, never stored. Results are calculated server-side and stored in the `AuditLead` table for follow-up email sequence. Lead is enrolled in a 4-email nurture sequence automatically.

---

## INTEGRATION GUIDE

---

### A. STRIPE INTEGRATION

**What data ChurnGuard pulls from Stripe:**

| Data | How used |
|------|----------|
| Subscriptions (all statuses) | Calculates Revenue at Risk |
| Subscription status | active, past_due, trialing, paused, canceled |
| MRR per subscription | Displayed per customer, aggregated |
| Customer email | Matched to ChurnGuard customer records |
| Payment failures | Triggers dunning sequence |
| trial_end date | Identifies trials expiring within 7 days |

**Revenue at Risk formula (from Stripe):**
```
Revenue at Risk = (Past Due MRR × 1.0) + (Paused MRR × 0.6) + (Trials Expiring <7 days × 0.4)
```

This weights past-due as full risk (likely to churn), paused as 60% risk (might return), and expiring trials as 40% risk (may not convert).

**Webhook events ChurnGuard listens to:**
- `invoice.payment_succeeded` → marks intervention as "saved"
- `checkout.session.completed` → marks intervention as "saved"
- `customer.subscription.*` → triggers dunning or win-back sequences

**Webhook setup:**
1. In ChurnGuard → Integrations → Stripe → paste your Stripe Secret Key (sk_live_... or sk_test_...)
2. Copy the webhook URL: `https://churnguardapp.com/api/webhooks/stripe`
3. In Stripe Dashboard → Developers → Webhooks → Add endpoint → paste URL → select events: `payment_intent.payment_failed`, `invoice.payment_succeeded`, `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

**Permissions needed:** Any Stripe key with read access to subscriptions is sufficient. A restricted key is recommended.

**Sync frequency:** Webhook events are real-time. Dashboard Revenue at Risk number refreshes on each dashboard load by calling the Stripe API directly.

---

### B. CRM INTEGRATIONS (HubSpot & Salesforce)

**Direction:** Bi-directional sync — customer data flows from CRM into ChurnGuard, and ChurnGuard risk scores and intervention data flow back to CRM.

**What syncs FROM HubSpot/Salesforce INTO ChurnGuard:**
- Contact email (matched to customer record)
- `notes_last_contacted` / `LastActivityDate` → sets `lastLoginAt` in ChurnGuard
- Health score (if present on contact)

**What syncs FROM ChurnGuard INTO HubSpot/Salesforce:**
- Risk score updates
- Intervention outcomes
- Customer status changes

**HubSpot setup:**
1. ChurnGuard → Integrations → HubSpot → Connect
2. OAuth flow: Authorize ChurnGuard to read/write Contacts and Deals
3. First sync runs automatically; subsequent syncs run every 6 hours

**Salesforce setup:**
1. ChurnGuard → Integrations → Salesforce → Connect
2. OAuth flow: Authorize access to Contacts and Accounts
3. Same 6-hour sync schedule

**Sync frequency:** Every 6 hours via cron (`/api/cron/crm-sync`). Manual sync available from admin panel.

**Important note on timestamps:** HubSpot's `notes_last_contacted` field returns a Unix timestamp in milliseconds. ChurnGuard validates this value — timestamps before January 1, 2000 are rejected (HubSpot demo accounts sometimes return `"2026"` meaning 2026 milliseconds from epoch, which is 1970).

---

### C. MESSAGING INTEGRATIONS

#### Slack

**Setup:** ChurnGuard → Integrations → Slack → Paste Incoming Webhook URL
- Create webhook at: api.slack.com/apps → Your App → Incoming Webhooks → Activate → Add New Webhook to Workspace
- Select the channel (e.g., #retention, #csm-alerts)
- Paste the URL into ChurnGuard

**What gets sent to Slack:**
- Risk score alerts (when customer crosses threshold via automation rule)
- Sequence step alerts (e.g., VIP_EARLY_WARNING step 0 fires Slack alert)
- Playbook trigger notifications
- Critical escalation flags

**Alert format:** Each Slack message includes customer email/name, risk score, MRR at risk, and last login date. Attachments are color-coded: red = danger (risk > 70), yellow = warning.

**Channel:** Set to `#retention` by default; the webhook URL determines the channel.

#### Twilio / SMS

**What it requires:** Twilio account SID + Auth Token + From number (configured in environment variables). Customer must have a phone number stored in ChurnGuard (`customer.phone`).

**When SMS is sent:**
- Dunning sequence Step 1 (Day 3 after payment failure): SMS reminder
- Any automation rule with `send_sms` action
- Manual intervention of type `critical_call_required`

**Opt-in requirement:** ChurnGuard sends to numbers stored in the customer record. Your application is responsible for ensuring customers have consented to SMS communications per your jurisdiction's requirements (TCPA in the US, GDPR in the EU).

#### Postmark / Email

**Provider:** Postmark HTTP API (`https://api.postmarkapp.com/email`)

**From address:** Configured via `POSTMARK_FROM_EMAIL` and `POSTMARK_FROM_NAME` environment variables. Default: `ChurnGuard <admin@churnguardapp.com>`

**When email is sent:**
- All sequence steps that include email
- Any automation rule with `send_email` action
- Playbook actions
- Free audit tool results
- Trial email sequence (5 emails over 13 days)

**Deliverability:** All emails log to the `EmailLog` table with status (sent / failed / mock) and Postmark message ID for tracking. Failed sends are logged with the error message.

**Template management:** Admin panel at `/admin/email-templates` allows editing subject lines and HTML bodies for the trial email sequence without code deployment. Templates use `{{variableName}}` placeholders that are substituted at send time.

---

### D. WIDGET INTEGRATION

**What the widget does:** Shows in-product retention messages to your users at the right moment — when they're most at risk and still inside your app.

**Installation:** One-time, one code block. See installation code above (3 methods). The `customerId` should be whatever identifier your app uses for users (e.g., Stripe customer ID, internal user ID, email).

**How ChurnGuard identifies the customer:** The `customerId` passed to `ChurnGuard.init()` is matched against your customer records in ChurnGuard. The risk profile for that customer determines which messages (if any) are shown.

**Configuring widget messages:** Dashboard → Widget Messages → Create Message
- Set trigger: risk score threshold, days inactive, plan type, etc.
- Write the message title, body, and CTA button label + URL
- Set display frequency (once per session, once per day, etc.)
- Toggle active/inactive

**Where it appears:** The widget injects a small UI element into your app's DOM. It's designed to be non-intrusive — shown as a banner, modal, or slide-in depending on the configuration.

---

### E. API & WEBHOOKS

**Authentication:** All API calls use `Authorization: Bearer YOUR_API_KEY` header. API key is found at ChurnGuard → Settings → API Keys.

**Event tracking API:**
```bash
# Send a customer activity event
POST /api/track
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "customerId": "user_abc123",
  "event": "feature_used",
  "timestamp": 1716000000000
}
```

**Customer data API:**
```bash
# List all customers
GET /api/customers
Authorization: Bearer YOUR_API_KEY
```

**Outbound webhooks from ChurnGuard to your systems:**

Configure at: Settings → Webhooks → Add Endpoint

| Event | When it fires |
|-------|--------------|
| `customer.created` | New customer added to ChurnGuard |
| `customer.risk_changed` | Customer risk score changes |
| `customer.high_risk` | Customer crosses high-risk threshold |
| `intervention.started` | Retention action begins |
| `intervention.completed` | Retention action resolved |
| `customer.churned` | Customer confirmed churned |
| `customer.saved` | At-risk customer successfully retained |

Each webhook delivery includes a JSON payload with the customer record and event metadata. Test webhook button available in the UI.

---

## THE THREE AUTOMATION ENGINES

ChurnGuard runs three independent background engines that together make the system zero-touch.

---

### Engine 1: Automation Engine (every 15 minutes)

**File:** `lib/automation-engine.ts` called by `/api/cron/automation`

**What it does:**
1. Loads all active `AutomationRule` records for all users
2. For each rule, loads all customers for that user
3. Evaluates each customer against the rule's conditions
4. For any customer that matches AND hasn't fired within the cooldown window → executes the action

**Execution is immediate** — when a match is found, the action fires synchronously:
- `send_email` → Postmark API called now
- `send_slack` → Slack webhook called now
- `send_sms` → Twilio API called now
- `create_intervention` → DB record created, channels fired now
- `escalate_to_human` → customer.csmStatus updated now
- `trigger_sequence` → sequence enrollment created with `nextRunAt: now`

**Cooldown:** Each rule stores the last time it fired per customer. Won't re-fire until the cooldown period elapses (1h to 7d depending on trigger type).

---

### Engine 2: Sequence Engine (every hour)

**File:** `lib/sequences.ts` called by `/api/cron/sequences`

**What it does:**
1. Loads all `SequenceEnrollment` records where `status = "active"` and `nextRunAt ≤ now`
2. For each enrollment, determines which step is next
3. Executes that step (sends email, SMS, Slack, or creates intervention)
4. Updates `nextRunAt` to the timestamp of the following step
5. If the sequence is complete (all steps done), marks enrollment as complete

**Step timing is absolute** — calculated from `enrollment.startedAt`. If a customer is enrolled at 9am and step 1 is at +72h, it fires at 9am three days later regardless of when step 0 ran.

**Early exit:** If the customer resolves their situation (pays, logs in), the sequence can be marked complete early by the Intervention cron or Stripe webhook.

---

### Engine 3: Playbook Engine (every 6 hours)

**File:** `/api/cron/playbooks`

**What it does:**
1. Loads all active playbooks for all users
2. For each playbook, evaluates its trigger against all customers for that user
3. HIGH_RISK trigger: customers with risk score ≥ 70
4. CRITICAL_RISK trigger: customers with risk score ≥ 90
5. For matching customers → immediately sends email and/or Slack alert
6. Logs action to InterventionOutcome

**Frequency:** Every 6 hours (less frequent than the Automation Engine because playbooks are broader sweeps, not per-event triggers).

---

### How the three engines work together

**Example scenario:** A customer's payment fails at 2pm.

1. **Stripe webhook fires** at 2pm → immediately enrolls customer in `DUNNING` sequence
2. **Sequence Engine** (next hourly run, e.g., 3pm) → fires Step 0: sends "Your payment failed" email to customer
3. **Automation Engine** (every 15 min) → evaluates `payment_failed` rule → fires Slack alert to team at 2:15pm
4. **Sequence Engine** at Day 3 → fires Step 1: sends SMS reminder if payment still open
5. **Intervention cron** → checks hourly if payment came in → if yes, marks saved; if 7 days pass, marks churned
6. **Sequence Engine** at Day 7 → fires Step 2: creates `high_priority_call` intervention → sequence complete

---

## CUSTOMER JOURNEY END-TO-END

**Scenario: Acme Corp (a SaaS company) signs up for ChurnGuard**

### Step 1: Signup

Acme signs up via Clerk auth → redirected to `/dashboard`. On first load:
- Dashboard shows 0 customers, $0 revenue at risk
- Onboarding checklist appears: "Connect Stripe," "Add your first customers," "Activate a playbook"
- Trial email sequence starts — Day 0 welcome email fires within 1 hour

### Step 2: Connect Stripe (2 minutes)

Acme goes to Integrations → Stripe → pastes their `sk_live_...` API key → ChurnGuard validates against Stripe, saves, and immediately pulls all subscription data.

Dashboard now shows:
- Total customers (e.g., 287)
- Revenue at Risk: $12,400 (past-due subscriptions + paused + expiring trials)
- Industry benchmark comparison visible

### Step 3: Activate First Playbook (30 seconds)

Acme clicks Playbooks → activates "High Risk Alert" template (pre-configured: risk score ≥ 80 → Slack alert).

They also activate "Payment Recovery" (payment failed → email within 1 hour).

Playbooks toggle Active — no further configuration needed.

### Step 4: First At-Risk Customer Detected

6 hours later, the Playbook Engine runs. It finds 8 customers with risk score ≥ 80.

For each one:
- Slack message fires to Acme's #retention channel: "⚠️ Risk Alert — sarah@company.com (risk: 87, MRR: $499)"
- InterventionOutcome record created with status "pending"
- If payment_failed rule also matches → separate Slack alert fires from Automation Engine within 15 minutes

Acme sees 8 new interventions in their dashboard with customer details.

### Step 5: Customer Response Tracked

Customer "sarah@company.com" receives the automated payment recovery email from ChurnGuard (via Postmark). She clicks the link and updates her card. Stripe fires `invoice.payment_succeeded` webhook.

ChurnGuard receives webhook → finds the active intervention for sarah → marks it `saved` → credits $499 to Acme's "MRR Saved" total.

Dashboard now shows: MRR Saved: $499. Success Rate: 1/8 resolved (running total).

### Step 6: Ongoing (Zero-Touch)

From here, ChurnGuard runs silently:
- Every 15 minutes: Automation Engine checks all rules
- Every hour: Sequence Engine advances dunning/retention sequences
- Every 6 hours: Playbook Engine sweeps all customers
- Every hour: Intervention cron auto-resolves completed cases

Acme's team receives Slack alerts for critical situations. Everything else is automatic.

---

## PRICING MODEL

**Four tiers based on the MRR Acme is protecting:**

| Plan | Price | Protects up to | Breakeven ROI |
|------|-------|---------------|---------------|
| **Seed** | $79/month | $50,000 MRR | Save $79 worth of MRR (0.16% of protected base) |
| **Growth** | $149/month | $200,000 MRR | Save $149 worth of MRR (0.07% of protected base) |
| **Scale** | $299/month | $1,000,000 MRR | Save $299 worth of MRR (0.03% of protected base) |
| **Enterprise** | Custom | Unlimited | Custom |

**Growth plan features (most popular):**
- Unlimited customers tracked
- Slack command center (unlimited alerts)
- Advanced playbooks (up to 10 active)
- VIP customer alerts (customers > $500 MRR)
- 30-day risk forecasting
- Priority support
- 90-day data retention

**Scale plan adds:**
- Unlimited active playbooks
- Custom risk scoring models
- Advanced analytics & cohorts
- Team collaboration (up to 10 seats)
- Full API access
- Outbound webhooks
- 1-year data retention

**Enterprise adds:**
- White-glove onboarding
- Custom SLA guarantees
- Dedicated success manager
- SSO & advanced security
- Custom contracts
- Unlimited team seats
- Lifetime data retention

**Trial:** 14-day free trial. Automated trial email sequence keeps new users engaged:
- Day 0: Welcome + Connect Stripe CTA
- Day 3: Stripe connection reminder
- Day 7: Playbook activation walkthrough
- Day 10: Live Revenue at Risk number (pulled from their Stripe if connected)
- Day 13: Trial ending tomorrow — account summary + upgrade CTA

**Billing:** Managed via Stripe. Users click "Upgrade" → redirected to Stripe Checkout → subscription created. Plan management (pause, cancel, update card) available at Settings → Billing via Stripe Customer Portal. Enterprise contacts sales@churnguard.io.

---

## EXAMPLE SCENARIOS

### "The Silent Quitter"
A customer pays their $200/month subscription but hasn't logged in for 35 days. Their risk score calculates to 73 (HIGH).

What happens automatically:
1. Automation Engine (every 15 min) evaluates your `no_activity` rule (no activity for 30 days → enroll in risk_retention sequence)
2. Customer enrolled in RISK_RETENTION sequence
3. Hour 0: GPT-4o-mini generates a personalized email referencing their specific plan and usage patterns → Postmark sends it
4. Hour 48: No login detected → Slack alert fires to your team: "Customer has not logged in since outreach"
5. Hour 168 (Day 7): Risk score boosted to 95, `critical_call_required` intervention created, sequence complete

Your team now has a concrete action item to call the customer.

---

### "The Failed Payment"
A $750/month customer's credit card expires. Stripe fires `payment_failed`.

What happens automatically:
1. Stripe webhook received by ChurnGuard immediately
2. Customer enrolled in DUNNING sequence
3. Your `payment_failed` Automation Rule fires within 15 minutes → Slack alert to #finance: "💳 Payment Failed — customer@example.com, MRR: $750"
4. Hour 0 (Sequence Engine): "Action required: Your payment failed" email sent with payment update link
5. Hour 72 (Day 3): Payment still open → SMS sent to customer: "Hi, your ChurnGuard payment is past due..."
6. Hour 168 (Day 7): `high_priority_call` intervention created → your CSM receives notification to call

If customer pays at any point: Stripe webhook `payment_succeeded` → ChurnGuard marks intervention saved, $750 credited to MRR Saved. Sequence ends.

---

### "The Downgrade Request"
A customer emails support that they want to downgrade. You manually create a `manual_outreach` intervention in ChurnGuard and enroll them in DOWNGRADE_PREVENTION sequence.

Hour 0: Customer receives email offering three alternatives:
- 3 months at 25% off their current plan
- Free 30-minute strategy call
- Switch to annual billing (20% discount)

Hour 72: Slack alert fires to your team to follow up with a personal call.

If the customer stays: Mark intervention `saved` manually in dashboard. MRR saved is credited to your retention metrics.

---

### "The Free Audit Convert"
A SaaS founder pastes their Stripe key into churnguardapp.com/audit. They see their churn rate is 6.2% (bottom 18% of SaaS companies) and $47,000/year in projected revenue loss.

They enter their email to unlock the full report.

ChurnGuard:
1. Saves them as an AuditLead
2. Immediately sends Email 1: their full churn report with breakdown
3. Day 2: Email 2 with social proof ("SaaS companies like yours save $X with ChurnGuard")
4. Day 5: Email 3 with the math — "At 6.2% churn, you'll lose $47K this year. ChurnGuard costs $149/month."
5. Day 7: Email 4 — last call with a direct CTA to sign up

If they sign up during this window, the AuditLead sequence stops automatically (converted users are excluded from the drip).

---

## ADMIN TOOLS (Internal)

Available only to the admin account (najwa.saadi1@hotmail.com).

**Calc Audit (`/admin/calc-audit`):** Select any account and any customer to see the exact risk score formula breakdown — login points, health points, activity points, and a mismatch flag if the stored score diverges from the recalculated score by more than 15 points. Used to debug scoring anomalies.

**Integration Health (`/admin/integrations`):** Live view of all email sends (Postmark status, recent logs), Slack alerts fired, CRM sync logs, and Stripe webhook events. Used to diagnose delivery failures.

**Email Templates (`/admin/email-templates`):** Edit the subject line and HTML body of any of the 5 trial email sequence emails without a code deployment. Templates support `{{variableName}}` variables. Live HTML preview renders in an iframe. Send Test button dispatches to any email with sample data.

---

*This document reflects the production codebase as of May 2026. All thresholds, formulas, schedules, and feature descriptions are derived directly from the source code.*
