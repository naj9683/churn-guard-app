'use client';

import { useEffect, useState } from 'react';

interface Slide {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function DashboardSlide() {
  return (
    <div className="bg-slate-900 rounded-xl p-6 w-full h-full flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">ChurnGuard Dashboard</span>
        <span className="text-xs text-slate-500">Live</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-red-500/20">
          <p className="text-slate-400 text-xs mb-1">Revenue at Risk</p>
          <p className="text-3xl font-bold text-red-400">$24,800</p>
          <p className="text-xs text-slate-500 mt-1">↑ 8 customers flagged this week</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-green-500/20">
          <p className="text-slate-400 text-xs mb-1">Saved This Month</p>
          <p className="text-3xl font-bold text-green-400">$61,200</p>
          <p className="text-xs text-slate-500 mt-1">↑ 23 interventions successful</p>
        </div>
      </div>
      <div className="bg-slate-800 rounded-lg p-4 flex-1">
        <p className="text-slate-400 text-xs mb-3">High-Risk Customers</p>
        {[
          { name: 'Acme Corp', risk: 94, mrr: '$4,200' },
          { name: 'TechFlow Inc', risk: 87, mrr: '$2,800' },
          { name: 'Bright Labs', risk: 81, mrr: '$1,600' },
        ].map((c) => (
          <div key={c.name} className="flex items-center gap-3 mb-2">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 text-xs">{c.name}</span>
                <span className="text-slate-400 text-xs">{c.mrr}/mo</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${c.risk}%` }}
                />
              </div>
            </div>
            <span className="text-red-400 text-xs font-bold w-8 text-right">{c.risk}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutomationSlide() {
  return (
    <div className="bg-slate-900 rounded-xl p-6 w-full h-full flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Automation Rules</span>
        <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">3 active</span>
      </div>
      {[
        {
          trigger: 'Churn risk > 80%',
          action: 'Notify CSM + Create task',
          status: 'active',
          color: 'indigo',
        },
        {
          trigger: 'No login for 14 days',
          action: 'Send re-engagement email',
          status: 'active',
          color: 'purple',
        },
        {
          trigger: 'Support tickets > 3/week',
          action: 'Escalate to success team',
          status: 'active',
          color: 'violet',
        },
      ].map((rule, i) => (
        <div key={i} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full bg-${rule.color}-400`} />
                <span className="text-slate-400 text-xs">IF</span>
                <span className="text-white text-xs font-medium">{rule.trigger}</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-slate-400 text-xs">THEN</span>
                <span className="text-indigo-300 text-xs">{rule.action}</span>
              </div>
            </div>
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full shrink-0">
              {rule.status}
            </span>
          </div>
        </div>
      ))}
      <div className="mt-auto">
        <button className="w-full py-2 rounded-lg border border-dashed border-slate-600 text-slate-500 text-xs hover:border-indigo-500 hover:text-indigo-400 transition-colors">
          + Add new rule
        </button>
      </div>
    </div>
  );
}

function InterventionSlide() {
  return (
    <div className="bg-slate-900 rounded-xl p-6 w-full h-full flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Intervention Results</span>
        <span className="text-xs text-green-400">This month</span>
      </div>
      <div className="bg-slate-800 rounded-lg p-4 border border-green-500/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 text-sm font-medium">Acme Corp</span>
          <span className="text-xs bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full">Saved ✓</span>
        </div>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            Flagged at 94% churn risk on Mar 18
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
            CSM reached out with tailored offer — Mar 19
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            Renewed annual plan — $50,400 ARR retained
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Interventions', value: '23', sub: 'this month' },
          { label: 'Success Rate', value: '78%', sub: 'industry avg 41%' },
          { label: 'ARR Retained', value: '$61K', sub: 'and counting' },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
            <p className="text-slate-600 text-xs">{stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4 mt-auto">
        <p className="text-indigo-300 text-sm font-medium text-center">
          ChurnGuard identifies risk 30+ days before cancellation — giving you time to act.
        </p>
      </div>
    </div>
  );
}

const SLIDES: Slide[] = [
  {
    title: 'Revenue at Risk Dashboard',
    description: 'See exactly which customers are about to churn and how much ARR is on the line — in real time.',
    content: <DashboardSlide />,
  },
  {
    title: 'Automated Intervention Rules',
    description: 'Set up once, run forever. ChurnGuard triggers the right action the moment a customer shows risk signals.',
    content: <AutomationSlide />,
  },
  {
    title: 'Intervention Success Tracking',
    description: 'Close the loop. See which outreach worked, how much revenue was retained, and your ROI at a glance.',
    content: <InterventionSlide />,
  },
];

export default function DemoVideoModal({ isOpen, onClose }: DemoVideoModalProps) {
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;

  // Reset to first slide when modal opens
  useEffect(() => {
    if (isOpen) setSlide(0);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #0f172a, #1e1b4b)',
          border: '1px solid rgba(99,102,241,0.25)',
          animation: 'fadeScaleIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Close demo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-indigo-400 text-xs font-medium uppercase tracking-wider">
                Product Demo · {slide + 1} of {SLIDES.length}
              </span>
            </div>
            <h2 className="text-white text-xl font-bold">{SLIDES[slide].title}</h2>
            <p className="text-slate-400 text-sm mt-1">{SLIDES[slide].description}</p>
          </div>

          {/* Slide content */}
          <div className="h-72 sm:h-80" key={slide} style={{ animation: 'fadeSlideIn 0.25s ease-out' }}>
            {SLIDES[slide].content}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className="transition-all duration-200"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div
                  className={`rounded-full transition-all duration-200 ${
                    i === slide
                      ? 'w-6 h-2 bg-indigo-400'
                      : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-4">
            {slide > 0 && (
              <button
                onClick={() => setSlide((s) => s - 1)}
                className="px-5 py-2.5 rounded-xl text-slate-300 text-sm border border-slate-700 hover:border-slate-500 hover:text-white transition-colors"
              >
                ← Previous
              </button>
            )}
            <div className="flex-1" />
            {!isLast ? (
              <button
                onClick={() => setSlide((s) => s + 1)}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              >
                Next →
              </button>
            ) : (
              <a
                href="#pricing"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              >
                Get Started →
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
