'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ACCENT, ACCENT_BG, ACCENT_BORDER, BORDER, BORDER_MED,
  TEXT, MUTED, FAINT, WHITE, PAGE_BG,
  SUCCESS, DANGER, DANGER_BG, DANGER_BORD, WARN_BG, WARN_BORD,
} from '@/app/lib/design-tokens';

// ── Types ────────────────────────────────────────────────────────────────────

interface AtRiskCustomer {
  name: string;
  email: string;
  mrr: number;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
}

interface AuditResult {
  monthlyChurnRate: number;
  revenueAtRisk: number;
  annualizedLoss: number;
  totalMrr: number;
  industryPercentile: number;
  atRiskCustomers: AtRiskCustomer[];
  activeCount: number;
  canceledCount: number;
  pastDueCount: number;
}

type Step = 'hubspot' | 'form' | 'analyzing' | 'results';
type InputMethod = 'stripe' | 'csv';

// ── Analysis animation ───────────────────────────────────────────────────────

const ANALYSIS_STEPS = [
  'Validating credentials…',
  'Pulling subscription data…',
  'Calculating monthly churn rate…',
  'Measuring revenue at risk…',
  'Benchmarking against industry averages…',
  'Identifying your highest-risk customers…',
  'Preparing your report…',
];

function AnalyzingScreen({ dataSource }: { dataSource: InputMethod }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= ANALYSIS_STEPS.length - 1) return;
    const t = setTimeout(() => setCurrentStep(s => s + 1), 700);
    return () => clearTimeout(t);
  }, [currentStep]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
      style={{ background: PAGE_BG }}
    >
      <div className="mb-10">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', animation: 'cgPulse 2s infinite' }}
        >
          🛡️
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: TEXT }}>
          Analyzing your {dataSource === 'stripe' ? 'Stripe account' : 'customer data'}
        </h2>
        <p className="text-sm" style={{ color: MUTED }}>This takes about 10 seconds…</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {ANALYSIS_STEPS.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm transition-all duration-300"
            style={{ opacity: i <= currentStep ? 1 : 0.2 }}
          >
            <div className="w-5 h-5 shrink-0 flex items-center justify-center">
              {i < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} style={{ color: SUCCESS }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : i === currentStep ? (
                <div className="w-3 h-3 rounded-full" style={{ background: ACCENT, animation: 'cgPulse 1s infinite' }} />
              ) : (
                <div className="w-2 h-2 rounded-full" style={{ background: BORDER_MED }} />
              )}
            </div>
            <span style={{
              color: i < currentStep ? FAINT : i === currentStep ? TEXT : FAINT,
              textDecoration: i < currentStep ? 'line-through' : 'none',
            }}>
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10 w-full max-w-sm h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${((currentStep + 1) / ANALYSIS_STEPS.length) * 100}%`,
            background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
          }}
        />
      </div>

      <style>{`@keyframes cgPulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  );
}

// ── Benchmark bar ────────────────────────────────────────────────────────────

function BenchmarkBar({ churnRate }: { churnRate: number }) {
  const max = 12;
  const position = Math.min((churnRate / max) * 100, 97);
  return (
    <div className="w-full">
      <div className="relative h-5 rounded-full overflow-visible mb-2" style={{ background: 'linear-gradient(90deg,#22c55e,#f59e0b 50%,#ef4444)' }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 shadow-lg transition-all duration-1000"
          style={{ left: `calc(${position}% - 8px)`, background: WHITE, borderColor: '#374151' }}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: MUTED }}>
        <span>0% — Elite</span>
        <span>2% — Avg</span>
        <span>5% — Danger</span>
        <span>10%+</span>
      </div>
    </div>
  );
}

// ── HubSpot lead-capture gate (FIRST SCREEN — shown before the calculator) ────
//
// Flow: HubSpot form → onFormSubmit postMessage fires → save email to
// sessionStorage → transition to 'form' step (the calculator).
//
// Why sessionStorage: HubSpot may be configured to redirect the parent page to
// /audit after submission. We catch onFormSubmit (fires before the redirect),
// save the email + a done flag, then when the page reloads we pick it up and
// skip straight to the calculator. Once the form is set to "Show thank you
// message" in HubSpot dashboard the redirect stops and onFormSubmitted handles
// the transition directly without a page reload.

