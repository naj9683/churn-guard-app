/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  DO NOT MODIFY WITHOUT UPDATING BOTH FREE AUDIT AND DASHBOARD        ║
 * ║                                                                      ║
 * ║  This is the single source of truth for all Stripe-based MRR,       ║
 * ║  churn rate, and revenue-at-risk calculations.                       ║
 * ║                                                                      ║
 * ║  Imported by:                                                        ║
 * ║    - app/api/audit/analyze/route.ts  (free audit lead magnet)        ║
 * ║    - app/api/revenue/risk/route.ts   (paid dashboard)                ║
 * ║                                                                      ║
 * ║  Both paths MUST call the same functions so a prospect's audit       ║
 * ║  report and their live dashboard speak the same language.            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import Stripe from 'stripe';

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface AtRiskCustomer {
  name: string;
  email: string;
  mrr: number;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface StripeAuditResult {
  monthlyChurnRate: number;
  revenueAtRisk: number;
  annualizedLoss: number;
  totalMrr: number;
  industryPercentile: number;
  atRiskCustomers: AtRiskCustomer[];
  activeCount: number;
  canceledCount: number;
  pastDueCount: number;
  pausedCount: number;
}

// ─── calcSubMrr ───────────────────────────────────────────────────────────────
// Converts a Stripe subscription (any billing interval) to monthly USD.
// unit_amount is in cents; result is whole dollars.

export function calcSubMrr(sub: Stripe.Subscription): number {
  let total = 0;
  for (const item of sub.items.data) {
    const unitAmount = item.price.unit_amount ?? 0;
    const qty        = item.quantity ?? 1;
    const interval   = item.price.recurring?.interval ?? 'month';
    const count      = item.price.recurring?.interval_count ?? 1;

    let monthly = 0;
    if      (interval === 'month') monthly = (unitAmount * qty) / count;
    else if (interval === 'year')  monthly = (unitAmount * qty) / (12 * count);
    else if (interval === 'week')  monthly = (unitAmount * qty * 4.33) / count;
    else if (interval === 'day')   monthly = (unitAmount * qty * 30) / count;

    total += monthly;
  }
  return Math.round(total / 100);
}

// ─── getIndustryPercentile ────────────────────────────────────────────────────
// Maps a monthly churn rate (%) to the SaaS industry percentile it represents.
// Used by both the audit report and the dashboard benchmark card.

export function getIndustryPercentile(monthlyChurnPct: number): number {
  if (monthlyChurnPct < 0.5) return 92;
  if (monthlyChurnPct < 1)   return 82;
  if (monthlyChurnPct < 2)   return 68;
  if (monthlyChurnPct < 3)   return 52;
  if (monthlyChurnPct < 5)   return 38;
  if (monthlyChurnPct < 7)   return 24;
  if (monthlyChurnPct < 10)  return 14;
  return 6;
}

// ─── analyzeStripe ────────────────────────────────────────────────────────────
// Full analysis from a Stripe secret key. Used by the free audit tool;
// also callable by any dashboard Stripe-snapshot feature.

export async function analyzeStripe(apiKey: string): Promise<StripeAuditResult> {
  const stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });

  // Paginate all subscriptions (cap at 500 to avoid timeout)
  const allSubs: Stripe.Subscription[] = [];
  let startingAfter: string | undefined;
  while (allSubs.length < 500) {
    const page = await stripe.subscriptions.list({
      limit: 100,
      starting_after: startingAfter,
      expand: ['data.customer'],
      status: 'all',
    });
    allSubs.push(...page.data);
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1].id;
  }

  const now            = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo  = now - 30 * 24 * 60 * 60;
  const sevenDaysAhead = now + 7 * 24 * 60 * 60;

  const active   = allSubs.filter(s => s.status === 'active');
  const pastDue  = allSubs.filter(s => s.status === 'past_due');
  const trialing = allSubs.filter(s => s.status === 'trialing');
  const paused   = allSubs.filter(s => s.status === 'paused');
  const canceled = allSubs.filter(
    s => s.status === 'canceled' && (s.canceled_at ?? 0) > thirtyDaysAgo
  );

  const totalMrr     = active.reduce((n, s) => n + calcSubMrr(s), 0);
  const canceledMrr  = canceled.reduce((n, s) => n + calcSubMrr(s), 0);
  const pastDueMrr   = pastDue.reduce((n, s) => n + calcSubMrr(s), 0);
  const pausedMrr    = paused.reduce((n, s) => n + calcSubMrr(s), 0);
  const trialingAtRisk = trialing
    .filter(s => s.trial_end !== null && s.trial_end < sevenDaysAhead)
    .reduce((n, s) => n + calcSubMrr(s), 0);

  // Churn denominator includes all non-expired statuses so trial-heavy companies
  // don't show inflated churn when canceled trials hit the numerator.
  const denominator = active.length + trialing.length + pastDue.length + paused.length + canceled.length;
  const monthlyChurnRate = denominator > 0 ? (canceled.length / denominator) * 100 : 0;

  // Revenue at risk:
  //   past_due  → 100% of MRR (payment already failing)
  //   paused    →  60% of MRR (strong churn signal; some will resume)
  //   trialing  →  40% of MRR (trial-to-paid conversion risk)
  const revenueAtRisk =
    pastDueMrr +
    Math.round(pausedMrr   * 0.6) +
    Math.round(trialingAtRisk * 0.4);

  const annualizedLoss = canceledMrr * 12 + revenueAtRisk;

  // At-risk customer list (top 5 by MRR)
  const riskSubs: Array<Stripe.Subscription & { _reason: string; _urgency: 'high' | 'medium' }> = [
    ...pastDue.map(s  => ({ ...s, _reason: 'Payment failed',           _urgency: 'high'   as const })),
    ...paused.map(s   => ({ ...s, _reason: 'Subscription paused',      _urgency: 'medium' as const })),
    ...trialing
      .filter(s => s.trial_end !== null && s.trial_end < sevenDaysAhead)
      .map(s          => ({ ...s, _reason: 'Trial ending in 7 days',   _urgency: 'medium' as const })),
  ].sort((a, b) => calcSubMrr(b) - calcSubMrr(a)).slice(0, 5);

  const atRiskCustomers: AtRiskCustomer[] = riskSubs.map(s => {
    const cust = s.customer as Stripe.Customer;
    return {
      name:    cust.name ?? cust.email?.split('@')[0] ?? 'Unknown',
      email:   cust.email ?? 'unknown',
      mrr:     calcSubMrr(s),
      reason:  s._reason,
      urgency: s._urgency,
    };
  });

  return {
    monthlyChurnRate:   Math.round(monthlyChurnRate * 10) / 10,
    revenueAtRisk,
    annualizedLoss,
    totalMrr,
    industryPercentile: getIndustryPercentile(monthlyChurnRate),
    atRiskCustomers,
    activeCount:        active.length,
    canceledCount:      canceled.length,
    pastDueCount:       pastDue.length,
    pausedCount:        paused.length,
  };
}
