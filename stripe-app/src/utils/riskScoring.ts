import type Stripe from 'stripe';

export type RiskLevel = 'high' | 'medium' | 'low';

export interface RiskResult {
  score: number;
  level: RiskLevel;
  factors: string[];
  mrr: number; // monthly dollars
}

/**
 * Calculates a 0–100 churn risk score from Stripe objects.
 * Scoring:
 *   past_due subscription          → +25
 *   cancellation scheduled          → +25
 *   each failed charge (max 3)      → +10 each (max +30)
 *   no successful charge in 30 days → +20
 */
export function calculateRisk(
  subscription: Stripe.Subscription | null,
  charges: Stripe.Charge[]
): RiskResult {
  let score = 0;
  const factors: string[] = [];

  if (subscription?.status === 'past_due') {
    score += 25;
    factors.push('Subscription is past due');
  }

  if (subscription?.cancel_at_period_end) {
    score += 25;
    factors.push('Cancellation scheduled at period end');
  }

  const failedCharges = charges.filter(c => c.status === 'failed');
  if (failedCharges.length > 0) {
    const points = Math.min(failedCharges.length * 10, 30);
    score += points;
    factors.push(`${failedCharges.length} failed payment attempt${failedCharges.length > 1 ? 's' : ''}`);
  }

  const thirtyDaysAgo = Date.now() / 1000 - 30 * 24 * 60 * 60;
  const hasRecentSuccess = charges.some(c => c.status === 'succeeded' && c.created > thirtyDaysAgo);
  if (!hasRecentSuccess && charges.length > 0) {
    score += 20;
    factors.push('No successful payment in the past 30 days');
  }

  if (factors.length === 0) {
    factors.push('No churn signals detected');
  }

  const finalScore = Math.min(score, 100);

  return {
    score: finalScore,
    level: finalScore >= 70 ? 'high' : finalScore >= 40 ? 'medium' : 'low',
    factors,
    mrr: getSubscriptionMrr(subscription),
  };
}

function getSubscriptionMrr(sub: Stripe.Subscription | null): number {
  if (!sub) return 0;
  return sub.items.data.reduce((total, item) => {
    const price = item.price as Stripe.Price;
    const unitAmount = price.unit_amount ?? 0;
    const qty = item.quantity ?? 1;
    const interval = price.recurring?.interval;
    const intervalCount = price.recurring?.interval_count ?? 1;
    // Normalise to monthly cents
    let monthlyCents = unitAmount * qty;
    if (interval === 'year') monthlyCents = monthlyCents / (12 * intervalCount);
    if (interval === 'week') monthlyCents = monthlyCents * (52 / 12) / intervalCount;
    if (interval === 'day') monthlyCents = monthlyCents * (365 / 12) / intervalCount;
    return total + monthlyCents;
  }, 0) / 100; // cents → dollars
}

export function riskBadgeType(level: RiskLevel): 'negative' | 'warning' | 'positive' {
  if (level === 'high') return 'negative';
  if (level === 'medium') return 'warning';
  return 'positive';
}

export function subscriptionBadgeType(
  status: string,
  cancelAtPeriodEnd: boolean
): 'negative' | 'warning' | 'positive' | 'neutral' {
  if (cancelAtPeriodEnd) return 'negative';
  if (status === 'past_due' || status === 'unpaid') return 'negative';
  if (status === 'trialing') return 'warning';
  if (status === 'active') return 'positive';
  return 'neutral';
}

export function subscriptionLabel(status: string, cancelAtPeriodEnd: boolean): string {
  if (cancelAtPeriodEnd) return 'Cancelling';
  const labels: Record<string, string> = {
    active: 'Active',
    past_due: 'Past Due',
    unpaid: 'Unpaid',
    canceled: 'Cancelled',
    trialing: 'Trial',
    incomplete: 'Incomplete',
    incomplete_expired: 'Expired',
    paused: 'Paused',
  };
  return labels[status] ?? status;
}
