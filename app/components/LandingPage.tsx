'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ─── Scroll-reveal hook ────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeSection({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(28px)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'How long does setup take?',
    a: 'Add one JavaScript snippet to your app — takes about 5 minutes. Your first risk analysis runs automatically within 6 hours.',
  },
  {
    q: 'Is our customer data secure?',
    a: 'Yes. AES-256 encryption at rest, GDPR compliant, SOC2 Type II aligned.',
  },
  {
    q: 'What if I exceed my MRR band?',
    a: 'We automatically move you up — no service interruption, no surprise bills.',
  },
  {
    q: 'Does it work with HubSpot or Salesforce?',
    a: 'Native bi-directional sync included. Risk scores push to your CRM every 6 hours, automatically.',
  },
  {
    q: 'Do I need to send messages manually?',
    a: 'No. AI writes and sends every message via Email, SMS, and Slack. You just review results.',
  },
  {
    q: 'How do I get started?',
    a: 'Pick a plan below. Setup takes 5 minutes. Cancel anytime.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-2xl overflow-hidden transition-colors"
      style={{
        background: '#1e293b',
        borderColor: open ? 'rgba(99,102,241,0.4)' : '#334155',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex justify-between items-center px-6 py-5 text-left font-medium transition-colors"
        style={{ color: open ? '#c4b5fd' : '#e2e8f0' }}
      >
        <span>{q}</span>
        <span
          className="text-indigo-400 text-2xl flex-shrink-0 ml-4 leading-none"
          style={{
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            display: 'inline-block',
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-700 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const planRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll-highlight: whichever pricing card is most centered in viewport
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    (['seed', 'growth', 'scale'] as const).forEach(plan => {
      const el = planRefs.current[plan];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActivePlan(plan);
          else setActivePlan(prev => (prev === plan ? null : prev));
        },
        { threshold: 0.55 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-slate-800/60"
        style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)' }}
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              🛡️
            </div>
            ChurnGuard
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-lg border text-slate-300 hover:text-white transition-colors"
              style={{ borderColor: '#334155' }}
            >
              Login
            </Link>
            <a
              href="#pricing"
              className="text-sm px-5 py-2 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              Get Started
            </a>
          </div>

          <button
            className="md:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </nav>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-800 px-5 py-5 flex flex-col gap-4" style={{ background: '#0f172a' }}>
            <a href="#features" className="text-slate-300 text-sm" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#pricing" className="text-slate-300 text-sm" onClick={() => setMobileOpen(false)}>Pricing</a>
            <Link href="/login" className="text-slate-300 text-sm">Login</Link>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="text-sm px-4 py-3 rounded-xl font-semibold text-white text-center"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              Get Started
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '92vh',
          background: 'linear-gradient(175deg,#0a0f1e 0%,#0f172a 50%,#0a0f1e 100%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Glow blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '15%', left: '50%', transform: 'translateX(-50%)',
            width: '900px', height: '600px',
            background: 'radial-gradient(ellipse,rgba(99,102,241,0.13) 0%,transparent 65%)',
            filter: 'blur(30px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '10%', right: '-10%',
            width: '500px', height: '400px',
            background: 'radial-gradient(ellipse,rgba(139,92,246,0.1) 0%,transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 border"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  borderColor: 'rgba(99,102,241,0.35)',
                  color: '#a5b4fc',
                }}
              >
                💰 Save 10× your subscription or full refund
              </div>

              <h1
                className="font-extrabold leading-[1.08] mb-6"
                style={{ fontSize: 'clamp(2.4rem,5vw,3.75rem)', color: '#f1f5f9', letterSpacing: '-0.02em' }}
              >
                You're Losing Revenue{' '}
                <span style={{
                  background: 'linear-gradient(135deg,#818cf8 0%,#c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Right Now.
                </span>
                <br />
                Here's Exactly How Much.
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
                ChurnGuard shows your{' '}
                <strong className="text-slate-200">Revenue at Risk</strong> in real-time and automatically
                saves at-risk customers using AI-powered{' '}
                <strong className="text-slate-200">Email, SMS, and Slack</strong> outreach.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <a
                  href="#pricing"
                  className="px-8 py-4 rounded-xl font-bold text-white text-base text-center hover:opacity-90 hover:scale-105 transition-all"
                  style={{
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    boxShadow: '0 0 32px rgba(99,102,241,0.45)',
                  }}
                >
                  Get Started
                </a>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-xl font-semibold text-slate-300 text-base text-center border hover:text-white transition-colors"
                  style={{ borderColor: '#334155' }}
                >
                  View Demo →
                </Link>
              </div>

              <p className="text-slate-600 text-sm">
                Setup in 5 minutes&nbsp;·&nbsp;First results in hours&nbsp;·&nbsp;Cancel anytime
              </p>
            </div>

            {/* Right: dashboard mockup — 2 big numbers */}
            <div className="flex justify-center lg:justify-end">
              <div
                className="w-full max-w-sm rounded-2xl border overflow-hidden"
                style={{
                  background: '#111827',
                  borderColor: 'rgba(99,102,241,0.25)',
                  boxShadow: '0 0 0 1px rgba(99,102,241,0.1), 0 40px 80px rgba(0,0,0,0.6)',
                }}
              >
                {/* Browser chrome */}
                <div
                  className="flex items-center gap-2 px-4 py-3 border-b"
                  style={{ background: '#0d1424', borderColor: '#1e293b' }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  <div
                    className="flex-1 ml-3 px-3 py-1 rounded text-xs text-slate-600 border text-left"
                    style={{ background: '#0f172a', borderColor: '#1e293b' }}
                  >
                    churnguardapp.com/dashboard
                  </div>
                </div>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: '#1e293b' }}>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                    Live Dashboard
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Revenue Overview · Today</div>
                </div>

                {/* Two hero numbers */}
                <div className="p-6 space-y-4">
                  <div
                    className="rounded-xl p-5 border"
                    style={{
                      background: 'rgba(248,113,113,0.06)',
                      borderColor: 'rgba(248,113,113,0.2)',
                      boxShadow: '0 0 24px rgba(248,113,113,0.08) inset',
                    }}
                  >
                    <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Revenue at Risk</div>
                    <div
                      className="font-extrabold"
                      style={{ fontSize: '2.5rem', color: '#f87171', letterSpacing: '-0.03em', lineHeight: 1 }}
                    >
                      $47,200
                    </div>
                    <div className="text-xs text-red-400/70 mt-2">↑ $3,100 since yesterday</div>
                  </div>

                  <div
                    className="rounded-xl p-5 border"
                    style={{
                      background: 'rgba(74,222,128,0.06)',
                      borderColor: 'rgba(74,222,128,0.2)',
                      boxShadow: '0 0 24px rgba(74,222,128,0.06) inset',
                    }}
                  >
                    <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Revenue Saved</div>
                    <div
                      className="font-extrabold"
                      style={{ fontSize: '2.5rem', color: '#4ade80', letterSpacing: '-0.03em', lineHeight: 1 }}
                    >
                      $18,400
                    </div>
                    <div className="text-xs text-green-400/70 mt-2">↑ 3 customers retained this week</div>
                  </div>
                </div>

                {/* Activity strip */}
                <div className="px-6 pb-6 space-y-2">
                  {[
                    { co: 'Acme Corp', action: 'Email sent automatically', color: '#818cf8' },
                    { co: 'DataFlow Inc', action: 'SMS via Twilio delivered', color: '#818cf8' },
                    { co: 'CloudBase', action: 'CSM alerted via Slack', color: '#f87171' },
                  ].map(r => (
                    <div
                      key={r.co}
                      className="flex items-center justify-between text-xs rounded-lg px-3 py-2"
                      style={{ background: '#0f172a' }}
                    >
                      <span className="text-slate-400">{r.co}</span>
                      <span style={{ color: r.color }}>{r.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIN ───────────────────────────────────────────────────────────── */}
      <section style={{ background: '#080d1a' }} className="py-24 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeSection className="text-center mb-14">
            <h2
              className="font-bold text-white"
              style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.02em' }}
            >
              Churn doesn't happen suddenly
            </h2>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '👻',
                headline: 'Customers stop logging in before they cancel',
                detail: 'Silence is the first warning sign. Most teams miss it entirely.',
              },
              {
                icon: '⏰',
                headline: 'Teams react too late',
                detail: 'By the time support hears about it, the decision is already made.',
              },
              {
                icon: '📉',
                headline: 'Revenue quietly disappears',
                detail: 'No alert. No warning. Just MRR that was there last month and isn\'t now.',
              },
            ].map((p, i) => (
              <FadeSection
                key={p.icon}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div
                  className="rounded-2xl p-7 border h-full group cursor-default transition-all duration-300"
                  style={{
                    background: '#111827',
                    borderColor: '#1e293b',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.4)';
                    (e.currentTarget as HTMLDivElement).style.background = '#131d2e';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#1e293b';
                    (e.currentTarget as HTMLDivElement).style.background = '#111827';
                  }}
                >
                  <div className="text-3xl mb-4">{p.icon}</div>
                  <h3 className="text-white font-semibold text-base mb-3 leading-snug">{p.headline}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.detail}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" style={{ background: '#0f172a' }} className="py-28 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-16">
            <h2
              className="font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.02em' }}
            >
              What you get with ChurnGuard
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              One platform. Fully automated. Zero manual work after setup.
            </p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: '💰',
                title: 'Revenue at Risk',
                bold: 'See exactly how much money you\'re about to lose',
                body: 'before it happens. Real dollar amounts, not vague percentages.',
              },
              {
                icon: '🤖',
                title: 'Fully Automated',
                bold: 'Customers get targeted messages automatically.',
                body: 'AI runs every 6 hours. Zero manual work required from your team.',
              },
              {
                icon: '📱',
                title: 'Multi-Channel',
                bold: 'Reach users via Email, SMS (Twilio), and Slack',
                body: 'at exactly the right moment with AI-written personalized messages.',
              },
              {
                icon: '🔗',
                title: 'CRM Sync',
                bold: 'Sales and success teams always know who\'s at risk.',
                body: 'Bi-directional HubSpot & Salesforce sync runs automatically every 6 hours.',
              },
              {
                icon: '🎯',
                title: 'In-App Widget',
                bold: 'Show retention offers to the right users automatically.',
                body: 'Install one script. Targeted offers appear based on real behavior signals.',
              },
              {
                icon: '⭐',
                title: 'VIP Alerts',
                bold: 'High-value accounts get instant escalation',
                body: 'to your CSM team via Slack the moment risk is detected.',
              },
            ].map((card, i) => (
              <FadeSection key={card.title} style={{ transitionDelay: `${i * 70}ms` }}>
                <div
                  className="rounded-2xl p-7 border h-full transition-all duration-300 group"
                  style={{ background: '#111827', borderColor: '#1e293b' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.45)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#1e293b';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                    style={{ background: 'rgba(99,102,241,0.12)' }}
                  >
                    {card.icon}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">{card.title}</div>
                  <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
                    <strong className="text-white font-semibold">{card.bold}</strong>{' '}{card.body}
                  </p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section style={{ background: '#080d1a' }} className="py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeSection className="text-center mb-16">
            <h2
              className="font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.02em' }}
            >
              Set it once. It runs automatically.
            </h2>
            <p className="text-slate-500 text-lg">From install to automated retention in under an hour.</p>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: '01',
                icon: '🔌',
                title: 'Install',
                body: 'Add one script to your app.',
                sub: '5 minutes',
              },
              {
                num: '02',
                icon: '🧠',
                title: 'Detect',
                body: 'AI tracks behavior every 6 hours.',
                sub: 'Fully automatic',
              },
              {
                num: '03',
                icon: '⚡',
                title: 'Engage',
                body: 'Messages sent via SMS / Email / Slack.',
                sub: 'Zero manual work',
              },
              {
                num: '04',
                icon: '💵',
                title: 'Recover',
                body: 'Customers stay. Revenue saved.',
                sub: 'Watch it in dashboard',
              },
            ].map((step, i) => (
              <FadeSection key={step.num} style={{ transitionDelay: `${i * 90}ms` }}>
                <div
                  className="relative rounded-2xl p-7 border h-full"
                  style={{ background: '#111827', borderColor: '#1e293b' }}
                >
                  {/* Step pill */}
                  <div
                    className="text-xs font-bold px-2 py-1 rounded-md inline-block mb-5 tracking-widest"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}
                  >
                    {step.num}
                  </div>
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-sm mb-3">{step.body}</p>
                  <div
                    className="text-xs font-semibold px-3 py-1 rounded-full inline-block"
                    style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}
                  >
                    {step.sub}
                  </div>
                  {/* Arrow connector */}
                  {i < 3 && (
                    <div
                      className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 items-center justify-center z-10 rounded-full"
                      style={{ background: '#1e293b', color: '#475569', fontSize: '12px' }}
                    >
                      →
                    </div>
                  )}
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ background: '#0f172a' }} className="py-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeSection className="text-center mb-16">
            <h2
              className="font-bold text-white mb-4"
              style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.02em' }}
            >
              Simple, predictable pricing
            </h2>
            <p
              className="text-base font-semibold mb-2"
              style={{ color: '#a5b4fc' }}
            >
              Most teams recover 10× their subscription cost in the first month.
            </p>
            <p className="text-slate-500 text-sm">Flat-rate based on MRR band. No meter anxiety.</p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            {/* Seed */}
            <FadeSection>
              <div
                ref={el => { planRefs.current['seed'] = el; }}
                className="rounded-2xl p-7 border h-full flex flex-col"
                style={{
                  background: activePlan === 'seed' ? '#131d2e' : '#0e1623',
                  borderColor: activePlan === 'seed' ? '#6366f1' : '#1e293b',
                  boxShadow: activePlan === 'seed' ? '0 0 30px rgba(99,102,241,0.2)' : 'none',
                  opacity: activePlan && activePlan !== 'seed' ? 0.5 : 0.85,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#6366f1';
                  el.style.boxShadow = '0 0 30px rgba(99,102,241,0.2)';
                  el.style.transform = 'scale(1.02)';
                  el.style.opacity = '1';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = activePlan === 'seed' ? '#6366f1' : '#1e293b';
                  el.style.boxShadow = activePlan === 'seed' ? '0 0 30px rgba(99,102,241,0.2)' : 'none';
                  el.style.transform = 'scale(1)';
                  el.style.opacity = activePlan && activePlan !== 'seed' ? '0.5' : '0.85';
                }}
              >
                <div className="mb-5">
                  <h3 className="text-slate-300 font-bold text-lg mb-1">Seed</h3>
                  <p className="text-slate-600 text-xs">Up to $50K MRR</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-slate-200">$79</span>
                  <span className="text-slate-600 text-sm ml-1">/mo</span>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-500 mb-8 flex-1">
                  {['100 customers tracked', 'Basic automation rules', 'Slack alerts', 'Email sequences', 'CRM sync'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-slate-600">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup?plan=seed"
                  className="block text-center py-3 px-5 rounded-xl font-semibold text-sm border text-slate-400 hover:text-slate-200 transition-colors"
                  style={{ borderColor: '#334155' }}
                >
                  Get Started
                </Link>
              </div>
            </FadeSection>

            {/* Growth — featured, larger */}
            <FadeSection style={{ transitionDelay: '80ms' }}>
              <div
                ref={el => { planRefs.current['growth'] = el; }}
                className="rounded-2xl p-8 flex flex-col relative"
                style={{
                  background: '#131d2e',
                  border: `2px solid ${activePlan === 'growth' ? '#818cf8' : '#6366f1'}`,
                  boxShadow: activePlan === 'growth'
                    ? '0 0 70px rgba(99,102,241,0.45), 0 0 0 1px rgba(99,102,241,0.2)'
                    : '0 0 50px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.1)',
                  transform: 'scale(1.03)',
                  opacity: activePlan && activePlan !== 'growth' ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.border = '2px solid #a5b4fc';
                  el.style.boxShadow = '0 0 90px rgba(99,102,241,0.6), 0 0 0 1px rgba(99,102,241,0.3)';
                  el.style.transform = 'scale(1.06)';
                  el.style.opacity = '1';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.border = `2px solid ${activePlan === 'growth' ? '#818cf8' : '#6366f1'}`;
                  el.style.boxShadow = activePlan === 'growth'
                    ? '0 0 70px rgba(99,102,241,0.45), 0 0 0 1px rgba(99,102,241,0.2)'
                    : '0 0 50px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.1)';
                  el.style.transform = 'scale(1.03)';
                  el.style.opacity = activePlan && activePlan !== 'growth' ? '0.7' : '1';
                }}
              >
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full text-white tracking-wide"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                  MOST POPULAR
                </div>
                <div className="mb-5">
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#a5b4fc' }}>Growth</h3>
                  <p className="text-slate-500 text-xs">$50K – $200K MRR</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">$149</span>
                  <span className="text-slate-500 text-sm ml-1">/mo</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 mb-8 flex-1">
                  {['Unlimited customers', 'Advanced playbooks', 'SMS via Twilio', 'VIP alerts', 'AI-written emails', 'Priority support'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-indigo-400">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup?plan=growth"
                  className="block text-center py-3.5 px-5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                  Get Started
                </Link>
              </div>
            </FadeSection>

            {/* Scale */}
            <FadeSection style={{ transitionDelay: '160ms' }}>
              <div
                ref={el => { planRefs.current['scale'] = el; }}
                className="rounded-2xl p-7 border h-full flex flex-col"
                style={{
                  background: activePlan === 'scale' ? '#131d2e' : '#0e1623',
                  borderColor: activePlan === 'scale' ? '#6366f1' : '#1e293b',
                  boxShadow: activePlan === 'scale' ? '0 0 30px rgba(99,102,241,0.2)' : 'none',
                  opacity: activePlan && activePlan !== 'scale' ? 0.5 : 0.85,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '#6366f1';
                  el.style.boxShadow = '0 0 30px rgba(99,102,241,0.2)';
                  el.style.transform = 'scale(1.02)';
                  el.style.opacity = '1';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = activePlan === 'scale' ? '#6366f1' : '#1e293b';
                  el.style.boxShadow = activePlan === 'scale' ? '0 0 30px rgba(99,102,241,0.2)' : 'none';
                  el.style.transform = 'scale(1)';
                  el.style.opacity = activePlan && activePlan !== 'scale' ? '0.5' : '0.85';
                }}
              >
                <div className="mb-5">
                  <h3 className="text-slate-300 font-bold text-lg mb-1">Scale</h3>
                  <p className="text-slate-600 text-xs">$200K – $1M MRR</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-slate-200">$299</span>
                  <span className="text-slate-600 text-sm ml-1">/mo</span>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-500 mb-8 flex-1">
                  {['Unlimited everything', 'API access', 'Custom risk models', 'White-glove onboarding', 'Dedicated CSM'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-slate-600">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup?plan=scale"
                  className="block text-center py-3 px-5 rounded-xl font-semibold text-sm border text-slate-400 hover:text-slate-200 transition-colors"
                  style={{ borderColor: '#334155' }}
                >
                  Get Started
                </Link>
              </div>
            </FadeSection>
          </div>

          <p className="text-center text-slate-600 text-sm mt-8">
            Cancel anytime&nbsp;·&nbsp;No contracts&nbsp;·&nbsp;No setup fees
          </p>
        </div>
      </section>

      {/* ── SOCIAL PROOF ───────────────────────────────────────────────────── */}
      <section style={{ background: '#080d1a' }} className="py-28 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeSection className="text-center mb-14">
            <h2
              className="font-bold text-white mb-3"
              style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.02em' }}
            >
              Built for modern SaaS teams
            </h2>
            <p className="text-slate-500">Early users are already recovering lost revenue automatically</p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: '"ChurnGuard spotted $47K in at-risk revenue our first week. Our CFO finally had numbers she could act on."',
                name: 'Sarah Chen',
                role: 'CFO, TechFlow',
                initials: 'SC',
              },
              {
                quote: '"Twilio SMS reminders recovered 15% of failed payments with zero work from our team. It just runs."',
                name: 'Mike Ross',
                role: 'Head of Retention, DataSync',
                initials: 'MR',
              },
              {
                quote: '"Set it up Friday. Woke up Monday with 3 customers already re-engaged. That\'s the product."',
                name: 'Lisa Park',
                role: 'VP Success, CloudBase',
                initials: 'LP',
              },
            ].map((t, i) => (
              <FadeSection key={t.name} style={{ transitionDelay: `${i * 90}ms` }}>
                <div
                  className="rounded-2xl p-7 border h-full flex flex-col"
                  style={{ background: '#111827', borderColor: '#1e293b' }}
                >
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6 italic">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{t.name}</div>
                      <div className="text-slate-500 text-xs">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0f172a' }} className="py-28 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <FadeSection className="text-center mb-12">
            <h2
              className="font-bold text-white mb-3"
              style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.02em' }}
            >
              Common questions
            </h2>
            <p className="text-slate-500 text-sm">Everything you need before getting started.</p>
          </FadeSection>
          <div className="space-y-3">
            {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-32 px-5 sm:px-8 relative overflow-hidden" style={{ background: '#080d1a' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(99,102,241,0.18) 0%,transparent 70%)' }}
        />
        <FadeSection className="relative max-w-2xl mx-auto text-center">
          <h2
            className="font-extrabold text-white mb-5"
            style={{ fontSize: 'clamp(2.2rem,5vw,3.25rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Stop letting revenue slip away
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Start tracking and recovering churn automatically today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pricing"
              className="px-10 py-4 rounded-xl font-bold text-white text-base hover:opacity-90 hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                boxShadow: '0 0 40px rgba(99,102,241,0.45)',
              }}
            >
              Get Started
            </a>
            <Link
              href="/dashboard"
              className="px-10 py-4 rounded-xl font-semibold text-slate-300 text-base border hover:text-white transition-colors"
              style={{ borderColor: '#334155' }}
            >
              Book Demo
            </Link>
          </div>
          <p className="text-slate-600 text-sm mt-6">Cancel anytime · No contracts · No setup fees</p>
        </FadeSection>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t py-10 px-5 sm:px-8" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>🛡️</span>
            <span className="font-semibold text-white">ChurnGuard</span>
            <span>© 2024 All rights reserved</span>
          </div>
          <div className="flex gap-6 text-slate-600 text-sm">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
          </div>
          <div className="flex gap-4">
            {[
              { label: 'Twitter', d: 'M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016 2a4.48 4.48 0 00-4.48 4.48v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
              { label: 'LinkedIn', d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
              { label: 'GitHub', d: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
            ].map(icon => (
              <a key={icon.label} href="#" aria-label={icon.label} className="text-slate-700 hover:text-slate-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