const HS_DONE_KEY  = 'cg_hs_done';
const HS_EMAIL_KEY = 'cg_hs_email';

function HubSpotGateScreen({ onDone }: { onDone: (email: string) => void }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const [submitted, setSubmitted]       = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Inject HubSpot embed script once per page load
    if (!document.querySelector('script[src*="js-eu1.hsforms.net/forms/embed/147977159"]')) {
      const s = document.createElement('script');
      s.src = 'https://js-eu1.hsforms.net/forms/embed/147977159.js';
      s.defer = true;
      document.head.appendChild(s);
    }

    // Show skip link after 12 s in case the form is blocked (ad blocker, CSP, etc.)
    const fallbackTimer = setTimeout(() => setShowFallback(true), 12000);

    let fired = false;
    function onMessage(ev: MessageEvent) {
      if (fired) return;
      if (!ev.data || ev.data.type !== 'hsFormCallback') return;
      const eventName: string = ev.data.eventName ?? '';
      // onFormSubmit fires the moment the user clicks submit — before any redirect.
      // onFormSubmitted fires after HubSpot's server confirms — only when no redirect.
      if (eventName !== 'onFormSubmit' && eventName !== 'onFormSubmitted') return;
      fired = true;

      const fields: Array<{ name: string; value: string }> = Array.isArray(ev.data.data) ? ev.data.data : [];
      const email = fields.find(f => f.name === 'email')?.value ?? '';

      // Persist before any potential redirect so the reload case also works
      try {
        sessionStorage.setItem(HS_DONE_KEY, '1');
        sessionStorage.setItem(HS_EMAIL_KEY, email);
      } catch { /* private browsing may block sessionStorage */ }

      clearTimeout(fallbackTimer);
      setSubmitted(true);
      setTimeout(() => onDoneRef.current(email), 600);
    }

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: PAGE_BG }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} style={{ color: WHITE }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold text-lg" style={{ color: TEXT }}>Loading your audit tool…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 px-5 h-14 flex items-center justify-between"
        style={{ background: WHITE, borderBottom: `1px solid ${BORDER_MED}` }}
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-base" style={{ color: TEXT, textDecoration: 'none' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🛡️</div>
          ChurnGuard
        </Link>
        <Link href="/#pricing" className="text-sm" style={{ color: MUTED, textDecoration: 'none' }}>
          View Plans →
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero */}
        <div className="text-center max-w-xl mb-10">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Free · No credit card · About 10 minutes
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight" style={{ color: TEXT }}>
            Free Churn Audit —<br />
            <span style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Know What You&apos;re Losing
            </span>
          </h1>
          <p className="text-lg" style={{ color: MUTED }}>
            Upload a CSV or connect Stripe (read-only). We&apos;ll email you your churn rate vs. benchmark and revenue at risk.
          </p>
        </div>

        {/* HubSpot form card */}
        <div
          className="w-full max-w-md rounded-2xl border p-8"
          style={{ background: WHITE, borderColor: BORDER_MED }}
        >
          <div className="flex justify-center mb-5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              🛡️
            </div>
          </div>
          <h2 className="text-lg font-bold text-center mb-6" style={{ color: TEXT }}>
            Enter your details to see your free churn risk audit
          </h2>

          {/* HubSpot form embed — renders into an iframe */}
          <div className="cg-hs-wrapper">
            <div
              className="hs-form-frame"
              data-region="eu1"
              data-form-id="31ad22e3-ed18-4279-8639-a51cd2ee69f7"
              data-portal-id="147977159"
            />
          </div>

          {/* Fallback skip link — shown after 12 s if form never loads */}
          {showFallback && (
            <div className="mt-5 text-center">
              <p className="text-xs mb-1" style={{ color: FAINT }}>Form not loading? (Ad blocker?)</p>
              <button
                onClick={() => onDoneRef.current('')}
                className="text-xs hover:underline"
                style={{ color: ACCENT, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Skip and go to the calculator →
              </button>
            </div>
          )}

          <p className="text-xs text-center mt-5 flex items-center justify-center gap-1.5" style={{ color: MUTED }}>
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: SUCCESS }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            No spam — we take your privacy seriously.
          </p>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs" style={{ color: MUTED }}>
          {['Used by 200+ SaaS founders', 'Stripe key never stored', 'Results emailed to you'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: SUCCESS }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </main>

      {/* HubSpot form — light-theme overrides */}
      <style>{`
        .cg-hs-wrapper .hs-form {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .cg-hs-wrapper .hs-form-field {
          margin-bottom: 16px !important;
        }
        .cg-hs-wrapper .hs-form-field > label {
          display: block !important;
          color: #111827 !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          margin-bottom: 6px !important;
          line-height: 1.4 !important;
        }
        .cg-hs-wrapper .hs-form-required {
          color: #dc2626 !important;
          margin-left: 2px;
        }
        .cg-hs-wrapper .hs-input,
        .cg-hs-wrapper .hs-input[type="text"],
        .cg-hs-wrapper .hs-input[type="email"],
        .cg-hs-wrapper .hs-input[type="tel"],
        .cg-hs-wrapper .hs-input[type="number"],
        .cg-hs-wrapper textarea.hs-input,
        .cg-hs-wrapper select.hs-input {
          width: 100% !important;
          box-sizing: border-box !important;
          background: #ffffff !important;
          background-color: #ffffff !important;
          color: #111827 !important;
          border: 1px solid rgba(0,0,0,0.13) !important;
          border-radius: 6px !important;
          padding: 10px 12px !important;
          font-size: 15px !important;
          min-height: 42px !important;
          font-family: inherit !important;
          transition: border-color 150ms, box-shadow 150ms !important;
          outline: none !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        .cg-hs-wrapper .hs-input::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
        .cg-hs-wrapper .hs-input:focus {
          border-color: #6d28d9 !important;
          box-shadow: 0 0 0 3px rgba(109,40,217,0.12) !important;
        }
        .cg-hs-wrapper .hs-input[type="checkbox"],
        .cg-hs-wrapper .hs-input[type="radio"] {
          min-height: unset !important;
          width: auto !important;
          padding: 0 !important;
          -webkit-appearance: auto !important;
          appearance: auto !important;
        }
        .cg-hs-wrapper select.hs-input {
          -webkit-appearance: auto !important;
          appearance: auto !important;
          cursor: pointer !important;
        }
        .cg-hs-wrapper .hs-error-msg,
        .cg-hs-wrapper ul.hs-error-msgs,
        .cg-hs-wrapper ul.hs-error-msgs li {
          color: #dc2626 !important;
          font-size: 13px !important;
          margin-top: 4px !important;
          padding-left: 0 !important;
          list-style: none !important;
          background: transparent !important;
        }
        .cg-hs-wrapper input[type="submit"],
        .cg-hs-wrapper .hs-button.primary {
          width: 100% !important;
          background: #6d28d9 !important;
          background-color: #6d28d9 !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 12px 24px !important;
          font-size: 15px !important;
          font-weight: 500 !important;
          font-family: inherit !important;
          cursor: pointer !important;
          transition: opacity 150ms !important;
          margin-top: 8px !important;
          box-shadow: none !important;
        }
        .cg-hs-wrapper input[type="submit"]:hover,
        .cg-hs-wrapper .hs-button.primary:hover {
          opacity: 0.85 !important;
        }
        .cg-hs-wrapper .submitted-message {
          color: #111827 !important;
          font-size: 15px !important;
          text-align: center !important;
          padding: 16px 0 !important;
        }
        .cg-hs-wrapper .hs-form-frame { display: block !important; width: 100% !important; }
        .cg-hs-wrapper .hs-form-frame iframe {
          width: 100% !important;
          min-height: 340px !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}

// ── PDF generation ───────────────────────────────────────────────────────────

function buildRecommendations(results: AuditResult): string[] {
  const recs: string[] = [];
  if (results.pastDueCount > 0)
    recs.push(`Recover ${results.pastDueCount} failed payment${results.pastDueCount !== 1 ? 's' : ''} — send a payment retry email today.`);
  if (results.monthlyChurnRate > 5)
    recs.push('Launch a win-back campaign targeting customers churned in the last 30 days (5–10% typically convert back).');
  if (results.atRiskCustomers.length > 0)
    recs.push(`Contact your top ${Math.min(results.atRiskCustomers.length, 3)} at-risk accounts personally within 48 hours before they cancel.`);
  if (results.monthlyChurnRate > 2)
    recs.push('Set up automated health-score alerts to catch churn signals before customers actually cancel.');
  recs.push('Add an in-app NPS survey to identify dissatisfied customers before they churn silently.');
  recs.push('Create a customer success check-in cadence for accounts above $500 MRR.');
  return recs.slice(0, 4);
}

async function downloadAuditPDF(results: AuditResult, email: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' }) as any;

  const W = 210;
  const margin = 18;
  const contentW = W - margin * 2;

  // Header band
  doc.setFillColor(67, 56, 202);
  doc.rect(0, 0, W, 32, 'F');
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ChurnGuard', margin, 12);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Churn Audit Report', margin, 19);
  doc.setFontSize(7.5);
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), W - margin, 12, { align: 'right' });
  doc.text(email, W - margin, 19, { align: 'right' });

  // Alert sub-banner
  doc.setFillColor(254, 226, 226);
  doc.rect(0, 32, W, 11, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('YOUR CHURN AUDIT RESULTS — CONFIDENTIAL', W / 2, 39.5, { align: 'center' });

  // Key metric cards
  const cardY = 50;
  const cardH = 28;
  const gap = 4;
  const cardW = (contentW - gap * 2) / 3;
  const churnR = results.monthlyChurnRate > 3 ? 220 : 21;
  const churnG = results.monthlyChurnRate > 3 ? 38 : 128;
  const churnB = results.monthlyChurnRate > 3 ? 38 : 61;
  const metricCards = [
    { label: 'Monthly Churn Rate',  value: `${results.monthlyChurnRate.toFixed(1)}%`, sub: 'per month',          r: churnR, g: churnG, b: churnB },
    { label: 'Revenue at Risk',     value: `$${results.revenueAtRisk.toLocaleString()}`,  sub: 'MRR in danger now',  r: 180,    g: 105,    b: 0      },
    { label: 'Annual Revenue Loss', value: `$${results.annualizedLoss.toLocaleString()}`, sub: 'if nothing changes', r: 220,    g: 38,     b: 38     },
  ];
  metricCards.forEach((card, i) => {
    const x = margin + i * (cardW + gap);
    doc.setFillColor(249, 250, 251);
    doc.rect(x, cardY, cardW, cardH, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.rect(x, cardY, cardW, cardH, 'S');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text(card.label.toUpperCase(), x + cardW / 2, cardY + 7, { align: 'center' });
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(card.r, card.g, card.b);
    doc.text(card.value, x + cardW / 2, cardY + 18, { align: 'center' });
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text(card.sub, x + cardW / 2, cardY + 24, { align: 'center' });
  });

  // Benchmark section
  const benchY = 86;
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, benchY, contentW, 30, 'F');
  doc.setDrawColor(209, 213, 219);
  doc.rect(margin, benchY, contentW, 30, 'S');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Industry Benchmark', margin + 4, benchY + 8);
  const bottomPct = 100 - results.industryPercentile;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  if (bottomPct > 75)      doc.setTextColor(185, 28, 28);
  else if (bottomPct > 50) doc.setTextColor(180, 83, 9);
  else                     doc.setTextColor(21, 128, 61);
  doc.text(`Bottom ${bottomPct}%`, W - margin - 4, benchY + 8, { align: 'right' });
  // Tri-color bar
  const barX = margin + 4;
  const barY = benchY + 13;
  const barW = contentW - 8;
  const barH = 4;
  doc.setFillColor(34, 197, 94);
  doc.rect(barX, barY, barW / 3, barH, 'F');
  doc.setFillColor(234, 179, 8);
  doc.rect(barX + barW / 3, barY, barW / 3, barH, 'F');
  doc.setFillColor(239, 68, 68);
  doc.rect(barX + (barW * 2) / 3, barY, barW / 3, barH, 'F');
  // Position marker
  const markerX = barX + Math.min((results.monthlyChurnRate / 12) * barW, barW - 2);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(31, 41, 55);
  doc.ellipse(markerX, barY + barH / 2, 2, 2, 'FD');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text(`${results.activeCount} Active   ·   ${results.canceledCount} Churned (30d)   ·   ${results.pastDueCount} Past Due`, margin + 4, benchY + 25);

  // At-risk customers table
  let tableEndY = benchY + 38;
  if (results.atRiskCustomers.length > 0) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Highest-Risk Customers', margin, tableEndY + 2);
    autoTable(doc, {
      startY: tableEndY + 6,
      margin: { left: margin, right: margin },
      head: [['Customer', 'Email', 'MRR / mo', 'Status']],
      body: results.atRiskCustomers.slice(0, 3).map(c => [
        c.name,
        c.email,
        `$${c.mrr.toLocaleString()}`,
        c.urgency === 'high' ? 'Payment Failed' : 'At Risk',
      ]),
      styles: { fontSize: 7.5, cellPadding: 2.5 },
      headStyles: { fillColor: [67, 56, 202] as [number, number, number], textColor: [255, 255, 255] as [number, number, number], fontStyle: 'bold', fontSize: 7 },
      alternateRowStyles: { fillColor: [248, 250, 252] as [number, number, number] },
      columnStyles: { 2: { halign: 'right' }, 3: { halign: 'center' } },
    });
    tableEndY = doc.lastAutoTable?.finalY ?? tableEndY + 36;
  }

  // Recommended actions
  const recY = tableEndY + 8;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Recommended Actions', margin, recY);
  buildRecommendations(results).forEach((rec, i) => {
    const y = recY + 8 + i * 10;
    doc.setFillColor(67, 56, 202);
    doc.rect(margin, y - 2.5, 2, 2, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(rec, contentW - 8);
    doc.text(lines, margin + 5, y);
  });

  // CTA footer
  doc.setFillColor(67, 56, 202);
  doc.rect(0, 270, W, 27, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Prevent this churn automatically with ChurnGuard', W / 2, 280, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Start your 30-day free trial — churnguard.app', W / 2, 288, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(196, 181, 253);
  doc.text('Setup in 5 minutes · Cancel anytime · First results in hours', W / 2, 293.5, { align: 'center' });

  doc.save('churnguard-audit-report.pdf');
}

// ── Results screen ───────────────────────────────────────────────────────────

function ResultsScreen({ results, email }: { results: AuditResult; email: string }) {
  const [downloading, setDownloading] = useState(false);
  const churnBad      = results.monthlyChurnRate > 3;
  const churnCritical = results.monthlyChurnRate > 7;
  const bottomPct     = 100 - results.industryPercentile;

  const churnColor =
    churnCritical ? '#ef4444' :
    churnBad ? '#f97316' :
    results.monthlyChurnRate > 1 ? '#f59e0b' : '#22c55e';

  const benchmarkMsg =
    churnCritical ? "You're losing customers 3× faster than the industry average" :
    results.monthlyChurnRate > 5 ? "You're in the bottom 25% of SaaS companies" :
    results.monthlyChurnRate > 2 ? "Your churn is above average for B2B SaaS" :
    results.monthlyChurnRate > 1 ? "You're near average — significant room to improve" :
    "You're beating most SaaS companies — let's keep it that way";

  return (
    <div className="min-h-screen pb-20" style={{ background: PAGE_BG }}>
      {/* Page header */}
      <div
        className="py-12 px-6 text-center border-b"
        style={{ background: DANGER_BG, borderColor: DANGER_BORD }}
      >
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
          style={{ background: 'rgba(220,38,38,0.1)', border: `1px solid ${DANGER_BORD}`, color: DANGER }}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Your Churn Audit Is Ready
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight" style={{ color: TEXT }}>
          The Brutal Truth About Your Churn
        </h1>
        <p className="text-sm" style={{ color: MUTED }}>
          Report sent to <span style={{ color: TEXT }}>{email}</span>
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-10 space-y-5">

        {/* Key metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="rounded-2xl p-5 text-center border"
            style={{
              background: churnBad ? DANGER_BG : '#ecfdf5',
              borderColor: churnBad ? DANGER_BORD : 'rgba(5,150,105,0.2)',
            }}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: MUTED }}>Monthly Churn</p>
            <p className="text-5xl font-extrabold mb-1" style={{ color: churnColor }}>
              {results.monthlyChurnRate.toFixed(1)}%
            </p>
            <p className="text-xs" style={{ color: FAINT }}>per month</p>
          </div>

          <div className="rounded-2xl p-5 text-center border" style={{ background: WARN_BG, borderColor: WARN_BORD }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: MUTED }}>Revenue at Risk</p>
            <p className="text-4xl font-extrabold mb-1" style={{ color: '#f59e0b' }}>
              ${results.revenueAtRisk.toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: FAINT }}>MRR in danger now</p>
          </div>

          <div className="rounded-2xl p-5 text-center border" style={{ background: DANGER_BG, borderColor: DANGER_BORD }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: MUTED }}>Annual Revenue Loss</p>
            <p className="text-4xl font-extrabold mb-1" style={{ color: DANGER }}>
              ${results.annualizedLoss.toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: FAINT }}>if nothing changes</p>
          </div>
        </div>

        {/* Benchmark */}
        <div className="rounded-2xl p-5 border" style={{ background: WHITE, borderColor: BORDER }}>
          <div className="flex items-start justify-between mb-4 gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-0.5" style={{ color: TEXT }}>Industry Benchmark</h3>
              <p className="text-xs" style={{ color: MUTED }}>{benchmarkMsg}</p>
            </div>
            <span
              className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: bottomPct > 75 ? DANGER_BG : bottomPct > 50 ? WARN_BG : '#ecfdf5',
                color:      bottomPct > 75 ? DANGER    : bottomPct > 50 ? '#f59e0b' : SUCCESS,
              }}
            >
              Bottom {bottomPct}%
            </span>
          </div>
          <BenchmarkBar churnRate={results.monthlyChurnRate} />
          <div className="flex gap-6 mt-5 pt-4 border-t text-center" style={{ borderColor: BORDER }}>
            {[
              { label: 'Active', value: results.activeCount },
              { label: 'Churned (30d)', value: results.canceledCount },
              { label: 'Past Due', value: results.pastDueCount },
            ].map(s => (
              <div key={s.label} className="flex-1">
                <p className="text-xl font-bold" style={{ color: TEXT }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: FAINT }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* At-risk customers */}
        {results.atRiskCustomers.length > 0 && (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: BORDER }}>
            <div className="px-5 py-4 border-b" style={{ background: PAGE_BG, borderColor: BORDER }}>
              <h3 className="font-semibold text-sm" style={{ color: TEXT }}>Your Highest-Risk Customers</h3>
              <p className="text-xs mt-0.5" style={{ color: FAINT }}>Act on these within 48 hours or they&apos;re gone</p>
            </div>
            <div style={{ background: WHITE }}>
              {results.atRiskCustomers.map((c, i) => {
                const isHigh = c.urgency === 'high';
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-4 border-b last:border-0"
                    style={{
                      borderColor: BORDER,
                      background: isHigh ? 'rgba(220,38,38,0.04)' : 'rgba(217,119,6,0.04)',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: TEXT }}>{c.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: FAINT }}>{c.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold" style={{ color: TEXT }}>${c.mrr.toLocaleString()}/mo</p>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: isHigh ? DANGER_BG : WARN_BG,
                          color:      isHigh ? DANGER    : '#f59e0b',
                        }}
                      >
                        {isHigh ? 'Payment Failed' : 'At Risk'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Download PDF */}
        <div className="flex justify-center">
          <button
            onClick={async () => {
              setDownloading(true);
              try { await downloadAuditPDF(results, email); }
              finally { setDownloading(false); }
            }}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: WHITE, boxShadow: '0 0 20px rgba(99,102,241,0.25)' }}
          >
            {downloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating PDF…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download My Churn Report
              </>
            )}
          </button>
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 text-center border"
          style={{ background: ACCENT_BG, borderColor: ACCENT_BORDER }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: ACCENT }}>What happens next</p>
          <h3 className="text-xl sm:text-2xl font-bold mb-3 leading-snug" style={{ color: TEXT }}>
            ChurnGuard can stop<br />
            <span style={{ color: '#f59e0b' }}>${results.revenueAtRisk.toLocaleString()}/mo</span> from walking out the door
          </h3>
          <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: MUTED }}>
            Automated interventions fire the moment a customer shows risk signals — before they cancel, not after.
          </p>
          <Link
            href="/#pricing"
            className="inline-block px-8 py-4 rounded-xl font-bold text-base hover:opacity-90 transition-all"
            style={{ background: ACCENT, color: WHITE }}
          >
            Start Your 30-Day Free Trial →
          </Link>
          <p className="text-xs mt-4" style={{ color: FAINT }}>No credit card · Setup in 5 minutes · Cancel anytime</p>
        </div>

      </div>
    </div>
  );
}

// ── Form ─────────────────────────────────────────────────────────────────────

function AuditPageInner() {
  const searchParams = useSearchParams();
  const [step, setStep]               = useState<Step>(() =>
    searchParams.get('step') === 'calculator' ? 'form' : 'hubspot'
  );
  const [inputMethod, setInputMethod] = useState<InputMethod>('stripe');
  const [hsEmail, setHsEmail]         = useState('');
  const [stripeKey, setStripeKey]     = useState('');
  const [csvFile, setCsvFile]         = useState<File | null>(null);
  const [error, setError]             = useState('');
  const [results, setResults]         = useState<AuditResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Redirect-case recovery: HubSpot redirected the parent page to /audit.
  // We saved a done flag + email in sessionStorage just before the redirect fired.
  useEffect(() => {
    try {
      const done = sessionStorage.getItem(HS_DONE_KEY);
      if (done === '1') {
        const email = sessionStorage.getItem(HS_EMAIL_KEY) ?? '';
        sessionStorage.removeItem(HS_DONE_KEY);
        sessionStorage.removeItem(HS_EMAIL_KEY);
        setHsEmail(email);
        setStep('form');
      }
    } catch { /* sessionStorage unavailable in private mode */ }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (inputMethod === 'stripe' && !stripeKey.startsWith('sk_')) {
      setError('Stripe secret keys must start with sk_live_ or sk_test_'); return;
    }
    if (inputMethod === 'csv' && !csvFile) { setError('Please upload a CSV file.'); return; }

    setStep('analyzing');

    let csvData: string | undefined;
    if (inputMethod === 'csv' && csvFile) csvData = await csvFile.text();

    const [apiResult] = await Promise.allSettled([
      fetch('/api/audit/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripeKey: inputMethod === 'stripe' ? stripeKey : undefined,
          csvData,
        }),
      }).then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? 'Analysis failed.');
        return data as AuditResult;
      }),
      new Promise(resolve => setTimeout(resolve, 4200)),
    ]);

    if (apiResult.status === 'rejected') {
      setError((apiResult.reason as Error)?.message ?? 'Analysis failed. Please try again.');
      setStep('form');
      return;
    }

    const auditData = apiResult.value as AuditResult;
    setResults(auditData);

    // Capture lead with full analysis data now that we have it
    fetch('/api/audit/capture-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:              hsEmail,
        stripeConnected:    inputMethod === 'stripe',
        csvUploaded:        inputMethod === 'csv',
        monthlyChurnRate:   auditData.monthlyChurnRate,
        revenueAtRisk:      auditData.revenueAtRisk,
        annualizedLoss:     auditData.annualizedLoss,
        totalMrr:           auditData.totalMrr,
        industryPercentile: auditData.industryPercentile,
        atRiskCustomers:    auditData.atRiskCustomers,
      }),
    }).catch(() => {});

    setStep('results');
  }

  if (step === 'hubspot')
    return <HubSpotGateScreen onDone={email => { setHsEmail(email); setStep('form'); }} />;

  if (step === 'analyzing') return <AnalyzingScreen dataSource={inputMethod} />;
  if (step === 'results' && results) return <ResultsScreen results={results} email={hsEmail} />;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 px-5 h-14 flex items-center justify-between"
        style={{ background: WHITE, borderBottom: `1px solid ${BORDER_MED}` }}
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-base" style={{ color: TEXT, textDecoration: 'none' }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >🛡️</div>
          ChurnGuard
        </Link>
        <Link href="/#pricing" className="text-sm" style={{ color: MUTED, textDecoration: 'none' }}>
          View Plans →
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero */}
        <div className="text-center max-w-xl mb-10">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: DANGER_BG, border: `1px solid ${DANGER_BORD}`, color: DANGER }}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Free churn audit · No credit card · Takes about 10 minutes
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight" style={{ color: TEXT }}>
            Find Out Exactly<br />
            <span style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              How Much You&apos;re Losing
            </span>
          </h1>
          <p className="text-lg" style={{ color: MUTED }}>
            Upload a CSV or connect Stripe (read-only). We&apos;ll email you your churn rate vs. benchmark and revenue at risk.
          </p>
        </div>

        {/* Form card */}
        <form
          id="calculator-section"
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border p-7"
          style={{ background: WHITE, borderColor: BORDER_MED }}
        >
          {/* Method toggle */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: TEXT }}>Data source</label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl border" style={{ background: PAGE_BG, borderColor: BORDER }}>
              {(['stripe', 'csv'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setInputMethod(method)}
                  className="py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: inputMethod === method ? ACCENT : 'transparent',
                    color:      inputMethod === method ? WHITE  : MUTED,
                    border:     'none',
                    cursor:     'pointer',
                  }}
                >
                  {method === 'stripe' ? '⚡ Stripe Key' : '📄 CSV Upload'}
                </button>
              ))}
            </div>
          </div>

          {/* Stripe input */}
          {inputMethod === 'stripe' && (
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2" style={{ color: TEXT }}>
                Stripe Secret Key
                <span className="font-normal ml-1" style={{ color: FAINT }}>(read-only is fine)</span>
              </label>
              <input
                type="password"
                value={stripeKey}
                onChange={e => setStripeKey(e.target.value)}
                placeholder="sk_live_... or sk_test_..."
                className="cg-audit-input w-full rounded-xl px-4 py-3 text-sm font-mono focus:outline-none transition-colors"
                style={{ background: PAGE_BG, border: `1px solid ${BORDER_MED}`, color: TEXT }}
              />
              <p className="text-xs mt-2 flex items-start gap-1.5" style={{ color: FAINT }}>
                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: SUCCESS }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Used server-side for this analysis only. Never stored.
              </p>
            </div>
          )}

          {/* CSV upload */}
          {inputMethod === 'csv' && (
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2" style={{ color: TEXT }}>Customer CSV file</label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed rounded-xl p-6 text-center transition-colors"
                style={{ borderColor: csvFile ? ACCENT : BORDER_MED, background: csvFile ? ACCENT_BG : 'transparent' }}
              >
                {csvFile ? (
                  <div>
                    <p className="font-medium text-sm" style={{ color: ACCENT }}>{csvFile.name}</p>
                    <p className="text-xs mt-1" style={{ color: FAINT }}>Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-7 h-7 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} style={{ color: FAINT }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm" style={{ color: MUTED }}>Drop CSV or click to browse</p>
                    <p className="text-xs mt-1" style={{ color: FAINT }}>Columns: email, mrr, status, days_inactive</p>
                  </div>
                )}
              </button>
              <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={e => setCsvFile(e.target.files?.[0] ?? null)} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 text-sm rounded-xl px-4 py-3" style={{ background: DANGER_BG, border: `1px solid ${DANGER_BORD}`, color: DANGER }}>
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-base hover:opacity-90 hover:scale-[1.02] transition-all"
            style={{ background: DANGER, color: WHITE, border: 'none', cursor: 'pointer' }}
          >
            Show Me My Churn Numbers →
          </button>
          <p className="text-xs text-center mt-4" style={{ color: FAINT }}>
            Free · Results emailed to you · Stripe key never stored
          </p>
        </form>

        {/* Social proof */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs" style={{ color: MUTED }}>
          {['Used by 200+ SaaS founders', 'Stripe key never stored', 'Results emailed to you'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: SUCCESS }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t}
            </span>
          ))}
        </div>

        <style>{`
          .cg-audit-input::placeholder { color: ${FAINT}; }
          .cg-audit-input:focus { border-color: ${ACCENT} !important; }
        `}</style>
      </main>
    </div>
  );
}

export default function FreeAuditPage() {
  return (
    <Suspense fallback={<div style={{ background: PAGE_BG, minHeight: '100vh' }} />}>
      <AuditPageInner />
    </Suspense>
  );
}
