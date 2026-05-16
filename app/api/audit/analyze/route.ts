import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/resend';
import { email1, daysUntilNextEmail } from '@/lib/email/audit-sequence';
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

// ── Email template ────────────────────────────────────────────────────────────

function auditEmailHtml(r: StripeAuditResult): string {
  const churnColor = r.monthlyChurnRate > 5 ? '#ef4444' : r.monthlyChurnRate > 2 ? '#f59e0b' : '#22c55e';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://churnguardapp.com';
  return `
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:12px;">
  <div style="text-align:center;margin-bottom:32px;">
    <div style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:10px 16px;border-radius:8px;font-weight:700;font-size:18px;color:#fff;">🛡️ ChurnGuard</div>
    <h1 style="font-size:24px;margin:16px 0 4px;color:#fff;">Your Free Churn Audit Report</h1>
    <p style="color:#94a3b8;margin:0;">Here's the brutal truth about your churn.</p>
  </div>

  <div style="display:grid;gap:16px;margin-bottom:32px;">
    <div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:20px;">
      <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.05em;margin:0 0 4px;">Monthly Churn Rate</p>
      <p style="font-size:40px;font-weight:800;color:${churnColor};margin:0;">${r.monthlyChurnRate.toFixed(1)}%</p>
      <p style="color:#94a3b8;font-size:13px;margin:4px 0 0;">You rank in the <strong style="color:#fff;">bottom ${100 - r.industryPercentile}%</strong> of SaaS companies</p>
    </div>
    <div style="background:#1e293b;border:1px solid #7f1d1d;border-radius:10px;padding:20px;">
      <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.05em;margin:0 0 4px;">Annualized Revenue Loss</p>
      <p style="font-size:40px;font-weight:800;color:#ef4444;margin:0;">$${r.annualizedLoss.toLocaleString()}</p>
    </div>
    <div style="background:#1e293b;border:1px solid #78350f;border-radius:10px;padding:20px;">
      <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.05em;margin:0 0 4px;">Revenue Currently at Risk</p>
      <p style="font-size:40px;font-weight:800;color:#f59e0b;margin:0;">$${r.revenueAtRisk.toLocaleString()}</p>
    </div>
  </div>

  <div style="text-align:center;margin-top:32px;">
    <a href="${appUrl}/#pricing" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:16px;">
      Activate ChurnGuard to Stop This Loss →
    </a>
    <p style="color:#475569;font-size:12px;margin-top:16px;">Setup in 5 minutes · First results in hours · Cancel anytime</p>
  </div>
</div>`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: { email?: string; stripeKey?: string; csvData?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, stripeKey, csvData } = body;

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }

  if (!stripeKey && !csvData) {
    return NextResponse.json({ error: 'Provide a Stripe API key or CSV data.' }, { status: 400 });
  }

  let result: StripeAuditResult;

  try {
    result = stripeKey
      ? await analyzeStripe(stripeKey.trim())   // from @/lib/calculations/stripe
      : analyzeCSVData(csvData!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Analysis failed.';
    if (message.includes('Invalid API Key') || message.includes('No such') || message.includes('authentication')) {
      return NextResponse.json({ error: 'Invalid Stripe API key. Please check and try again.' }, { status: 422 });
    }
    return NextResponse.json({ error: message }, { status: 422 });
  }

  // Persist lead + start email sequence
  const daysToNext = daysUntilNextEmail(1)!;
  const nextEmailAt = new Date(Date.now() + daysToNext * 24 * 60 * 60 * 1000);

  try {
    await prisma.auditLead.create({
      data: {
        email,
        stripeConnected: !!stripeKey,
        csvUploaded:     !!csvData,
        monthlyChurnRate:   result.monthlyChurnRate,
        revenueAtRisk:      result.revenueAtRisk,
        annualizedLoss:     result.annualizedLoss,
        totalMrr:           result.totalMrr,
        industryPercentile: result.industryPercentile,
        atRiskCustomers:    JSON.parse(JSON.stringify(result.atRiskCustomers)),
        emailStep:   1,
        nextEmailAt,
      },
    });
  } catch (dbErr) {
    console.error('[audit] DB write failed:', dbErr);
  }

  // Send Email 1 immediately (non-blocking)
  const e1 = email1({ id: 'pending', email, ...result });
  sendEmail(email, e1.subject, e1.html).catch(e =>
    console.error('[audit] email1 send failed:', e)
  );

  return NextResponse.json(result);
}
