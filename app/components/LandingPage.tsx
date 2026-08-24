'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import DarkShell from '@/app/components/ui/DarkShell';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Shield, TrendingUp, TrendingDown, Zap, CreditCard, Play, CheckCircle,
  ArrowRight, BarChart3, Users, RefreshCw, Settings, Workflow,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const RevenueChart = dynamic(() => import('@/app/components/RevenueChart'), {
  ssr: false,
  loading: () => <div className="h-[68px] animate-pulse bg-slate-800/60 rounded-lg" />,
});

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useCountUp(target: number, durationMs: number, active: boolean): number {
  const prefersReducedMotion = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) { setVal(target); return; }
    if (!active) return;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / durationMs, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs, prefersReducedMotion]);
  return val;
}

function useScrollTrigger() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { once: true, margin: '-80px' as unknown as `${number}px` });
  return { ref, active };
}

// ── Scroll-reveal wrapper ─────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function RiskGauge({ value, active }: { value: number; active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const cx = 60, cy = 60, r = 50;
  const s = polar(cx, cy, r, 225);
  const e = polar(cx, cy, r, 315);
  const d = `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 1 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  const color = '#f59e0b';
  const displayVal = useCountUp(value, 1200, active);
  const shouldAnimate = active || prefersReducedMotion;
  return (
    <svg viewBox="0 0 120 120" width="108" height="108" aria-label={`Churn risk ${value}%`}>
      <path d={d} fill="none" stroke="#1e293b" strokeWidth="9" strokeLinecap="round" />
      <motion.path
        d={d} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
        initial={{ pathLength: prefersReducedMotion ? value / 100 : 0 }}
        animate={{ pathLength: shouldAnimate ? value / 100 : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.3, ease: 'easeOut', delay: 0.35 }}
        style={{ filter: `drop-shadow(0 0 5px ${color}80)` }}
      />
      <text x="60" y="56" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="Inter,sans-serif">
        {displayVal}%
      </text>
      <text x="60" y="72" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="Inter,sans-serif" letterSpacing="1.5">
        CHURN RISK
      </text>
    </svg>
  );
}

const CUSTOMERS = [
  { name: 'Acme Corp',  risk: 89, signal: 'Payment failed',     high: true  },
  { name: 'DesignHub',  risk: 74, signal: 'Usage drop',         high: true  },
  { name: 'ByteFlow',   risk: 62, signal: 'No login 5d',        high: false },
  { name: 'DevStack',   risk: 45, signal: 'Onboarding stalled', high: false },
];
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.85 } },
};
const rowVariants = {
  hidden: { opacity: 0, x: 14 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.38, ease: 'easeOut' as const } },
};

function HeroDashboard() {
  const [active, setActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  useEffect(() => {
    const t = setTimeout(() => setActive(true), 350);
    return () => clearTimeout(t);
  }, []);
  const mrr   = useCountUp(4820, 1400, active);
  const count = useCountUp(12,   1000, active);
  const animState = prefersReducedMotion || active ? 'show' : 'hidden';
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-indigo-500/10 blur-3xl rounded-full scale-75 translate-x-8 pointer-events-none" />
      <div className="bg-slate-900/90 border border-slate-700/40 rounded-2xl p-4 shadow-2xl shadow-black/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-slate-100 tracking-tight">ChurnGuard</span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[11px] text-green-400 font-medium">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">MRR at Risk</p>
            <p className="text-lg font-bold text-white leading-none">${mrr.toLocaleString()}</p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3 text-red-400" />
              <span className="text-[11px] text-red-400 font-medium">+12%</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <RiskGauge value={68} active={active} />
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">At Risk</p>
            <p className="text-lg font-bold text-white leading-none">{count}</p>
            <p className="text-[11px] text-amber-400 font-medium mt-1">customers</p>
          </div>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-2">Flagged Accounts</p>
          <motion.div variants={listVariants} initial="hidden" animate={animState} className="space-y-1.5">
            {CUSTOMERS.map((c) => (
              <motion.div key={c.name} variants={rowVariants}
                className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 flex items-center justify-center text-[11px] text-indigo-300 font-semibold shrink-0">
                    {c.name[0]}
                  </div>
                  <span className="text-sm text-slate-200 font-medium">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 hidden sm:block">{c.signal}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${c.high ? 'text-red-300 bg-red-500/15 border border-red-500/20' : 'text-amber-300 bg-amber-500/10 border border-amber-500/20'}`}>
                    {c.risk}%
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <p className="text-center text-[10px] text-slate-700 mt-3 tracking-widest uppercase">Illustrative data</p>
      </div>
    </div>
  );
}

