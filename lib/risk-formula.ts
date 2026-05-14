// Single source of truth for the deterministic churn risk score.
// Imported by both the AI analyzer (to produce the stored score) and
// the Calc Audit page (to verify stored scores). Same inputs → same number, always.

export interface FormulaInput {
  lastLoginAt: Date | null;
  healthScore: number | null;
  loginCountThisMonth: number;
}

export interface FormulaResult {
  daysSinceLogin: number | null; // null = never logged in
  loginPts: number;              // 0–45
  healthPts: number;             // 0–30
  activityPts: number;           // 0–25
  score: number;                 // 0–100, clamped
}

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
