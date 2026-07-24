# ChurnGuard Diagnostic Report
Date: 2026-07-24

---

## 1. Risk Formula — exact scoring function and inputs

**File:** `lib/risk-formula.ts:19–42`

```ts
export function computeRiskScore(input: FormulaInput): FormulaResult {
  const msPerDay = 1000 * 60 * 60 * 24;

  const daysSinceLogin: number | null = input.lastLoginAt
    ? Math.floor((Date.now() - new Date(input.lastLoginAt).getTime()) / msPerDay)
    : null;

  // 45 pts max — login recency, capped at 30 days (beyond 30 = full 45 pts)
  const loginDays = daysSinceLogin ?? 999;
  const cappedDays = Math.min(loginDays, 30);
  const loginPts = Math.round((cappedDays / 30) * 45);

  // 30 pts max — inverted health score
  const health = input.healthScore ?? 100;
  const healthPts = Math.round(((100 - health) / 100) * 30);

  // 25 pts max — login frequency this month
  const logins = input.loginCountThisMonth ?? 0;
  const activityPts = logins === 0 ? 25 : logins < 3 ? 12 : 0;

  const score = Math.min(100, Math.max(0, loginPts + healthPts + activityPts));

  return { daysSinceLogin, loginPts, healthPts, activityPts, score };
}
```

**Inputs:** Three only.

| Input | Type | Max pts |
|---|---|---|
| `lastLoginAt` | `Date \| null` | 45 |
| `healthScore` | `number \| null` | 30 |
| `loginCountThisMonth` | `number` | 25 |

**Do payment failures, MRR, plan changes, or any Stripe billing signal affect the numeric score?**

**No.**

The Stripe webhook (`app/api/webhooks/stripe/route.ts:57`) handles `invoice.payment_failed` by recording an Event row and firing automation rules — but it never writes to `lastLoginAt`, `healthScore`, or `loginCountThisMonth`. Those three fields are the only inputs the formula reads. Stripe billing data is visible in the AI's qualitative narrative (`lib/risk-analyzer.ts`) but has zero effect on the number.

---

## 2. healthScore — where it's written, what computes it, default state

**Schema:** `prisma/schema.prisma` — `healthScore Int? @default(100)` (nullable).

**Where it is written:**

There are exactly three customer creation paths. None of them set `healthScore` explicitly:

- `app/api/customers/route.ts:59` — manual customer creation: no `healthScore` in data block → DB default
- `app/api/track/route.ts:33` — widget-triggered customer creation: no `healthScore` in data block → DB default
- `lib/crm/hubspot.ts:316` — new customer from HubSpot pull: no `healthScore` in data block → DB default

HubSpot **push** (`lib/crm/hubspot.ts:360`) sends ChurnGuard's stored `healthScore` to a HubSpot contact property (`churnguard_health_score`). It does not receive health data back — there is no property being pulled from HubSpot into `healthScore`.

The only code that modifies `healthScore` after creation is:
- `app/api/admin/fix-crm-scores/route.ts:47` — admin one-time tool that sets `healthScore: null` (a cleanup, not a computation)

**Nothing computes healthScore automatically.** There is no cron job, no CRM field, no webhook that writes a meaningful value into it.

**Value for a customer created today with no activity:**

The DB `@default(100)` stores `100` on creation (not `null`, despite no explicit value in the `create` call — Prisma applies the schema default). The formula then computes: `health = 100` → `healthPts = Math.round(((100 - 100) / 100) * 30) = 0`. Zero risk contribution. Every new customer starts with healthPts = 0 and it stays there unless something manually changes `healthScore`.

**Bad news:** The 30 health-score points are effectively dead weight for any account that doesn't manually update this field or connect a CRM that populates it. That's most accounts.

---

## 3. Stripe-only customer simulation

Customer connected via Stripe, never installed the widget. No CRM. Created today.

| Input | Value | Reason |
|---|---|---|
| `lastLoginAt` | `null` | No widget → no login events tracked |
| `loginCountThisMonth` | `0` | No widget → no login events tracked |
| `healthScore` | DB default `100` | Nothing sets it |

Formula output:
- `daysSinceLogin = null` → `loginDays = 999` → `cappedDays = 30` → `loginPts = 45` **(maximum)**
- `logins = 0` → `activityPts = 25` **(maximum)**
- `health = 100` → `healthPts = 0`
- **Score = 70/100 immediately on creation**

**Is it meaningful?** No. The score is maxed out on the two login-dependent components (70 out of a possible 70 from those components) despite having absolutely no engagement signal. Every Stripe-only customer scores 70 with no variance. The number tells the product owner nothing about actual churn risk — it just reflects the absence of widget data.

This is a structural gap in the product: connecting Stripe alone is marketed as the quickest path to a score, but the score produced is a constant with no information value.