// ── Stats strip ───────────────────────────────────────────────────────────────

function StatTile({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, active } = useScrollTrigger();
  const displayed = useCountUp(value, 900, active);
  return (
    <div ref={ref} className="text-center px-6 py-2">
      <p className="text-5xl font-bold text-white tabular-nums">
        {displayed}
        <span className="text-indigo-400">{suffix}</span>
      </p>
      <p className="text-slate-400 text-sm mt-2 leading-snug">{label}</p>
    </div>
  );
}

// ── Feature card visuals ──────────────────────────────────────────────────────

function PlaybookToggles({ active }: { active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const show = prefersReducedMotion || active;
  const items = ['Onboarding Rescue', 'Silent Quitter', 'Payment Saver'];
  return (
    <div className="space-y-2.5">
      {items.map((name, i) => (
        <motion.div
          key={name}
          initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
          animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
          transition={{ duration: 0.4, delay: i * 0.12, ease: 'easeOut' }}
          className="flex items-center justify-between bg-slate-900/60 rounded-lg px-3 py-2"
        >
          <span className="text-xs text-slate-300 font-medium">{name}</span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-8 h-4 rounded-full relative"
              animate={show ? { backgroundColor: '#22c55e' } : { backgroundColor: '#334155' }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.12 }}
            >
              <motion.div
                className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow"
                animate={show ? { left: '18px' } : { left: '2px' }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.12 }}
              />
            </motion.div>
            <span className="text-[10px] text-green-400 font-medium w-5">ON</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SegmentBars({ active }: { active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const show = prefersReducedMotion || active;
  const bars = [
    { label: 'Trial accounts',  pct: 45, color: '#818cf8' },
    { label: 'Annual accounts', pct: 78, color: '#6366f1' },
  ];
  return (
    <div className="space-y-3">
      {bars.map(({ label, pct, color }, i) => (
        <div key={label}>
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-300 font-medium">{pct}% threshold</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color, transformOrigin: 'left' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: show ? pct / 100 : 0 }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
      <p className="text-[10px] text-slate-600 mt-1">Trigger thresholds differ per segment</p>
    </div>
  );
}

function SetupSteps({ active }: { active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const show = prefersReducedMotion || active;
  const steps = ['Connect Stripe', 'Toggle playbooks', 'Automations running'];
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <motion.div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 shrink-0"
              animate={show
                ? { borderColor: '#6366f1', backgroundColor: '#312e81', color: '#a5b4fc' }
                : { borderColor: '#334155', backgroundColor: 'transparent', color: '#475569' }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.2 }}
            >
              {i + 1}
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                className="w-px mt-0.5" style={{ height: '20px' }}
                animate={show ? { backgroundColor: '#4338ca' } : { backgroundColor: '#1e293b' }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.2 }}
              />
            )}
          </div>
          <motion.p
            className="text-sm pb-3"
            animate={show ? { color: '#e2e8f0' } : { color: '#475569' }}
            transition={{ duration: 0.3, delay: 0.35 + i * 0.2 }}
          >
            {step}
          </motion.p>
        </div>
      ))}
    </div>
  );
}

function RevenueSavedVisual({ active }: { active: boolean }) {
  const mrr = useCountUp(4820, 1200, active);
  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">MRR recovered</p>
          <p className="text-2xl font-bold text-green-400">
            ${mrr.toLocaleString()}
            <span className="text-slate-500 text-sm font-normal">/mo</span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
          <TrendingUp className="w-3 h-3" /><span>+34%</span>
        </div>
      </div>
      {active ? <RevenueChart /> : <div className="h-[68px] bg-slate-800/40 rounded-lg" />}
      <p className="text-[10px] text-slate-600 mt-1 text-right">Illustrative example</p>
    </div>
  );
}

