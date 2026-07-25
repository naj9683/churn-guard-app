# Security To-Do

## Plaintext credential storage in CrmIntegration

**Affected columns:** `CrmIntegration.accessToken`, `CrmIntegration.webhookSecret`

**What is stored in plaintext:**
- `accessToken` — the ChurnGuard user's Stripe secret key (`sk_live_…` or `sk_test_…`). Full key, live credentials, stored as a raw string.
- `webhookSecret` — the Stripe webhook signing secret (`whsec_…`) for that user's registered endpoint. Stored as a raw string after the finding #4 fix.

**Why this is its own task:**
Encrypting these columns is not a one-line change. Every code path that reads or writes these fields must be updated:

- Read paths: any route that fetches `accessToken` to make Stripe API calls on behalf of the user (snapshot, sync, integration check). Any route that fetches `webhookSecret` to verify incoming events (the webhook handler now queries this on every request).
- Write paths: the POST handler in `app/api/integrations/stripe/route.ts` (both the upsert and the webhook-secret update), and the backfill script.

An encryption helper already exists at `lib/encrypt.ts` (AES-256-GCM, keyed off `POSTMARK_ENCRYPTION_KEY`). It is currently used only for Postmark tokens stored on the `User` model. The same key and functions could be reused, or a separate `CRM_ENCRYPTION_KEY` env var added.

**What to do (when scheduled):**
1. Add `CRM_ENCRYPTION_KEY` env var (or reuse `POSTMARK_ENCRYPTION_KEY` with clear documentation).
2. Update the Stripe integration write path to `encrypt(value)` before storing.
3. Update all read paths to `decrypt(value)` before use. The existing `decrypt()` function handles legacy plaintext gracefully (returns raw value if not in `iv:tag:cipher` format), so migration can be done without a data backfill — values will be re-encrypted the next time each user saves their key.
4. Do the same for any other CRM types (HubSpot, Salesforce) that also store plaintext tokens in `CrmIntegration.accessToken`.

**Current risk:** A database compromise exposes live Stripe secret keys and webhook secrets for every connected account. At current scale (one connected account), the blast radius is one merchant's Stripe account. Risk grows linearly with connected users.

**Do not bundle this into an unrelated fix.** It touches every integration read/write path and warrants its own PR, review, and test pass.
