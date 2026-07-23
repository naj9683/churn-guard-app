'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ─── Theme ────────────────────────────────────────────────────────────────────
const ACCENT        = '#6d28d9';
const ACCENT_BG     = '#ede9fe';
const ACCENT_BORDER = 'rgba(109,40,217,0.2)';
const BORDER        = 'rgba(0,0,0,0.08)';
const BORDER_MED    = 'rgba(0,0,0,0.13)';
const TEXT          = '#111827';
const MUTED         = '#6b7280';
const FAINT         = '#9ca3af';
const WHITE         = '#ffffff';
const PAGE_BG       = '#f9fafb';
const SUCCESS       = '#059669';
const SUCCESS_BG    = '#ecfdf5';
const SUCCESS_BORD  = 'rgba(5,150,105,0.2)';
const DANGER        = '#dc2626';
const DANGER_BG     = '#fef2f2';
const DANGER_BORD   = 'rgba(220,38,38,0.2)';
const WARN          = '#d97706';
const WARN_BG       = '#fffbeb';
const WARN_BORD     = 'rgba(217,119,6,0.2)';
const FONT          = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

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
  const [mrr, setMrr]           = useState(25000);
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
            {/* Table title */}
            <div style={{ padding: '11px 16px', borderBottom: `1px solid ${BORDER}`, background: PAGE_BG, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: TEXT }}>At-risk accounts</span>
              <span style={{ fontSize: '12px', color: FAINT }}>sorted by MRR</span>
            </div>
            {/* Column headers — hidden on mobile via CSS */}
            <div className="cg-risk-header" style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 72px', padding: '8px 16px', background: PAGE_BG, borderBottom: `1px solid ${BORDER}` }}>
              {['Account', 'Signal', 'MRR', 'Score'].map(h => (
                <span key={h} style={{ fontSize: '11px', fontWeight: 500, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
              ))}
            </div>
            {/* Rows */}
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
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const btnPrimary: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: 500,
    color: WHITE,
    textDecoration: 'none',
    padding: '11px 26px',
    borderRadius: '6px',
    background: ACCENT,
    transition: 'opacity 150ms',
    cursor: 'pointer',
    border: 'none',
  };

  const btnOutline: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: 500,
    color: TEXT,
    textDecoration: 'none',
    padding: '10px 26px',
    borderRadius: '6px',
    background: WHITE,
    border: `1px solid ${BORDER_MED}`,
    transition: 'border-color 150ms',
    cursor: 'pointer',
  };

  return (
    <div style={{ fontFamily: FONT, background: PAGE_BG, color: TEXT, overflowX: 'hidden' }}>

      {/* ── Global styles ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Range inputs */
        .cg-range { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px;
          background: #e5e7eb; outline: none; cursor: pointer; }
        .cg-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: ${ACCENT}; border: 2px solid ${WHITE};
          box-shadow: 0 1px 2px rgba(0,0,0,0.15); }
        .cg-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%;
          background: ${ACCENT}; border: 2px solid ${WHITE}; box-shadow: 0 1px 2px rgba(0,0,0,0.15); }

        /* FAQ details */
        details > summary { list-style: none; cursor: pointer; }
        details > summary::-webkit-details-marker { display: none; }
        details[open] .cg-chevron { transform: rotate(180deg); }
        .cg-chevron { transition: transform 150ms ease; }

        /* Focus rings */
        a:focus-visible, button:focus-visible, input:focus-visible, summary:focus-visible {
          outline: 2px solid ${ACCENT}; outline-offset: 2px; border-radius: 2px; }

        /* Hover states */
        .cg-nav-link:hover { color: ${TEXT} !important; }
        .cg-outline-btn:hover { border-color: #9ca3af !important; }

        /* Mobile: dashboard table rows become stacked cards */
        @media (max-width: 639px) {
          .cg-risk-header { display: none !important; }
          .cg-risk-row {
            display: flex !important; flex-direction: column !important;
            gap: 6px !important; padding: 14px 16px !important; }
          .cg-risk-row > span:first-child { font-weight: 500; color: ${TEXT}; }
        }

        /* Mobile: full-width CTAs */
        @media (max-width: 639px) {
          .cg-cta-group { flex-direction: column !important; align-items: stretch !important; }
          .cg-cta-group a { text-align: center !important; }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition: none !important; animation: none !important; }
        }
      ` }} />

      {/* ═══════════════════════════════════════════════════════════════════════
          NAV
      ═══════════════════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50, background: WHITE,
        borderBottom: `1px solid ${scrolled ? BORDER : 'transparent'}`,
        transition: 'border-color 150ms',
      }}>
        <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link href="/" aria-label="ChurnGuard home" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo-purple.png" alt="ChurnGuard" width={116} height={28} style={{ height: '28px', width: 'auto', display: 'block' }} />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '28px' }}>
            {[['#features', 'Product'], ['#pricing', 'Pricing'], ['/blog', 'Blog'], ['/login', 'Login']].map(([href, label]) => (
              <a key={href} href={href} className="cg-nav-link"
                style={{ fontSize: '14px', color: MUTED, textDecoration: 'none', transition: 'color 150ms' }}>
                {label}
              </a>
            ))}
            <Link href="/signup" style={{ ...btnPrimary, fontSize: '14px', padding: '8px 18px' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Start free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: TEXT }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </nav>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden" style={{ borderTop: `1px solid ${BORDER}`, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px', background: WHITE }}>
            {[['#features', 'Product'], ['#pricing', 'Pricing'], ['/blog', 'Blog'], ['/login', 'Login']].map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: '14px', color: MUTED, textDecoration: 'none' }}
                onClick={() => setMobileOpen(false)}>{label}</a>
            ))}
            <Link href="/signup" style={{ ...btnPrimary, textAlign: 'center', padding: '12px' }}
              onClick={() => setMobileOpen(false)}>
              Start free
            </Link>
          </div>
        )}
      </header>

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
              Connect Stripe — free
            </Link>
            <a href="/audit" className="cg-outline-btn" style={btnOutline}>
              Run your free churn audit →
            </a>
            <Link href="/book-demo" className="cg-outline-btn" style={btnOutline}>
              Watch 90-second demo
            </Link>
          </div>
          <p style={{ fontSize: '13px', color: FAINT }}>
            Read-only access · no credit card · disconnect any time
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
                  { signal: 'Payment failures',                    weight: '30 pts' },
                  { signal: 'Login gap (14+ days without activity)', weight: '25 pts' },
                  { signal: 'Feature usage drop (>50% decline)',    weight: '20 pts' },
                  { signal: 'Seat reductions',                      weight: '15 pts' },
                  { signal: 'Support ticket volume spike',           weight: '10 pts' },
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
          INTEGRATIONS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '64px 24px', borderTop: `1px solid ${BORDER}`, background: WHITE }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 500, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '18px' }}>
            Connects with
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Stripe', 'HubSpot', 'Twilio', 'Slack', 'Postmark', 'Segment'].map(name => (
              <div key={name} style={{ padding: '8px 18px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '14px', color: MUTED, background: WHITE, fontWeight: 500 }}>
                {name}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: FAINT, marginTop: '12px' }}>These are integration partners, not customers.</p>
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

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '48px 24px 32px', background: WHITE }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10" style={{ marginBottom: '40px' }}>

            <div>
              <img src="/logo-purple.png" alt="ChurnGuard" width={116} height={28} style={{ height: '28px', width: 'auto', display: 'block', marginBottom: '12px' }} />
              <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.7, marginBottom: '14px' }}>
                Customer retention platform for SaaS founders.
              </p>
              <a href="mailto:admin@churnguardapp.com" style={{ fontSize: '13px', color: MUTED, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
                admin@churnguardapp.com
              </a>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: FAINT, marginBottom: '14px' }}>Product</div>
              {[['#features', 'How it works'], ['#pricing', 'Pricing'], ['/audit', 'Free churn audit'], ['/blog', 'Blog']].map(([href, label]) => (
                <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: MUTED, textDecoration: 'none', marginBottom: '9px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
                  {label}
                </a>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: FAINT, marginBottom: '14px' }}>Company</div>
              {[['/about', 'About'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/book-demo', 'Book a call']].map(([href, label]) => (
                <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: MUTED, textDecoration: 'none', marginBottom: '9px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
                  {label}
                </a>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: FAINT, marginBottom: '14px' }}>Resources</div>
              <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.7, marginBottom: '10px' }}>
                Read about churn prevention, retention tactics, and SaaS benchmarks on our{' '}
                <Link href="/blog" style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>blog</Link>.
              </p>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '12px', color: FAINT }}>© 2026 ChurnGuard · All rights reserved</p>
            <p style={{ fontSize: '12px', color: FAINT }}>Built for SaaS founders who care about retention</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
