/**
 * Trial email sequence — sent to ChurnGuard account owners during their 14-day trial.
 * Steps: Day 0 (immediate), Day 3, Day 7, Day 10, Day 13.
 *
 * Templates are stored in the EmailTemplate DB table so admins can edit them.
 * These code defaults are used when no DB override exists.
 *
 * Variable placeholders: {{firstName}}, {{appUrl}}, {{revenueAtRisk}},
 *   {{annualizedLoss}}, {{recoveryEstimate}}, {{stripeStatus}},
 *   {{customers}}, {{playbooks}}, {{avgRisk}}
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://churnguardapp.com';

export const TRIAL_KEYS = [
  'trial_day_0',
  'trial_day_3',
  'trial_day_7',
  'trial_day_10',
  'trial_day_13',
] as const;

export type TrialKey = typeof TRIAL_KEYS[number];

// Days from user.createdAt when each step fires
export const TRIAL_SCHEDULE_DAYS: Record<TrialKey, number> = {
  trial_day_0:  0,
  trial_day_3:  3,
  trial_day_7:  7,
  trial_day_10: 10,
  trial_day_13: 13,
};

export interface TrialTemplate {
  key: TrialKey;
  name: string;
  subject: string;
  bodyHtml: string;
}

// ── Rendering ────────────────────────────────────────────────────────────────

export function renderTemplate(html: string, vars: Record<string, string>): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

// ── Shared shell ─────────────────────────────────────────────────────────────

function shell(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#0a0a12;font-family:system-ui,-apple-system,sans-serif;">
<div style="max-width:560px;margin:0 auto;background:#0f172a;border-radius:14px;overflow:hidden;border:1px solid #1e293b;">
  <div style="padding:20px 28px;border-bottom:1px solid #1e293b;background:linear-gradient(135deg,#1a1040,#0f172a);">
    <span style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:7px 14px;border-radius:8px;font-weight:700;font-size:15px;color:#fff;">🛡️ ChurnGuard</span>
  </div>
  <div style="padding:32px 28px;">${body}</div>
  <div style="padding:16px 28px;border-top:1px solid #1e293b;background:#080c18;">
    <p style="color:#334155;font-size:11px;margin:0;line-height:1.6;">
      You're receiving this because you signed up for a ChurnGuard trial.&nbsp;&nbsp;·&nbsp;&nbsp;
      <a href="${APP_URL}/dashboard/settings" style="color:#475569;text-decoration:underline;">Manage preferences</a>
    </p>
  </div>
</div>
</body></html>`;
}

function btn(text: string, href: string, color = '#6366f1'): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#fff;font-weight:700;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:15px;">${text}</a>`;
}

// ── Default templates ────────────────────────────────────────────────────────

export const TRIAL_DEFAULTS: Record<TrialKey, Omit<TrialTemplate, 'key'>> = {

  trial_day_0: {
    name: 'Day 0 — Welcome',
    subject: "Your churn audit is ready — here's what to do next",
    bodyHtml: shell(`
      <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">Welcome to ChurnGuard, {{firstName}}!</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">
        Your account is set up. Now let's find out exactly how much revenue you're losing — and stop it automatically.
      </p>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:20px;margin:0 0 24px;">
        <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px;">Your first step</p>
        <p style="color:#f1f5f9;font-size:16px;font-weight:600;margin:0 0 6px;">Connect Stripe to see your live Revenue at Risk</p>
        <p style="color:#64748b;font-size:13px;margin:0;">Takes 2 minutes. We pull your subscription data and show you exactly which customers are about to cancel and how much MRR is at stake.</p>
      </div>
      <p style="margin:0 0 24px;">${btn('Connect Stripe Now →', '{{appUrl}}/integrations')}</p>
      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
        <strong style="color:#94a3b8;">What happens next:</strong> Once connected, ChurnGuard automatically scores every customer on a 0–100 risk scale and fires retention playbooks before they cancel.
      </p>
    `),
  },

  trial_day_3: {
    name: 'Day 3 — Stripe Reminder',
    subject: '3 days in — have you connected Stripe yet?',
    bodyHtml: shell(`
      <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 12px;">Quick check-in, {{firstName}}</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">
        You're 3 days into your trial. Connecting Stripe is the single most valuable thing you can do right now — it unlocks the full picture of your revenue at risk.
      </p>
      <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-radius:12px;padding:20px;margin:0 0 24px;">
        <p style="color:#a5b4fc;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin:0 0 12px;">What connecting Stripe unlocks</p>
        <ul style="color:#94a3b8;font-size:14px;line-height:2.2;margin:0;padding-left:20px;">
          <li>Live <strong style="color:#f1f5f9;">Revenue at Risk</strong> — past due + paused + expiring trials</li>
          <li>Automatic risk score for every subscription</li>
          <li>Payment failure alerts before customers cancel</li>
          <li>Trial-to-paid conversion tracking</li>
        </ul>
      </div>
      <p style="margin:0 0 20px;">${btn('Connect Stripe — 2 Minutes →', '{{appUrl}}/integrations')}</p>
      <p style="color:#475569;font-size:13px;margin:0;">
        No Stripe? You can also <a href="{{appUrl}}/integrations" style="color:#818cf8;">upload a CSV</a> to get started immediately.
      </p>
    `),
  },

  trial_day_7: {
    name: 'Day 7 — Playbooks',
    subject: 'Your first automation playbook is waiting',
    bodyHtml: shell(`
      <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">3 playbooks that stop churn on autopilot</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px;">
        Hey {{firstName}} — here are the three playbooks ChurnGuard customers activate first. Each one runs automatically in the background, 24/7.
      </p>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:18px;margin-bottom:12px;">
        <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0 0 6px;">🚀 Onboarding Rescue</p>
        <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">Fires when a new user hasn't completed key setup steps after 48 hours. Sends a personalized check-in and a quick-start guide. Average impact: +12% activation rate.</p>
      </div>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:18px;margin-bottom:12px;">
        <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0 0 6px;">🔇 Silent Quitter</p>
        <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">Detects customers who go quiet (30+ days inactive) before they cancel. Triggers a "we miss you" campaign with a usage tip. Average impact: 18% reactivation.</p>
      </div>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:18px;margin-bottom:24px;">
        <p style="color:#f1f5f9;font-size:15px;font-weight:600;margin:0 0 6px;">💳 Payment Saver</p>
        <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">Catches failed payments the moment they happen and sends a frictionless retry flow. Recovers 35–45% of payments that would otherwise churn.</p>
      </div>
      <p style="margin:0;">${btn('Activate My Playbooks →', '{{appUrl}}/playbooks', '#8b5cf6')}</p>
    `),
  },

  trial_day_10: {
    name: 'Day 10 — Revenue at Risk',
    subject: "You're losing ${{revenueAtRisk}}/month — here's the proof",
    bodyHtml: shell(`
      <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">${'$'}{{revenueAtRisk}}/month is at risk of churning</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">
        Hey {{firstName}} — {{stripeStatus}} here's the current revenue at risk in your business:
      </p>
      <div style="background:rgba(239,68,68,0.07);border:1px solid #7f1d1d;border-radius:12px;padding:24px;margin:0 0 24px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.05em;margin:0 0 6px;">Revenue at Risk</p>
        <p style="color:#ef4444;font-size:48px;font-weight:800;margin:0 0 4px;">${'$'}{{revenueAtRisk}}<span style="font-size:22px;font-weight:600;">/mo</span></p>
        <p style="color:#64748b;font-size:13px;margin:0;">${'$'}{{annualizedLoss}} per year if nothing changes</p>
      </div>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px;">
        ChurnGuard's automated playbooks typically recover <strong style="color:#f1f5f9;">30–40% of at-risk MRR</strong> within the first 30 days — roughly <strong style="color:#22c55e;">${'$'}{{recoveryEstimate}}/month</strong> recovered on autopilot.
      </p>
      <p style="margin:0;">${btn('See My Dashboard →', '{{appUrl}}/dashboard', '#ef4444')}</p>
    `),
  },

  trial_day_13: {
    name: 'Day 13 — Trial Ending',
    subject: "Your trial ends tomorrow — here's what you'll lose",
    bodyHtml: shell(`
      <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">Trial ends tomorrow, {{firstName}}</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">
        Your 14-day ChurnGuard trial expires tomorrow. Here's what's set up on your account — and what stops working if you don't upgrade:
      </p>
      <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;overflow:hidden;margin:0 0 24px;">
        <div style="padding:12px 20px;border-bottom:1px solid #1f2937;background:#0d111b;">
          <p style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.05em;margin:0;">Account summary</p>
        </div>
        <div style="padding:14px 20px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;">
          <span style="color:#94a3b8;font-size:14px;">Customers tracked</span>
          <span style="color:#22c55e;font-size:14px;font-weight:600;">{{customers}}</span>
        </div>
        <div style="padding:14px 20px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;">
          <span style="color:#94a3b8;font-size:14px;">Active playbooks</span>
          <span style="color:#22c55e;font-size:14px;font-weight:600;">{{playbooks}}</span>
        </div>
        <div style="padding:14px 20px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;">
          <span style="color:#94a3b8;font-size:14px;">Avg customer risk score</span>
          <span style="color:#f59e0b;font-size:14px;font-weight:600;">{{avgRisk}}/100</span>
        </div>
        <div style="padding:14px 20px;background:rgba(239,68,68,0.05);">
          <p style="color:#ef4444;font-size:13px;margin:0;">⚠️ After trial: monitoring pauses, playbooks stop, risk alerts disabled</p>
        </div>
      </div>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px;">
        Upgrading takes 60 seconds. Your data, settings, and playbooks stay exactly as they are.
      </p>
      <p style="margin:0 0 16px;">${btn('Upgrade Now — Keep Everything →', '{{appUrl}}/#pricing')}</p>
      <p style="color:#475569;font-size:12px;margin:0;">Questions? Just reply to this email — we respond within a few hours.</p>
    `),
  },
};

export function getDefaultTemplate(key: TrialKey): TrialTemplate {
  return { key, ...TRIAL_DEFAULTS[key] };
}
