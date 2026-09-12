/**
 * Regression tests for lib/risk-formula.ts
 *
 * Run with:
 *   node --experimental-strip-types lib/__tests__/risk-formula.test.mjs
 *
 * Node 24 supports --experimental-strip-types natively (no tsx required).
 * The formula file uses only TypeScript type annotations; stripping them is safe.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

// Node's strip-types resolves .ts imports when the flag is active.
// We import the compiled-in-place formula directly.
import { computeRiskScore } from '../risk-formula.ts';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Build a timestamp N days ago from now. */
function daysAgo(n) {
  return Date.now() - n * DAY_MS;
}

// ─── Test 1: cus_UwzxE4JqRxY9ed — paused + same-day refund + no widget ───────
// Expected after Priority 2 changes:
//   billingPts = min(30 [pause] + 20 [refund], 50) = 50
//   recencyPts = 0  (hasEngagementData = false, lastLoginAt = null)
//   activityPts = 0 (hasEngagementData = false)
//   score = 50, isSubscriptionPaused = true, refundsIssued30d = 1

test('paused subscription + same-day refund + no widget scores 50 (Medium boundary)', () => {
  const result = computeRiskScore({
    lastLoginAt: null,
    recentEvents: [
      { event: 'subscription_paused', timestamp: daysAgo(5) },
      { event: 'refund_issued',       timestamp: daysAgo(0) },
    ],
  });

  assert.equal(result.isSubscriptionPaused, true,  'should detect paused subscription');
  assert.equal(result.refundsIssued30d, 1,          'should count one refund');
  assert.equal(result.billingPts, 50,               'billing: min(30+20, 50) = 50');
  assert.equal(result.recencyPts, 0,                'no widget → no recency pts');
  assert.equal(result.activityPts, 0,               'no widget → no activity pts');
  assert.equal(result.hasEngagementData, false,     'widget never fired');
  assert.equal(result.score, 50,                    'final score: 50');
});

// ─── Test 2: Genuinely low-risk customer ─────────────────────────────────────
// Active payer, engaged daily, no billing issues.
// Expected: score = 0, all pts = 0

test('active paying engaged customer scores 0 (Low risk)', () => {
  const recentPageViews = Array.from({ length: 20 }, (_, i) => ({
    event: 'page_view',
    timestamp: daysAgo(i + 1),
  }));

  const result = computeRiskScore({
    lastLoginAt: new Date(daysAgo(1)),
    recentEvents: [
      { event: 'payment_success', timestamp: daysAgo(2) },
      ...recentPageViews,
    ],
  });

  assert.equal(result.failedPayments30d, 0,     'no failed payments');
  assert.equal(result.hasDowngrade30d, false,   'no downgrade');
  assert.equal(result.refundsIssued30d, 0,      'no refunds');
  assert.equal(result.isSubscriptionPaused, false, 'not paused');
  assert.equal(result.billingPts, 0,            'billing: 0');
  assert.equal(result.recencyPts, 1,            '1 day since login → round((1/30)*35) = round(1.17) = 1');
  assert.equal(result.activityPts, 0,           '20 active days ≥ 5 → 0 pts');
  assert.equal(result.score <= 5, true,         'score should be very low (≤5)');
});

// ─── Test 3: Failed payment only, no pause, no refund ────────────────────────
// Verifies existing payment_failed behavior is unchanged post-Priority-2.
// Expected: billingPts = 20, score = 20 (no widget, so no recency/activity)

test('single payment failure + no widget preserves pre-existing score of 20', () => {
  const result = computeRiskScore({
    lastLoginAt: null,
    recentEvents: [
      { event: 'payment_failed', timestamp: daysAgo(3) },
    ],
  });

  assert.equal(result.failedPayments30d, 1, 'one payment failure');
  assert.equal(result.billingPts, 20,       'billing: 1*20 = 20');
  assert.equal(result.recencyPts, 0,        'no widget');
  assert.equal(result.activityPts, 0,       'no widget');
  assert.equal(result.score, 20,            'final score: 20');
});

test('two payment failures + no widget caps billing at 40 (unchanged from before)', () => {
  const result = computeRiskScore({
    lastLoginAt: null,
    recentEvents: [
      { event: 'payment_failed', timestamp: daysAgo(2) },
      { event: 'payment_failed', timestamp: daysAgo(10) },
    ],
  });

  assert.equal(result.failedPayments30d, 2, 'two payment failures');
  assert.equal(result.billingPts, 40,       'billing: 2*20 = 40 (under the 50 cap)');
  assert.equal(result.score, 40,            'final score: 40');
});

// ─── Test 4: Paused + would-have-cancelled anyway ────────────────────────────
// cancel_at_period_end is NOT a signal in the authoritative formula — only in
// riskScoring.ts (the Stripe App fallback). So this test confirms:
//   a) pause is scored (+30)
//   b) if a downgrade also exists, the cap (50) prevents double-counting
//   c) score stays bounded even with all billing signals present

test('paused + downgrade detected: billing cap at 50 prevents runaway score', () => {
  const result = computeRiskScore({
    lastLoginAt: null,
    recentEvents: [
      { event: 'subscription_paused',    timestamp: daysAgo(10) },
      { event: 'downgrade_detected',     timestamp: daysAgo(5)  },
    ],
  });

  // Raw: 30 (pause) + 15 (downgrade) = 45 — under cap, passes through
  assert.equal(result.isSubscriptionPaused, true);
  assert.equal(result.hasDowngrade30d, true);
  assert.equal(result.billingPts, 45,   'billing: 30+15 = 45, under the 50 cap');
  assert.equal(result.score, 45,        'final score: 45 (no widget data)');
});

test('paused + downgrade + payment failure: hard cap at 50', () => {
  const result = computeRiskScore({
    lastLoginAt: null,
    recentEvents: [
      { event: 'subscription_paused',  timestamp: daysAgo(10) },
      { event: 'downgrade_detected',   timestamp: daysAgo(5)  },
      { event: 'payment_failed',       timestamp: daysAgo(3)  },
    ],
  });

  // Raw: 30 + 15 + 20 = 65 — capped at 50
  assert.equal(result.billingPts, 50, 'billing capped at 50');
  assert.equal(result.score, 50,      'final score: 50');
});

// ─── Test 5: Pause older than 30 days is still detected ──────────────────────
// Verifies the OR-filter design: subscription_paused events loaded without a
// 30-day limit are correctly interpreted as current state.

test('subscription paused 45 days ago with no resume is still detected as paused', () => {
  const result = computeRiskScore({
    lastLoginAt: null,
    recentEvents: [
      // This event would NOT be loaded by a plain 30-day window filter.
      // It IS loaded because the cron/per-customer queries use an OR filter.
      { event: 'subscription_paused', timestamp: daysAgo(45) },
    ],
  });

  assert.equal(result.isSubscriptionPaused, true, 'pause detected regardless of age');
  assert.equal(result.billingPts, 30,              'pause contributes 30 billing pts');
  assert.equal(result.score, 30,                   'final score: 30');
});

test('subscription paused then resumed: not scored as paused', () => {
  const result = computeRiskScore({
    lastLoginAt: null,
    recentEvents: [
      { event: 'subscription_paused',  timestamp: daysAgo(20) },
      { event: 'subscription_resumed', timestamp: daysAgo(10) },
    ],
  });

  assert.equal(result.isSubscriptionPaused, false, 'resumed subscription not scored as paused');
  assert.equal(result.billingPts, 0,                'no billing signals remaining');
  assert.equal(result.score, 0,                     'final score: 0');
});
