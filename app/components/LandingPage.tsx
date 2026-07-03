'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import DemoVideoModal from './DemoVideoModal';

// ─── Constants ────────────────────────────────────────────────────────────────
const BG = '#060610';
const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
};

// ─── FloatCard ────────────────────────────────────────────────────────────────
function FloatCard({ children, className, style, delay = 0, amplitude = 10 }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; delay?: number; amplitude?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} style={style}
      animate={reduced ? {} : { y: [0, -amplitude, 0] }}
      transition={{ duration: 4 + delay * 0.5, repeat: Infinity, ease: 'easeInOut', delay }}>
      {children}
    </motion.div>
  );
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────
function FadeIn({ children, className, style, delay = 0, direction = 'up' }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; delay?: number; direction?: 'up' | 'left' | 'right' | 'none';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const initial = direction === 'up' ? { opacity: 0, y: 28 } : direction === 'left' ? { opacity: 0, x: -28 } : direction === 'right' ? { opacity: 0, x: 28 } : { opacity: 0 };
  return (
    <motion.div ref={ref} className={className} style={style} initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}>
      {children}
    </motion.div>
  );
}

// ─── Logo Ticker ──────────────────────────────────────────────────────────────
const LOGOS = ['Stripe', 'HubSpot', 'Twilio', 'Slack', 'Postmark', 'Segment', 'Intercom', 'Linear', 'Mixpanel', 'Amplitude', 'Salesforce', 'Notion'];

