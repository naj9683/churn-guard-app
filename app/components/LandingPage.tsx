'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ACCENT, ACCENT_BG, ACCENT_BORDER, BORDER, BORDER_MED,
  TEXT, MUTED, FAINT, WHITE, PAGE_BG,
  SUCCESS, SUCCESS_BG, SUCCESS_BORD,
  DANGER, DANGER_BG, DANGER_BORD,
  WARN, WARN_BG, WARN_BORD,
  btnPrimary, btnOutline,
} from '@/app/lib/design-tokens';
import PublicShell from '@/app/components/ui/PublicShell';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function getPlan(mrr: number): { name: string; monthly: number | null } {
  if (mrr <= 50000)   return { name: 'Seed',       monthly: 79 };
  if (mrr <= 200000)  return { name: 'Growth',     monthly: 149 };
  if (mrr <= 1000000) return { name: 'Scale',      monthly: 299 };
  return                     { name: 'Enterprise', monthly: null };
}

// ─── Inline SVGs ─────────────────────────────────────────────────────────────
function IconCheck({ color = SUCCESS }: { color?: string }) {
  return (
    <svg width="14" height="14" fill="none" stroke={color} strokeWidth={2} viewBox="0 0 24 24"
      aria-hidden="true" style={{ flexShrink: 0, marginTop: '2px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconChevron({ className }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" fill="none" stroke="currentColor"
      strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, color: FAINT }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── Calculator ───────────────────────────────────────────────────────────────
function ChurnCalculator() {
  const [mrr, setMrr]             = useState(25000);
  const [churnRate, setChurnRate] = useState(3);

  const lostPerYear    = Math.round(mrr * (churnRate / 100) * 12);
  const recoverable    = Math.round(lostPerYear * 0.35);
  const plan           = getPlan(mrr);
  const planCostAnnual = plan.monthly ? plan.monthly * 12 : null;
  const churnColor     = churnRate > 5 ? DANGER : churnRate > 2 ? WARN : SUCCESS;

  return (
    <div style={{ background: WHITE, border: `1px solid ${BORDER_MED}`, borderRadius: '12px', padding: '28px 32px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '28px' }}>

        {/* MRR slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
            <label htmlFor="mrr-slider" style={{ fontSize: '14px', color: TEXT, fontWeight: 500 }}>
              Monthly recurring revenue
            </label>
            <span style={{ fontSize: '15px', fontWeight: 500, color: ACCENT }}>{fmt(mrr)}</span>
          </div>
          <input
            id="mrr-slider"
            type="range"
            min={1000}
            max={500000}
            step={1000}
            value={mrr}
            onChange={e => setMrr(Number(e.target.value))}
            aria-valuetext={fmt(mrr)}
            className="cg-range"
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: FAINT, marginTop: '5px' }}>
            <span>$1k</span><span>$500k</span>
          </div>
        </div>

        {/* Churn rate slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
            <label htmlFor="churn-slider" style={{ fontSize: '14px', color: TEXT, fontWeight: 500 }}>
              Monthly churn rate
            </label>
            <span style={{ fontSize: '15px', fontWeight: 500, color: churnColor }}>{churnRate}%</span>
          </div>
          <input
            id="churn-slider"
            type="range"
            min={0.5}
            max={15}
            step={0.5}
            value={churnRate}
            onChange={e => setChurnRate(Number(e.target.value))}
            aria-valuetext={`${churnRate} percent monthly churn`}
            className="cg-range"
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: FAINT, marginTop: '5px' }}>
            <span>0.5%</span><span>15%</span>
          </div>
        </div>
      </div>

      {/* Output row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: '20px' }}>
        <div style={{ padding: '18px', background: DANGER_BG, border: `1px solid ${DANGER_BORD}`, borderRadius: '10px' }}>
          <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px' }}>Lost per year</div>
          <div style={{ fontSize: '22px', fontWeight: 500, color: DANGER }}>{fmt(lostPerYear)}</div>
        </div>
        <div style={{ padding: '18px', background: SUCCESS_BG, border: `1px solid ${SUCCESS_BORD}`, borderRadius: '10px' }}>
          <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px' }}>Recoverable at 35%</div>
          <div style={{ fontSize: '22px', fontWeight: 500, color: SUCCESS }}>{fmt(recoverable)}</div>
        </div>
        <div style={{ padding: '18px', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, borderRadius: '10px' }}>
          <div style={{ fontSize: '12px', color: MUTED, marginBottom: '6px' }}>
            ChurnGuard ({plan.name})
          </div>
          <div style={{ fontSize: '22px', fontWeight: 500, color: ACCENT }}>
            {planCostAnnual ? `${fmt(planCostAnnual)}/yr` : 'Custom'}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '14px', color: MUTED, textAlign: 'center' }}>
        See your real numbers —{' '}
        <Link href="/signup" style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
          connect Stripe free
        </Link>
      </p>
    </div>
  );
}

// ─── Dashboard showcase ───────────────────────────────────────────────────────
function DashboardShowcase() {
  const rows = [
    { name: 'CloudBase',    signal: 'No login in 14 days',       mrr: '$2,400', score: 85, level: 'danger' as const },
    { name: 'Acme Corp',    signal: 'Payment failed twice',       mrr: '$1,200', score: 92, level: 'danger' as const },
    { name: 'DataFlow Inc', signal: 'Reports usage down 60%',     mrr: '$890',   score: 78, level: 'warn'   as const },
  ];

  return (
    <div>
      {/* Browser chrome frame */}
      <div style={{ border: `1px solid ${BORDER_MED}`, borderRadius: '12px', overflow: 'hidden', background: WHITE }}>
        {/* Chrome bar */}
        <div style={{ background: PAGE_BG, borderBottom: `1px solid ${BORDER}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: BORDER_MED }} />
            ))}
          </div>
          <div style={{ flex: 1, background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '4px', padding: '4px 12px', fontSize: '12px', color: FAINT, fontFamily: 'monospace' }}>
            app.churnguardapp.com
          </div>
        </div>

        {/* Dashboard content */}
        <div style={{ padding: '24px' }}>
          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: '20px' }}>
            <div style={{ padding: '16px', border: `1px solid ${DANGER_BORD}`, borderRadius: '10px', background: DANGER_BG }}>
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '4px' }}>Revenue at risk</div>
              <div style={{ fontSize: '22px', fontWeight: 500, color: DANGER }}>$4,940</div>
            </div>
            <div style={{ padding: '16px', border: `1px solid ${SUCCESS_BORD}`, borderRadius: '10px', background: SUCCESS_BG }}>
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '4px' }}>Recovered this month</div>
              <div style={{ fontSize: '22px', fontWeight: 500, color: SUCCESS }}>$1,830</div>
            </div>
            <div style={{ padding: '16px', border: `1px solid ${BORDER}`, borderRadius: '10px', background: PAGE_BG }}>
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '4px' }}>Accounts flagged</div>
              <div style={{ fontSize: '22px', fontWeight: 500, color: TEXT }}>7</div>
            </div>
          </div>

          {/* At-risk accounts table */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '11px 16px', borderBottom: `1px solid ${BORDER}`, background: PAGE_BG, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: TEXT }}>At-risk accounts</span>
              <span style={{ fontSize: '12px', color: FAINT }}>sorted by MRR</span>
            </div>
            <div className="cg-risk-header" style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 72px', padding: '8px 16px', background: PAGE_BG, borderBottom: `1px solid ${BORDER}` }}>
              {['Account', 'Signal', 'MRR', 'Score'].map(h => (
                <span key={h} style={{ fontSize: '11px', fontWeight: 500, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
              ))}
            </div>
            {rows.map((row, i) => (
              <div key={row.name} className="cg-risk-row"
                style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 72px', padding: '12px 16px', alignItems: 'center', borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}` : 'none', background: WHITE }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: TEXT }}>{row.name}</span>
                <span style={{ fontSize: '13px', color: MUTED }}>{row.signal}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: TEXT }}>{row.mrr}</span>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: row.level === 'danger' ? DANGER_BG : WARN_BG,
                    color: row.level === 'danger' ? DANGER : WARN,
                    border: `1px solid ${row.level === 'danger' ? DANGER_BORD : WARN_BORD}`,
                  }}>
                    {row.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: '12px', color: FAINT, marginTop: '10px' }}>
        Example dashboard with sample data.
      </p>
    </div>
  );
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'How long does setup take?',
    a: 'Install the widget on your app or connect Stripe in under 10 minutes. First risk scores appear within 6 hours. You can also add customers manually or sync from HubSpot.',
  },
  {
    q: 'Is our customer data secure?',
    a: 'AES-256 encryption at rest, GDPR compliant, SOC2 Type II aligned. Stripe access is read-only by default — we never write to your Stripe account.',
  },
  {
    q: 'What if I exceed my MRR band?',
    a: 'We move you up automatically — no service interruption, no surprise bills. You will receive an email notice 7 days before the change.',
  },
  {
    q: 'Does it work with HubSpot?',
    a: 'Yes — native two-way sync. Contacts pull from HubSpot into ChurnGuard, and risk scores push back to HubSpot contact properties every 6 hours.',
  },
  {
    q: 'Do I need to send messages manually?',
    a: 'No. Automated playbooks send every message via email, SMS, and Slack. Retention emails are personalized by Claude AI. You review results.',
  },
  {
    q: 'Do I need Stripe to use ChurnGuard?',
    a: 'No. Stripe is one of several data sources. You can install the widget for engagement tracking, sync from HubSpot, or add customers manually. Stripe is optional.',
  },
];

