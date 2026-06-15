'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import DemoVideoModal from './DemoVideoModal';

// ─── Scroll-reveal ─────────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Fade({ children, className, style, delay = 0 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; delay?: number }) {
  const ref = useFadeIn();
  return (
    <div ref={ref} className={className} style={{ opacity: 0, transform: 'translateY(24px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'How long does setup take?', a: 'Connect your Stripe account in 5 minutes. Your first risk analysis runs automatically within 6 hours.' },
  { q: 'Is our customer data secure?', a: 'Yes. AES-256 encryption at rest, GDPR compliant, SOC2 Type II aligned.' },
  { q: 'What if I exceed my MRR band?', a: 'We automatically move you up — no service interruption, no surprise bills.' },
  { q: 'Does it work with HubSpot?', a: 'Native bi-directional sync included. Risk scores push to HubSpot every 6 hours, automatically.' },
  { q: 'Do I need to send messages manually?', a: 'No. AI writes and sends every message via Email, SMS, and Slack. You just review results.' },
  { q: 'How do I get started?', a: 'Pick a plan below. Setup takes 5 minutes. Cancel anytime.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-2xl overflow-hidden transition-all" style={{ background: '#fff', borderColor: open ? '#6366f1' : '#e2e8f0' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold transition-colors text-slate-800" style={{ fontSize: '15px' }}>
        <span>{q}</span>
        <span className="text-indigo-500 text-xl flex-shrink-0 ml-4" style={{ transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
      </button>
      {open && <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">{a}</div>}
    </div>
  );
}

// ─── Avatar placeholder ────────────────────────────────────────────────────────
function Avatar({ initials, bg }: { initials: string; bg: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: bg }}>
      <span className="text-white font-bold text-2xl">{initials}</span>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const planRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    (['freeTrial', 'seed', 'growth', 'scale'] as const).forEach(plan => {
      const el = planRefs.current[plan];
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActivePlan(plan); else setActivePlan(p => p === plan ? null : p); }, { threshold: 0.55 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter,system-ui,-apple-system,sans-serif' }}>

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80" style={{ backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.95)' }}>
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-900 tracking-tight">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🛡️</div>
            ChurnGuard
          </div>
          <div className="hidden md:flex items-center gap-7">
            {[['#features', 'Features'], ['#how-it-works', 'How it works'], ['#pricing', 'Pricing']].map(([href, label]) => (
              <a key={href} href={href} className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">{label}</a>
            ))}
            <Link href="/blog" className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">Blog</Link>
            <Link href="/book" className="text-violet-600 hover:text-violet-700 text-sm font-semibold transition-colors">Book a Call</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-sm px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-medium transition-colors">Login</Link>
            <Link href="/audit" className="text-sm px-5 py-2.5 rounded-xl font-bold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              Free Audit →
            </Link>
          </div>
          <button className="md:hidden text-slate-600 p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 px-5 py-5 bg-white flex flex-col gap-4">
            {[['#features', 'Features'], ['#how-it-works', 'How it works'], ['#pricing', 'Pricing']].map(([href, label]) => (
              <a key={href} href={href} className="text-slate-600 text-sm font-medium" onClick={() => setMobileOpen(false)}>{label}</a>
            ))}
            <Link href="/blog" className="text-slate-600 text-sm font-medium" onClick={() => setMobileOpen(false)}>Blog</Link>
            <Link href="/book" className="text-violet-600 text-sm font-semibold" onClick={() => setMobileOpen(false)}>Book a Call</Link>
            <Link href="/auth/login" className="text-slate-600 text-sm">Login</Link>
            <Link href="/audit" onClick={() => setMobileOpen(false)} className="text-sm px-4 py-3 rounded-xl font-bold text-white text-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              Get Free Audit →
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#0f172a 0%,#1e1b4b 60%,#0f172a 100%)', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        {/* Glow */}
        <div className="absolute pointer-events-none" style={{ top: '20%', left: '55%', width: '700px', height: '500px', background: 'radial-gradient(ellipse,rgba(99,102,241,0.18) 0%,transparent 65%)', filter: 'blur(40px)', transform: 'translateX(-50%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: 0, right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(ellipse,rgba(74,222,128,0.08) 0%,transparent 65%)', filter: 'blur(50px)' }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 border" style={{ background: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.3)', color: '#4ade80' }}>
                ✦ AI-powered churn prevention — set it once
              </div>
              <h1 className="font-extrabold leading-[1.08] mb-6 text-white" style={{ fontSize: 'clamp(2.5rem,5.5vw,4rem)', letterSpacing: '-0.03em' }}>
                Stop churn{' '}
                <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  before it happens
                </span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
                ChurnGuard predicts which customers will cancel, then automatically sends personalized retention messages via Email, SMS, and Slack — before they leave.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/audit" className="px-8 py-4 rounded-xl font-bold text-white text-base text-center hover:opacity-90 hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 40px rgba(99,102,241,0.45)' }}>
                  Get Free Audit →
                </Link>
                <button onClick={() => setShowDemo(true)} className="px-8 py-4 rounded-xl font-semibold text-slate-300 text-base text-center border hover:text-white hover:border-slate-500 transition-colors" style={{ borderColor: '#334155' }}>
                  View Demo
                </button>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-slate-600 text-sm">Setup in 5 min · No credit card · Cancel anytime</p>
              </div>
            </div>

            {/* Dashboard card */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-2xl border overflow-hidden" style={{ background: '#111827', borderColor: 'rgba(99,102,241,0.25)', boxShadow: '0 0 0 1px rgba(99,102,241,0.1), 0 40px 80px rgba(0,0,0,0.5)' }}>
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: '#0d1424', borderColor: '#1e293b' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  <div className="flex-1 ml-2 px-3 py-1 rounded text-xs text-slate-600 border text-left" style={{ background: '#0f172a', borderColor: '#1e293b' }}>churnguardapp.com/dashboard</div>
                </div>
                <div className="px-5 pt-5 pb-3 border-b" style={{ borderColor: '#1e293b' }}>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Live Dashboard</div>
                  <div className="text-slate-300 text-sm font-medium">Revenue Overview · Today</div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="rounded-xl p-4 border" style={{ background: 'rgba(248,113,113,0.06)', borderColor: 'rgba(248,113,113,0.2)' }}>
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Revenue at Risk</div>
                    <div className="font-extrabold" style={{ fontSize: '2.25rem', color: '#f87171', letterSpacing: '-0.03em', lineHeight: 1 }}>$47,200</div>
                    <div className="text-xs text-red-400/70 mt-1.5">↑ $3,100 since yesterday</div>
                  </div>
                  <div className="rounded-xl p-4 border" style={{ background: 'rgba(74,222,128,0.06)', borderColor: 'rgba(74,222,128,0.2)' }}>
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">Revenue Saved</div>
                    <div className="font-extrabold" style={{ fontSize: '2.25rem', color: '#4ade80', letterSpacing: '-0.03em', lineHeight: 1 }}>$18,400</div>
                    <div className="text-xs text-green-400/70 mt-1.5">↑ 3 customers retained this week</div>
                  </div>
                </div>
                <div className="px-5 pb-5 space-y-2">
                  {[
                    { co: 'Acme Corp', action: 'Email sent automatically', color: '#818cf8' },
                    { co: 'DataFlow Inc', action: 'SMS via Twilio delivered', color: '#4ade80' },
                    { co: 'CloudBase', action: 'CSM alerted via Slack', color: '#fb923c' },
                  ].map(r => (
                    <div key={r.co} className="flex items-center justify-between text-xs rounded-lg px-3 py-2" style={{ background: '#0f172a' }}>
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

      {/* ── TRUSTED BY ── */}
      <section className="bg-white py-14 px-5 sm:px-8 border-b border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">Trusted by SaaS teams worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {['Acme SaaS', 'Growlio', 'DataStack', 'PipelineHQ', 'FlowBase', 'Launchly'].map(name => (
              <div key={name} className="px-6 py-3 rounded-xl border text-slate-400 text-sm font-semibold" style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-24 px-5 sm:px-8" style={{ background: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <Fade className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#fee2e2', color: '#ef4444' }}>The Problem</div>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.02em' }}>
              Churn doesn't happen suddenly
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">The warning signs are there weeks before cancellation. Most teams miss all of them.</p>
          </Fade>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '👻', accent: '#fde047', accentBg: '#fefce8', accentBorder: '#fde047', headline: 'Silent disengagement', detail: 'Customers stop logging in weeks before they cancel. No complaint, no warning — just silence.' },
              { icon: '⏰', accent: '#fb923c', accentBg: '#fff7ed', accentBorder: '#fdba74', headline: 'Teams react too late', detail: 'By the time support hears about it, the decision is already made. Manual monitoring doesn\'t scale.' },
              { icon: '📉', accent: '#f87171', accentBg: '#fef2f2', accentBorder: '#fca5a5', headline: 'Revenue quietly drains', detail: 'No alert. No warning. Just MRR that was there last month and isn\'t now.' },
            ].map((p, i) => (
              <Fade key={p.icon} delay={i * 100}>
                <div className="rounded-2xl p-8 border h-full bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: '#e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 border" style={{ background: p.accentBg, borderColor: p.accentBorder }}>
                    {p.icon}
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-3">{p.headline}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.detail}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION / FEATURES ── */}
      <section id="features" className="py-28 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <Fade className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#ede9fe', color: '#7c3aed' }}>The Solution</div>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.02em' }}>
              Predict churn. Act automatically.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">ChurnGuard closes the loop from signal to recovery — without your team lifting a finger.</p>
          </Fade>

          {/* Feature pairs: face + card */}
          <div className="space-y-20">
            {[
              {
                avatarBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                avatarInitials: 'SR',
                quote: '"We stopped checking dashboards. ChurnGuard alerts us the moment something\'s off."',
                name: 'Sara R.', role: 'Founder, DataStack',
                cardAccent: '#4ade80', cardBg: '#f0fdf4', cardBorder: '#bbf7d0',
                icon: '💰', tag: 'Revenue at Risk',
                headline: 'See exactly which customers are about to cancel',
                body: 'Real dollar amounts on every at-risk account. Not vague percentages — actual MRR you\'re about to lose.',
                stat: '$47,200', statLabel: 'avg MRR saved per month',
                flip: false,
              },
              {
                avatarBg: 'linear-gradient(135deg,#fb923c,#f97316)',
                avatarInitials: 'MK',
                quote: '"It detected a customer going quiet 3 weeks before their renewal. We saved a $12K deal."',
                name: 'Marcus K.', role: 'Head of CS, Growlio',
                cardAccent: '#7dd3fc', cardBg: '#f0f9ff', cardBorder: '#bae6fd',
                icon: '🤖', tag: 'Automated Retention',
                headline: 'AI fires the right message at the right moment',
                body: 'Email, SMS, and Slack messages triggered automatically based on behavioral risk signals. Zero manual work.',
                stat: '87%', statLabel: 'of interventions fully automated',
                flip: true,
              },
              {
                avatarBg: 'linear-gradient(135deg,#4ade80,#22c55e)',
                avatarInitials: 'AJ',
                quote: '"Setup took 15 minutes. First customer saved within 48 hours."',
                name: 'Aisha J.', role: 'CEO, PipelineHQ',
                cardAccent: '#fb923c', cardBg: '#fff7ed', cardBorder: '#fed7aa',
                icon: '🔗', tag: 'Integrations',
                headline: 'Works with the tools you already use',
                body: 'Stripe, HubSpot, Twilio, Slack, Postmark — connect once. ChurnGuard syncs risk scores and fires recovery actions automatically.',
                stat: '5 min', statLabel: 'average time to connect Stripe',
                flip: false,
              },
            ].map((f) => (
              <Fade key={f.tag}>
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${f.flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  {/* Face + quote */}
                  <div className="flex flex-col items-start gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0" style={{ background: f.avatarBg }}>
                        <Avatar initials={f.avatarInitials} bg={f.avatarBg} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{f.name}</div>
                        <div className="text-slate-500 text-xs">{f.role}</div>
                      </div>
                    </div>
                    <blockquote className="text-slate-700 text-lg leading-relaxed font-medium italic border-l-4 pl-5" style={{ borderColor: f.cardAccent }}>
                      {f.quote}
                    </blockquote>
                  </div>

                  {/* UI card */}
                  <div className="rounded-2xl border p-8" style={{ background: f.cardBg, borderColor: f.cardBorder, boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 border" style={{ background: '#fff', borderColor: f.cardBorder, color: f.cardAccent }}>
                      {f.icon} {f.tag}
                    </div>
                    <h3 className="text-slate-900 font-bold text-xl mb-3 leading-snug">{f.headline}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{f.body}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-3xl" style={{ color: f.cardAccent, letterSpacing: '-0.03em' }}>{f.stat}</span>
                      <span className="text-slate-500 text-sm">{f.statLabel}</span>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-5 sm:px-8" style={{ background: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <Fade className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#e0f2fe', color: '#0284c7' }}>How it works</div>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.02em' }}>
              Set it once. It runs automatically.
            </h2>
            <p className="text-slate-500 text-lg">From connect to first saved customer in under 24 hours.</p>
          </Fade>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector lines (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5" style={{ background: 'linear-gradient(90deg,#e2e8f0,#6366f1,#e2e8f0)' }} />

            {[
              { num: '1', icon: '⚡', accent: '#7dd3fc', accentBg: '#e0f9ff', title: 'Connect Stripe', body: 'Link your Stripe account in 5 minutes. ChurnGuard immediately starts reading payment and subscription signals.' },
              { num: '2', icon: '🧠', accent: '#a78bfa', accentBg: '#ede9fe', title: 'AI detects risk', body: 'Every 6 hours, the risk engine scores all your customers using behavioral, billing, and engagement signals.' },
              { num: '3', icon: '✉️', accent: '#4ade80', accentBg: '#f0fdf4', title: 'Auto-retention fires', body: 'The right email, SMS, or Slack message goes out automatically — personalized, timed, no manual work.' },
            ].map((step, i) => (
              <Fade key={step.num} delay={i * 120}>
                <div className="rounded-2xl p-8 bg-white border border-slate-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 border" style={{ background: step.accentBg, borderColor: step.accent }}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: step.accent }}>Step {step.num}</div>
                  <h3 className="text-slate-900 font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.body}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHURN SIGNALS ── */}
      <section className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <Fade className="text-center mb-14">
            <h2 className="font-bold text-slate-900 mb-3" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.02em' }}>Signals we catch automatically</h2>
            <p className="text-slate-500">No dashboards to check. The playbook fires the moment something's off.</p>
          </Fade>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '💳', accent: '#fb923c', accentBg: '#fff7ed', accentBorder: '#fed7aa', badge: 'Real-time', title: 'Payment Failures', body: 'Failed charges, expired cards, and dunning risk — caught before they become cancellations.' },
              { icon: '📉', accent: '#818cf8', accentBg: '#ede9fe', accentBorder: '#c4b5fd', badge: 'Auto-detected', title: 'Usage Drops', body: 'When customers stop logging in or abandon key features — the earliest churn signal.' },
              { icon: '⚠️', accent: '#f87171', accentBg: '#fef2f2', accentBorder: '#fca5a5', badge: 'Auto-detected', title: 'Downgrade Intent', body: 'Plan changes, negative support sentiment, and expansion stalls — flagged before they escalate.' },
            ].map((s, i) => (
              <Fade key={s.title} delay={i * 100}>
                <div className="rounded-2xl p-7 border bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ borderColor: '#e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border" style={{ background: s.accentBg, borderColor: s.accentBorder }}>{s.icon}</div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ background: s.accentBg, color: s.accent, borderColor: s.accentBorder }}>{s.badge}</span>
                  </div>
                  <h3 className="text-slate-900 font-bold text-base mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.body}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="py-28 px-5 sm:px-8 relative overflow-hidden" style={{ background: '#0f172a' }}>
        <div className="absolute pointer-events-none inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%,rgba(99,102,241,0.12) 0%,transparent 65%)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <Fade>
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>Dashboard Preview</div>
            <h2 className="font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.02em' }}>
              Your revenue. Fully visible.
            </h2>
            <p className="text-slate-400 text-lg mb-14 max-w-xl mx-auto">Every at-risk account, every intervention, every dollar saved — in one dashboard.</p>

            {/* Large dashboard mock */}
            <div className="rounded-2xl border overflow-hidden text-left" style={{ background: '#111827', borderColor: 'rgba(99,102,241,0.2)', boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 60px 120px rgba(0,0,0,0.6)' }}>
              <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{ background: '#0d1424', borderColor: '#1e293b' }}>
                <div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-yellow-500/60" /><div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="flex-1 ml-3 text-xs text-slate-600 font-mono">churnguardapp.com/dashboard · At-Risk Accounts</div>
              </div>
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b" style={{ borderColor: '#1e293b' }}>
                {[
                  { label: 'Revenue at Risk', val: '$47,200', color: '#f87171' },
                  { label: 'Revenue Saved', val: '$18,400', color: '#4ade80' },
                  { label: 'At-Risk Accounts', val: '14', color: '#fb923c' },
                  { label: 'Interventions Sent', val: '31', color: '#818cf8' },
                ].map((s, i) => (
                  <div key={s.label} className="px-6 py-5 border-r last:border-r-0" style={{ borderColor: '#1e293b', background: i % 2 === 0 ? '#111827' : '#0f172a' }}>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">{s.label}</div>
                    <div className="font-extrabold text-2xl" style={{ color: s.color, letterSpacing: '-0.02em' }}>{s.val}</div>
                  </div>
                ))}
              </div>
              {/* Table */}
              <div className="p-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-600 uppercase tracking-wider border-b" style={{ borderColor: '#1e293b' }}>
                      <th className="text-left pb-3 font-semibold">Customer</th>
                      <th className="text-left pb-3 font-semibold">MRR</th>
                      <th className="text-left pb-3 font-semibold">Risk Score</th>
                      <th className="text-left pb-3 font-semibold">Last Action</th>
                      <th className="text-left pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Acme Corp', mrr: '$1,200', risk: 92, riskColor: '#f87171', action: 'Email sent', status: 'Intervening', statusColor: '#818cf8', statusBg: 'rgba(129,140,248,0.1)' },
                      { name: 'DataFlow Inc', mrr: '$890', risk: 78, riskColor: '#fb923c', action: 'SMS delivered', status: 'Saved', statusColor: '#4ade80', statusBg: 'rgba(74,222,128,0.1)' },
                      { name: 'CloudBase', mrr: '$2,400', risk: 85, riskColor: '#f87171', action: 'Slack alert', status: 'CSM assigned', statusColor: '#7dd3fc', statusBg: 'rgba(125,211,252,0.1)' },
                      { name: 'Launchly', mrr: '$620', risk: 61, riskColor: '#fde047', action: 'Monitoring', status: 'Watching', statusColor: '#fde047', statusBg: 'rgba(253,224,71,0.1)' },
                    ].map(r => (
                      <tr key={r.name} className="border-b" style={{ borderColor: '#1e293b' }}>
                        <td className="py-3.5 text-slate-300 font-medium">{r.name}</td>
                        <td className="py-3.5 text-slate-400">{r.mrr}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-slate-800">
                              <div className="h-full rounded-full" style={{ width: `${r.risk}%`, background: r.riskColor }} />
                            </div>
                            <span style={{ color: r.riskColor }} className="text-xs font-bold">{r.risk}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-500 text-xs">{r.action}</td>
                        <td className="py-3.5">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: r.statusColor, background: r.statusBg }}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Fade className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#ede9fe', color: '#7c3aed' }}>Pricing</div>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.02em' }}>Simple, predictable pricing</h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">Most teams recover 10× their subscription cost in the first month. Flat-rate by MRR band.</p>
          </Fade>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {/* Free Trial */}
            <Fade>
              <div ref={el => { planRefs.current['freeTrial'] = el; }} className="rounded-2xl p-7 border h-full flex flex-col relative" style={{ background: '#f0fdf4', borderColor: '#4ade80', boxShadow: '0 4px 24px rgba(74,222,128,0.12)' }}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full text-white tracking-wide whitespace-nowrap" style={{ background: '#16a34a' }}>NO CREDIT CARD</div>
                <div className="mb-5"><h3 className="font-bold text-lg mb-1 text-green-700">Free Trial</h3><p className="text-slate-500 text-xs">30 days full access</p></div>
                <div className="mb-6"><span className="text-3xl font-extrabold text-slate-900">$0</span><span className="text-slate-400 text-sm ml-1">/30 days</span><p className="text-slate-400 text-xs mt-1.5">Then $79/mo</p></div>
                <ul className="space-y-2.5 text-sm text-slate-600 mb-8 flex-1">
                  {['100 customers tracked', 'Basic automation', 'Slack alerts', 'Email sequences', 'CRM sync'].map(f => (
                    <li key={f} className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span>{f}</li>
                  ))}
                </ul>
                <Link href="/signup" className="block text-center py-3 px-5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity" style={{ background: '#16a34a' }}>Start Free Trial</Link>
              </div>
            </Fade>

            {/* Seed */}
            <Fade delay={60}>
              <div ref={el => { planRefs.current['seed'] = el; }} className="rounded-2xl p-7 border h-full flex flex-col" style={{ background: '#fff', borderColor: '#e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="mb-5"><h3 className="text-slate-800 font-bold text-lg mb-1">Seed</h3><p className="text-slate-400 text-xs">Up to $50K MRR</p></div>
                <div className="mb-6"><span className="text-3xl font-extrabold text-slate-900">$79</span><span className="text-slate-400 text-sm ml-1">/mo</span></div>
                <ul className="space-y-2.5 text-sm text-slate-600 mb-8 flex-1">
                  {['100 customers tracked', 'Basic automation', 'Slack alerts', 'Email sequences', 'CRM sync'].map(f => (
                    <li key={f} className="flex items-center gap-2"><span className="text-slate-400">✓</span>{f}</li>
                  ))}
                </ul>
                <Link href="/signup?plan=seed" className="block text-center py-3 px-5 rounded-xl font-semibold text-sm border text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors" style={{ borderColor: '#e2e8f0' }}>Get Started</Link>
              </div>
            </Fade>

            {/* Growth — featured */}
            <Fade delay={120}>
              <div ref={el => { planRefs.current['growth'] = el; }} className="rounded-2xl p-8 flex flex-col relative" style={{ background: 'linear-gradient(160deg,#1e1b4b,#312e81)', border: '2px solid #6366f1', boxShadow: '0 0 50px rgba(99,102,241,0.25)', transform: 'scale(1.03)' }}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full text-white tracking-wide" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>MOST POPULAR</div>
                <div className="mb-5"><h3 className="font-bold text-xl mb-1 text-white">Growth</h3><p className="text-indigo-300/70 text-xs">$50K – $200K MRR</p></div>
                <div className="mb-6"><span className="text-4xl font-extrabold text-white">$149</span><span className="text-indigo-300/70 text-sm ml-1">/mo</span></div>
                <ul className="space-y-3 text-sm text-indigo-200 mb-8 flex-1">
                  {['Unlimited customers', 'Advanced playbooks', 'SMS via Twilio', 'VIP Slack alerts', 'AI-written emails', 'Priority support'].map(f => (
                    <li key={f} className="flex items-center gap-2"><span className="text-indigo-400">✓</span>{f}</li>
                  ))}
                </ul>
                <Link href="/signup?plan=growth" className="block text-center py-3.5 px-5 rounded-xl font-bold text-indigo-900 text-sm hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg,#a5b4fc,#c4b5fd)' }}>Get Started</Link>
              </div>
            </Fade>

            {/* Scale */}
            <Fade delay={180}>
              <div ref={el => { planRefs.current['scale'] = el; }} className="rounded-2xl p-7 border h-full flex flex-col" style={{ background: '#fff', borderColor: '#e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="mb-5"><h3 className="text-slate-800 font-bold text-lg mb-1">Scale</h3><p className="text-slate-400 text-xs">$200K – $1M MRR</p></div>
                <div className="mb-6"><span className="text-3xl font-extrabold text-slate-900">$299</span><span className="text-slate-400 text-sm ml-1">/mo</span></div>
                <ul className="space-y-2.5 text-sm text-slate-600 mb-8 flex-1">
                  {['Unlimited everything', 'API access', 'Custom risk models', 'White-glove onboarding', 'Dedicated CSM'].map(f => (
                    <li key={f} className="flex items-center gap-2"><span className="text-slate-400">✓</span>{f}</li>
                  ))}
                </ul>
                <Link href="/signup?plan=scale" className="block text-center py-3 px-5 rounded-xl font-semibold text-sm border text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors" style={{ borderColor: '#e2e8f0' }}>Get Started</Link>
              </div>
            </Fade>
          </div>
          <p className="text-center text-slate-400 text-sm mt-8">30-day free trial · Cancel anytime · No contracts · No setup fees</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-5 sm:px-8" style={{ background: '#f8fafc' }}>
        <div className="max-w-2xl mx-auto">
          <Fade className="text-center mb-12">
            <h2 className="font-bold text-slate-900 mb-3" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.02em' }}>Common questions</h2>
            <p className="text-slate-500 text-sm">Everything you need before getting started.</p>
          </Fade>
          <div className="space-y-3">
            {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-5 sm:px-8 relative overflow-hidden" style={{ background: '#0f172a' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(99,102,241,0.18) 0%,transparent 70%)' }} />
        <Fade className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-extrabold text-white mb-5" style={{ fontSize: 'clamp(2.2rem,5vw,3.25rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Ready to reduce churn?
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Run a free audit on your Stripe account. See your at-risk MRR in 2 minutes — no signup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/audit" className="px-10 py-4 rounded-xl font-bold text-white text-base hover:opacity-90 hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 40px rgba(99,102,241,0.45)' }}>
              Get Free Audit →
            </Link>
            <Link href="/book" className="px-10 py-4 rounded-xl font-semibold text-slate-300 text-base border hover:text-white hover:border-slate-500 transition-colors" style={{ borderColor: '#334155' }}>
              Book a Demo
            </Link>
          </div>
          <p className="text-slate-600 text-sm mt-6">Cancel anytime · No contracts · No setup fees</p>
        </Fade>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-10 px-5 sm:px-8 bg-white" style={{ borderColor: '#e2e8f0' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm">
            <span>🛡️</span>
            <span className="font-bold text-slate-900">ChurnGuard</span>
            <span className="text-slate-400">© 2026 All rights reserved</span>
          </div>
          <div className="flex gap-6 text-slate-400 text-sm">
            {[['#', 'Privacy'], ['#', 'Terms'], ['#', 'Security'], ['/blog', 'Blog']].map(([href, label]) => (
              <a key={label} href={href} className="hover:text-slate-700 transition-colors">{label}</a>
            ))}
          </div>
          <div className="flex gap-4">
            {[
              { label: 'Twitter', d: 'M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016 2a4.48 4.48 0 00-4.48 4.48v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
              { label: 'LinkedIn', d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
            ].map(icon => (
              <a key={icon.label} href="#" aria-label={icon.label} className="text-slate-300 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon.d} /></svg>
              </a>
            ))}
          </div>
        </div>
      </footer>

      <DemoVideoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
}
