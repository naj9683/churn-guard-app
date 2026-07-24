// Single source of truth for the deterministic churn risk score.
// Imported by both the AI analyzer (to produce the stored score) and
// the Calc Audit page (to verify stored scores). Same inputs → same number, always.

export interface FormulaInput {
  lastLoginAt: Date | null;
  loginCountThisMonth: number;
  recentEvents: Array<{ event: string; timestamp: number }>;
}

export interface FormulaResult {
  daysSinceLogin: number | null; // null = no widget data (lastLoginAt never set)
  billingPts: number;            // 0–40: payment failures + downgrade, capped at 40
  recencyPts: number;            // 0–35, login recency (0 when no engagement data)
  activityPts: number;           // 0–25, login frequency (0 when no engagement data)
  hasEngagementData: boolean;    // false when lastLoginAt is null — absent data ≠ risk
  failedPayments30d: number;     // raw count driving billing pts
  hasDowngrade30d: boolean;      // true if downgrade_detected event in last 30 days
  score: number;                 // 0–100, clamped
}

export function computeRiskScore(input: FormulaInput): FormulaResult {
  const now = Date.now();
  const msPerDay = 1000 * 60 * 60 * 24;
  const ms30Days = 30 * msPerDay;

  // ── Billing: payment failures + downgrade in last 30 days (max 40 pts) ─────
  // payment_failed: written automatically by Stripe webhook (20 pts each, cap 40)
  // downgrade_detected: written by Stripe webhook when quantity/amount reduces (15 pts)
  // Combined cap at 40 — cannot exceed billing ceiling regardless of combination.
  const failedPayments30d = input.recentEvents.filter(
    e => e.event === 'payment_failed' && (now - e.timestamp) <= ms30Days
  ).length;

  const hasDowngrade30d = input.recentEvents.some(
    e => e.event === 'downgrade_detected' && (now - e.timestamp) <= ms30Days
  );

  const billingPts = Math.min(failedPayments30d * 20 + (hasDowngrade30d ? 15 : 0), 40);

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

  // Login frequency: 0–25 pts
  const logins = input.loginCountThisMonth ?? 0;
  const activityPts = hasEngagementData
    ? (logins === 0 ? 25 : logins < 3 ? 12 : 0)
    : 0;

  const score = Math.min(100, Math.max(0, billingPts + recencyPts + activityPts));

  return {
    daysSinceLogin,
    billingPts,
    recencyPts,
    activityPts,
    hasEngagementData,
    failedPayments30d,
    hasDowngrade30d,
    score,
  };
}