---

## 4. DEMO_STATS — when it renders, what new accounts see

**File:** `app/dashboard/page.tsx:14–27` (data) and lines 90–101 (state logic)

```ts
// line 90
const [demoMode, setDemoMode] = useState(false);

// line 95–97 — reads from localStorage on mount
useEffect(() => {
  setDemoMode(localStorage.getItem('cg_demo_mode') === 'true');
}, []);

// line 98–101 — writes to localStorage on every toggle
useEffect(() => {
  localStorage.setItem('cg_demo_mode', demoMode ? 'true' : 'false');
  if (demoMode) generateDailyData([]);
}, [demoMode]);
```

**Conditions for DEMO_STATS to render:**

`localStorage.getItem('cg_demo_mode')` must equal the string `'true'`. This only happens if the user has previously clicked the "Demo Mode" toggle button in the dashboard (line 368). The button sets `demoMode` to `true`, which triggers the second `useEffect`, which writes `'true'` to localStorage. On subsequent visits, the first `useEffect` reads it back and restores the state.

**What a brand-new account sees on first login:**

Real empty state. `localStorage.getItem('cg_demo_mode')` returns `null` on a fresh browser. `null === 'true'` is `false`. `demoMode` stays `false`. All stats render from real API data: 0 customers, $0 MRR saved, 0 automations.

Demo data is only visible after the user explicitly clicks the "Demo Mode" button. It is not shown by default to anyone.

---

## 5. Cancel-flow — intercept vs reactive

**There is a cancel intercept at the billing settings page level.**

**File:** `app/settings/billing/page.tsx:365–491`

The "Cancel Subscription" button (`line 368`) does **not** go straight to the Stripe billing portal. It sets `showCancelModal(true)`, which opens a confirmation modal with two options:

1. **"Pause for 30 days instead"** (highlighted, marked "Recommended") — calls `handlePause()`, which pauses the Stripe subscription via API. Shows a success state in the same modal.
2. **"Continue to cancel →"** — calls `openPortal()`, which redirects the user to the Stripe billing portal at `/api/stripe/portal-session`.

**The good news:** There is a real intercept with a pause offer before the user reaches Stripe.

**The bad news (three gaps):**

1. This intercept only fires if the user cancels through the in-app billing settings page. Users who go directly to Stripe's customer portal (e.g. from a payment email receipt) bypass it entirely.

2. The Stripe webhook (`app/api/webhooks/stripe/route.ts:87`) handles `customer.subscription.deleted` purely reactively — it marks the platform subscription as cancelled and the customer record as `plan: 'cancelled'`. There is no pre-cancel hook, no Stripe subscription schedule, no grace-period logic.

3. There is no exit-intent trigger anywhere else in the product — no signal that fires when a user visits the billing page, no proactive outreach when high-risk customers are detected.

---

## 6. robots.ts and noindex coverage

**`app/robots.ts`:**

```ts
rules: [{
  userAgent: '*',
  allow: '/',
  disallow: [
    '/dashboard/',
    '/api/',
    '/admin/',
    '/signout',
    '/widget-demo/',
    '/widget-install/',
    '/widget-messages/',
    '/widget-test/',
  ],
}],
sitemap: 'https://churnguardapp.com/sitemap.xml'
```

**Pages carrying `robots: { index: false, follow: false }` metadata:**

| File | Route |
|---|---|
| `app/widget-install/layout.tsx:4` | `/widget-install/*` |
| `app/widget-demo/layout.tsx:4` | `/widget-demo/*` |

**Pages with explicit `index: true`:**

| File | Route |
|---|---|
| `app/layout.tsx:60` | Global default (all pages inherit this) |
| `app/page.tsx:34` | `/` (homepage, explicit override) |
| `app/blog/page.tsx:23` | `/blog` |
| `app/blog/[slug]/page.tsx:43` | `/blog/*` |

**Sitemap (`app/sitemap.ts`):**

Static routes submitted: `/`, `/pricing`, `/blog`, `/audit`, `/docs`, `/privacy`, `/terms`, plus all blog posts.

No noindexed page appears in the sitemap. Coverage is clean on that axis.

**Missing from sitemap (pages that exist and are crawlable but not submitted):**

| Route | File |
|---|---|
| `/about` | `app/about/page.tsx` |
| `/book-demo` | `app/book-demo/page.tsx` |
| `/signup` | `app/signup/page.tsx` |

All three pages exist on disk. None carry a noindex tag (they inherit the global `index: true` from `app/layout.tsx`). They are crawlable but Google has no authoritative signal to prioritise them — no sitemap entry, no explicit canonical.

`/signup` is likely intentional (Clerk handles it; no SEO value). `/about` and `/book-demo` are probably worth adding to the sitemap.
