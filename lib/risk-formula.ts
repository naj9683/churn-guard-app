// Single source of truth for the deterministic churn risk score.
// Imported by both the AI analyzer (to produce the stored score) and
// the Calc Audit page (to verify stored scores). Same inputs → same number, always.

export interface FormulaInput {
  lastLoginAt: Date | null;
  loginCountThisMonth?: number; // retained for backward compat; not used by scoring
  recentEvents: Array<{ event: string; timestamp: number }>;
  // Live subscription status from Stripe API, fetched at analysis time.
  // When present, takes priority over event-based pause inference so the cron
  // self-heals missed webhooks and handles customers paused before this code deployed.
  // null/undefined = Stripe not available for this customer; fall back to events.
  subscriptionStatus?: string | null;
}

export interface FormulaResult {
  daysSinceLogin: number | null; // null = no widget data (lastLoginAt never set)
  billingPts: number;            // 0–50: payment failures + downgrade + refunds + pause, capped at 50
  recencyPts: number;            // 0–35, login recency (0 when no engagement data)
  activityPts: number;           // 0–25, login frequency (0 when no engagement data)
  uniqueDaysLast30d: number;     // distinct calendar days with page_view in last 30d
  hasEngagementData: boolean;    // false when lastLoginAt is null — absent data ≠ risk
  failedPayments30d: number;     // raw count of payment_failed events in 30d
  hasDowngrade30d: boolean;      // true if downgrade_detected event in last 30 days
  refundsIssued30d: number;      // raw count of refund_issued events in 30d
  isSubscriptionPaused: boolean; // true when most recent pause-state event is subscription_paused
  score: number;                 // 0–100, clamped
}

export function computeRiskScore(input: FormulaInput): FormulaResult {
  const now = Date.now();
  const msPerDay = 1000 * 60 * 60 * 24;
  const ms30Days = 30 * msPerDay;

  // ── Billing signals (max 50 pts) ─────────────────────────────────────────
  // payment_failed (30d):        +20 each  — from invoice.payment_failed webhook
  // downgrade_detected (30d):    +15       — from subscription.updated webhook
  // refund_issued (30d):         +20 each, capped at 20 — from charge.refunded webhook
  // subscription_paused (state): +30       — pause suppresses invoice.payment_failed so
  //   the formula reads current state instead of inferring from failure events.
  //   The event query loads subscription_paused/resumed without a 30-day limit so
  //   this correctly reflects pauses older than 30 days.
  const failedPayments30d = input.recentEvents.filter(
    e => e.event === 'payment_failed' && (now - e.timestamp) <= ms30Days
  ).length;

  const hasDowngrade30d = input.recentEvents.some(
    e => e.event === 'downgrade_detected' && (now - e.timestamp) <= ms30Days
  );

  const refundsIssued30d = input.recentEvents.filter(
    e => e.event === 'refund_issued' && (now - e.timestamp) <= ms30Days
  ).length;
  // TODO: weight refund pts by amountRefunded ratio so a small partial refund
  // (e.g. 10% courtesy credit) doesn't score the same as a full same-day reversal.
  // Suggested formula: pts = Math.round((amountRefunded / chargeAmount) * 20), cap 20.
  // Requires storing amountRefunded and chargeAmount in the refund_issued Event metadata
  // and threading them through FormulaInput.

  // Pause detection: prefer live Stripe status (self-healing) over event inference.
  // subscriptionStatus is populated by the cron and per-customer route from the Stripe API;
  // falls back to the most recent subscription_paused/resumed event for non-Stripe customers
  // or when the Stripe call fails.
  const pauseStatusEvents = input.recentEvents
    .filter(e => e.event === 'subscription_paused' || e.event === 'subscription_resumed')
    .sort((a, b) => b.timestamp - a.timestamp);
  const isSubscriptionPaused =
    input.subscriptionStatus === 'paused' ||
    (input.subscriptionStatus == null && pauseStatusEvents[0]?.event === 'subscription_paused');

  const billingPts = Math.min(
    failedPayments30d * 20
    + (hasDowngrade30d ? 15 : 0)
    + Math.min(refundsIssued30d * 20, 20)
    + (isSubscriptionPaused ? 30 : 0),
    50,
  );

  // ── Engagement signals — only scored when the widget has fired at least once
  // lastLoginAt === null means the widget is not installed or has never fired.
  // Absent engagement data is not evidence of risk; score 0, flag the customer.
  const hasEngagementData = input.lastLoginAt !== null;

  const daysSinceLogin: number | null = hasEngagementData
    ? Math.floor((now - new Date(input.lastLoginAt!).getTime()) / msPerDay)
    : null;

  // Login recency: 0–35 pts, capped at 30 days (beyond 30 = full 35 pts)
  const recencyPts = hasEngagementData
    ? Math.round((Math.min(daysSinceLogin!, 30) / 30) * 35)
    : 0;

  // Login frequency: 0–25 pts, computed from rolling 30-day page_view events
  const uniqueDaysLast30d = hasEngagementData
    ? new Set(
        input.recentEvents
          .filter(e => e.event === 'page_view' && (now - e.timestamp) <= ms30Days)
          .map(e => new Date(e.timestamp).toDateString())
      ).size
    : 0;

  const activityPts = hasEngagementData
    ? (uniqueDaysLast30d === 0 ? 25 : uniqueDaysLast30d < 5 ? 12 : 0)
    : 0;

  const score = Math.min(100, Math.max(0, billingPts + recencyPts + activityPts));

  return {
    daysSinceLogin,
    billingPts,
    recencyPts,
    activityPts,
    uniqueDaysLast30d,
    hasEngagementData,
    failedPayments30d,
    hasDowngrade30d,
    refundsIssued30d,
    isSubscriptionPaused,
    score,
  };
}
