import Anthropic from '@anthropic-ai/sdk';
import { auditEmailShell } from '@/lib/email/audit-sequence';
import { trialEmailShell } from '@/lib/email/trial-sequence';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://churnguardapp.com';

// 9 s timeout — long enough for Haiku, short enough to fall back gracefully
const AI_TIMEOUT_MS = 9000;

async function callClaude(prompt: string): Promise<{ subject: string; body: string } | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const response = await Promise.race([
      client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 900,
        messages: [{ role: 'user', content: prompt }],
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI timeout')), AI_TIMEOUT_MS)
      ),
    ]);
    const raw = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]) as { subject?: string; body?: string };
    if (!parsed.subject || !parsed.body) throw new Error('Missing subject or body');
    return { subject: parsed.subject, body: parsed.body };
  } catch (err) {
    console.error('[ai-sequence]', err instanceof Error ? err.message : String(err));
    return null;
  }
}

// ── Audit sequence ────────────────────────────────────────────────────────────

export interface AuditEmailCtx {
  monthlyChurnRate: number;
  revenueAtRisk: number;
  annualizedLoss: number;
  totalMrr: number;
  industryPercentile: number;
}

const AUDIT_DARK = `All inline styles — no CSS classes. Headings: color:#f1f5f9;font-size:21px;font-weight:800;margin:0 0 16px;line-height:1.3. Body text: color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 16px. No outer wrapper div — it will be added automatically.`;

