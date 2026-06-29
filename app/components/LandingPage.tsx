'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import DemoVideoModal from './DemoVideoModal';

// ─── Reduced-motion safe float ─────────────────────────────────────────────────
function FloatCard({
  children,
  className,
  style,
  delay = 0,
  amplitude = 10,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  amplitude?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      animate={reduced ? {} : { y: [0, -amplitude, 0] }}
      transition={{ duration: 4 + delay * 0.5, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Scroll fade-in ───────────────────────────────────────────────────────────
function FadeIn({
  children,
  className,
  style,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const initial =
    direction === 'up' ? { opacity: 0, y: 32 }
    : direction === 'left' ? { opacity: 0, x: -32 }
    : direction === 'right' ? { opacity: 0, x: 32 }
    : { opacity: 0 };
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'How long does setup take?', a: 'Connect Stripe in 5 minutes. First risk analysis runs automatically within 6 hours.' },
  { q: 'Is our customer data secure?', a: 'AES-256 encryption at rest, GDPR compliant, SOC2 Type II aligned.' },
  { q: 'What if I exceed my MRR band?', a: 'We move you up automatically — no service interruption, no surprise bills.' },
  { q: 'Does it work with HubSpot?', a: 'Native bi-directional sync. Risk scores push to HubSpot every 6 hours, automatically.' },
  { q: 'Do I need to send messages manually?', a: 'No. AI writes and sends every message via Email, SMS, and Slack. You just review results.' },
  { q: 'How do I get started?', a: 'Pick a plan below. Setup takes 5 minutes. Cancel anytime.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: '#fff', borderColor: open ? '#06b6d4' : '#e2e8f0', transition: 'border-color 0.2s' }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center px-6 py-5 text-slate-800 font-semibold" style={{ fontSize: '15px' }}>
        <span>{q}</span>
        <span style={{ color: '#06b6d4', display: 'inline-block', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', fontSize: '22px', lineHeight: 1, flexShrink: 0, marginLeft: '16px' }}>+</span>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">{a}</div>
      </motion.div>
    </div>
  );
}

// ─── Reusable avatar chip ─────────────────────────────────────────────────────
function AvatarChip({ initials, bg, size = 32 }: { initials: string; bg: string; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [email, setEmail] = useState('');
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const planRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    (['freeTrial', 'seed', 'growth', 'scale'] as const).forEach(plan => {
      const el = planRefs.current[plan];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActivePlan(plan); else setActivePlan(p => p === plan ? null : p); },
        { threshold: 0.55 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(11,17,32,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5 font-bold text-lg text-white tracking-tight">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#06b6d4,#6366f1)' }}>🛡️</div>
            ChurnGuard
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[['#features', 'Features'], ['#how-it-works', 'How it works'], ['#pricing', 'Pricing'], ['/blog', 'Blog']].map(([href, label]) => (
              <a key={href} href={href} className="text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                {label}
              </a>
            ))}
            <Link href="/book-demo" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">Book a Call</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-sm px-4 py-2 rounded-lg font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>
              Login
            </Link>
            <Link href="/audit" className="text-sm px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', boxShadow: '0 0 20px rgba(6,182,212,0.35)' }}>
              Free Audit →
            </Link>
          </div>
          <button className="md:hidden p-2 text-slate-400" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden border-t px-5 py-5 flex flex-col gap-4" style={{ background: '#0b1120', borderColor: 'rgba(255,255,255,0.06)' }}>
            {[['#features', 'Features'], ['#how-it-works', 'How it works'], ['#pricing', 'Pricing'], ['/blog', 'Blog']].map(([href, label]) => (
              <a key={href} href={href} className="text-slate-300 text-sm font-medium" onClick={() => setMobileOpen(false)}>{label}</a>
            ))}
            <Link href="/book-demo" className="text-cyan-400 text-sm font-semibold" onClick={() => setMobileOpen(false)}>Book a Call</Link>
            <Link href="/auth/login" className="text-slate-300 text-sm">Login</Link>
            <Link href="/audit" onClick={() => setMobileOpen(false)} className="text-sm px-4 py-3.5 rounded-xl font-bold text-white text-center" style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)' }}>
              Get Free Audit →
            </Link>
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#0b1120', minHeight: '95vh', display: 'flex', alignItems: 'center' }}>

        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Glow blobs */}
        <div className="absolute pointer-events-none" style={{ top: '-10%', left: '30%', width: '800px', height: '600px', background: 'radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 60%)', filter: 'blur(60px)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '5%', right: '-5%', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 60%)', filter: 'blur(60px)' }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── Copy ── */}
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 border" style={{ background: 'rgba(6,182,212,0.1)', borderColor: 'rgba(6,182,212,0.3)', color: '#67e8f9' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  AI-powered churn prevention · New in 2026
                </div>
              </motion.div>

              <motion.h1
                className="font-extrabold text-white leading-[1.07] mb-6"
                style={{ fontSize: 'clamp(2.6rem,5.5vw,4.2rem)', letterSpacing: '-0.03em' }}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              >
                Stop churn{' '}
                <span style={{ background: 'linear-gradient(135deg,#06b6d4,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  before it happens
                </span>
              </motion.h1>

              <motion.p
                className="text-lg leading-relaxed mb-10 max-w-lg"
                style={{ color: 'rgba(255,255,255,0.55)' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              >
                ChurnGuard monitors every customer signal, predicts cancellations weeks in advance, and automatically fires personalized retention messages via Email, SMS, and Slack.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4 mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <Link href="/audit" className="px-8 py-4 rounded-xl font-bold text-white text-base text-center transition-all hover:scale-105 hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', boxShadow: '0 0 40px rgba(6,182,212,0.4)' }}>
                  Get Free Audit →
                </Link>
                <button onClick={() => setShowDemo(true)} className="px-8 py-4 rounded-xl font-semibold text-base text-center border transition-all hover:border-slate-500"
                  style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
                  View Demo ▶
                </button>
              </motion.div>

              <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }}>
                <div className="flex -space-x-2">
                  {[
                    { i: 'SR', bg: 'linear-gradient(135deg,#06b6d4,#6366f1)' },
                    { i: 'MK', bg: 'linear-gradient(135deg,#f97316,#fb923c)' },
                    { i: 'AJ', bg: 'linear-gradient(135deg,#4ade80,#22c55e)' },
                    { i: 'PL', bg: 'linear-gradient(135deg,#f472b6,#e879f9)' },
                  ].map(a => (
                    <div key={a.i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold" style={{ background: a.bg, borderColor: '#0b1120' }}>
                      {a.i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Loved by 200+ SaaS founders</p>
                </div>
              </motion.div>
            </div>

            {/* ── Floating cards ── */}
            <div className="relative h-[520px] hidden lg:block">
              {/* Main dashboard card */}
              <FloatCard delay={0} amplitude={12} className="absolute" style={{ top: '0%', left: '5%', width: '340px' }}>
                <div className="rounded-2xl border overflow-hidden" style={{ background: '#141d2e', borderColor: 'rgba(6,182,212,0.2)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ background: '#0d1525', borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e' }} />
                    <span className="ml-2 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>dashboard · at-risk</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="rounded-xl p-3 border" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.15)' }}>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Revenue at Risk</div>
                      <div className="font-extrabold text-2xl" style={{ color: '#f87171', letterSpacing: '-0.03em' }}>$47,200</div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(248,113,113,0.6)' }}>↑ 14 accounts flagged today</div>
                    </div>
                    <div className="rounded-xl p-3 border" style={{ background: 'rgba(74,222,128,0.06)', borderColor: 'rgba(74,222,128,0.15)' }}>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Saved This Month</div>
                      <div className="font-extrabold text-2xl" style={{ color: '#4ade80', letterSpacing: '-0.03em' }}>$18,400</div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(74,222,128,0.6)' }}>↑ 3 customers retained</div>
                    </div>
                    {[
                      { name: 'Acme Corp', action: 'Email fired', color: '#818cf8' },
                      { name: 'DataFlow', action: 'SMS sent', color: '#4ade80' },
                    ].map(r => (
                      <div key={r.name} className="flex items-center justify-between text-xs rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{r.name}</span>
                        <span style={{ color: r.color }} className="font-semibold">{r.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FloatCard>

              {/* Mint accent card — risk alert */}
              <FloatCard delay={1.2} amplitude={8} className="absolute" style={{ top: '2%', right: '0%', width: '180px' }}>
                <div className="rounded-2xl p-4 border shadow-lg" style={{ background: '#d1fae5', borderColor: '#6ee7b7' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AvatarChip initials="MK" bg="linear-gradient(135deg,#f97316,#fb923c)" size={28} />
                    <span className="text-xs font-bold text-emerald-800">Risk alert</span>
                  </div>
                  <div className="text-xs text-emerald-700 leading-snug">Marcus K. hasn't logged in for <strong>12 days</strong></div>
                  <div className="mt-2 px-2 py-1 rounded-lg text-xs font-bold text-center" style={{ background: '#6ee7b7', color: '#064e3b' }}>Email queued ✓</div>
                </div>
              </FloatCard>

              {/* Yellow card — MRR saved */}
              <FloatCard delay={0.6} amplitude={14} className="absolute" style={{ bottom: '12%', right: '2%', width: '170px' }}>
                <div className="rounded-2xl p-4 border shadow-lg" style={{ background: '#fef3c7', borderColor: '#fcd34d' }}>
                  <div className="text-2xl mb-1">🎉</div>
                  <div className="text-xs font-bold text-amber-800 mb-1">MRR Saved</div>
                  <div className="text-2xl font-extrabold text-amber-700" style={{ letterSpacing: '-0.02em' }}>$1,200</div>
                  <div className="text-xs text-amber-600 mt-1">Acme Corp retained</div>
                </div>
              </FloatCard>

              {/* Blue card — AI message */}
              <FloatCard delay={1.8} amplitude={9} className="absolute" style={{ bottom: '5%', left: '8%', width: '200px' }}>
                <div className="rounded-2xl p-4 border shadow-lg" style={{ background: '#dbeafe', borderColor: '#93c5fd' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs" style={{ background: '#3b82f6', color: '#fff' }}>✉</div>
                    <span className="text-xs font-bold text-blue-800">AI Message</span>
                  </div>
                  <p className="text-xs text-blue-700 leading-snug">"Hi Sarah, we noticed you haven't used the reports feature…"</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-xs text-blue-600">Sent via Email</span>
                  </div>
                </div>
              </FloatCard>

              {/* Coral card — Slack alert */}
              <FloatCard delay={2.4} amplitude={7} className="absolute" style={{ top: '50%', left: '0%', width: '168px' }}>
                <div className="rounded-2xl p-4 border shadow-lg" style={{ background: '#ffe4e6', borderColor: '#fda4af' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center text-white text-xs font-bold">S</div>
                    <span className="text-xs font-bold text-rose-800">Slack Alert</span>
                  </div>
                  <div className="text-xs text-rose-700 leading-snug">VIP customer <strong>CloudBase</strong> is at 91% risk</div>
                  <div className="text-xs text-rose-500 mt-1.5">→ CSM notified</div>
                </div>
              </FloatCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <section className="bg-white py-14 px-5 sm:px-8 border-b border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn><p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">Trusted by 200+ SaaS teams worldwide</p></FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {['Acme SaaS', 'Growlio', 'DataStack', 'PipelineHQ', 'FlowBase', 'Launchly', 'BuildKit'].map(name => (
                <div key={name} className="px-6 py-3 rounded-xl border text-slate-400 text-sm font-semibold grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all" style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}>
                  {name}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          PROBLEM
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8" style={{ background: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#fee2e2', color: '#dc2626' }}>The Problem</div>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(1.9rem,4vw,2.75rem)', letterSpacing: '-0.025em' }}>
              Churn doesn't happen overnight
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">The signals are there weeks before cancellation. Most teams miss every one of them.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', accent: '#06b6d4', accentBg: '#cffafe', title: 'Silent disengagement', body: 'Customers stop logging in weeks before cancelling. No complaint, no support ticket — just silence.' },
              { num: '02', accent: '#f97316', accentBg: '#ffedd5', title: 'Manual monitoring breaks', body: 'Once you cross 50 customers, no one can keep track. By the time your team reacts, the decision is made.' },
              { num: '03', accent: '#8b5cf6', accentBg: '#ede9fe', title: 'Revenue drains quietly', body: 'No dashboard alert. No warning email. Just MRR that was there last month and isn\'t now.' },
            ].map((p, i) => (
              <FadeIn key={p.num} delay={i * 0.1}>
                <motion.div
                  className="rounded-2xl p-8 bg-white h-full border-t-4"
                  style={{ borderTopColor: p.accent, borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-5xl font-extrabold mb-5" style={{ color: p.accentBg, WebkitTextStroke: `2px ${p.accent}`, letterSpacing: '-0.04em' }}>{p.num}</div>
                  <h3 className="text-slate-900 font-bold text-lg mb-3">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SOLUTION — alternating rows
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#cffafe', color: '#0e7490' }}>The Solution</div>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.025em' }}>
              Predict. Intervene. Retain.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">ChurnGuard handles the full loop — from signal detection to automated message delivery.</p>
          </FadeIn>

          <div className="space-y-24">
            {[
              {
                flip: false,
                tag: 'Revenue Intelligence',
                tagColor: '#0e7490', tagBg: '#cffafe',
                headline: 'See exactly how much revenue is at risk — right now',
                body: 'Every customer gets a live risk score. ChurnGuard shows you the exact MRR attached to each at-risk account, not vague health percentages.',
                bullets: ['Risk scores updated every 6 hours', 'MRR-weighted account prioritization', 'Trend analysis over 30 / 60 / 90 days', 'Exportable at-risk customer list'],
                card: (
                  <div className="rounded-2xl border overflow-hidden" style={{ background: '#141d2e', borderColor: 'rgba(6,182,212,0.2)', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
                    <div className="px-5 py-4 border-b grid grid-cols-2 gap-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      {[{ l: 'Revenue at Risk', v: '$47,200', c: '#f87171' }, { l: 'Saved This Month', v: '$18,400', c: '#4ade80' }, { l: 'At-Risk Accounts', v: '14', c: '#fb923c' }, { l: 'Interventions', v: '31', c: '#818cf8' }].map(s => (
                        <div key={s.l} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.l}</div>
                          <div className="font-extrabold text-xl" style={{ color: s.c, letterSpacing: '-0.02em' }}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 space-y-2">
                      {[
                        { name: 'Acme Corp', mrr: '$1,200', risk: 92, c: '#f87171' },
                        { name: 'DataFlow', mrr: '$890', risk: 78, c: '#fb923c' },
                        { name: 'CloudBase', mrr: '$2,400', risk: 85, c: '#f87171' },
                      ].map(r => (
                        <div key={r.name} className="flex items-center justify-between text-xs rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <span style={{ color: 'rgba(255,255,255,0.6)' }} className="font-medium">{r.name}</span>
                          <span style={{ color: 'rgba(255,255,255,0.35)' }}>{r.mrr}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                              <div className="h-full rounded-full" style={{ width: `${r.risk}%`, background: r.c }} />
                            </div>
                            <span style={{ color: r.c }} className="font-bold">{r.risk}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                flip: true,
                tag: 'Automated Retention',
                tagColor: '#7c3aed', tagBg: '#ede9fe',
                headline: 'AI fires the right message before you even notice the risk',
                body: 'No manual outreach. ChurnGuard writes and sends personalized messages via Email, SMS, and Slack based on each customer\'s exact behavior.',
                bullets: ['Personalized emails written by AI', 'SMS via Twilio for high-value accounts', 'Slack alerts to your CSM team', 'Intervention outcomes tracked automatically'],
                card: (
                  <div className="space-y-4">
                    <FloatCard delay={0} amplitude={6} style={{ display: 'block' }}>
                      <div className="rounded-2xl p-5 border" style={{ background: '#dbeafe', borderColor: '#93c5fd', boxShadow: '0 8px 32px rgba(59,130,246,0.12)' }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: '#3b82f6' }}>✉</div>
                          <div>
                            <div className="text-xs font-bold text-blue-800">AI Email · Sent 2 min ago</div>
                            <div className="text-xs text-blue-500">To: sarah@acmecorp.com</div>
                          </div>
                        </div>
                        <p className="text-xs text-blue-700 leading-relaxed italic">"Hi Sarah, we noticed you haven't used ChurnGuard's report builder in 2 weeks. Here's a quick 90-second walkthrough that might help…"</p>
                      </div>
                    </FloatCard>
                    <div className="grid grid-cols-2 gap-4">
                      <FloatCard delay={0.8} amplitude={8} style={{ display: 'block' }}>
                        <div className="rounded-2xl p-4 border" style={{ background: '#d1fae5', borderColor: '#6ee7b7', boxShadow: '0 8px 24px rgba(16,185,129,0.1)' }}>
                          <div className="text-lg mb-1">💬</div>
                          <div className="text-xs font-bold text-emerald-800 mb-1">SMS Sent</div>
                          <div className="text-xs text-emerald-600">"Your trial ends in 3 days. Lock in your rate—"</div>
                        </div>
                      </FloatCard>
                      <FloatCard delay={1.4} amplitude={10} style={{ display: 'block' }}>
                        <div className="rounded-2xl p-4 border" style={{ background: '#ffe4e6', borderColor: '#fda4af', boxShadow: '0 8px 24px rgba(244,63,94,0.08)' }}>
                          <div className="text-lg mb-1">🔔</div>
                          <div className="text-xs font-bold text-rose-800 mb-1">Slack Alert</div>
                          <div className="text-xs text-rose-600">CSM: CloudBase @ 91% risk</div>
                        </div>
                      </FloatCard>
                    </div>
                  </div>
                ),
              },
              {
                flip: false,
                tag: 'Integrations',
                tagColor: '#b45309', tagBg: '#fef3c7',
                headline: 'Connects to the tools you already use in minutes',
                body: 'Stripe, HubSpot, Twilio, Slack, Postmark — connect once and ChurnGuard handles syncing, triggering, and reporting automatically.',
                bullets: ['Stripe billing & payment data', 'HubSpot CRM bi-directional sync', 'Twilio SMS for outreach', 'Slack + email notifications'],
                card: (
                  <div className="rounded-2xl p-6 border" style={{ background: '#fff', borderColor: '#e2e8f0', boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}>
                    <div className="text-sm font-bold text-slate-800 mb-5">Connected integrations</div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: 'Stripe', icon: '💳', status: 'Connected', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
                        { name: 'HubSpot', icon: '🔗', status: 'Syncing', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
                        { name: 'Twilio', icon: '📱', status: 'Active', color: '#06b6d4', bg: '#cffafe', border: '#67e8f9' },
                        { name: 'Slack', icon: '💬', status: 'Alerts on', color: '#8b5cf6', bg: '#ede9fe', border: '#c4b5fd' },
                        { name: 'Postmark', icon: '✉️', status: 'Sending', color: '#f59e0b', bg: '#fef3c7', border: '#fcd34d' },
                        { name: 'Segment', icon: '📊', status: 'Tracking', color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
                      ].map(int => (
                        <div key={int.name} className="rounded-xl p-3 border flex items-center gap-3" style={{ background: int.bg, borderColor: int.border }}>
                          <span className="text-lg">{int.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{int.name}</div>
                            <div className="text-xs font-semibold" style={{ color: int.color }}>{int.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
            ].map((f) => (
              <div key={f.tag} className={`grid lg:grid-cols-2 gap-16 items-center ${f.flip ? '' : ''}`}>
                <FadeIn direction={f.flip ? 'right' : 'left'} className={f.flip ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 border" style={{ background: f.tagBg, color: f.tagColor, borderColor: f.tagColor + '40' }}>
                    {f.tag}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-4 leading-snug" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '-0.02em' }}>{f.headline}</h3>
                  <p className="text-slate-500 text-base leading-relaxed mb-6">{f.body}</p>
                  <ul className="space-y-3">
                    {f.bullets.map(b => (
                      <li key={b} className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: f.tagBg }}>
                          <svg className="w-3 h-3" fill="none" stroke={f.tagColor} viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {b}
                      </li>
                    ))}
                  </ul>
                </FadeIn>
                <FadeIn direction={f.flip ? 'left' : 'right'} delay={0.15} className={f.flip ? 'lg:order-1' : ''}>
                  {f.card}
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 px-5 sm:px-8" style={{ background: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#e0f2fe', color: '#0284c7' }}>How it works</div>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.025em' }}>Set it once. It runs forever.</h2>
            <p className="text-slate-500 text-lg">From connect to first saved customer in under 24 hours.</p>
          </FadeIn>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connector */}
            <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-0.5" style={{ background: 'linear-gradient(90deg,#06b6d4,#8b5cf6)' }} />
            {[
              { n: '1', icon: '⚡', accent: '#06b6d4', accentBg: '#cffafe', title: 'Connect Stripe', body: 'Link your billing account in 5 minutes. ChurnGuard immediately reads payment and subscription signals.' },
              { n: '2', icon: '🧠', accent: '#8b5cf6', accentBg: '#ede9fe', title: 'AI detects risk', body: 'Every 6 hours the engine scores every customer using behavioral, billing, and engagement data.' },
              { n: '3', icon: '✉️', accent: '#4ade80', accentBg: '#d1fae5', title: 'Auto-retention fires', body: 'Personalized email, SMS, or Slack message goes out automatically — zero manual work required.' },
            ].map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.15}>
                <motion.div
                  className="bg-white rounded-2xl p-8 border text-center"
                  style={{ borderColor: '#e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                  whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-6 border-2" style={{ background: s.accentBg, borderColor: s.accent }}>
                    {s.icon}
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: s.accent }}>Step {s.n}</div>
                  <h3 className="text-slate-900 font-bold text-lg mb-3">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          DASHBOARD PREVIEW
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-5 sm:px-8 relative overflow-hidden" style={{ background: '#0b1120' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(6,182,212,0.08) 0%, transparent 65%)' }} />
        <div className="relative max-w-5xl mx-auto text-center">
          <FadeIn>
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: 'rgba(6,182,212,0.12)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.25)' }}>Dashboard</div>
            <h2 className="font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.025em' }}>Your revenue. Fully visible.</h2>
            <p className="text-lg mb-14 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>Every at-risk account, every automated action, every dollar saved — in one place.</p>
            {/* Browser mockup */}
            <div className="rounded-2xl border overflow-hidden text-left" style={{ background: '#111827', borderColor: 'rgba(6,182,212,0.15)', boxShadow: '0 0 0 1px rgba(6,182,212,0.06), 0 60px 120px rgba(0,0,0,0.7)' }}>
              <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{ background: '#0d1525', borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} /><div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} /><div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                <div className="flex-1 ml-3 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>churnguardapp.com/dashboard</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {[['Revenue at Risk', '$47,200', '#f87171'], ['Saved This Month', '$18,400', '#4ade80'], ['At-Risk Accounts', '14', '#fb923c'], ['Actions Fired', '31', '#818cf8']].map(([l, v, c]) => (
                  <div key={l} className="px-5 py-5 border-r last:border-r-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{l}</div>
                    <div className="font-extrabold text-2xl" style={{ color: c, letterSpacing: '-0.02em' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="p-5 overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      {['Customer', 'MRR', 'Risk Score', 'Last Action', 'Status'].map(h => (
                        <th key={h} className="text-left pb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Acme Corp', mrr: '$1,200', risk: 92, rc: '#f87171', action: 'Email sent', status: 'Intervening', sc: '#818cf8', sb: 'rgba(129,140,248,0.12)' },
                      { name: 'DataFlow Inc', mrr: '$890', risk: 78, rc: '#fb923c', action: 'SMS delivered', status: 'Saved ✓', sc: '#4ade80', sb: 'rgba(74,222,128,0.12)' },
                      { name: 'CloudBase', mrr: '$2,400', risk: 85, rc: '#f87171', action: 'Slack alert', status: 'CSM assigned', sc: '#7dd3fc', sb: 'rgba(125,211,252,0.12)' },
                      { name: 'Launchly', mrr: '$620', risk: 61, rc: '#fde047', action: 'Monitoring', status: 'Watching', sc: '#fde047', sb: 'rgba(253,224,71,0.12)' },
                    ].map(r => (
                      <tr key={r.name} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                        <td className="py-3.5 font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>{r.name}</td>
                        <td className="py-3.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.mrr}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                              <div className="h-full rounded-full" style={{ width: `${r.risk}%`, background: r.rc }} />
                            </div>
                            <span className="text-xs font-bold" style={{ color: r.rc }}>{r.risk}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{r.action}</td>
                        <td className="py-3.5">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: r.sc, background: r.sb }}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: '#cffafe', color: '#0e7490' }}>Pricing</div>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem,4.5vw,3rem)', letterSpacing: '-0.025em' }}>Simple, predictable pricing</h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">Most teams recover 10× their subscription in the first month. Flat-rate by MRR band.</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {/* Free Trial */}
            <FadeIn>
              <motion.div ref={el => { planRefs.current['freeTrial'] = el; }} className="rounded-2xl p-7 border h-full flex flex-col relative" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                style={{ background: '#f0fdf4', borderColor: '#4ade80', boxShadow: '0 4px 24px rgba(74,222,128,0.12)' }}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full text-white whitespace-nowrap" style={{ background: '#16a34a' }}>NO CREDIT CARD</div>
                <h3 className="font-bold text-lg mb-1 text-green-700">Free Trial</h3>
                <p className="text-slate-500 text-xs mb-5">30 days full access</p>
                <div className="mb-6"><span className="text-3xl font-extrabold text-slate-900">$0</span><span className="text-slate-400 text-sm ml-1">/30 days</span></div>
                <ul className="space-y-2.5 text-sm text-slate-600 mb-8 flex-1">
                  {['100 customers tracked', 'Basic automation', 'Slack alerts', 'Email sequences', 'CRM sync'].map(f => <li key={f} className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span>{f}</li>)}
                </ul>
                <Link href="/signup" className="block text-center py-3 px-5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity" style={{ background: '#16a34a' }}>Start Free Trial</Link>
              </motion.div>
            </FadeIn>
            {/* Seed */}
            <FadeIn delay={0.06}>
              <motion.div ref={el => { planRefs.current['seed'] = el; }} className="rounded-2xl p-7 border h-full flex flex-col" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                style={{ background: '#fff', borderColor: '#e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h3 className="text-slate-800 font-bold text-lg mb-1">Seed</h3>
                <p className="text-slate-400 text-xs mb-5">Up to $50K MRR</p>
                <div className="mb-6"><span className="text-3xl font-extrabold text-slate-900">$79</span><span className="text-slate-400 text-sm ml-1">/mo</span></div>
                <ul className="space-y-2.5 text-sm text-slate-600 mb-8 flex-1">
                  {['100 customers tracked', 'Basic automation', 'Slack alerts', 'Email sequences', 'CRM sync'].map(f => <li key={f} className="flex items-center gap-2"><span className="text-slate-400">✓</span>{f}</li>)}
                </ul>
                <Link href="/signup?plan=seed" className="block text-center py-3 px-5 rounded-xl font-semibold text-sm border text-slate-700 hover:border-cyan-400 hover:text-cyan-600 transition-colors" style={{ borderColor: '#e2e8f0' }}>Get Started</Link>
              </motion.div>
            </FadeIn>
            {/* Growth */}
            <FadeIn delay={0.12}>
              <motion.div ref={el => { planRefs.current['growth'] = el; }} className="rounded-2xl p-8 flex flex-col relative" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                style={{ background: 'linear-gradient(160deg,#0c1a3a,#1e1b4b)', border: '2px solid #06b6d4', boxShadow: '0 0 50px rgba(6,182,212,0.2)', transform: 'scale(1.03)' }}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg,#06b6d4,#6366f1)' }}>MOST POPULAR</div>
                <h3 className="font-bold text-xl mb-1 text-white">Growth</h3>
                <p className="text-xs mb-5" style={{ color: 'rgba(6,182,212,0.6)' }}>$50K – $200K MRR</p>
                <div className="mb-6"><span className="text-4xl font-extrabold text-white">$149</span><span className="text-sm ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>/mo</span></div>
                <ul className="space-y-3 text-sm mb-8 flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {['Unlimited customers', 'Advanced playbooks', 'SMS via Twilio', 'VIP Slack alerts', 'AI-written emails', 'Priority support'].map(f => <li key={f} className="flex items-center gap-2"><span className="text-cyan-400">✓</span>{f}</li>)}
                </ul>
                <Link href="/signup?plan=growth" className="block text-center py-3.5 px-5 rounded-xl font-bold text-white text-sm hover:brightness-110 transition-all" style={{ background: 'linear-gradient(135deg,#06b6d4,#6366f1)' }}>Get Started</Link>
              </motion.div>
            </FadeIn>
            {/* Scale */}
            <FadeIn delay={0.18}>
              <motion.div ref={el => { planRefs.current['scale'] = el; }} className="rounded-2xl p-7 border h-full flex flex-col" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                style={{ background: '#fff', borderColor: '#e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h3 className="text-slate-800 font-bold text-lg mb-1">Scale</h3>
                <p className="text-slate-400 text-xs mb-5">$200K – $1M MRR</p>
                <div className="mb-6"><span className="text-3xl font-extrabold text-slate-900">$299</span><span className="text-slate-400 text-sm ml-1">/mo</span></div>
                <ul className="space-y-2.5 text-sm text-slate-600 mb-8 flex-1">
                  {['Unlimited everything', 'API access', 'Custom risk models', 'White-glove onboarding', 'Dedicated CSM'].map(f => <li key={f} className="flex items-center gap-2"><span className="text-slate-400">✓</span>{f}</li>)}
                </ul>
                <Link href="/signup?plan=scale" className="block text-center py-3 px-5 rounded-xl font-semibold text-sm border text-slate-700 hover:border-cyan-400 hover:text-cyan-600 transition-colors" style={{ borderColor: '#e2e8f0' }}>Get Started</Link>
              </motion.div>
            </FadeIn>
          </div>
          <p className="text-center text-slate-400 text-sm mt-8">30-day free trial · Cancel anytime · No contracts · No setup fees</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-5 sm:px-8" style={{ background: '#f8fafc' }}>
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="font-bold text-slate-900 mb-3" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.025em' }}>Common questions</h2>
            <p className="text-slate-500 text-sm">Everything you need before getting started.</p>
          </FadeIn>
          <div className="space-y-3">
            {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          FINAL CTA  — dark with floating cards
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-5 sm:px-8 relative overflow-hidden" style={{ background: '#0b1120' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(6,182,212,0.1) 0%, transparent 65%)' }} />

        {/* Decorative floating cards */}
        <FloatCard delay={0} amplitude={10} className="absolute hidden lg:block" style={{ left: '3%', top: '20%', width: '160px' }}>
          <div className="rounded-2xl p-4 border" style={{ background: '#d1fae5', borderColor: '#6ee7b7' }}>
            <div className="text-lg mb-1">🎉</div>
            <div className="text-xs font-bold text-emerald-800">Revenue saved</div>
            <div className="text-xl font-extrabold text-emerald-700">$1,200</div>
          </div>
        </FloatCard>
        <FloatCard delay={1.5} amplitude={8} className="absolute hidden lg:block" style={{ right: '3%', top: '15%', width: '160px' }}>
          <div className="rounded-2xl p-4 border" style={{ background: '#dbeafe', borderColor: '#93c5fd' }}>
            <div className="text-lg mb-1">✉️</div>
            <div className="text-xs font-bold text-blue-800">Email sent</div>
            <div className="text-xs text-blue-600 mt-1">Acme Corp saved</div>
          </div>
        </FloatCard>

        <FadeIn className="relative max-w-2xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8" style={{ background: 'rgba(6,182,212,0.12)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.25)' }}>
            Get started today
          </div>
          <h2 className="font-extrabold text-white mb-5 leading-tight" style={{ fontSize: 'clamp(2.2rem,5vw,3.25rem)', letterSpacing: '-0.025em' }}>
            Ready to reduce churn?
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Run a free audit on your Stripe account. See your at-risk MRR and at-risk customers in 2 minutes — no signup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/audit" className="px-10 py-4 rounded-xl font-bold text-white text-base hover:brightness-110 hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', boxShadow: '0 0 40px rgba(6,182,212,0.4)' }}>
              Get Free Audit →
            </Link>
            <Link href="/book-demo" className="px-10 py-4 rounded-xl font-semibold text-base border transition-all hover:border-slate-500"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }}>
              Book a Demo
            </Link>
          </div>
          <p className="text-sm mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>Cancel anytime · No contracts · No setup fees</p>
        </FadeIn>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-16 px-5 sm:px-8" style={{ background: '#080d1a', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 font-bold text-lg text-white mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#06b6d4,#6366f1)' }}>🛡️</div>
                ChurnGuard
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>AI-powered churn prevention for SaaS founders. Predict. Intervene. Retain.</p>
              <a href="mailto:admin@churnguardapp.com" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#67e8f9')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                admin@churnguardapp.com
              </a>
            </div>
            {/* Product */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Product</div>
              {[['#features', 'Features'], ['#pricing', 'Pricing'], ['/audit', 'Free Audit'], ['/blog', 'Blog']].map(([href, label]) => (
                <a key={label} href={href} className="block text-sm mb-2.5 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                  {label}
                </a>
              ))}
            </div>
            {/* Company */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Company</div>
              {[['/about', 'About'], ['/privacy', 'Privacy'], ['/terms', 'Terms']].map(([href, label]) => (
                <a key={label} href={href} className="block text-sm mb-2.5 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                  {label}
                </a>
              ))}
            </div>
            {/* Newsletter */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Stay updated</div>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>Churn reduction tips for SaaS founders. No spam.</p>
              <form onSubmit={e => { e.preventDefault(); setEmail(''); }} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 min-w-0 px-3 py-2.5 rounded-xl text-sm outline-none border"
                  style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <button type="submit" className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110" style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)' }}>→</button>
              </form>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2026 ChurnGuard · All rights reserved</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>Built for SaaS founders who care about retention</p>
          </div>
        </div>
      </footer>

      <DemoVideoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
}