// ── Feature card components (each owns its scroll trigger) ────────────────────

function FeatureCardPlaybooks() {
  const { ref, active } = useScrollTrigger();
  return (
    <FadeUp delay={0}>
      <div ref={ref} className="h-full bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 transition-all duration-200">
        <div className="flex items-start gap-4 mb-5">
          <div className="bg-slate-700/60 p-2.5 rounded-xl shrink-0"><Workflow className="w-5 h-5 text-indigo-400" /></div>
          <div>
            <h3 className="font-semibold mb-1">Pre-Built Playbooks</h3>
            <p className="text-slate-400 text-sm">Ready-made save sequences, live on day one. No flowcharts to build.</p>
          </div>
        </div>
        <div className="border-t border-slate-700/40 pt-4"><PlaybookToggles active={active} /></div>
      </div>
    </FadeUp>
  );
}

function FeatureCardSegmentation() {
  const { ref, active } = useScrollTrigger();
  return (
    <FadeUp delay={0.08}>
      <div ref={ref} className="h-full bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 transition-all duration-200">
        <div className="flex items-start gap-4 mb-5">
          <div className="bg-slate-700/60 p-2.5 rounded-xl shrink-0"><Settings className="w-5 h-5 text-indigo-400" /></div>
          <div>
            <h3 className="font-semibold mb-1">Smart Segmentation</h3>
            <p className="text-slate-400 text-sm">Different plays for new trials, loyal customers, and big accounts.</p>
          </div>
        </div>
        <div className="border-t border-slate-700/40 pt-4"><SegmentBars active={active} /></div>
      </div>
    </FadeUp>
  );
}

function FeatureCardSetup() {
  const { ref, active } = useScrollTrigger();
  return (
    <FadeUp delay={0.16}>
      <div ref={ref} className="h-full bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 transition-all duration-200">
        <div className="flex items-start gap-4 mb-5">
          <div className="bg-slate-700/60 p-2.5 rounded-xl shrink-0"><Zap className="w-5 h-5 text-indigo-400" /></div>
          <div>
            <h3 className="font-semibold mb-1">5-Minute Setup</h3>
            <p className="text-slate-400 text-sm">Connect Stripe, paste one line on your site, done.</p>
          </div>
        </div>
        <div className="border-t border-slate-700/40 pt-4"><SetupSteps active={active} /></div>
      </div>
    </FadeUp>
  );
}

function FeatureCardRevenue() {
  const { ref, active } = useScrollTrigger();
  return (
    <FadeUp delay={0.24}>
      <div ref={ref} className="h-full bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 transition-all duration-200">
        <div className="flex items-start gap-4 mb-5">
          <div className="bg-slate-700/60 p-2.5 rounded-xl shrink-0"><RefreshCw className="w-5 h-5 text-indigo-400" /></div>
          <div>
            <h3 className="font-semibold mb-1">Revenue Saved Dashboard</h3>
            <p className="text-slate-400 text-sm">See exactly what each playbook recovered, in dollars.</p>
          </div>
        </div>
        <div className="border-t border-slate-700/40 pt-4"><RevenueSavedVisual active={active} /></div>
      </div>
    </FadeUp>
  );
}

// ── Signal card mini-charts ───────────────────────────────────────────────────