export async function generateAuditEmail(
  lead: AuditEmailCtx,
  step: number,
  leadId: string,
): Promise<{ subject: string; html: string } | null> {
  const dailyCost  = Math.round(lead.annualizedLoss / 365);
  const preventable = Math.round(lead.revenueAtRisk * 0.78);
  const bottomPct  = 100 - lead.industryPercentile;
  const pricingUrl = `${APP_URL}/#pricing`;
  const featuresUrl = `${APP_URL}/#features`;

  const ctaHtml: Record<number, string> = {
    1: `<div style="text-align:center;margin-top:28px;"><a href="${featuresUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:-0.01em;">See How It Works →</a></div>`,
    2: `<div style="text-align:center;margin-top:28px;"><a href="${pricingUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:-0.01em;">Start Your 30-Day Free Trial →</a></div>`,
    3: `<div style="text-align:center;margin-top:28px;"><a href="${pricingUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:-0.01em;">Activate ChurnGuard — 30 Days Free, No CC →</a></div>`,
    4: `<div style="text-align:center;margin-top:28px;"><a href="${pricingUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:-0.01em;">Claim Your Beta Spot →</a></div>`,
  };

  const prompts: Record<number, string> = {
    1: `Write an email for ChurnGuard (SaaS churn prevention tool). The recipient just ran a free churn audit. Use their EXACT data.

AUDIT DATA:
- Monthly churn: ${lead.monthlyChurnRate.toFixed(1)}%
- Revenue at risk: $${lead.revenueAtRisk.toLocaleString()}/month
- Annual loss: $${lead.annualizedLoss.toLocaleString()}
- Industry standing: bottom ${bottomPct}% by churn rate
- Preventable with automation: ~$${preventable.toLocaleString()}/month (78% of at-risk)

Write the inner email body HTML. Include:
1. A headline referencing their audit results
2. Three stat boxes side-by-side (use display:flex;gap:12px on a wrapper): churn rate (danger color), revenue at risk (warning), annual loss (danger). Each box: background:#1e293b;border:1px solid #334155;border-radius:10px;padding:16px;text-align:center;flex:1
3. A callout (background:#1a0505;border:1px solid #7f1d1d;border-radius:10px;padding:16px 20px;margin:0 0 20px) mentioning bottom ${bottomPct}% and $${lead.annualizedLoss.toLocaleString()} annual loss
4. 3 bullet points: ~78% preventable ($${preventable.toLocaleString()}/mo), churn is predictable 30+ days ahead, silence is not a retention strategy
5. A closing line about wanting to see how ChurnGuard catches at-risk customers automatically
Do NOT include a CTA button — it will be appended.
Sign as: ChurnGuard Team
${AUDIT_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML content only. No outer wrapper.`,

    2: `Write a day-2 follow-up email for ChurnGuard (SaaS churn prevention). Revenue at risk: $${lead.revenueAtRisk.toLocaleString()}/month.

Write the inner email body HTML with:
1. A small opener referencing the audit from 2 days ago
2. A headline about how one founder stopped losing ~$4K/month to churn
3. A realistic founder testimonial (background:#1e293b;border-left:3px solid #6366f1;border-radius:0 10px 10px 0;padding:16px 20px;margin:0 0 20px): specific dollar amounts, timeframe, outcome
4. A numbered 4-step playbook explaining how ChurnGuard works
5. A closing line referencing their $${lead.revenueAtRisk.toLocaleString()}/month and asking what they're doing about it
Do NOT include a CTA button — it will be appended.
Sign as: ChurnGuard Team
${AUDIT_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    3: `Write a day-5 urgency email for ChurnGuard audit follow-up.

DATA:
- Revenue at risk: $${lead.revenueAtRisk.toLocaleString()}/month
- Annual loss: $${lead.annualizedLoss.toLocaleString()}
- Daily cost of inaction: $${dailyCost.toLocaleString()}/day
- Weekly cost: $${(dailyCost * 7).toLocaleString()}/week

Write the inner email body HTML with:
1. A brief opener "Since your audit 5 days ago, here's what's happened:"
2. A headline about $${lead.revenueAtRisk.toLocaleString()}/month compounding to $${lead.annualizedLoss.toLocaleString()}/year
3. A cost table (background:#1a0505;border:1px solid #7f1d1d;border-radius:10px;padding:20px;margin:0 0 24px):
   - Every day you wait: −$${dailyCost.toLocaleString()} (color:#ef4444;font-weight:700)
   - Every week you wait: −$${(dailyCost * 7).toLocaleString()} (color:#ef4444;font-weight:700)
   - This year if nothing changes: −$${lead.annualizedLoss.toLocaleString()} (color:#ef4444;font-weight:700;font-size:17px)
4. A paragraph acknowledging "dealing with it later" is tempting but costly
5. A brief note that ChurnGuard flags at-risk customers before they decide to leave
Do NOT include a CTA button — it will be appended.
Sign as: ChurnGuard Team
${AUDIT_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    4: `Write the final (day-7) last-chance email for ChurnGuard audit follow-up. This is the last email.

AUDIT DATA:
- Monthly churn: ${lead.monthlyChurnRate.toFixed(1)}%
- Revenue at risk: $${lead.revenueAtRisk.toLocaleString()}/month
- Annual loss: $${lead.annualizedLoss.toLocaleString()}

Write the inner email body HTML with:
1. A small opener "This is my last email about your audit."
2. A headline about audit data being deleted in 24 hours (automatic 7-day deletion for privacy)
3. A brief paragraph about the deletion
4. A summary box (background:#1e293b;border:1px solid #334155;border-radius:10px;padding:16px 20px;margin:0 0 20px) with "What you found in your audit" label and the 3 numbers
5. A paragraph offering beta spots: 30-day free trial, no credit card
6. A line suggesting they reply "YES" for a direct access link
7. A closing note this is the last follow-up
Do NOT include a CTA button — it will be appended.
Sign as: ChurnGuard Team
${AUDIT_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,
  };

  const prompt = prompts[step];
  if (!prompt) return null;

  const result = await callClaude(prompt);
  if (!result) return null;

  return {
    subject: result.subject,
    html: auditEmailShell(result.body + (ctaHtml[step] ?? ''), leadId),
  };
}

// ── Trial sequence ────────────────────────────────────────────────────────────

export interface TrialEmailCtx {
  firstName: string;
  revenueAtRisk?: number;
  annualizedLoss?: number;
  recoveryEstimate?: number;
  customers?: number;
  playbooks?: number;
  avgRisk?: number;
  revenueMonitored?: number;
  inactivePlaybooks?: number;
  stripeConnected?: boolean;
}

const TRIAL_DARK = `All inline styles — no CSS classes. Headings: color:#f1f5f9;font-size:22px;font-weight:800;margin:0 0 16px;line-height:1.3. Body text: color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 16px. No outer wrapper div — it will be added automatically.`;

export async function generateTrialEmail(
  user: TrialEmailCtx,
  stepKey: string,
): Promise<{ subject: string; html: string } | null> {
  const appUrl = APP_URL;

  const ctaMap: Record<string, string> = {
    trial_day_0:  `<p style="margin:0 0 24px;"><a href="${appUrl}/integrations" style="display:inline-block;background:#6366f1;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Connect Stripe Now →</a></p>`,
    trial_day_3:  `<p style="margin:0 0 20px;"><a href="${appUrl}/integrations" style="display:inline-block;background:#6366f1;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Connect Stripe — 2 Minutes →</a></p><p style="color:#475569;font-size:13px;margin:0;">No Stripe? You can also <a href="${appUrl}/integrations" style="color:#818cf8;">upload a CSV</a> to get started immediately.</p>`,
    trial_day_7:  `<p style="margin:0;"><a href="${appUrl}/playbooks" style="display:inline-block;background:#8b5cf6;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Activate My Playbooks →</a></p>`,
    trial_day_10: `<p style="margin:0;"><a href="${appUrl}/dashboard" style="display:inline-block;background:#ef4444;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">See My Dashboard →</a></p>`,
    trial_day_13: `<p style="margin:0 0 16px;"><a href="${appUrl}/#pricing" style="display:inline-block;background:#6366f1;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Upgrade Now — Keep Everything →</a></p><p style="color:#475569;font-size:12px;margin:0;">Questions? Just reply to this email — we respond within a few hours.</p>`,
    trial_day_17: `<p style="margin:0 0 16px;"><a href="${appUrl}/dashboard" style="display:inline-block;background:#6366f1;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">View Full Dashboard →</a></p><p style="color:#475569;font-size:12px;margin:0;">You have 13 days left in your trial. <a href="${appUrl}/#pricing" style="color:#818cf8;">Upgrade anytime</a> to keep everything running.</p>`,
    trial_day_21: `<p style="margin:0;"><a href="${appUrl}/playbooks" style="display:inline-block;background:#8b5cf6;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Activate My Playbooks →</a></p>`,
    trial_day_25: `<p style="margin:0 0 16px;"><a href="${appUrl}/#pricing" style="display:inline-block;background:#10b981;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Upgrade Now — Keep Everything →</a></p><p style="color:#475569;font-size:12px;margin:0;">Questions? Just reply to this email.</p>`,
    trial_day_28: `<p style="margin:0 0 16px;"><a href="${appUrl}/#pricing" style="display:inline-block;background:#10b981;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Upgrade Now — $79/month →</a></p><p style="color:#475569;font-size:12px;margin:0;">Upgrading takes 60 seconds. Cancel anytime. Questions? Just reply to this email.</p>`,
    trial_day_29: `<p style="margin:0 0 16px;"><a href="${appUrl}/#pricing" style="display:inline-block;background:#10b981;color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Upgrade Now — Keep Everything →</a></p><p style="color:#475569;font-size:13px;margin:0 0 8px;">Not ready yet? Your data stays safe for 30 days after trial end.</p>`,
  };

  const prompts: Record<string, string> = {
    trial_day_0: `Write a welcome email for ${user.firstName}, who just signed up for ChurnGuard (SaaS churn prevention tool).

Goal: get them to connect Stripe within 48 hours.

Write inner HTML body with:
1. A warm but direct welcome headline for ${user.firstName}
2. A paragraph about getting set up to find revenue at risk automatically
3. A "first step" highlight box (background:#1e293b;border:1px solid #334155;border-radius:10px;padding:20px;margin:0 0 24px):
   - Small label: "Your first step"
   - Bold text: "Connect Stripe to see your live Revenue at Risk"
   - Description: takes 2 minutes, pulls subscription data, shows at-risk customers and MRR at stake
4. A "what happens next" paragraph: automatic risk scores per customer, retention playbooks fire before they cancel
Do NOT include a CTA button — it will be appended.
${TRIAL_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    trial_day_3: `Write a day-3 check-in email for ChurnGuard trial user ${user.firstName}.

Write inner HTML body with:
1. A "quick check-in" headline for ${user.firstName}
2. A paragraph: 3 days into the trial, Stripe is the single most valuable thing to connect
3. A feature list box (background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-radius:12px;padding:20px;margin:0 0 24px) with header "What connecting Stripe unlocks" and 4 bullet items:
   - Live Revenue at Risk — past due + paused + expiring trials
   - Automatic risk score for every subscription
   - Payment failure alerts before customers cancel
   - Trial-to-paid conversion tracking
Do NOT include a CTA button — it will be appended (CSV alternative link included in CTA).
${TRIAL_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    trial_day_7: `Write a day-7 playbooks email for ChurnGuard trial user ${user.firstName}.

Write inner HTML body with:
1. A headline "3 playbooks that stop churn on autopilot"
2. A brief intro for ${user.firstName}
3. Three playbook cards (background:#1e293b;border:1px solid #334155;border-radius:10px;padding:18px;margin-bottom:12px):
   - "🚀 Onboarding Rescue" — fires when new user hasn't completed setup after 48h. Avg impact: +12% activation rate.
   - "🔇 Silent Quitter" — detects 30+ day inactive customers before cancellation. 18% reactivation.
   - "💳 Payment Saver" — catches failed payments instantly. Recovers 35–45% of payments that would otherwise churn.
Each card: title in color:#f1f5f9;font-size:15px;font-weight:600, description in color:#64748b;font-size:13px;line-height:1.6
Do NOT include a CTA button — it will be appended.
${TRIAL_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    trial_day_10: `Write a day-10 revenue-at-risk email for ChurnGuard trial user ${user.firstName}.

DATA:
- Revenue at risk: $${(user.revenueAtRisk ?? 2400).toLocaleString()}/month
- Annual loss: $${(user.annualizedLoss ?? 28800).toLocaleString()}
- Recoverable: ~$${(user.recoveryEstimate ?? 840).toLocaleString()}/month (30–40% recovery typical)
- Data source: ${user.stripeConnected ? 'their connected Stripe account' : 'industry benchmarks for SaaS at their stage'}

Write inner HTML body with:
1. A headline "$${(user.revenueAtRisk ?? 2400).toLocaleString()}/month is at risk of churning"
2. A brief intro mentioning it's ${user.stripeConnected ? 'from their Stripe data' : 'based on industry benchmarks'}
3. A large revenue block (background:rgba(239,68,68,0.07);border:1px solid #7f1d1d;border-radius:12px;padding:24px;margin:0 0 24px;text-align:center):
   - "Revenue at Risk" label in small caps (color:#94a3b8;font-size:12px;text-transform:uppercase)
   - $${(user.revenueAtRisk ?? 2400).toLocaleString()} in large text (color:#ef4444;font-size:48px;font-weight:800;line-height:1)
   - "$${(user.annualizedLoss ?? 28800).toLocaleString()} per year if nothing changes" below in color:#64748b
4. A paragraph: ChurnGuard typically recovers 30–40% (~$${(user.recoveryEstimate ?? 840).toLocaleString()}/month) on autopilot
Do NOT include a CTA button — it will be appended.
${TRIAL_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    trial_day_13: `Write a trial-ending urgency email for ChurnGuard trial user ${user.firstName}. Trial ends tomorrow.

DATA:
- Customers tracked: ${user.customers ?? 0}
- Active playbooks: ${user.playbooks ?? 0}
- Avg risk score: ${user.avgRisk ?? 0}/100

Write inner HTML body with:
1. A headline "Trial ends tomorrow, ${user.firstName}"
2. A brief paragraph about what's set up and what stops without upgrade
3. An account summary table (background:#111827;border:1px solid #1f2937;border-radius:12px;overflow:hidden;margin:0 0 24px):
   - Header row (padding:12px 20px;background:#0d111b): "Account summary" label
   - Row: Customers tracked | ${user.customers ?? 0} (color:#22c55e)
   - Row: Active playbooks | ${user.playbooks ?? 0} (color:#22c55e)
   - Row: Avg risk score | ${user.avgRisk ?? 0}/100 (color:#f59e0b)
   - Warning row (background:rgba(239,68,68,0.05);color:#ef4444): "⚠️ After trial: monitoring pauses, playbooks stop, risk alerts disabled"
4. A paragraph: upgrading takes 60 seconds, data and settings stay intact
Do NOT include a CTA button — it will be appended.
${TRIAL_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    trial_day_17: `Write a day-17 activity snapshot email for ChurnGuard trial user ${user.firstName}.

DATA:
- Customers monitored: ${user.customers ?? 0}
- Active playbooks: ${user.playbooks ?? 0}
- Revenue under protection: $${(user.revenueMonitored ?? 0).toLocaleString()}/month

Write inner HTML body with:
1. A headline: "Here's your ChurnGuard activity snapshot, ${user.firstName}"
2. A paragraph about being over halfway through the trial
3. A dashboard summary table (background:#111827;border:1px solid #1f2937;border-radius:12px;overflow:hidden;margin:0 0 24px):
   - Header row (background:#0d111b): "Your trial dashboard — day 17"
   - Row: Customers being monitored | ${user.customers ?? 0} (color:#22c55e)
   - Row: Active automation playbooks | ${user.playbooks ?? 0} (color:#22c55e)
   - Row: Revenue under protection | $${(user.revenueMonitored ?? 0).toLocaleString()}/mo (color:#818cf8)
4. A paragraph: every customer scored daily, playbooks fire automatically when risk threshold crossed
Do NOT include a CTA button — it will be appended.
${TRIAL_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    trial_day_21: `Write a day-21 case study email for ChurnGuard trial user ${user.firstName}.

Marcus runs a B2B SaaS with $180K MRR. After using ChurnGuard: 68% reduction in silent churn, $14K MRR recovered in 90 days, 2 hours/week saved.
${user.inactivePlaybooks ? `${user.firstName} currently has ${user.inactivePlaybooks} inactive playbooks.` : ''}

Write inner HTML body with:
1. A headline "A story that might sound familiar, ${user.firstName}"
2. A paragraph about Marcus's situation before ChurnGuard
3. A results block (background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-radius:12px;padding:20px;margin:0 0 24px):
   - Header: "What changed after ChurnGuard" (color:#a5b4fc;font-size:12px;font-weight:700;text-transform:uppercase)
   - 3 results: metric in color:#22c55e;font-size:18px;font-weight:700 | description in color:#94a3b8;font-size:14px
4. A bridge: Marcus had inactive playbooks just like ${user.firstName} might${user.inactivePlaybooks ? ` (${user.inactivePlaybooks} inactive right now)` : ''} — activating them made the difference
Do NOT include a CTA button — it will be appended.
${TRIAL_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    trial_day_25: `Write a day-25 account summary email for ChurnGuard trial user ${user.firstName}. 5 days left in trial.

DATA:
- Customers tracked: ${user.customers ?? 0}
- Revenue monitored: $${(user.revenueMonitored ?? 0).toLocaleString()}/month
- Active playbooks: ${user.playbooks ?? 0}
- Avg risk score: ${user.avgRisk ?? 0}/100

Write inner HTML body with:
1. A headline "5 days left on your trial, ${user.firstName}"
2. A paragraph: "here's everything ChurnGuard has built for you — this all stops if you don't upgrade"
3. An account summary table (background:#111827;border:1px solid #1f2937;border-radius:12px;overflow:hidden;margin:0 0 24px):
   - Header (background:#0d111b): "Account summary — day 25"
   - Row: Customers tracked | ${user.customers ?? 0} (color:#22c55e)
   - Row: Revenue monitored | $${(user.revenueMonitored ?? 0).toLocaleString()}/mo (color:#818cf8)
   - Row: Active playbooks | ${user.playbooks ?? 0} (color:#22c55e)
   - Row: Avg risk score | ${user.avgRisk ?? 0}/100 (color:#f59e0b)
   - Warning row (background:rgba(239,68,68,0.05);color:#ef4444): "⚠️ After trial: all monitoring, playbooks, and alerts stop"
4. A paragraph: starts at $79/month, upgrade takes 60 seconds
Do NOT include a CTA button — it will be appended.
${TRIAL_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    trial_day_28: `Write a day-28 final warning email for ChurnGuard trial user ${user.firstName}. 2 days left.

Write inner HTML body with:
1. A headline "2 days left, ${user.firstName}"
2. A paragraph: "dashboard goes dark after 48 hours — no risk scoring, no playbooks, no protection"
3. A warning box (background:rgba(239,68,68,0.07);border:1px solid #7f1d1d;border-radius:12px;padding:20px;margin:0 0 24px):
   - Header: "What stops working at trial end:" (color:#f87171;font-size:14px;font-weight:600)
   - Bullet list (color:#94a3b8;font-size:14px;line-height:2): daily risk scoring, automation playbooks, Slack risk alerts, email retention sequences, Revenue at Risk dashboard
4. A reassurance: data is safe for 30 days after trial end
5. A closing: "churn doesn't wait"
Do NOT include a CTA button — it will be appended.
${TRIAL_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,

    trial_day_29: `Write the absolute last-chance email for ChurnGuard trial user ${user.firstName}. Trial ends tomorrow.

Write inner HTML body with:
1. A headline "Your trial ends tomorrow, ${user.firstName}"
2. A paragraph: all protection stops at midnight
3. An offer box (background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:24px;margin:0 0 24px;text-align:center):
   - "Limited time offer" header (color:#6ee7b7;font-size:13px;font-weight:700;text-transform:uppercase)
   - "$79/month" in large text (color:#f1f5f9;font-size:28px;font-weight:800)
   - "Cancel anytime. 10× ROI guarantee or your money back." (color:#64748b;font-size:13px)
4. A brief urgency line: every day without ChurnGuard = at-risk customers going undetected
Do NOT include a CTA button — it will be appended.
${TRIAL_DARK}

Return ONLY valid JSON: {"subject": "...", "body": "..."}
"body" = inner HTML only. No outer wrapper.`,
  };

  const prompt = prompts[stepKey];
  if (!prompt) return null;

  const result = await callClaude(prompt);
  if (!result) return null;

  return {
    subject: result.subject,
    html: trialEmailShell(result.body + (ctaMap[stepKey] ?? '')),
  };
}