// ─── Pricing tiers ────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Seed',
    price: '$79',
    band: 'Up to $50K MRR',
    features: ['100 customers tracked', 'Email + Slack alerts', 'Basic playbooks (3 active)', 'Payment dunning sequences', '7-day data retention'],
    popular: false,
    href: '/signup?plan=seed',
    cta: 'Get started',
  },
  {
    name: 'Growth',
    price: '$149',
    band: '$50K – $200K MRR',
    features: ['Unlimited customers tracked', 'SMS via Twilio', 'Advanced playbooks (10 active)', 'VIP account alerts', 'AI-written retention emails', '90-day data retention'],
    popular: true,
    href: '/signup?plan=growth',
    cta: 'Get started',
  },
  {
    name: 'Scale',
    price: '$299',
    band: '$200K – $1M MRR',
    features: ['Unlimited everything', 'Custom risk scoring models', 'API access + webhooks', 'Team collaboration (10 seats)', '1-year data retention'],
    popular: false,
    href: '/signup?plan=scale',
    cta: 'Get started',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    band: '$1M+ MRR',
    features: ['Dedicated success manager', 'White-glove onboarding', 'SSO + advanced security', 'Custom SLA guarantees', 'Unlimited seats'],
    popular: false,
    href: 'mailto:admin@churnguardapp.com?subject=Enterprise inquiry',
    cta: 'Contact us',
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <PublicShell>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>

          {/* Pill */}
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '999px', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT, fontSize: '13px', fontWeight: 500, marginBottom: '24px' }}>
            Now live · founding pricing open
          </div>

          <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)', fontWeight: 500, color: TEXT, lineHeight: 1.15, marginBottom: '18px', letterSpacing: '-0.02em' }}>
            The dashboard that tells you who's about to leave
          </h1>

          <p style={{ fontSize: '18px', color: MUTED, lineHeight: 1.7, marginBottom: '32px' }}>
            Connect Stripe, get a ranked list of at-risk accounts with the dollars attached. Retention runs on its own.
          </p>

          {/* CTAs */}
          <div className="cg-cta-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '14px' }}>
            <Link href="/signup" style={btnPrimary}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Start free
            </Link>
            <a href="/audit" className="cg-outline-btn" style={btnOutline}>
              Run your free churn audit →
            </a>
            <a href="/book-demo" className="cg-outline-btn" style={btnOutline}>
              Book a churn demo
            </a>
          </div>
          <p style={{ fontSize: '13px', color: FAINT }}>
            No credit card · set up in 15 minutes · cancel any time
          </p>
          <p style={{ fontSize: '13px', color: FAINT, marginTop: '4px' }}>
            See your at-risk MRR in 2 minutes — no signup required.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DASHBOARD SHOWCASE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 24px 80px', maxWidth: '960px', margin: '0 auto' }}>
        <DashboardShowcase />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CHURN CALCULATOR
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="calculator" style={{ padding: '80px 24px', borderTop: `1px solid ${BORDER}`, background: WHITE }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 500, color: TEXT, marginBottom: '8px', letterSpacing: '-0.01em' }}>
            What is churn costing you?
          </h2>
          <p style={{ fontSize: '16px', color: MUTED, marginBottom: '28px' }}>
            Adjust the sliders to your numbers. No email needed.
          </p>
          <ChurnCalculator />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW THE SCORING WORKS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: '80px 24px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 500, color: TEXT, marginBottom: '8px', letterSpacing: '-0.01em' }}>
            How the scoring works
          </h2>
          <p style={{ fontSize: '16px', color: MUTED, marginBottom: '48px', maxWidth: '500px' }}>
            Every account gets a score from 0–100, updated every 6 hours. Anything above 75 triggers a retention action automatically.
          </p>

          {/* Three steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: '40px' }}>
            {[
              {
                n: '01',
                title: 'Detect',
                body: 'We pull billing, usage, and engagement signals from Stripe, HubSpot, and your widget. Every signal has a weight; the engine adds them up into a score.',
              },
              {
                n: '02',
                title: 'Reach out',
                body: 'When a customer crosses the risk threshold, a personalized message goes out automatically — email, SMS, or Slack, whichever channel fits the urgency.',
              },
              {
                n: '03',
                title: 'Save at the door',
                body: 'If they reach your cancellation page, they see a relevant offer — pause, downgrade, or a one-time discount — before the subscription ends.',
              },
            ].map(step => (
              <div key={step.n} style={{ padding: '24px', background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: ACCENT, marginBottom: '12px', letterSpacing: '0.04em' }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: TEXT, marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.7, margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>

          {/* Expandable scoring model — content always in DOM for crawlers */}
          <details style={{ border: `1px solid ${BORDER}`, borderRadius: '12px', background: WHITE, overflow: 'hidden' }}>
            <summary style={{ padding: '18px 24px', fontSize: '14px', fontWeight: 500, color: TEXT, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', userSelect: 'none' }}>
              <span>See the actual scoring model</span>
              <IconChevron className="cg-chevron" />
            </summary>
            <div style={{ borderTop: `1px solid ${BORDER}`, padding: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 500, color: TEXT, marginBottom: '12px' }}>No black box</h4>
              <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.7, marginBottom: '20px' }}>
                Every score is the sum of weighted signals. Open any customer record to see exactly which signals are firing and how many points each contributed.
              </p>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', background: PAGE_BG, padding: '10px 16px', borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Signal</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Weight</span>
                </div>
                {[
                  { signal: 'Payment failures',                      weight: '30 pts' },
                  { signal: 'Login gap (14+ days without activity)',  weight: '25 pts' },
                  { signal: 'Feature usage drop (>50% decline)',      weight: '20 pts' },
                  { signal: 'Seat reductions',                        weight: '15 pts' },
                  { signal: 'Support ticket volume spike',             weight: '10 pts' },
                ].map((row, i, arr) => (
                  <div key={row.signal} style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '12px 16px', alignItems: 'center', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none', background: WHITE, gap: '16px' }}>
                    <span style={{ fontSize: '14px', color: TEXT }}>{row.signal}</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: ACCENT, whiteSpace: 'nowrap' }}>{row.weight}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: FAINT, marginTop: '14px', lineHeight: 1.6 }}>
                Scores 75 and above are danger. Scores 50–74 are watch. Scores below 50 are healthy.
                Read more about churn signals on our{' '}
                <Link href="/blog" style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>blog</Link>.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CONNECTED IN MINUTES
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', borderTop: `1px solid ${BORDER}`, background: WHITE }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 500, color: TEXT, marginBottom: '8px', letterSpacing: '-0.01em' }}>
            Connected in minutes, not sprints
          </h2>
          <p style={{ fontSize: '16px', color: MUTED, marginBottom: '40px', maxWidth: '560px' }}>
            Most churn tools need you to instrument events in your codebase before they return anything. ChurnGuard starts scoring from data you already have.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: '24px' }}>

            {/* Card 1 — Stripe */}
            <div style={{ padding: '24px', background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.07em', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, padding: '2px 8px', borderRadius: '4px' }}>
                  No code
                </span>
                <svg width="20" height="20" fill="none" stroke={ACCENT} strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: TEXT, marginBottom: '6px' }}>Connect Stripe</h3>
                <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.7, margin: 0 }}>
                  One OAuth click. Read-only. Pulls customers, MRR, and payment history.
                </p>
              </div>
              <p style={{ fontSize: '13px', color: FAINT, margin: 0 }}>Scores within the hour</p>
            </div>

            {/* Card 2 — HubSpot */}
            <div style={{ padding: '24px', background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.07em', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, padding: '2px 8px', borderRadius: '4px' }}>
                  No code
                </span>
                <svg width="20" height="20" fill="none" stroke={ACCENT} strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: TEXT, marginBottom: '6px' }}>Sync HubSpot</h3>
                <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.7, margin: 0 }}>
                  OAuth both ways. Contacts pull in, risk scores push back as properties.
                </p>
              </div>
              <p style={{ fontSize: '13px', color: FAINT, margin: 0 }}>Re-syncs hourly</p>
            </div>

            {/* Card 3 — Widget */}
            <div style={{ padding: '24px', background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: SUCCESS, textTransform: 'uppercase', letterSpacing: '0.07em', background: SUCCESS_BG, border: `1px solid ${SUCCESS_BORD}`, padding: '2px 8px', borderRadius: '4px' }}>
                  One line
                </span>
                <svg width="20" height="20" fill="none" stroke={ACCENT} strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: TEXT, marginBottom: '6px' }}>Drop in the widget</h3>
                <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.7, margin: 0 }}>
                  One script tag with your API key. Tracks page views and sessions. No backend changes.
                </p>
              </div>
              <p style={{ fontSize: '13px', color: FAINT, margin: 0 }}>Tracking starts immediately</p>
            </div>

          </div>

          <p style={{ fontSize: '13px', color: FAINT, marginBottom: '4px' }}>
            Also connects with Twilio, Slack, Postmark, and Segment.
          </p>
          <p style={{ fontSize: '12px', color: FAINT }}>These are integration partners, not customers.</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: '80px 24px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 500, color: TEXT, marginBottom: '8px', letterSpacing: '-0.01em' }}>
            Simple, predictable pricing
          </h2>
          <p style={{ fontSize: '16px', color: MUTED, marginBottom: '40px' }}>
            Four plans based on your MRR. No metered billing, no surprise overages.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ alignItems: 'start', marginBottom: '20px' }}>
            {PLANS.map(tier => (
              <div key={tier.name} style={{
                padding: '24px',
                background: WHITE,
                border: tier.popular ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}>
                {tier.popular && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: ACCENT, color: WHITE, fontSize: '11px', fontWeight: 500, padding: '3px 12px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                    Most popular
                  </div>
                )}
                <div style={{ marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, color: TEXT, marginBottom: '4px' }}>{tier.name}</h3>
                  <p style={{ fontSize: '13px', color: FAINT }}>{tier.band}</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '26px', fontWeight: 500, color: TEXT }}>{tier.price}</span>
                  {tier.price !== 'Custom' && (
                    <span style={{ fontSize: '13px', color: FAINT, marginLeft: '4px' }}>/mo</span>
                  )}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: MUTED }}>
                      <IconCheck />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={tier.href} style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'opacity 150ms',
                  ...(tier.popular
                    ? { background: ACCENT, color: WHITE }
                    : { background: 'transparent', color: TEXT, border: `1px solid ${BORDER_MED}` }),
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '13px', color: FAINT, textAlign: 'center' }}>
            30-day free trial · cancel any time · no setup fees
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECURITY AND SETUP
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', borderTop: `1px solid ${BORDER}`, background: WHITE }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 500, color: TEXT, marginBottom: '40px', letterSpacing: '-0.01em' }}>
            Built for trust
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'No black box',
                body: 'Open any risk score and see the exact signals and weights that produced it. Every number is explainable to your team and your customers.',
              },
              {
                title: 'Read-only by default',
                body: 'Stripe access is read-only. Customer data is AES-256 encrypted at rest. GDPR compliant. We never write to your Stripe account.',
              },
              {
                title: '15 minutes to first score',
                body: 'One OAuth click for Stripe, or one script tag for the widget. No backend changes required, no engineering sprint.',
              },
            ].map(col => (
              <div key={col.title} style={{ padding: '24px', border: `1px solid ${BORDER}`, borderRadius: '12px', background: PAGE_BG }}>
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: TEXT, marginBottom: '10px' }}>{col.title}</h3>
                <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.7, margin: 0 }}>{col.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 500, color: TEXT, marginBottom: '32px', letterSpacing: '-0.01em' }}>
            Common questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FAQS.map(({ q, a }) => (
              <details key={q} style={{ border: `1px solid ${BORDER}`, borderRadius: '8px', background: WHITE, overflow: 'hidden' }}>
                <summary style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 500, color: TEXT, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', userSelect: 'none' }}>
                  <span>{q}</span>
                  <IconChevron className="cg-chevron" />
                </summary>
                <div style={{ borderTop: `1px solid ${BORDER}`, padding: '16px 20px', fontSize: '14px', color: MUTED, lineHeight: 1.7 }}>
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOUNDING OFFER
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', borderTop: `1px solid ${BORDER}`, background: ACCENT_BG }}>
        <div style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 500, color: TEXT, marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Founding accounts — 25 spots, lifetime pricing
          </h2>
          <p style={{ fontSize: '16px', color: MUTED, lineHeight: 1.7, marginBottom: '32px' }}>
            ChurnGuard launched this year. Rather than pad the page with logos we don't have, the first 25 accounts get lifetime pricing, a direct line to me, and real influence over what gets built.
          </p>
          <div className="cg-cta-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            <Link href="/signup" style={btnPrimary}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Claim a spot
            </Link>
            <a href="/audit" className="cg-outline-btn" style={btnOutline}>
              Run your free churn audit →
            </a>
          </div>
        </div>
      </section>

    </PublicShell>
  );
}