function LogoTicker() {
  return (
    <div style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)' }}>
      <style>{`@keyframes cg-tick{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.cg-tick{animation:cg-tick 30s linear infinite}.cg-tick:hover{animation-play-state:paused}`}</style>
      <div className="cg-tick" style={{ display: 'flex', gap: '16px', width: 'max-content', alignItems: 'center', padding: '4px 0' }}>
        {[...LOGOS, ...LOGOS].map((logo, i) => (
          <div key={i} style={{ padding: '10px 22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', color: 'rgba(255,255,255,0.22)', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
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
    <div onClick={() => setOpen(!open)} style={{ ...GLASS, borderRadius: '14px', cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.2s, background 0.2s', border: `1px solid ${open ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.08)'}`, background: open ? 'rgba(124,58,237,0.07)' : 'rgba(255,255,255,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', color: '#fff', fontWeight: '600', fontSize: '15px' }}>
        <span>{q}</span>
        <span style={{ color: '#a78bfa', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', fontSize: '22px', lineHeight: 1, flexShrink: 0, marginLeft: '16px' }}>+</span>
      </div>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '0 24px 20px', paddingTop: '16px', color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.06)' }}>{a}</div>
      </motion.div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowX: 'hidden', background: BG }}>

      {/* ── NAV ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(6,6,16,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo-purple.png" alt="ChurnGuard" height={32} style={{ height: '32px', width: 'auto', filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.3))' }} />
          </div>
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '30px' }}>
            {[['#features', 'Features'], ['#how-it-works', 'How it works'], ['#pricing', 'Pricing'], ['/blog', 'Blog']].map(([href, label]) => (
              <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: '500', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
                {label}
              </a>
            ))}
            <Link href="/book-demo" style={{ color: '#a78bfa', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Book a Call</Link>
          </div>
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '12px' }}>
            <Link href="/login" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: '500', textDecoration: 'none', padding: '8px 16px' }}>Login</Link>
            <Link href="/audit" style={{ fontSize: '14px', fontWeight: '700', color: '#fff', textDecoration: 'none', padding: '10px 22px', borderRadius: '10px', background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 0 28px rgba(124,58,237,0.45)' }}>
              Free Audit →
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '8px' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(6,6,16,0.97)' }}>
            {[['#features', 'Features'], ['#how-it-works', 'How it works'], ['#pricing', 'Pricing'], ['/blog', 'Blog']].map(([href, label]) => (
              <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>{label}</a>
            ))}
            <Link href="/book-demo" style={{ color: '#a78bfa', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Book a Call</Link>
            <Link href="/login" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textDecoration: 'none' }}>Login</Link>
            <Link href="/audit" style={{ fontSize: '14px', fontWeight: '700', color: '#fff', textDecoration: 'none', padding: '14px', borderRadius: '10px', background: 'linear-gradient(135deg,#7c3aed,#6366f1)', textAlign: 'center', display: 'block' }} onClick={() => setMobileOpen(false)}>
              Get Free Audit →
            </Link>
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '95vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        {/* Glows */}
        <div style={{ position: 'absolute', top: '-15%', left: '15%', width: '900px', height: '700px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, transparent 60%)', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '-5%', width: '600px', height: '500px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '25%', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 60%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '96px 32px', width: '100%' }}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Copy */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.1)', color: '#c4b5fd', fontSize: '12px', fontWeight: '700', marginBottom: '32px', letterSpacing: '0.02em' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} className="animate-pulse" />
                  AI-powered churn prevention · 2026
                </div>
              </motion.div>

              <motion.h1
                style={{ fontWeight: 800, color: '#fff', lineHeight: 1.04, marginBottom: '24px', letterSpacing: '-0.04em', fontSize: 'clamp(3rem,5.5vw,5rem)' }}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
              >
                Stop churn{' '}
                <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  before it
                </span>
                <br />
                <span style={{ background: 'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  costs you
                </span>
              </motion.h1>

              <motion.p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', marginBottom: '40px', maxWidth: '460px' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                ChurnGuard monitors every customer signal, predicts cancellations weeks in advance, and fires personalized retention messages via Email, SMS, and Slack — automatically.
              </motion.p>

              <motion.div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <Link href="/audit" style={{ padding: '14px 32px', borderRadius: '12px', fontWeight: '700', color: '#fff', fontSize: '15px', textDecoration: 'none', background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 0 50px rgba(124,58,237,0.45)', display: 'inline-block' }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; }}>
                  Get Free Audit →
                </Link>
                <button onClick={() => setShowDemo(true)} style={{ padding: '14px 32px', borderRadius: '12px', fontWeight: '600', fontSize: '15px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}>
                  View Demo ▶
                </button>
              </motion.div>

              <motion.div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }}>
                <div style={{ display: 'flex' }}>
                  {[{ i: 'SR', bg: 'linear-gradient(135deg,#7c3aed,#6366f1)' }, { i: 'MK', bg: 'linear-gradient(135deg,#f97316,#fb923c)' }, { i: 'AJ', bg: 'linear-gradient(135deg,#4ade80,#22c55e)' }, { i: 'PL', bg: 'linear-gradient(135deg,#f472b6,#e879f9)' }].map((a, i) => (
                    <div key={a.i} style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${BG}`, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700', marginLeft: i > 0 ? '-10px' : 0 }}>{a.i}</div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: '#fbbf24', fontSize: '13px' }}>★</span>)}</div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Loved by 200+ SaaS founders</p>
                </div>
              </motion.div>
            </div>

            {/* Floating cards */}
            <div className="relative hidden lg:block" style={{ height: '540px' }}>
              <FloatCard delay={0} amplitude={10} style={{ position: 'absolute', top: '0%', left: '5%', width: '340px' }}>
                <div style={{ borderRadius: '20px', ...GLASS, border: '1px solid rgba(124,58,237,0.2)', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.25)' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ marginLeft: '8px', fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>dashboard · at-risk</span>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ borderRadius: '12px', padding: '14px', border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.06)' }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>Revenue at Risk</div>
                      <div style={{ fontWeight: 800, fontSize: '26px', color: '#f87171', letterSpacing: '-0.03em' }}>$47,200</div>
                      <div style={{ fontSize: '11px', color: 'rgba(248,113,113,0.6)', marginTop: '4px' }}>↑ 14 accounts flagged today</div>
                    </div>
                    <div style={{ borderRadius: '12px', padding: '14px', border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.06)' }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>Saved This Month</div>
                      <div style={{ fontWeight: 800, fontSize: '26px', color: '#4ade80', letterSpacing: '-0.03em' }}>$18,400</div>
                      <div style={{ fontSize: '11px', color: 'rgba(74,222,128,0.6)', marginTop: '4px' }}>↑ 3 customers retained</div>
                    </div>
                    {[{ name: 'Acme Corp', action: 'Email fired', color: '#a78bfa' }, { name: 'DataFlow Inc', action: 'SMS sent', color: '#4ade80' }].map(r => (
                      <div key={r.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', borderRadius: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{r.name}</span>
                        <span style={{ color: r.color, fontWeight: 600 }}>{r.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FloatCard>

              <FloatCard delay={1.2} amplitude={7} style={{ position: 'absolute', top: '2%', right: '0%', width: '185px' }}>
                <div style={{ borderRadius: '16px', padding: '16px', border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.1)', backdropFilter: 'blur(12px)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>MK</div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#c4b5fd' }}>Risk alert</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Marcus K. hasn't logged in for <strong style={{ color: '#fff' }}>12 days</strong></div>
                  <div style={{ marginTop: '10px', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', textAlign: 'center', background: 'rgba(167,139,250,0.2)', color: '#a78bfa' }}>Email queued ✓</div>
                </div>
              </FloatCard>

              <FloatCard delay={0.6} amplitude={14} style={{ position: 'absolute', bottom: '12%', right: '2%', width: '170px' }}>
                <div style={{ borderRadius: '16px', padding: '16px', border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.07)', backdropFilter: 'blur(12px)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>🎉</div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#4ade80', marginBottom: '4px' }}>MRR Saved</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>$1,200</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>Acme Corp retained</div>
                </div>
              </FloatCard>

              <FloatCard delay={1.8} amplitude={9} style={{ position: 'absolute', bottom: '5%', left: '8%', width: '205px' }}>
                <div style={{ borderRadius: '16px', padding: '16px', border: '1px solid rgba(6,182,212,0.18)', background: 'rgba(6,182,212,0.06)', backdropFilter: 'blur(12px)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✉</div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#67e8f9' }}>AI Message</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>"Hi Sarah, we noticed you haven't used the reports feature…"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Sent via Email</span>
                  </div>
                </div>
              </FloatCard>

              <FloatCard delay={2.4} amplitude={7} style={{ position: 'absolute', top: '50%', left: '0%', width: '170px' }}>
                <div style={{ borderRadius: '16px', padding: '16px', border: '1px solid rgba(244,114,182,0.18)', background: 'rgba(244,114,182,0.06)', backdropFilter: 'blur(12px)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#e879f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: '700' }}>S</div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#f0abfc' }}>Slack Alert</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>VIP customer <strong style={{ color: '#fff' }}>CloudBase</strong> is at 91% risk</div>
                  <div style={{ fontSize: '11px', color: 'rgba(240,171,252,0.55)', marginTop: '6px' }}>→ CSM notified</div>
                </div>
              </FloatCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[{ value: '$47M+', label: 'MRR Protected' }, { value: '3,200+', label: 'Customers Monitored' }, { value: '35%', label: 'Avg Churn Reduction' }].map((s, i) => (
            <div key={s.label} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LOGO TICKER ── */}
      <section style={{ padding: '48px 0' }}>
        <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>Integrated with the tools you already use</p>
        <LogoTicker />
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          FEATURES — BENTO GRID
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: '96px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '999px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#c4b5fd', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>The Platform</div>
            <h2 style={{ fontWeight: 800, color: '#fff', fontSize: 'clamp(2rem,4.5vw,3.25rem)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '16px' }}>Everything you need to stop churn</h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>One platform. Full loop — from signal detection to automated retention.</p>
          </FadeIn>

          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
            {/* Revenue Intelligence */}
            <FadeIn direction="left" className="lg:col-span-7">
              <div style={{ ...GLASS, borderRadius: '20px', padding: '32px', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.16) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd', fontSize: '11px', fontWeight: '700', marginBottom: '14px' }}>Revenue Intelligence</div>
                <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '20px', letterSpacing: '-0.02em', marginBottom: '8px' }}>See exactly how much revenue is at risk</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '380px' }}>Every customer gets a live risk score with the exact MRR attached. No vague health percentages — just dollars.</p>
                <div style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '16px', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {[{ l: 'Revenue at Risk', v: '$47,200', c: '#f87171' }, { l: 'Saved This Month', v: '$18,400', c: '#4ade80' }].map(s => (
                      <div key={s.l} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>{s.l}</div>
                        <div style={{ fontWeight: 800, fontSize: '20px', color: s.c, letterSpacing: '-0.02em' }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[{ name: 'Acme Corp', mrr: '$1,200', risk: 92, c: '#f87171' }, { name: 'DataFlow Inc', mrr: '$890', risk: 78, c: '#fb923c' }, { name: 'CloudBase', mrr: '$2,400', risk: 85, c: '#f87171' }].map(r => (
                      <div key={r.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{r.name}</span>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>{r.mrr}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '56px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)' }}>
                            <div style={{ height: '100%', borderRadius: '2px', width: `${r.risk}%`, background: r.c }} />
                          </div>
                          <span style={{ color: r.c, fontWeight: 700, fontSize: '11px' }}>{r.risk}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* AI + Integrations stacked */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <FadeIn direction="right" delay={0.1}>
                <div style={{ ...GLASS, borderRadius: '20px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '140px', height: '140px', background: 'radial-gradient(ellipse, rgba(6,182,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', color: '#67e8f9', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>AI Automation</div>
                  <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '17px', letterSpacing: '-0.02em', marginBottom: '8px' }}>AI fires the right message</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '16px' }}>Personalized emails by AI. SMS via Twilio. Slack alerts to your CSM.</p>
                  <div style={{ borderRadius: '12px', padding: '14px', border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.05)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#67e8f9', marginBottom: '6px' }}>AI Email · Sent 2 min ago</div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, fontStyle: 'italic' }}>"Hi Sarah, we noticed you haven't used ChurnGuard's reports in 2 weeks…"</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction="right" delay={0.18}>
                <div style={{ ...GLASS, borderRadius: '20px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '120px', height: '120px', background: 'radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.22)', color: '#fcd34d', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>Integrations</div>
                  <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '17px', letterSpacing: '-0.02em', marginBottom: '12px' }}>Connects in minutes</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[{ name: 'Stripe', color: '#818cf8' }, { name: 'HubSpot', color: '#fb923c' }, { name: 'Twilio', color: '#06b6d4' }, { name: 'Slack', color: '#a78bfa' }, { name: 'Postmark', color: '#fcd34d' }, { name: 'Segment', color: '#4ade80' }].map(int => (
                      <div key={int.name} style={{ padding: '9px 6px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: int.color }}>{int.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <FadeIn direction="up" delay={0.1} className="lg:col-span-5">
              <div style={{ ...GLASS, borderRadius: '20px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '180px', height: '180px', background: 'radial-gradient(ellipse, rgba(248,113,113,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.22)', color: '#fca5a5', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>Dunning Recovery</div>
                <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '17px', letterSpacing: '-0.02em', marginBottom: '8px' }}>Recover failed payments</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '16px' }}>20–40% of SaaS churn is involuntary. Automated sequences recover 30–60% of failed payments.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[{ day: 'Day 1', msg: 'Gentle alert email', color: '#fca5a5' }, { day: 'Day 3', msg: 'Follow-up reminder', color: '#fb923c' }, { day: 'Day 7', msg: 'Final warning + SMS', color: '#f87171' }, { day: 'Day 14', msg: 'Win-back offer', color: '#ef4444' }].map(step => (
                    <div key={step.day} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: step.color, minWidth: '44px' }}>{step.day}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{step.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.18} className="lg:col-span-7">
              <div style={{ ...GLASS, borderRadius: '20px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '200px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>Cancellation Flow</div>
                <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '17px', letterSpacing: '-0.02em', marginBottom: '8px' }}>Save customers at the door</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '20px' }}>When a customer clicks "Cancel," show them a save offer — pause, downgrade, or discount. Recover 15–25% of would-be cancellations.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[{ label: 'Pause Plan', icon: '⏸', color: '#a5b4fc', bg: 'rgba(99,102,241,0.1)' }, { label: 'Downgrade', icon: '📉', color: '#67e8f9', bg: 'rgba(6,182,212,0.08)' }, { label: '30% Discount', icon: '🏷️', color: '#fcd34d', bg: 'rgba(251,191,36,0.08)' }].map(opt => (
                    <div key={opt.label} style={{ padding: '16px', borderRadius: '12px', background: opt.bg, border: `1px solid ${opt.color}22`, textAlign: 'center' }}>
                      <div style={{ fontSize: '22px', marginBottom: '8px' }}>{opt.icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: opt.color }}>{opt.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '96px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '999px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#67e8f9', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>How it works</div>
            <h2 style={{ fontWeight: 800, color: '#fff', fontSize: 'clamp(2rem,4.5vw,3.25rem)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '16px' }}>Set it once. It runs forever.</h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.4)', maxWidth: '440px', margin: '0 auto' }}>From connect to first saved customer in under 24 hours.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ position: 'relative' }}>
            <div className="hidden md:block" style={{ position: 'absolute', top: '48px', left: '33%', right: '33%', height: '1px', background: 'linear-gradient(90deg,rgba(124,58,237,0.5),rgba(99,102,241,0.5))' }} />
            {[
              { n: '01', icon: '⚡', accent: '#7c3aed', accentBg: 'rgba(124,58,237,0.12)', title: 'Connect Stripe', body: 'Link your billing account in 5 minutes. ChurnGuard immediately reads payment and subscription signals.' },
              { n: '02', icon: '🧠', accent: '#6366f1', accentBg: 'rgba(99,102,241,0.12)', title: 'AI detects risk', body: 'Every 6 hours the engine scores every customer using behavioral, billing, and engagement data.' },
              { n: '03', icon: '✉️', accent: '#06b6d4', accentBg: 'rgba(6,182,212,0.12)', title: 'Auto-retention fires', body: 'Personalized email, SMS, or Slack message goes out automatically — zero manual work required.' },
            ].map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.12}>
                <motion.div style={{ ...GLASS, borderRadius: '20px', padding: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
                  whileHover={{ y: -4, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${s.accent}20` }} transition={{ duration: 0.2 }}>
                  <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '160px', height: '160px', background: `radial-gradient(ellipse, ${s.accent}25 0%, transparent 70%)`, pointerEvents: 'none' }} />
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 20px', background: s.accentBg, border: `1px solid ${s.accent}50` }}>{s.icon}</div>
                  <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: s.accent, marginBottom: '10px' }}>Step {s.n}</div>
                  <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '18px', letterSpacing: '-0.02em', marginBottom: '10px' }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{s.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '96px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '999px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fcd34d', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>Testimonials</div>
            <h2 style={{ fontWeight: 800, color: '#fff', fontSize: 'clamp(2rem,4.5vw,3.25rem)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>SaaS founders love it</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Sarah R.', role: 'CEO, PipelineHQ', av: 'SR', bg: 'linear-gradient(135deg,#7c3aed,#6366f1)', quote: 'Recovered $8,400 in failed payments in the first week. The dunning sequence paid for itself 10x over.', accent: '#7c3aed' },
              { name: 'Marcus K.', role: 'Founder, DataStack', av: 'MK', bg: 'linear-gradient(135deg,#f97316,#fb923c)', quote: 'I used to manually email at-risk customers. Now ChurnGuard does it while I sleep. Churn dropped 31%.', accent: '#f97316' },
              { name: 'Priya N.', role: 'CTO, Launchly', av: 'PN', bg: 'linear-gradient(135deg,#4ade80,#22c55e)', quote: "The Revenue at Risk dashboard is the first thing I check every morning. Best visibility we've ever had.", accent: '#4ade80' },
            ].map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <motion.div style={{ ...GLASS, borderRadius: '20px', padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}
                  whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '1px', background: `linear-gradient(90deg, transparent, ${t.accent}55, transparent)` }} />
                  <div style={{ display: 'flex', gap: '2px' }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>)}</div>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, flex: 1 }}>"{t.quote}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{t.av}</div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>{t.name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          PRICING
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: '96px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '999px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#c4b5fd', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>Pricing</div>
            <h2 style={{ fontWeight: 800, color: '#fff', fontSize: 'clamp(2rem,4.5vw,3.25rem)', letterSpacing: '-0.04em', marginBottom: '12px' }}>Simple, predictable pricing</h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.4)', maxWidth: '420px', margin: '0 auto' }}>Most teams recover 10× their subscription in the first month.</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {/* Free Trial */}
            <FadeIn>
              <motion.div style={{ ...GLASS, borderRadius: '20px', padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', border: '1px solid rgba(74,222,128,0.2)' }}
                whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#16a34a', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '4px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>NO CREDIT CARD</div>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#4ade80', marginBottom: '4px' }}>Free Trial</h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>30 days full access</p>
                <div style={{ marginBottom: '24px' }}><span style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>$0</span><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>/30 days</span></div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
                  {['100 customers tracked', 'Basic automation', 'Slack alerts', 'Email sequences', 'CRM sync'].map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                      <span style={{ color: '#4ade80', fontWeight: 700 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '12px', fontWeight: '700', color: '#fff', fontSize: '14px', textDecoration: 'none', background: '#16a34a' }}>Start Free Trial</Link>
              </motion.div>
            </FadeIn>

            {/* Seed */}
            <FadeIn delay={0.06}>
              <motion.div style={{ ...GLASS, borderRadius: '20px', padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}
                whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: '4px' }}>Seed</h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>Up to $50K MRR</p>
                <div style={{ marginBottom: '24px' }}><span style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>$79</span><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>/mo</span></div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
                  {['100 customers tracked', 'Basic automation', 'Slack alerts', 'Email sequences', 'CRM sync'].map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup?plan=seed" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.65)', fontSize: '14px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>Get Started</Link>
              </motion.div>
            </FadeIn>

            {/* Growth — gradient border */}
            <FadeIn delay={0.12}>
              <div style={{ borderRadius: '22px', padding: '2px', background: 'linear-gradient(135deg,#7c3aed,#6366f1,#06b6d4)', boxShadow: '0 0 60px rgba(124,58,237,0.3)' }}>
                <motion.div style={{ borderRadius: '20px', padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', background: '#0e0920', position: 'relative', overflow: 'hidden' }}
                  whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '180px', height: '180px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#7c3aed,#6366f1)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '4px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
                  <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: '4px' }}>Growth</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(167,139,250,0.55)', marginBottom: '20px' }}>$50K – $200K MRR</p>
                  <div style={{ marginBottom: '24px' }}><span style={{ fontSize: '36px', fontWeight: 800, color: '#fff' }}>$149</span><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginLeft: '4px' }}>/mo</span></div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
                    {['Unlimited customers', 'Advanced playbooks', 'SMS via Twilio', 'VIP Slack alerts', 'AI-written emails', 'Priority support'].map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                        <span style={{ color: '#a78bfa', fontWeight: 700 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup?plan=growth" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: '12px', fontWeight: '700', color: '#fff', fontSize: '14px', textDecoration: 'none', background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>Get Started</Link>
                </motion.div>
              </div>
            </FadeIn>

            {/* Scale */}
            <FadeIn delay={0.18}>
              <motion.div style={{ ...GLASS, borderRadius: '20px', padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}
                whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: '4px' }}>Scale</h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>$200K – $1M MRR</p>
                <div style={{ marginBottom: '24px' }}><span style={{ fontSize: '32px', fontWeight: 800, color: '#fff' }}>$299</span><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>/mo</span></div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
                  {['Unlimited everything', 'API access', 'Custom risk models', 'White-glove onboarding', 'Dedicated CSM'].map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup?plan=scale" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.65)', fontSize: '14px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>Get Started</Link>
              </motion.div>
            </FadeIn>
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '13px', marginTop: '24px' }}>30-day free trial · Cancel anytime · No contracts · No setup fees</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontWeight: 800, color: '#fff', fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.04em', marginBottom: '10px' }}>Common questions</h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.35)' }}>Everything you need before getting started.</p>
          </FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '128px 32px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0e0920 0%, #1a0b3d 30%, #0c1a3a 60%, #060610 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.16) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(99,102,241,0.5), transparent)' }} />

        <FloatCard delay={0} amplitude={10} className="absolute hidden lg:block" style={{ left: '3%', top: '20%', width: '160px' }}>
          <div style={{ borderRadius: '16px', padding: '16px', border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.08)', backdropFilter: 'blur(12px)' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎉</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#4ade80' }}>Revenue saved</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>$1,200</div>
          </div>
        </FloatCard>
        <FloatCard delay={1.5} amplitude={8} className="absolute hidden lg:block" style={{ right: '3%', top: '15%', width: '165px' }}>
          <div style={{ borderRadius: '16px', padding: '16px', border: '1px solid rgba(6,182,212,0.2)', background: 'rgba(6,182,212,0.07)', backdropFilter: 'blur(12px)' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>✉️</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#67e8f9' }}>Email sent</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Acme Corp saved</div>
          </div>
        </FloatCard>

        <FadeIn style={{ position: 'relative', maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '999px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '28px' }}>Get started today</div>
          <h2 style={{ fontWeight: 800, color: '#fff', fontSize: 'clamp(2.2rem,5.5vw,4rem)', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '20px' }}>
            Ready to reduce{' '}
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>churn?</span>
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '40px' }}>
            Run a free audit on your Stripe account. See your at-risk MRR in 2 minutes — no signup required.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/audit" style={{ padding: '16px 40px', borderRadius: '14px', fontWeight: '700', color: '#fff', fontSize: '16px', textDecoration: 'none', background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 0 60px rgba(124,58,237,0.45)', display: 'inline-block' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; }}>
              Get Free Audit →
            </Link>
            <Link href="/book-demo" style={{ padding: '16px 40px', borderRadius: '14px', fontWeight: '600', fontSize: '16px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'inline-block' }}>
              Book a Demo
            </Link>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)', marginTop: '24px' }}>Cancel anytime · No contracts · No setup fees</p>
        </FadeIn>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 32px 40px', background: '#030308' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10" style={{ marginBottom: '48px' }}>
            <div>
              <div style={{ marginBottom: '12px' }}>
                <img src="/logo-purple.png" alt="ChurnGuard" height={40} style={{ height: '40px', width: 'auto', filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.3))' }} />
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, marginBottom: '16px' }}>AI-powered churn prevention for SaaS founders. Predict. Intervene. Retain.</p>
              <a href="mailto:admin@churnguardapp.com" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                admin@churnguardapp.com
              </a>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }}>Product</div>
              {[['#features', 'Features'], ['#pricing', 'Pricing'], ['/audit', 'Free Audit'], ['/blog', 'Blog']].map(([href, label]) => (
                <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: '10px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                  {label}
                </a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }}>Company</div>
              {[['/about', 'About'], ['/privacy', 'Privacy'], ['/terms', 'Terms']].map(([href, label]) => (
                <a key={label} href={href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: '10px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                  {label}
                </a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }}>Stay updated</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px', lineHeight: 1.6 }}>Churn reduction tips for SaaS founders. No spam.</p>
              <form onSubmit={e => { e.preventDefault(); setEmail(''); }} style={{ display: 'flex', gap: '8px' }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" style={{ flex: 1, minWidth: 0, padding: '10px 14px', borderRadius: '10px', fontSize: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', fontFamily: 'inherit' }} />
                <button type="submit" style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#fff', background: 'linear-gradient(135deg,#7c3aed,#6366f1)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>→</button>
              </form>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>© 2026 ChurnGuard · All rights reserved</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.12)' }}>Built for SaaS founders who care about retention</p>
          </div>
        </div>
      </footer>

      <DemoVideoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
}
