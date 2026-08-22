# ChurnGuard Stripe App — Marketplace Rejection Audit

**App ID:** `com.churnguard.risk-monitor`  
**Version audited:** 0.0.6  
**Date:** 2026-07-29  
**Purpose:** Read-only audit to understand the submitted app before fixing the listing rejection.

---

## 1. Integration Type

### What exists in the codebase

There is **one integration type only: a Stripe App** (`ui_extension`). There is no Connect Extension.

The manifest field `"extensions": null` is explicit. There is no `stripe-extensions.json`, no OAuth connect flow for merchant onboarding, and no cross-account data access pattern anywhere in the codebase. The phrase "Connect Extension" does not appear in any source file.

### The manifest (`stripe-app/stripe-app.json`) — full contents

```json
{
  "$schema": "https://stripe.com/stripe-app.schema.json",
  "id": "com.churnguard.risk-monitor",
  "name": "ChurnGuard",
  "version": "0.0.6",
  "icon": "./public/icon.png",
  "ui_extension": {
    "views": [
      {
        "viewport": "stripe.dashboard.home.overview",
        "component": "App"
      },
      {
        "viewport": "stripe.dashboard.customer.detail",
        "component": "CustomerDetailView"
      }
    ],
    "content_security_policy": {
      "connect-src": ["https://churnguardapp.com/api/"],
      "purpose": "ChurnGuard backend API for AI-powered churn risk scores and retention data"
    }
  },
  "extensions": null,
  "permissions": [
    {
      "permission": "customer_read",
      "purpose": "Identify customers at risk of churning based on their profile and payment history"
    },
    {
      "permission": "subscription_read",
      "purpose": "Detect past-due, cancelling, and at-risk subscriptions"
    },
    {
      "permission": "charge_read",
      "purpose": "Calculate churn risk from failed and missing payment attempts"
    }
  ],
  "post_install_action": {
    "type": "external",
    "url": "https://churnguardapp.com/stripe-app/install"
  },
  "constants": {
    "API_BASE": "https://churnguardapp.com/api/stripe-app"
  },
  "distribution_type": "public"
}
```

### What was submitted as version 0.0.6

The Stripe App (`ui_extension`) was submitted. The listing's key feature images showing "Connect Extension" UI are therefore wrong — they depict a different product or an older prototype. The submitted app has no Connect Extension at all.

---

## 2. What the App Actually Shows

### Panel components and their files

| View | Viewport | File |
|---|---|---|
| Home overview | `stripe.dashboard.home.overview` | `stripe-app/src/views/App.tsx` (360 lines) |
| Customer detail | `stripe.dashboard.customer.detail` | `stripe-app/src/views/CustomerDetailView.tsx` (238 lines) |

Shared scoring logic: `stripe-app/src/utils/riskScoring.ts` (113 lines)

---

### View 1 — Home Overview (`App.tsx`)

A reviewer visiting the Stripe Dashboard home sees a side panel with this layout (top to bottom):

**Banner (conditional):**
- If no subscriptions exist: yellow caution banner — "No subscriptions found — Showing sample data so you can explore the UI."
- If in test mode with real data: yellow caution banner — "Showing test data. Switch to live mode to see real customer risk."

**Summary stats row — three equal-width tiles:**
| Tile | Label | Value |
|---|---|---|
| 1 | At Risk | Count of customers with score ≥ 40 |
| 2 | High Risk | Count of customers with score ≥ 70 |
| 3 | MRR Risk | Sum of MRR for all at-risk customers, formatted as `$1.2k` |

**Divider**

**"Customer Risk Scores" subheading** with a count badge (or "Demo data" warning badge), and a small "Demo Mode" / "Exit Demo" toggle button.

**Customer list — card per customer, up to 8 shown by default:**

Each card has two rows:
- Row 1: customer name (truncated to 24 chars) + email (truncated to 30 chars) on the left; risk badge on the right showing numeric score and level (e.g., `92 High` in red, `61 Med` in yellow, `23 Low` in green)
- Row 2: subscription status badge (Active/Past Due/Cancelling/Trial/etc.) + compact MRR (e.g., `$299/mo`) + days since last payment (e.g., `· 67d ago`)

If more than 8 customers: "Show all N customers" button below the list.

**Divider**

**Footer CTA (one of two states):**
- If ChurnGuard account is linked: `Open full ChurnGuard dashboard →` (external link to `https://churnguardapp.com/dashboard?source=stripe_app`)
- If not linked: a caption ("N high-risk customers — automate retention with ChurnGuard.") + a primary "Start Free Trial" button linking to `/signup` with `stripe_account_id` and OAuth state params

---

### View 2 — Customer Detail (`CustomerDetailView.tsx`)

A reviewer clicking any customer in the Stripe Dashboard sees a panel with:

**Header row:** "ChurnGuard Risk" heading + risk badge (e.g., `87/100 — High Risk` in red)

