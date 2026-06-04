'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
      style={{ background: '#0a0a12' }}
    >
      <div className="mb-10">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', animation: 'cgPulse 2s infinite' }}
        >
          🛡️
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Analyzing your {dataSource === 'stripe' ? 'Stripe account' : 'customer data'}
        </h2>
        <p className="text-slate-400 text-sm">This takes about 10 seconds…</p>
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
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : i === currentStep ? (
                <div className="w-3 h-3 rounded-full bg-indigo-400" style={{ animation: 'cgPulse 1s infinite' }} />
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-700" />
              )}
            </div>
            <span className={
              i < currentStep ? 'text-slate-400 line-through' :
              i === currentStep ? 'text-white' :
              'text-slate-600'
            }>
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10 w-full max-w-sm h-1.5 rounded-full bg-slate-800 overflow-hidden">
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
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow-lg transition-all duration-1000"
          style={{ left: `calc(${position}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
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

// Native form that submits directly to HubSpot's Forms API — no iframe, full style control.
const HS_PORTAL  = '147977159';
const HS_FORM_ID = '31ad22e3-ed18-4279-8639-a51cd2ee69f7';

function HubSpotGateScreen({ onDone }: { onDone: (email: string) => void }) {
  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [company,    setCompany]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError,  setFormError]  = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !company.trim()) {
      setFormError('Please fill in First Name, Email, and Company Name.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL}/${HS_FORM_ID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: [
              { name: 'firstname', value: firstName.trim() },
              { name: 'lastname',  value: lastName.trim() },
              { name: 'email',     value: email.trim() },
              { name: 'company',   value: company.trim() },
            ],
            context: {
              pageUri:  typeof window !== 'undefined' ? window.location.href : 'https://churnguardapp.com/audit',
              pageName: 'ChurnGuard Free Churn Audit',
            },
          }),
        }
      );
    } catch { /* network failure — proceed anyway, lead is best-effort */ }
    onDone(email.trim());
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#e5e7eb',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '6px',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#ffffff',
    color: '#0f172a',
    border: '1.5px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };
  const req = <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a12' }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b border-slate-800/60 px-5 h-14 flex items-center justify-between"
        style={{ background: 'rgba(10,10,18,0.92)', backdropFilter: 'blur(16px)' }}
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-base">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🛡️</div>
          ChurnGuard
        </Link>
        <Link href="/#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
          View Plans →
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero */}
        <div className="text-center max-w-xl mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-700/40 text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Free · No credit card · Results in 10 seconds
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Find Out Exactly<br />
            <span style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              How Much You're Losing
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Enter your details to see your free churn risk audit — monthly churn rate, revenue at risk, and customers about to cancel.
          </p>
        </div>

        {/* Lead capture form card */}
        <div
          className="w-full max-w-md rounded-2xl border p-8"
          style={{ background: '#111827', borderColor: '#1f2937' }}
        >
          <div className="flex justify-center mb-5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              🛡️
            </div>
          </div>
          <h2 className="text-white text-lg font-bold text-center mb-1">
            Enter your details to see your free churn risk audit
          </h2>
          <p className="text-slate-300 text-sm text-center mb-6">
            See your churn risk in 60 seconds. No credit card required.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* First + Last name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>First Name{req}</label>
                <input
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email{req}</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={inputStyle}
              />
            </div>

            {/* Company */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Company Name{req}</label>
              <input
                type="text"
                autoComplete="organization"
                value={company}
                onChange={e => setCompany(e.target.value)}
                style={inputStyle}
              />
            </div>

            {formError && (
              <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{formError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}
            >
              {submitting ? 'Submitting…' : 'See My Free Churn Audit →'}
            </button>
          </form>

          <p className="text-slate-400 text-xs text-center mt-5 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            We'll store your info to send your report. No spam, ever.
          </p>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-slate-400">
          {['Used by 200+ SaaS founders', 'Results in under 10 seconds', 'Stripe key never stored'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </main>
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
    <div className="min-h-screen pb-20" style={{ background: '#0a0a12' }}>
      {/* Page header */}
      <div
        className="py-12 px-6 text-center border-b"
        style={{ background: 'linear-gradient(180deg,#1a0505 0%,#0a0a12 100%)', borderColor: '#3f1a1a' }}
      >
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-800/40 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Your Churn Audit Is Ready
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
          The Brutal Truth About Your Churn
        </h1>
        <p className="text-slate-400 text-sm">
          Report sent to <span className="text-slate-300">{email}</span>
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-10 space-y-5">

        {/* Key metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="rounded-2xl p-5 text-center border"
            style={{
              background: churnBad ? 'rgba(239,68,68,0.07)' : 'rgba(34,197,94,0.07)',
              borderColor: churnBad ? '#7f1d1d' : '#14532d',
            }}
          >
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Monthly Churn</p>
            <p className="text-5xl font-extrabold mb-1" style={{ color: churnColor }}>
              {results.monthlyChurnRate.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500">per month</p>
          </div>

          <div className="rounded-2xl p-5 text-center border" style={{ background: 'rgba(245,158,11,0.07)', borderColor: '#78350f' }}>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Revenue at Risk</p>
            <p className="text-4xl font-extrabold text-amber-400 mb-1">
              ${results.revenueAtRisk.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">MRR in danger now</p>
          </div>

          <div className="rounded-2xl p-5 text-center border" style={{ background: 'rgba(239,68,68,0.07)', borderColor: '#7f1d1d' }}>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Annual Revenue Loss</p>
            <p className="text-4xl font-extrabold text-red-400 mb-1">
              ${results.annualizedLoss.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">if nothing changes</p>
          </div>
        </div>

        {/* Benchmark */}
        <div className="rounded-2xl p-5 border" style={{ background: '#111827', borderColor: '#1f2937' }}>
          <div className="flex items-start justify-between mb-4 gap-4">
            <div>
              <h3 className="text-white font-semibold text-sm mb-0.5">Industry Benchmark</h3>
              <p className="text-slate-400 text-xs">{benchmarkMsg}</p>
            </div>
            <span
              className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: bottomPct > 75 ? 'rgba(239,68,68,0.15)' : bottomPct > 50 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                color:      bottomPct > 75 ? '#ef4444' : bottomPct > 50 ? '#f59e0b' : '#22c55e',
              }}
            >
              Bottom {bottomPct}%
            </span>
          </div>
          <BenchmarkBar churnRate={results.monthlyChurnRate} />
          <div className="flex gap-6 mt-5 pt-4 border-t border-slate-800 text-center">
            {[
              { label: 'Active', value: results.activeCount },
              { label: 'Churned (30d)', value: results.canceledCount },
              { label: 'Past Due', value: results.pastDueCount },
            ].map(s => (
              <div key={s.label} className="flex-1">
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* At-risk customers */}
        {results.atRiskCustomers.length > 0 && (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#1f2937' }}>
            <div className="px-5 py-4 border-b" style={{ background: '#111827', borderColor: '#1f2937' }}>
              <h3 className="text-white font-semibold text-sm">Your Highest-Risk Customers</h3>
              <p className="text-slate-500 text-xs mt-0.5">Act on these within 48 hours or they're gone</p>
            </div>
            <div style={{ background: '#0d111b' }}>
              {results.atRiskCustomers.map((c, i) => {
                const isHigh = c.urgency === 'high';
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-4 border-b last:border-0"
                    style={{
                      borderColor: '#1a2035',
                      background: isHigh ? 'rgba(239,68,68,0.04)' : 'rgba(245,158,11,0.04)',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{c.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{c.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white text-sm font-semibold">${c.mrr.toLocaleString()}/mo</p>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: isHigh ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                          color:      isHigh ? '#ef4444' : '#f59e0b',
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
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}
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
          style={{ background: 'linear-gradient(145deg,#1a1040,#0f172a)', borderColor: 'rgba(99,102,241,0.3)' }}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">What happens next</p>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
            ChurnGuard can stop<br />
            <span className="text-amber-400">${results.revenueAtRisk.toLocaleString()}/mo</span> from walking out the door
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Automated interventions fire the moment a customer shows risk signals — before they cancel, not after.
          </p>
          <Link
            href="/#pricing"
            className="inline-block px-8 py-4 rounded-xl font-bold text-white text-base hover:opacity-90 hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 32px rgba(99,102,241,0.4)' }}
          >
            Activate ChurnGuard — Stop This Loss →
          </Link>
          <p className="text-slate-400 text-xs mt-4">Setup in 5 minutes · Cancel anytime · First results in hours</p>
        </div>

      </div>
    </div>
  );
}

// ── Form ─────────────────────────────────────────────────────────────────────

export default function FreeAuditPage() {
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
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a12' }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b border-slate-800/60 px-5 h-14 flex items-center justify-between"
        style={{ background: 'rgba(10,10,18,0.92)', backdropFilter: 'blur(16px)' }}
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-base">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >🛡️</div>
          ChurnGuard
        </Link>
        <Link href="/#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
          View Plans →
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero */}
        <div className="text-center max-w-xl mb-10">
          <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-800/40 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Free · No credit card · Results in 10 seconds
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Find Out Exactly<br />
            <span style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              How Much You're Losing
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Connect Stripe or upload a CSV. Get your monthly churn rate, revenue at risk, and a list of customers about to cancel — in seconds.
          </p>
        </div>

        {/* Form card */}
        <form
          id="calculator-section"
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl border p-7"
          style={{ background: '#111827', borderColor: '#1f2937' }}
        >
          {/* Method toggle */}
          <div className="mb-5">
            <label className="block text-slate-300 text-sm font-medium mb-2">Data source</label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
              {(['stripe', 'csv'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setInputMethod(method)}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    inputMethod === method ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {method === 'stripe' ? '⚡ Stripe Key' : '📄 CSV Upload'}
                </button>
              ))}
            </div>
          </div>

          {/* Stripe input */}
          {inputMethod === 'stripe' && (
            <div className="mb-5">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Stripe Secret Key
                <span className="text-slate-500 font-normal ml-1">(read-only is fine)</span>
              </label>
              <input
                type="password"
                value={stripeKey}
                onChange={e => setStripeKey(e.target.value)}
                placeholder="sk_live_... or sk_test_..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <p className="text-slate-500 text-xs mt-2 flex items-start gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Used server-side for this analysis only. Never stored.
              </p>
            </div>
          )}

          {/* CSV upload */}
          {inputMethod === 'csv' && (
            <div className="mb-5">
              <label className="block text-slate-300 text-sm font-medium mb-2">Customer CSV file</label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed rounded-xl p-6 text-center transition-colors hover:border-indigo-500"
                style={{ borderColor: csvFile ? '#4f46e5' : '#374151', background: csvFile ? 'rgba(99,102,241,0.05)' : 'transparent' }}
              >
                {csvFile ? (
                  <div>
                    <p className="text-indigo-400 font-medium text-sm">{csvFile.name}</p>
                    <p className="text-slate-500 text-xs mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-7 h-7 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-400 text-sm">Drop CSV or click to browse</p>
                    <p className="text-slate-400 text-xs mt-1">Columns: email, mrr, status, days_inactive</p>
                  </div>
                )}
              </button>
              <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={e => setCsvFile(e.target.files?.[0] ?? null)} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-950/50 border border-red-800/50 text-red-400 text-sm rounded-xl px-4 py-3">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-white text-base hover:opacity-90 hover:scale-[1.02] transition-all"
            style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: '0 0 24px rgba(239,68,68,0.3)' }}
          >
            Show Me My Churn Numbers →
          </button>
          <p className="text-slate-400 text-xs text-center mt-4">
            Free · No account needed · Results in 10 seconds
          </p>
        </form>

        {/* Social proof */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-slate-400">
          {['Used by 200+ SaaS founders', 'Results in under 10 seconds', 'Stripe key never stored'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
