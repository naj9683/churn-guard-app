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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── FAQ accordion ─────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'How long does setup take?',
    a: 'Install our JavaScript snippet in 5 minutes. First risk analysis runs within 6 hours automatically.',
  },
  {
    q: 'Do you store our customer data securely?',
    a: 'Yes. SOC2 Type II compliant, AES-256 encryption at rest, GDPR compliant.',
  },
  {
    q: 'What if I exceed my MRR band?',
    a: 'We automatically adjust your plan. No surprise overages, no service interruption.',
  },
  {
    q: 'Can I use this with my existing CRM?',
    a: 'Native HubSpot and Salesforce sync included. Risk scores push automatically every 6 hours.',
  },
  {
    q: 'Do I need to manually send the retention messages?',
    a: 'No. Everything is automated—AI writes the messages and sends via Email, SMS (Twilio), and Slack based on your rules.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. 14-day free trial, no credit card required. Full feature access.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-slate-700 rounded-xl overflow-hidden"
      style={{ background: '#1e293b' }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex justify-between items-center p-5 text-left text-white font-medium hover:bg-slate-700 transition-colors"
      >
        <span>{q}</span>
        <span
          className="text-indigo-400 text-xl transition-transform duration-200 flex-shrink-0 ml-4"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-700 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Reusable fade-in section wrapper ─────────────────────────────────────────
function FadeSection({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, transform: 'translateY(32px)', transition: 'opacity 0.6s ease, transform 0.6s ease', ...style }}
    >
      {children}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-white" style={{ background: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── STICKY HEADER ────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-slate-800"
        style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-lg">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              🛡️
            </div>
            <span>ChurnGuard</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/pricing"
              className="text-sm px-4 py-2 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 px-4 py-4 flex flex-col gap-4" style={{ background: '#0f172a' }}>
            <a href="#features" className="text-slate-300 text-sm" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="text-slate-300 text-sm" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <Link href="/auth/login" className="text-slate-300 text-sm">Login</Link>
            <Link
              href="/pricing"
              className="text-sm px-4 py-2 rounded-lg font-semibold text-white text-center"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6"
        style={{ minHeight: '90vh', background: 'linear-gradient(180deg,#0f172a 0%,#0c1428 60%,#0f172a 100%)' }}
      >
        {/* Background glow orbs */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          style={{ width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)', filter: 'blur(40px)' }}
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border"
            style={{
              background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15))',
              borderColor: 'rgba(99,102,241,0.4)',
              color: '#a5b4fc',
            }}
          >
            💰 Guaranteed: Save 10× your subscription or money back
          </div>

          {/* H1 */}
          <h1
            className="font-bold leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', color: '#f8fafc' }}
          >
            Stop Losing Revenue
            <br />
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              to Churn
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            AI-powered Revenue at Risk (RaR) dashboard. Know exactly how many dollars are at risk.
            Set it up once, and our AI automatically detects at-risk customers, sends retention
            messages via <strong className="text-slate-300">Email, SMS (Twilio), and Slack</strong>—saving
            customers before they cancel.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-xl font-semibold text-white text-base transition-all hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl font-semibold text-slate-300 text-base border border-slate-600 hover:border-slate-400 hover:text-white transition-colors"
            >
              View Demo →
            </Link>
          </div>

          {/* Trust micro-copy */}
          <p className="text-slate-600 text-sm mt-6">14-day free trial · No credit card required · Cancel anytime</p>

          {/* Dashboard mockup */}
          <div className="mt-16 relative">
            <div
              className="rounded-2xl border border-slate-700 overflow-hidden mx-auto max-w-3xl"
              style={{ background: '#1e293b', boxShadow: '0 40px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(99,102,241,0.1)' }}
            >
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700" style={{ background: '#0f172a' }}>
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="flex-1 ml-4 rounded-md px-3 py-1 text-xs text-slate-500 border border-slate-700 text-left" style={{ background: '#0f172a' }}>
                  churnguardapp.com/dashboard
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="p-6 grid grid-cols-3 gap-4">
                {[
                  { label: 'Revenue at Risk', value: '$47,200', sub: '+12% this week', color: '#f87171' },
                  { label: 'At-Risk Customers', value: '23', sub: '↑ 3 new today', color: '#fb923c' },
                  { label: 'MRR Saved', value: '$18,400', sub: 'This month', color: '#4ade80' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl p-4 border border-slate-700" style={{ background: '#0f172a' }}>
                    <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                    <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 grid grid-cols-2 gap-3">
                {[
                  { name: 'Acme Corp', risk: 87, mrr: '$2,400', action: 'Email sent' },
                  { name: 'DataFlow Inc', risk: 73, mrr: '$1,200', action: 'SMS queued' },
                  { name: 'CloudBase', risk: 91, mrr: '$5,800', action: 'CSM alerted' },
                  { name: 'TechSync', risk: 68, mrr: '$890', action: 'Widget shown' },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between rounded-lg px-3 py-2 border border-slate-700" style={{ background: '#0f172a' }}>
                    <div>
                      <div className="text-xs font-medium text-slate-300">{row.name}</div>
                      <div className="text-xs text-slate-600">{row.mrr} MRR</div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-xs font-bold"
                        style={{ color: row.risk >= 80 ? '#f87171' : '#fb923c' }}
                      >
                        {row.risk} risk
                      </div>
                      <div className="text-xs text-indigo-400">{row.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section id="features" style={{ background: '#0f172a' }} className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to reduce churn
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              One platform. Fully automated. Zero manual work after setup.
            </p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '💰',
                title: 'Revenue at Risk (RaR)',
                body: 'See exact dollar amounts at risk, not just percentages. CFO-level forecasting with real-time MRR impact analysis.',
              },
              {
                icon: '🤖',
                title: 'Fully Automated Retention',
                body: 'Set it and forget it. AI analyzes customers every 6 hours, detects churn risk, and automatically runs playbooks—zero manual intervention required.',
              },
              {
                icon: '📱',
                title: 'Multi-Channel Outreach',
                body: 'Reach customers via Email sequences, SMS via Twilio, Slack alerts, and in-app widgets. AI writes personalized retention messages for each customer.',
              },
              {
                icon: '🍊',
                title: 'HubSpot & Salesforce Sync',
                body: 'Bi-directional CRM integration. Risk scores automatically sync to your CRM every 6 hours. No manual "Sync Now" clicks needed.',
              },
              {
                icon: '🎯',
                title: 'In-App Widget',
                body: 'Install our JavaScript snippet on your site in minutes. Automatically displays targeted offers to at-risk users based on their behavior.',
              },
              {
                icon: '⭐',
                title: 'VIP Alerts',
                body: 'Special escalations for high-value customers. Auto-route enterprise accounts (MRR > $5K) to your CSM team via Slack.',
              },
            ].map((card, i) => (
              <FadeSection key={card.title} style={{ transitionDelay: `${i * 80}ms` } as React.CSSProperties}>
                <div
                  className="rounded-2xl p-6 border border-slate-700 h-full hover:border-indigo-500/50 transition-colors group"
                  style={{ background: '#1e293b' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: 'rgba(99,102,241,0.15)' }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-indigo-300 transition-colors">{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{card.body}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#0c1628' }} className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Works in 4 simple steps</h2>
            <p className="text-slate-400 text-lg">From install to automated retention in under an hour.</p>
          </FadeSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: '🔌',
                title: 'Install SDK',
                body: 'Add one line of JavaScript to your website. Track logins, features, and payments automatically.',
              },
              {
                step: '02',
                icon: '🧠',
                title: 'AI Watches 24/7',
                body: 'GPT-4o analyzes behavior every 6 hours. Detects login drops, feature abandonment, and payment risks.',
              },
              {
                step: '03',
                icon: '⚡',
                title: 'Auto-Engage',
                body: 'Risk detected → Email sent → SMS reminder (Twilio) → Slack alert. Multi-channel sequence runs automatically.',
              },
              {
                step: '04',
                icon: '💵',
                title: 'Save Revenue',
                body: 'Customers retained, MRR protected. View saved revenue in your dashboard. Zero manual work.',
              },
            ].map((step, i) => (
              <FadeSection key={step.step} style={{ transitionDelay: `${i * 100}ms` } as React.CSSProperties}>
                <div className="relative rounded-2xl p-6 border border-slate-700 h-full" style={{ background: '#1e293b' }}>
                  <div
                    className="text-xs font-bold tracking-widest mb-4 inline-block px-2 py-1 rounded-md"
                    style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}
                  >
                    STEP {step.step}
                  </div>
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.body}</p>
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-600 text-xl z-10">→</div>
                  )}
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ background: '#0f172a' }} className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, tier-based pricing</h2>
            <p className="text-slate-400 text-lg">Flat-rate based on your MRR band. No meter anxiety. Predictable billing.</p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Seed */}
            <FadeSection>
              <div className="rounded-2xl p-8 border border-slate-700 h-full flex flex-col" style={{ background: '#1e293b' }}>
                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">Seed</h3>
                  <p className="text-slate-500 text-sm">Up to $50K MRR</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$79</span>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
                  {['Up to 100 customers', 'Basic automation rules', 'Slack alerts', 'Email sequences', 'HubSpot / Salesforce sync'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-indigo-400">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className="block text-center py-3 px-6 rounded-xl font-semibold border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </FadeSection>

            {/* Growth — highlighted */}
            <FadeSection style={{ transitionDelay: '80ms' } as React.CSSProperties}>
              <div
                className="rounded-2xl p-8 h-full flex flex-col relative"
                style={{ background: '#1e293b', border: '2px solid #6366f1', boxShadow: '0 0 40px rgba(99,102,241,0.2)' }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                  MOST POPULAR
                </div>
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#818cf8' }}>Growth</h3>
                  <p className="text-slate-500 text-sm">$50K – $200K MRR</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$149</span>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
                  {['Unlimited customers', 'Advanced playbooks', 'SMS via Twilio included', 'VIP alerts', 'AI-written retention emails', 'Priority support'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-indigo-400">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className="block text-center py-3 px-6 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                  Get Started — Popular
                </Link>
              </div>
            </FadeSection>

            {/* Scale */}
            <FadeSection style={{ transitionDelay: '160ms' } as React.CSSProperties}>
              <div className="rounded-2xl p-8 border border-slate-700 h-full flex flex-col" style={{ background: '#1e293b' }}>
                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">Scale</h3>
                  <p className="text-slate-500 text-sm">$200K – $1M MRR</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$299</span>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
                  {['Unlimited everything', 'API access', 'Custom risk models', 'White-glove onboarding', 'Dedicated CSM', 'Priority support'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-indigo-400">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className="block text-center py-3 px-6 rounded-xl font-semibold border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </FadeSection>
          </div>

          <p className="text-center text-slate-600 text-sm mt-8">
            Cancel anytime · No setup fees · Money-back guarantee
          </p>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#0c1628' }} className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Trusted by fast-growing SaaS teams</h2>
            <p className="text-slate-400 text-lg">Join 50+ teams reducing churn automatically</p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'ChurnGuard identified $47K in at-risk revenue in our first week. The RaR dashboard gave our CFO exactly what she needed.',
                name: 'Sarah Chen',
                role: 'CFO at TechFlow',
                initials: 'SC',
              },
              {
                quote: 'The SMS reminders via Twilio recovered 15% of our failed payments automatically. Zero manual work from our team.',
                name: 'Mike Ross',
                role: 'Head of Retention at DataSync',
                initials: 'MR',
              },
              {
                quote: 'Finally a churn tool that actually works on autopilot. Set it up on a Friday, woke up Monday with 3 customers already re-engaged.',
                name: 'Lisa Park',
                role: 'VP Success at CloudBase',
                initials: 'LP',
              },
            ].map((t, i) => (
              <FadeSection key={t.name} style={{ transitionDelay: `${i * 100}ms` } as React.CSSProperties}>
                <div className="rounded-2xl p-6 border border-slate-700 h-full flex flex-col" style={{ background: '#1e293b' }}>
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{t.name}</div>
                      <div className="text-slate-500 text-xs">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0f172a' }} className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <FadeSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Frequently asked questions</h2>
            <p className="text-slate-400">Everything you need to know before getting started.</p>
          </FadeSection>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.15) 0%,rgba(139,92,246,0.1) 100%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: '800px', height: '400px', background: 'radial-gradient(ellipse,rgba(99,102,241,0.2) 0%,transparent 70%)', filter: 'blur(60px)' }}
        />
        <FadeSection className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to stop losing revenue?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join teams saving $10K+ MRR monthly with automated churn prevention.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl font-semibold text-slate-300 border border-slate-600 hover:border-slate-400 hover:text-white transition-colors"
            >
              Book Demo
            </Link>
          </div>
          <p className="text-slate-600 text-sm mt-6">14-day free trial · No credit card required</p>
        </FadeSection>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-10 px-4 sm:px-6" style={{ background: '#0f172a' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>🛡️</span>
            <span className="font-semibold text-white">ChurnGuard</span>
            <span>© 2024 All rights reserved</span>
          </div>

          {/* Center */}
          <div className="flex gap-6 text-slate-500 text-sm">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
          </div>

          {/* Right — social icons */}
          <div className="flex gap-4">
            {[
              { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016 2a4.48 4.48 0 00-4.48 4.48v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
              { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
              { label: 'GitHub', path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
            ].map((icon) => (
              <a
                key={icon.label}
                href="#"
                aria-label={icon.label}
                className="text-slate-600 hover:text-slate-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
