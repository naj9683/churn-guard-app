/**
 * Trial email sequence — sent to ChurnGuard account owners during their 30-day trial.
 * Steps: Day 0, Day 3, Day 7, Day 10, Day 13, Day 17, Day 21, Day 25, Day 28, Day 29.
 *
 * Templates are stored in the EmailTemplate DB table so admins can edit them.
 * These code defaults are used when no DB override exists.
 *
 * Variable placeholders: {{firstName}}, {{appUrl}}, {{revenueAtRisk}},
 *   {{annualizedLoss}}, {{recoveryEstimate}}, {{stripeStatus}},
 *   {{customers}}, {{playbooks}}, {{avgRisk}}, {{revenueMonitored}},
 *   {{inactivePlaybooks}}
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://churnguardapp.com';

export const TRIAL_KEYS = [
  'trial_day_0',
  'trial_day_3',
  'trial_day_7',
  'trial_day_10',
  'trial_day_13',
  'trial_day_17',
  'trial_day_21',
  'trial_day_25',
  'trial_day_28',
  'trial_day_29',
] as const;

export type TrialKey = typeof TRIAL_KEYS[number];

// Days from user.createdAt when each step fires
export const TRIAL_SCHEDULE_DAYS: Record<TrialKey, number> = {
  trial_day_0:  0,
  trial_day_3:  3,
  trial_day_7:  7,
  trial_day_10: 10,
  trial_day_13: 13,
  trial_day_17: 17,
  trial_day_21: 21,
  trial_day_25: 25,
  trial_day_28: 28,
  trial_day_29: 29,
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
        Your 30-day ChurnGuard trial expires tomorrow. Here's what's set up on your account — and what stops working if you don't upgrade:
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

  trial_day_17: {
    name: 'Day 17 — First Month Insights',
    subject: "Your first 17 days with ChurnGuard — here's what we've tracked",
    bodyHtml: shell(`
      <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">Here's your ChurnGuard activity snapshot, {{firstName}}</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">
        You're over halfway through your trial. Here's everything ChurnGuard has been doing for your business behind the scenes:
      </p>
      <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;overflow:hidden;margin:0 0 24px;">
        <div style="padding:12px 20px;border-bottom:1px solid #1f2937;background:#0d111b;">
          <p style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.05em;margin:0;">Your trial dashboard — day 17</p>
        </div>
        <div style="padding:14px 20px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;">
          <span style="color:#94a3b8;font-size:14px;">Customers being monitored</span>
          <span style="color:#22c55e;font-size:14px;font-weight:600;">{{customers}}</span>
        </div>
        <div style="padding:14px 20px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;">
          <span style="color:#94a3b8;font-size:14px;">Active automation playbooks</span>
          <span style="color:#22c55e;font-size:14px;font-weight:600;">{{playbooks}}</span>
        </div>
        <div style="padding:14px 20px;">
          <span style="color:#94a3b8;font-size:14px;">Revenue under protection</span>
          <span style="color:#818cf8;font-size:14px;font-weight:600;float:right;">${'$'}{{revenueMonitored}}/mo</span>
        </div>
      </div>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px;">
        Every customer on your list is being scored daily. The moment one crosses the risk threshold, ChurnGuard fires a retention playbook automatically — no manual work on your end.
      </p>
      <p style="margin:0 0 16px;">${btn('View Full Dashboard →', '{{appUrl}}/dashboard', '#6366f1')}</p>
      <p style="color:#475569;font-size:12px;margin:0;">You have 13 days left in your trial. <a href="{{appUrl}}/#pricing" style="color:#818cf8;">Upgrade anytime</a> to keep everything running.</p>
    `),
  },

  trial_day_21: {
    name: 'Day 21 — Case Study',
    subject: 'How a SaaS founder saved $14K/month with ChurnGuard',
    bodyHtml: shell(`
      <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">A story that might sound familiar, {{firstName}}</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">
        Marcus runs a B2B SaaS with $180K MRR. Last year, he was losing 4–5 customers a month — mostly to silent churn. No cancellation emails. They just stopped paying.
      </p>
      <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-radius:12px;padding:20px;margin:0 0 24px;">
        <p style="color:#a5b4fc;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin:0 0 16px;">What changed after ChurnGuard</p>
        <div style="display:flex;gap:12px;margin-bottom:12px;">
          <span style="color:#22c55e;font-size:18px;font-weight:700;min-width:80px;">-68%</span>
          <span style="color:#94a3b8;font-size:14px;line-height:1.5;">reduction in silent churn — the Silent Quitter playbook catches 7-in-10 before they leave</span>
        </div>
        <div style="display:flex;gap:12px;margin-bottom:12px;">
          <span style="color:#22c55e;font-size:18px;font-weight:700;min-width:80px;">$14K</span>
          <span style="color:#94a3b8;font-size:14px;line-height:1.5;">MRR recovered in the first 90 days from payment failures and at-risk accounts</span>
        </div>
        <div style="display:flex;gap:12px;">
          <span style="color:#22c55e;font-size:18px;font-weight:700;min-width:80px;">2 hrs</span>
          <span style="color:#94a3b8;font-size:14px;line-height:1.5;">saved per week — no more manual "check-in" emails or spreadsheet tracking</span>
        </div>
      </div>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 8px;">
        Marcus had {{inactivePlaybooks}} playbooks sitting inactive when he started — just like you might right now. Activating them was the single action that made the difference.
      </p>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px;">
        Which of your playbooks are still switched off?
      </p>
      <p style="margin:0;">${btn('Activate My Playbooks →', '{{appUrl}}/playbooks', '#8b5cf6')}</p>
    `),
  },

  trial_day_25: {
    name: 'Day 25 — Trial Ending in 5 Days',
    subject: 'Your trial ends in 5 days — full account summary',
    bodyHtml: shell(`
      <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">5 days left on your trial, {{firstName}}</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">
        Here's everything ChurnGuard has built for you over the past 25 days. This all stops if you don't upgrade:
      </p>
      <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;overflow:hidden;margin:0 0 24px;">
        <div style="padding:12px 20px;border-bottom:1px solid #1f2937;background:#0d111b;">
          <p style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.05em;margin:0;">Account summary — day 25</p>
        </div>
        <div style="padding:14px 20px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;">
          <span style="color:#94a3b8;font-size:14px;">Customers tracked</span>
          <span style="color:#22c55e;font-size:14px;font-weight:600;">{{customers}}</span>
        </div>
        <div style="padding:14px 20px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;">
          <span style="color:#94a3b8;font-size:14px;">Revenue monitored</span>
          <span style="color:#818cf8;font-size:14px;font-weight:600;">${'$'}{{revenueMonitored}}/mo</span>
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
          <p style="color:#ef4444;font-size:13px;margin:0;">⚠️ After trial: all monitoring, playbooks, and alerts stop</p>
        </div>
      </div>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px;">
        Upgrading takes 60 seconds and keeps everything exactly as you've set it up. Starting at $79/month.
      </p>
      <p style="margin:0 0 16px;">${btn('Upgrade Now — Keep Everything →', '{{appUrl}}/#pricing', '#10b981')}</p>
      <p style="color:#475569;font-size:12px;margin:0;">Questions? Just reply to this email.</p>
    `),
  },

  trial_day_28: {
    name: 'Day 28 — 2 Days Left',
    subject: 'Your trial ends in 2 days — upgrade to keep your data',
    bodyHtml: shell(`
      <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">2 days left, {{firstName}}</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">
        Your ChurnGuard trial ends in 48 hours. After that, your dashboard goes dark — no more risk scoring, no more automated playbooks, no more revenue protection.
      </p>
      <div style="background:rgba(239,68,68,0.07);border:1px solid #7f1d1d;border-radius:12px;padding:20px;margin:0 0 24px;">
        <p style="color:#f87171;font-size:14px;font-weight:600;margin:0 0 12px;">What stops working at trial end:</p>
        <ul style="color:#94a3b8;font-size:14px;line-height:2;margin:0;padding-left:20px;">
          <li>Daily customer risk scoring</li>
          <li>All automation playbooks</li>
          <li>Slack risk alerts</li>
          <li>Email retention sequences</li>
          <li>Revenue at Risk dashboard</li>
        </ul>
      </div>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 8px;">
        <strong style="color:#f1f5f9;">Your data is safe.</strong> We retain everything for 30 days after trial end, so nothing is lost if you upgrade within that window.
      </p>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px;">
        But the monitoring stops. And churn doesn't wait.
      </p>
      <p style="margin:0 0 16px;">${btn('Upgrade Now — $79/month →', '{{appUrl}}/#pricing', '#10b981')}</p>
      <p style="color:#475569;font-size:12px;margin:0;">Upgrading takes 60 seconds. Cancel anytime. Questions? Just reply to this email.</p>
    `),
  },

  trial_day_29: {
    name: 'Day 29 — Last Chance',
    subject: 'Last chance — your ChurnGuard trial ends tomorrow',
    bodyHtml: shell(`
      <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">Your trial ends tomorrow, {{firstName}}</h2>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">
        This is it — your 30-day ChurnGuard trial expires tomorrow. After midnight, all protection stops.
      </p>
      <div style="background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:24px;margin:0 0 24px;text-align:center;">
        <p style="color:#6ee7b7;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px;">Limited time offer</p>
        <p style="color:#f1f5f9;font-size:28px;font-weight:800;margin:0 0 4px;">Start at $79/month</p>
        <p style="color:#64748b;font-size:13px;margin:0;">Cancel anytime. 10× ROI guarantee or your money back.</p>
      </div>
      <p style="color:#94a3b8;line-height:1.7;margin:0 0 24px;">
        Every day without ChurnGuard is another day your at-risk customers go undetected. Don't let the work you've set up this month go to waste.
      </p>
      <p style="margin:0 0 16px;">${btn('Upgrade Now — Keep Everything →', '{{appUrl}}/#pricing', '#10b981')}</p>
      <p style="color:#475569;font-size:13px;margin:0 0 8px;">
        Not ready yet? Your data stays safe for 30 days after trial end — you can upgrade and pick up right where you left off.
      </p>
      <p style="color:#475569;font-size:13px;margin:0;">Questions? Just reply to this email — we respond within a few hours.</p>
    `),
  },
};

export function getDefaultTemplate(key: TrialKey): TrialTemplate {
  return { key, ...TRIAL_DEFAULTS[key] };
}

// Exported shell wrapper used by AI sequence generator
export function trialEmailShell(body: string): string {
  return shell(body);
}