function PaymentBars({ active }: { active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const show = prefersReducedMotion || active;
  const vals = [90, 88, 84, 76, 60, 42, 28];
  const maxV = 90, h = 44, bw = 14, gap = 5;
  return (
    <svg width={(bw + gap) * vals.length - gap} height={h} aria-hidden="true">
      {vals.map((v, i) => {
        const barH = (v / maxV) * h;
        return (
          <motion.rect key={i} x={i * (bw + gap)} width={bw} rx="3"
            fill={i >= 4 ? '#ef4444' : '#334155'}
            initial={{ y: h, height: 0 }}
            animate={show ? { y: h - barH, height: barH } : { y: h, height: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
          />
        );
      })}
    </svg>
  );
}

function UsageDropLine({ active }: { active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const show = prefersReducedMotion || active;
  const vals = [88, 84, 80, 72, 60, 44, 32, 20, 14, 10];
  const w = 130, h = 44, minV = 8, maxV = 90;
  const xS = (i: number) => ((i / (vals.length - 1)) * w).toFixed(1);
  const yS = (v: number) => (h - ((v - minV) / (maxV - minV)) * (h - 4)).toFixed(1);
  const linePath = vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xS(i)},${yS(v)}`).join(' ');
  return (
    <svg width={w} height={h} aria-hidden="true">
      <motion.path
        d={linePath} fill="none" stroke="#60a5fa" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
        animate={{ pathLength: show ? 1 : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.4, ease: 'easeOut' }}
      />
      {show && (
        <motion.circle
          cx={xS(vals.length - 1)} cy={yS(vals[vals.length - 1])} r="4" fill="#ef4444"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        />
      )}
    </svg>
  );
}

function DowngradeBars({ active }: { active: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const show = prefersReducedMotion || active;
  const vals = [80, 72, 70, 65, 58, 46, 38];
  const maxV = 80, h = 44, bw = 14, gap = 5;
  return (
    <svg width={(bw + gap) * vals.length - gap} height={h} aria-hidden="true">
      {vals.map((v, i) => {
        const barH = (v / maxV) * h;
        return (
          <motion.rect key={i} x={i * (bw + gap)} width={bw} rx="3"
            fill={i >= 5 ? '#f97316' : '#334155'}
            initial={{ y: h, height: 0 }}
            animate={show ? { y: h - barH, height: barH } : { y: h, height: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
          />
        );
      })}
    </svg>
  );
}

// ── Signal card components ────────────────────────────────────────────────────

function SignalPayment() {
  const { ref, active } = useScrollTrigger();
  return (
    <FadeUp delay={0}>
      <div ref={ref} className="h-full bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-200">
        <div className="mb-4 flex items-end justify-between min-h-[52px]">
          <PaymentBars active={active} />
          <span className="text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-full ml-2 shrink-0">Real-time</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-amber-500/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="font-semibold">Payment Failures</h3>
        </div>
        <p className="text-slate-400 text-sm">Failed charges, expired cards, and dunning risk before they become cancellations.</p>
      </div>
    </FadeUp>
  );
}

function SignalUsage() {
  const { ref, active } = useScrollTrigger();
  return (
    <FadeUp delay={0.1}>
      <div ref={ref} className="h-full bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-200">
        <div className="mb-4 flex items-end justify-between min-h-[52px]">
          <UsageDropLine active={active} />
          <span className="text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full ml-2 shrink-0">Auto-detected</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-semibold">Usage Drops</h3>
        </div>
        <p className="text-slate-400 text-sm">When customers stop logging in or abandon key features.</p>
      </div>
    </FadeUp>
  );
}

function SignalDowngrade() {
  const { ref, active } = useScrollTrigger();
  return (
    <FadeUp delay={0.2}>
      <div ref={ref} className="h-full bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 hover:border-red-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-200">
        <div className="mb-4 flex items-end justify-between min-h-[52px]">
          <DowngradeBars active={active} />
          <span className="text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full ml-2 shrink-0">Auto-detected</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-500/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="font-semibold">Downgrade Intent</h3>
        </div>
        <p className="text-slate-400 text-sm">Plan changes, negative support sentiment, and expansion stalls.</p>
      </div>
    </FadeUp>
  );
}

// ── Churn cost calculator ─────────────────────────────────────────────────────

function getPlan(mrr: number): { name: string; monthly: number | null } {
  if (mrr <= 50_000)   return { name: 'Seed',       monthly: 79  };
  if (mrr <= 200_000)  return { name: 'Growth',     monthly: 149 };
  if (mrr <= 1_000_000) return { name: 'Scale',     monthly: 299 };
  return                      { name: 'Enterprise', monthly: null };
}

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000   ? `$${Math.round(n / 1_000)}K`
  : `$${n}`;

function ChurnCalculator() {
  const [mrr,       setMrr]       = useState(25_000);
  const [churnRate, setChurnRate] = useState(3);

  const lostPerYear    = Math.round(mrr * (churnRate / 100) * 12);
  const recoverable    = Math.round(lostPerYear * 0.35);
  const plan           = getPlan(mrr);
  const planCostAnnual = plan.monthly ? plan.monthly * 12 : null;
  const rateColor      = churnRate > 5 ? '#f87171' : churnRate > 2 ? '#fb923c' : '#4ade80';

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-7 sm:p-9">
      <div className="space-y-7 mb-8">

        {/* MRR slider */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <label htmlFor="cg-mrr" className="text-sm font-medium text-slate-200">
              Monthly recurring revenue
            </label>
            <span className="text-base font-semibold text-indigo-400">{fmt(mrr)}</span>
          </div>
          <input
            id="cg-mrr"
            type="range"
            min={1_000} max={500_000} step={1_000}
            value={mrr}
            onChange={e => setMrr(Number(e.target.value))}
            className="cg-calc-range"
            style={{ width: '100%' }}
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1.5">
            <span>$1K</span><span>$500K</span>
          </div>
        </div>

        {/* Churn rate slider */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <label htmlFor="cg-churn" className="text-sm font-medium text-slate-200">
              Monthly churn rate
            </label>
            <span className="text-base font-semibold" style={{ color: rateColor }}>{churnRate}%</span>
          </div>
          <input
            id="cg-churn"
            type="range"
            min={0.5} max={15} step={0.5}
            value={churnRate}
            onChange={e => setChurnRate(Number(e.target.value))}
            className="cg-calc-range"
            style={{ width: '100%' }}
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1.5">
            <span>0.5%</span><span>15%</span>
          </div>
        </div>
      </div>

      {/* Output cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-slate-400 mb-1.5">Lost per year</p>
          <p className="text-2xl font-bold text-red-400">{fmt(lostPerYear)}</p>
        </div>
        <div className="rounded-xl p-4 bg-green-500/10 border border-green-500/20">
          <p className="text-xs text-slate-400 mb-1.5">Recoverable at 35%</p>
          <p className="text-2xl font-bold text-green-400">{fmt(recoverable)}</p>
        </div>
        <div className="rounded-xl p-4 bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-xs text-slate-400 mb-1.5">ChurnGuard ({plan.name})</p>
          <p className="text-2xl font-bold text-indigo-400">
            {planCostAnnual ? `${fmt(planCostAnnual)}/yr` : 'Custom'}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-500 text-center">
        See your exact numbers —{' '}
        <Link href="/audit" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
          run your free churn audit
        </Link>
      </p>

      <style>{`
        .cg-calc-range {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          background: #1e293b;
          outline: none;
          cursor: pointer;
        }
        .cg-calc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #6366f1;
          border: 2px solid #fff;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.25);
        }
        .cg-calc-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #6366f1;
          border: 2px solid #fff;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.25);
        }
      `}</style>
    </div>
  );
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    {
      q: 'How is ChurnGuard different from Baremetrics or ChartMogul?',
      a: 'They show you churn analytics. ChurnGuard acts on them — automatically running retention playbooks the moment a customer shows risk signals. Analytics tell you what happened. Playbooks change what happens next.',
    },
    {
      q: 'Do I need Stripe to use ChurnGuard?',
      a: 'Stripe is where ChurnGuard is deepest today — failed-payment recovery, subscription signals, one-click setup. More billing integrations are on the roadmap.',
    },
    {
      q: 'How long does setup take?',
      a: 'About 5 minutes. Connect Stripe, paste one line of code on your site (or skip it for billing-only signals), pick your playbooks. No developers, no flowcharts, no CS degree.',
    },
    {
      q: 'What does the free churn audit include?',
      a: "Connect your Stripe (read-only) and we'll show your at-risk customers, failed-payment losses, and exactly which playbooks would recover them. Free, no card required, 48-hour turnaround — most finish in minutes.",
    },
    {
      q: 'Does ChurnGuard email my customers without my say?',
      a: 'No. Nothing sends until you activate a playbook, and every email template is yours to edit before it ever goes out. You stay in control of what your customers see.',
    },
  ];
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-slate-700/60 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left bg-slate-800/60 hover:bg-slate-800 transition-colors duration-150"
          >
            <span className="font-medium text-slate-100 pr-4">{item.q}</span>
            <span className="shrink-0 text-slate-400 text-xl leading-none">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div className="px-6 py-5 bg-slate-900/50 border-t border-slate-700/40 text-slate-400 text-sm leading-relaxed">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <DarkShell>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-indigo-600/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-indigo-900/8 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-indigo-400 text-sm font-medium">3 Playbooks. Zero Setup. Saved Revenue.</span>
              </div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-[1.05]">
                Stop Churn Before Customers Decide to Leave
              </h1>
              <p className="text-xl text-slate-400 mb-8 max-w-xl leading-relaxed">
                ChurnGuard watches your Stripe billing — and your product usage, once you paste one line of code — spots at-risk customers while there&apos;s still time to act, and automatically runs the save: retention emails, dunning, and win-backs. Built for small SaaS teams — no Customer Success hire needed.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                <Link href="/audit"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/25">
                  Run Your Free Churn Audit <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#playbooks"
                  className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200">
                  See the Playbooks
                </a>
              </div>
              <p className="text-sm text-slate-500">
                5-minute setup ·{' '}
                <a
                  href="https://marketplace.stripe.com/apps/churnguard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: '#7A73FF', textDecoration: 'none' }}>
                  Listed on the Stripe App Marketplace ↗
                </a>
                {' '}· Cancel anytime
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.15 }}>
              <HeroDashboard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="border-y border-slate-800/60 bg-slate-900/30">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="grid grid-cols-3 divide-x divide-slate-800/60">
            <StatTile value={3}  suffix=""     label="Playbooks ready out of the box" />
            <StatTile value={5}  suffix=" min" label="From Stripe connect to first automation" />
            <StatTile value={0}  suffix=" code" label="No engineering work required" />
          </div>
        </div>
      </div>

      {/* Problem */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-5">
              Analytics Don&apos;t Save Customers.<br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Actions Do.</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Most churn tools give you a &quot;risk score&quot; and call it a day.
              ChurnGuard gives you <span className="text-white font-semibold">pre-built workflows</span> that run automatically.
            </p>
          </FadeUp>
          <div className="grid md:grid-cols-2 gap-6">
            <FadeUp delay={0.05}>
              <div className="h-full bg-slate-900/60 border border-red-500/20 rounded-2xl p-8 shadow-lg shadow-red-500/5">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-red-400" />
                  <h3 className="font-semibold text-red-400">Other Churn Tools</h3>
                </div>
                <ul className="space-y-4 text-slate-400">
                  {[
                    'Dashboards you have to remember to check',
                    'Health scores that tell you who is leaving — after it\'s obvious',
                    'Insights that still require you to do something',
                    'Built for teams with a CS department',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="text-red-500 mt-0.5 shrink-0">×</span>
                      <span className="text-sm">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={0.12}>
              <div className="h-full bg-slate-800/80 border border-green-500/30 rounded-2xl p-8 relative shadow-xl shadow-green-500/5">
                <div className="absolute -top-3.5 right-5 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                  CHURNGUARD
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <Play className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-green-400">Automated Playbooks</h3>
                </div>
                <ul className="space-y-4 text-slate-300">
                  {[
                    'Detects churn risk automatically from Stripe + usage signals',
                    'Runs the save play for you — retention emails, dunning, win-backs',
                    'Fires automatically when a signal appears — not when you check a dashboard',
                    'Built for founders doing support, sales, and product at once',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Churn cost calculator */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Is Churn Actually<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"> Costing You?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Most founders find out a customer was unhappy the day the cancellation email arrives. By then, the decision was made weeks ago. ChurnGuard catches the signal while there&apos;s still time to act.</p>
            <p className="text-slate-500 text-sm mt-3">Drag the sliders — no email required.</p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <ChurnCalculator />
          </FadeUp>
        </div>
      </section>

      {/* Playbooks */}
      <section id="playbooks" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-slate-800/40">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">3 Playbooks. Zero Configuration.</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Toggle on the workflows that fit your business. We handle the logic.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-5 h-5 text-indigo-400" />, title: 'The Onboarding Rescue', desc: "New customer signed up but never got going? ChurnGuard spots stalled onboarding and automatically sends the right nudge at the right time — before ‘I’ll set it up later’ becomes ‘cancel.’", trigger: 'Signed up 3 days ago, never used core feature', action: 'In-app tour + founder email sequence', delay: 0 },
              { icon: <Users className="w-5 h-5 text-indigo-400" />, title: 'The Silent Quitter', desc: "Usage dropping? Logins fading? Silent churn is the biggest killer of small SaaS — customers drift away without a word. ChurnGuard detects the fade and re-engages them while they still remember your name.", trigger: "Daily user hasn't logged in for 5 days", action: 'Slack alert to team + personal outreach email', delay: 0.1 },
              { icon: <CreditCard className="w-5 h-5 text-indigo-400" />, title: 'The Payment Saver', desc: "Industry-wide, failed payments drive 20–40% of all churn. ChurnGuard catches declined charges the moment they happen and runs a 3-step recovery sequence — email, reminder, escalation — until the payment is recovered.", trigger: 'Failed payment + recent login drop', action: 'Offer "Pause subscription" instead of cancel', delay: 0.2 },
            ].map(({ icon, title, desc, trigger, action, delay }) => (
              <FadeUp key={title} delay={delay}>
                <div className="group h-full bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200">
                  <div className="bg-indigo-500/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4">{icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm mb-5">{desc}</p>
                  <div className="bg-slate-900/70 border border-slate-700/40 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex flex-wrap items-start gap-1.5">
                      <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wide shrink-0 mt-0.5">Trigger</span>
                      <span className="text-xs text-slate-300">{trigger}</span>
                    </div>
                    <div className="h-px bg-slate-700/40" />
                    <div className="flex flex-wrap items-start gap-1.5">
                      <span className="text-[11px] font-semibold text-green-400 uppercase tracking-wide shrink-0 mt-0.5">Action</span>
                      <span className="text-xs text-slate-300">{action}</span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.3} className="mt-10 text-center">
            <p className="text-slate-500 text-sm">+ Custom playbooks for your specific signals. Webhook support for any tool.</p>
          </FadeUp>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Small Teams Who Can&apos;t Hire<br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"> Customer Success Yet</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mt-4">You&apos;re the founder, the support team, and the retention department — all before lunch. ChurnGuard connects to your Stripe account in 5 minutes and becomes the CS hire you can&apos;t afford yet: watching every customer, catching every signal, running every save.</p>
          </FadeUp>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCardPlaybooks />
            <FeatureCardSegmentation />
            <FeatureCardSetup />
            <FeatureCardRevenue />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-slate-800/40">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fair Pricing That Scales With You</h2>
            <p className="text-slate-400">Start free for 30 days. No credit card required.</p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {([
              { label: 'Free Trial', sublabel: '30 days full access', price: '$0', period: '/30 days', badge: 'NO CREDIT CARD', href: '/signup?plan=trial', features: ['100 customers tracked','Basic automation rules','Slack alerts','Email sequences','CRM sync'], cta: 'Start Free Trial →', ctaClass: 'bg-green-500 hover:bg-green-600 text-white', cardBorder: 'border-2 border-green-500/50', labelClass: 'text-green-400', delay: 0 },
              { label: 'Seed', sublabel: 'For MRR $0 – $50K', price: '$79', period: '/month', badge: '', href: '/signup?plan=seed', features: ['Up to 100 customers','Slack risk alerts (3 channels)','Basic playbooks (3 active)','Email support','7-day data retention'], cta: 'Get Started →', ctaClass: 'bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white', cardBorder: 'border border-slate-700', labelClass: 'text-white', delay: 0.06 },
              { label: 'Growth', sublabel: 'For MRR $50K – $200K', price: '$149', period: '/month', badge: 'Most Popular', href: '/signup?plan=growth', features: ['Everything in Seed, plus:','Unlimited customers','Advanced playbooks (10 active)','30-day risk forecasting','Priority support'], cta: 'Get Started →', ctaClass: 'bg-indigo-600 hover:bg-indigo-700 text-white', cardBorder: 'border-2 border-indigo-500 shadow-xl shadow-indigo-500/10', labelClass: 'text-indigo-400', delay: 0.12 },
              { label: 'Scale', sublabel: 'For MRR $200K – $1M', price: '$299', period: '/month', badge: '', href: '/signup?plan=scale', features: ['Everything in Growth, plus:','Custom risk scoring','Team collaboration (10 seats)','API access','1-year data retention'], cta: 'Get Started →', ctaClass: 'bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white', cardBorder: 'border border-slate-700', labelClass: 'text-white', delay: 0.18 },
            ] as const).map(({ label, sublabel, price, period, badge, href, features, cta, ctaClass, cardBorder, labelClass, delay }) => (
              <FadeUp key={label} delay={delay}>
                <div className={`h-full bg-slate-800/60 ${cardBorder} rounded-2xl p-6 flex flex-col relative hover:-translate-y-1 hover:shadow-2xl transition-all duration-200`}>
                  {badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${label === 'Free Trial' ? 'bg-green-500' : 'bg-indigo-500'} text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap`}>
                      {badge}
                    </div>
                  )}
                  <h3 className={`text-lg font-semibold mb-0.5 ${badge ? 'mt-2' : ''} ${labelClass}`}>{label}</h3>
                  <p className="text-slate-500 text-xs mb-4">{sublabel}</p>
                  <div className="mb-5">
                    <span className="text-4xl font-bold">{price}</span>
                    <span className="text-slate-400 text-sm ml-1">{period}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300 mb-6 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${label === 'Free Trial' ? 'text-green-500' : 'text-indigo-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={href}
                    className={`block w-full ${ctaClass} text-center py-2.5 rounded-xl font-semibold text-sm transition-all duration-200`}>
                    {cta}
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.25} className="text-center mt-10 text-slate-500 text-sm">
            30-day free trial · Cancel anytime · No contracts · No setup fees
          </FadeUp>
        </div>
      </section>

      {/* Churn signals */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Churn signals we catch automatically</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">No dashboards to check. Signals fire the playbook the moment something&apos;s off.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            <SignalPayment />
            <SignalUsage />
            <SignalDowngrade />
          </div>
          <FadeUp delay={0.3} className="mt-14 text-center">
            <div className="text-slate-500 text-sm mb-4">Works seamlessly with</div>
            <div className="flex items-center justify-center gap-8 text-slate-400 font-semibold text-sm">
              <span>Stripe</span><span className="text-slate-700">•</span>
              <span>Slack</span><span className="text-slate-700">•</span>
              <span>Intercom</span><span className="text-slate-700">•</span>
              <span>Zapier</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Social proof */}
      <div className="border-y border-slate-800/60 bg-slate-900/30">
        <div className="max-w-2xl mx-auto px-4 py-14 text-center">
          <FadeUp>
            <h2 className="text-xl font-semibold text-slate-200 mb-3">Trusted by founder-led SaaS teams</h2>
            <p className="text-slate-400 text-base">ChurnGuard is new — and we&apos;re early. Run the free audit and judge us on your own numbers.</p>
          </FadeUp>
        </div>
      </div>

      {/* FAQ */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-slate-800/40">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions Founders Ask</h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <FaqAccordion />
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section id="signup" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/8 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">Stop Losing Customers<br />to Silence</h2>
            <p className="text-xl text-slate-400 mb-10">Every week without playbooks, more customers quietly drift away. Find out who&apos;s at risk right now — free.</p>
            <div className="max-w-xs mx-auto">
              <Link href="/audit"
                className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/30">
                Run Your Free Churn Audit
              </Link>
            </div>
            <p className="text-sm text-slate-600 mt-5">30-day free trial · No credit card required · Cancel anytime</p>
          </FadeUp>
        </div>
      </section>

    </DarkShell>
  );
}
