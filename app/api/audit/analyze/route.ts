import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeStripe,
  getIndustryPercentile,
  type AtRiskCustomer,
  type StripeAuditResult,
} from '@/lib/calculations/stripe';

// ── CSV helpers ───────────────────────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += ch; }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map(h =>
    h.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/__+/g, '_')
  );
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = vals[i] ?? ''; });
    return row;
  });
}

function pick(row: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) if (row[k] !== undefined && row[k] !== '') return row[k];
  return '';
}

function anonymizeEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email.slice(0, 3) + '***';
  return local.slice(0, 2) + '***@' + domain;
}

// ── CSV analysis ──────────────────────────────────────────────────────────────
// Uses the same getIndustryPercentile and AtRiskCustomer from the shared module.

function analyzeCSVData(csvText: string): StripeAuditResult {
  const rows = parseCSV(csvText);
  if (rows.length === 0) throw new Error('CSV is empty or could not be parsed.');

  const customers = rows.map(row => {
    const email  = pick(row, 'email', 'customer_email', 'customer', 'name');
    const mrrRaw = pick(row, 'mrr', 'monthly_revenue', 'revenue', 'amount', 'arr', 'monthly_arr');
    const mrr    = parseFloat(mrrRaw.replace(/[$,]/g, '')) || 0;
    const status = pick(row, 'status', 'subscription_status').toLowerCase();
    const daysStr = pick(row, 'days_inactive', 'days_since_login', 'last_login_days', 'inactive_days');
    const daysInactive = parseInt(daysStr) || 0;
    const payFailed = pick(row, 'payment_failed', 'failed_payment', 'payment_status').toLowerCase();

    let riskScore = 0;
    if (status === 'past_due' || status === 'failed' || payFailed === 'true' || payFailed === '1') riskScore += 70;
    else if (status === 'trialing' || status === 'trial') riskScore += 30;
    else if (status === 'inactive' || status === 'paused') riskScore += 50;
    if (daysInactive > 60) riskScore += 30;      // at-risk threshold alone
    else if (daysInactive > 30) riskScore += 15;

    return { email: email || 'unknown', mrr, status, daysInactive, riskScore, isCanceled: status === 'canceled' };
  });

  const active   = customers.filter(c => !c.isCanceled && c.status !== 'canceled');
  const canceled = customers.filter(c => c.isCanceled);
  const paused   = customers.filter(c => c.status === 'paused');
  const atRisk   = active.filter(c => c.riskScore >= 30);

  const totalMrr      = active.reduce((n, c) => n + c.mrr, 0);
  const revenueAtRisk = atRisk.reduce((n, c) => n + c.mrr, 0);
  const canceledMrr   = canceled.reduce((n, c) => n + c.mrr, 0);

  const denominator = active.length + canceled.length;
  const monthlyChurnRate = denominator > 0 ? (canceled.length / denominator) * 100 : 0;
  const annualizedLoss   = canceledMrr * 12 + revenueAtRisk;

  const atRiskCustomers: AtRiskCustomer[] = atRisk
    .sort((a, b) => b.mrr - a.mrr)
    .slice(0, 5)
    .map(c => ({
      name:    anonymizeEmail(c.email),
      email:   anonymizeEmail(c.email),
      mrr:     c.mrr,
      reason:  c.riskScore >= 70 ? 'Payment failed' : c.daysInactive > 30 ? 'Inactive 30+ days' : 'Trial at risk',
      urgency: (c.riskScore >= 70 ? 'high' : 'medium') as 'high' | 'medium',
    }));

  return {
    monthlyChurnRate:   Math.round(monthlyChurnRate * 10) / 10,
    revenueAtRisk:      Math.round(revenueAtRisk),
    annualizedLoss:     Math.round(annualizedLoss),
    totalMrr:           Math.round(totalMrr),
    industryPercentile: getIndustryPercentile(monthlyChurnRate),  // shared function
    atRiskCustomers,
    activeCount:   active.length,
    canceledCount: canceled.length,
    pastDueCount:  atRisk.filter(c => c.riskScore >= 70).length,
    pausedCount:   paused.length,
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────
// Pure analysis — no email required. Lead capture happens in /api/audit/capture-lead.

export async function POST(request: NextRequest) {
  let body: { stripeKey?: string; csvData?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { stripeKey, csvData } = body;

  if (!stripeKey && !csvData) {
    return NextResponse.json({ error: 'Provide a Stripe API key or CSV data.' }, { status: 400 });
  }

  let result: StripeAuditResult;
  try {
    result = stripeKey
      ? await analyzeStripe(stripeKey.trim())
      : analyzeCSVData(csvData!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Analysis failed.';
    if (message.includes('Invalid API Key') || message.includes('No such') || message.includes('authentication')) {
      return NextResponse.json({ error: 'Invalid Stripe API key. Please check and try again.' }, { status: 422 });
    }
    return NextResponse.json({ error: message }, { status: 422 });
  }

  return NextResponse.json(result);
}
