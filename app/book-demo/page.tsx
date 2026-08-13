'use client';

import { useEffect, useRef } from 'react';
import DarkShell from '@/app/components/ui/DarkShell';

const DK_BORDER_MD = 'rgba(71,85,105,0.6)';
const DK_ACCENT    = '#6366f1';
const DK_ACCENT_BG = 'rgba(99,102,241,0.12)';
const DK_ACCENT_BR = 'rgba(99,102,241,0.25)';
const DK_MUTED     = '#94a3b8';
const DK_FAINT     = '#64748b';

const CALENDLY_URL = 'https://calendly.com/dispatchpro/30min';

export default function BookDemoPage() {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const existing = document.querySelector('script[src*="calendly"]');
      if (existing) existing.remove();
    };
  }, []);

  return (
    <DarkShell>

      {/* Hero text */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '80px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '999px', background: DK_ACCENT_BG, border: `1px solid ${DK_ACCENT_BR}`, color: DK_ACCENT, fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '20px' }}>
          30-minute demo
        </div>
        <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)', fontWeight: 500, color: '#f1f5f9', letterSpacing: '-0.02em', margin: '0 0 16px', lineHeight: 1.15 }}>
          Book a ChurnGuard Demo
        </h1>
        <p style={{ fontSize: '18px', color: DK_MUTED, maxWidth: '520px', margin: '0 auto 20px', lineHeight: 1.6 }}>
          See how ChurnGuard predicts churn and fires automated retention messages — live, with your questions answered.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', color: DK_FAINT, fontSize: '13px', marginBottom: '48px' }}>
          {['30 minutes', 'No sales pressure', 'Live dashboard walkthrough', 'Q&A included'].map(item => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="13" height="13" fill="none" stroke={DK_ACCENT} strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Calendly inline widget */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${DK_BORDER_MD}` }}>
          <div
            className="calendly-inline-widget"
            data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0f172a&text_color=f1f5f9&primary_color=6366f1`}
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      </div>

    </DarkShell>
  );
}
