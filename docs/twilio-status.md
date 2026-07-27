# Twilio SMS Status

_Audit date: 2026-07-27. Read-only code trace._

---

## 1. Env vars the code expects

Three variables, all read from `process.env` in `lib/sequences.ts:34`:

```
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
```

---

## 2. Which are set in production Vercel

All three are present. `npx vercel env ls` output:

| Variable | Production | Preview | Development |
|---|---|---|---|
| `TWILIO_ACCOUNT_SID` | **present** | present | present |
| `TWILIO_AUTH_TOKEN` | **present** | absent | absent |
| `TWILIO_PHONE_NUMBER` | **present** | present | present |

`TWILIO_AUTH_TOKEN` is scoped to Production only — Preview and Development deployments won't have it, which means SMS test commands run locally or in preview will hit the `'Twilio env vars not configured'` guard. On production (Vercel Production environment), all three are present.

The earlier audit that said credentials aren't configured was reading the local `.env` file, which has all three set to empty strings. On Vercel production the credentials are there.

---

## 3. What happens when SMS runs today

**`sendSms()` — `lib/sequences.ts:33–58`**

```
check TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER
  → all present on production → guard passes
  → fetch POST to api.twilio.com/Messages.json
  → returns { ok: true } or { ok: false, error: '...' }
```

The function itself is complete and correct. It never throws — failures return `{ ok: false, error }`.

**The actual blocking condition — dunning sequence step 1 (`lib/sequences.ts:103–118`):**

```typescript
if (!customer.phone) {
  return { status: 'skipped', message: 'No phone number — SMS step skipped' };
}
const { ok, error } = await sendSms(customer.phone, `...`);
```

`sendSms` is never reached. The step returns `skipped` before it gets there.

**Current state of `customer.phone` in production DB:**

```
customers with phone number: 0 / 348
```

Every customer record has `phone = null`. The guard at line 108 fires for all of them. SMS is skipped silently on every sequence run — no error, no log entry indicating a problem, the sequence just moves on.

**Automation engine SMS action (`lib/automation-engine.ts:241–251`):**

```typescript
const phone = customer.phone ?? (actionConfig.phone as string | undefined);
if (!phone) return { status: 'skipped', message: 'No phone number on customer record' };
```

Same gate. Same result. `sendSms` is never called.

**Interventions route (`app/api/interventions/route.ts:166–190`)** has two sequential gates:

1. `user.smsEnabled` — currently `false` → skipped at line 169
2. `customer.phone` — null for all customers → would skip at line 173 even if `smsEnabled` were true

---

## 4. Would adding credentials fix it?

No. Credentials are already in production. They are not the gap.

The blocking condition is `customer.phone = null` on all 348 customer records. Until at least one customer record has a phone number, `sendSms` cannot be reached by any code path — the `customer.phone` guard fires first in every caller.

**What is actually needed:**

| Gap | Where to fix | Notes |
|---|---|---|
| `customer.phone` unpopulated | Customer import, manual edit UI, or widget data | The only thing preventing SMS from firing |
| `user.smsEnabled = false` | Settings → Integrations → enable SMS toggle | Only gates the interventions path, not sequences or automation rules |
| `TWILIO_AUTH_TOKEN` absent in Preview/Dev | Vercel env var scoping | Minor — only affects local testing, not production |

**The sequence and automation engine paths** (dunning, risk retention, etc.) do not check `smsEnabled` at all — they only check `customer.phone`. So once any customer has a phone number, those paths will attempt SMS on the next cron tick without any other change.

**The interventions path** checks `smsEnabled` first, then `customer.phone`. Both need to be true for that path to send.

---

## Summary

The previous diagnosis ("Twilio credentials not configured") was wrong — it was reading the local `.env` not Vercel. Credentials are live in production. The real blocking condition is that no customer record has a phone number. SMS has never fired because `customer.phone` has always been null, causing every SMS step to return `skipped` before `sendSms` is ever called. Add phone numbers to customer records and SMS sequences will begin firing automatically on the next hourly cron.