**Stats row — three equal-width tiles:** Subscription status badge | MRR in dollars | Last Payment (days ago or `—`)

**Risk Factors section** (if any exist), shown as a numbered list with colored badges:
- Examples: "Subscription is past due", "Cancellation scheduled at period end", "2 failed payment attempts", "No successful payment in the past 30 days"

**Divider**

**CTA section:**
- Personalized copy: "Prevent [Customer Name] from churning — ChurnGuard sends automated retention messages the moment risk signals appear."
- Primary button: "Prevent Churn — Start Free Trial" (links to `/signup` with `stripe_account_id` and `customer_id`)
- Secondary link: "See all ChurnGuard plans →"

---

### Does the panel deliver value without clicking the external link?

**Yes.** Both views compute and display complete risk data directly from the Stripe API — scores, factors, MRR, subscription status, days since payment — without requiring any ChurnGuard account or clicking the CTA. The external link is supplemental (full dashboard access for linked accounts). A reviewer who never clicks anything still sees a fully functional churn risk panel.

---

## 3. Auth & Data

### Authentication approach

**The app uses the Restricted API Key (RAK) pattern**, which is the standard Stripe Apps auth mechanism.

- `STRIPE_API_KEY` is imported from `@stripe/ui-extension-sdk/http_client`. This is not a secret — it is the SDK-provided token scoped to the installing merchant's account, automatically granted at install based on the permissions in the manifest.
- Both panel components instantiate a Stripe client with this key:
  ```ts
  const stripe = new Stripe(STRIPE_API_KEY, {
    httpClient: createHttpClient(),
    apiVersion: '2023-10-16',
  });
  ```
- **There is no Connect Extension, no OAuth grant flow, and no cross-account access.** The key only accesses the account that installed the app.

**For backend calls** (the optional ChurnGuard enhancement layer):
- `fetchStripeSignature()` from the SDK generates a short-lived signature from inside the panel
- The backend verifies it with `stripe.webhooks.signature.verifyHeader()` using `STRIPE_APP_SECRET`
- If `STRIPE_APP_SECRET` is not set, signature verification is skipped (the code comments note this explicitly)

**`createOAuthState()`** is called in `App.tsx` to generate a cryptographic `state` + `challenge` pair for the "Start Free Trial" link. This is not a Connect Extension OAuth flow — it is a standard Stripe Apps utility to create a tamper-proof handoff URL so ChurnGuard can verify the link came from the panel. The `/stripe-app/connect` backend page receives those params and redirects to `/signup`.

---

### Where panel data comes from

**Primary source — live Stripe API data (always):**

Both panel views call the merchant's own Stripe account via RAK:
- `stripe.subscriptions.list({ limit: 100, expand: ['data.customer', 'data.items.data.price'] })`
- `stripe.charges.list({ limit: 100 })`
- `stripe.customers.retrieve(customerId)` (detail view only)

Risk scores are then computed locally by `calculateRisk()` in `riskScoring.ts`. No external call is needed to show scores.

**Secondary source — ChurnGuard backend (optional, non-blocking):**

After displaying Stripe-native data, both views fire background requests:
- `GET /api/stripe-app/risk?account_id=acct_xxx` — checks if the Stripe account is linked to a ChurnGuard account; returns aggregate stats from the ChurnGuard DB if so
- `GET /api/stripe-app/customer?account_id=acct_xxx&customer_id=cus_xxx` — fetches AI-generated risk score, risk reason, and intervention history from the ChurnGuard DB

Both are wrapped in `try/catch` with silent fallback. If the backend is unavailable or the account is unlinked, the Stripe-native scores are shown unchanged.

---

### What a Stripe reviewer sees right now

A reviewer who installs on a Stripe test account with **no subscriptions** will see the hard-coded demo data (`DEMO_ROWS` in `App.tsx`):

| Name | Email | Risk | Status | MRR | Days since payment |
|---|---|---|---|---|---|
| Emily Zhao | emily@launchpad.dev | 92 High | Past Due | $299 | 67d |
| Sarah Mitchell | sarah@acme.io | 87 High | Active | $199 | 45d |
| Priya Nair | priya@scalehq.com | 61 Med | Active (cancelling) | $79 | 28d |
| James Okafor | james@buildco.com | 45 Med | Active | $99 | 12d |
| Carlos Rivera | carlos@growthops.io | 23 Low | Active | $149 | 3d |

These are the only seeded/fake values in the codebase. **There are no $466M test rows anywhere in the source code** — if those appear during a review, they are coming from real data in whatever Stripe account the app was tested on, not from the app itself.

A reviewer with real subscriptions in their test account sees those subscriptions with live-calculated scores.

---

## 4. The Manifest & Listing

See Section 1 for the full manifest. Summary of key fields:

| Field | Value |
|---|---|
| App ID | `com.churnguard.risk-monitor` |
| Name | ChurnGuard |
| Version | 0.0.6 |
| Distribution | Public |
| Extensions | `null` (none) |
| Views | `stripe.dashboard.home.overview` → `App`; `stripe.dashboard.customer.detail` → `CustomerDetailView` |
| Permissions | `customer_read`, `subscription_read`, `charge_read` |
| CSP connect-src | `https://churnguardapp.com/api/` |
| Post-install URL | `https://churnguardapp.com/stripe-app/install` |
| API_BASE constant | `https://churnguardapp.com/api/stripe-app` |

### Are all permissions actually used?

| Permission | Used? | Where |
|---|---|---|
| `customer_read` | Yes | `stripe.customers.retrieve()` in `CustomerDetailView.tsx:51`; customer object expanded from subscriptions in `App.tsx:97-99` |
| `subscription_read` | Yes | `stripe.subscriptions.list()` in both views |
| `charge_read` | Yes | `stripe.charges.list()` in both views |

All three permissions are used. No unnecessary permissions are requested.

---

## 5. How to Regenerate Listing Images

### How to run the Stripe App locally for screenshots

The Stripe App lives in `stripe-app/`. It uses the Stripe CLI's `stripe-app` command under the hood.

**Prerequisites:**
- Stripe CLI installed (`stripe` in PATH)
- Node.js 18+
- The SDK dependency is installed from a local tarball: `"@stripe/ui-extension-sdk": "file:../../../AppData/Local/Temp/stripe-ui-extension-sdk-fixed.tgz"` — this path is machine-specific (points to `C:\Users\najwa\AppData\Local\Temp\`). Verify the file exists before running on a new machine.

**Steps:**

```bash
cd stripe-app
npm install        # installs SDK from the local tarball + stripe@14
npm start          # runs: stripe-app start
```

`stripe-app start` opens the Stripe Dashboard in your browser with the app loaded in local preview mode. It connects via the Stripe CLI to your Stripe account (whichever account the CLI is authenticated to).

**To capture the exact screenshots Stripe wants:**

1. Run `npm start` — this opens `https://dashboard.stripe.com/...` with a preview URL appended
2. The **home overview panel** appears when you navigate to the Stripe Dashboard home — look for the ChurnGuard side panel on the right
3. The **customer detail panel** appears when you click into any customer record
4. If your test account has no real subscriptions, the app will show the demo data (Emily Zhao et al.) — that is valid to screenshot for the listing since it accurately represents what the app looks like
5. Alternatively, create 2–3 test subscriptions in your Stripe test account to show realistic live-data screenshots

**For a test account with realistic data**, use Stripe CLI test fixtures or the Stripe Dashboard to create a few test customers with subscriptions in different states (active, past_due, cancel_at_period_end=true). That will generate scores across all three risk levels and make the screenshots more illustrative.

---

## 6. The Deprecation Recommendation

### Does the app currently depend on Connect Extension?

**No.** There is zero Connect Extension dependency anywhere in the codebase:
- `stripe-app.json` has `"extensions": null`
- No `stripe-extensions.json` exists
- No imports from any Connect Extension SDK
- No OAuth merchant-onboarding flow
- No cross-account `Stripe-Account` header usage

The app is already a native Stripe App using the RAK pattern. Stripe's deprecation recommendation does not apply to this codebase — there is nothing to migrate.

### Why the reviewer flagged "Connect Extension"

The rejection is purely a listing problem, not a code problem. The **screenshots/video in the marketplace listing show Connect Extension UI** (possibly from a prior prototype, a competitor's listing used as reference, or a different version of the product). The submitted code is a standard `ui_extension` Stripe App. The reviewer compared the listing images to the installed app and found a mismatch.

### Scope of what a migration would involve (if it were needed)

Since the app already uses RAK, there is nothing to migrate. If hypothetically a Connect Extension were present, migrating to a Stripe App would require:
1. Replacing the `extensions` block in the manifest with a `ui_extension` block
2. Switching from `Stripe-Account` header patterns to `STRIPE_API_KEY` from the SDK's `http_client`
3. Rewriting panel components to use `@stripe/ui-extension-sdk/ui` components instead of any Connect Extension iframe approach
4. Replacing the OAuth merchant-onboarding grant flow with the `createOAuthState()` + backend challenge verification pattern already implemented

None of that work is needed. The app is already on the correct implementation path.

---

## Summary for Fixing the Rejection

The **only required fix** is replacing the listing's key feature images and/or video with accurate screenshots of the `ui_extension` Stripe App panel (the two views described in Section 2). The code itself, the manifest, and the permissions are all consistent with a standard public Stripe App.

Run `npm start` inside `stripe-app/` to launch the local preview in the Stripe Dashboard, then capture screenshots of:
1. The home overview panel (stats tiles + customer risk list)
2. The customer detail panel (risk score header + stats row + risk factors list)

The Stripe deprecation recommendation (migrate away from Connect Extension) does not require any action — the app has no Connect Extension to migrate from.
