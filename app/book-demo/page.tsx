'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

// Set your Calendly link here or via NEXT_PUBLIC_CALENDLY_URL env var
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/najwasaadi1/30min';

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
      // clean up on unmount
      const existing = document.querySelector('script[src*="calendly"]');
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0b1120', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(11,17,32,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <nav style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '18px', color: '#fff', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#06b6d4,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              🛡️
            </div>
            ChurnGuard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textDecoration: 'none' }}>
              ← Back to home
            </Link>
            <Link href="/audit" style={{ padding: '8px 20px', borderRadius: '10px', background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', color: '#fff', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
              Free Audit →
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero text */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#67e8f9', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px' }}>
          30-minute demo
        </div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 16px' }}>
          Book a ChurnGuard Demo
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '520px', margin: '0 auto 12px', lineHeight: 1.6 }}>
          See how ChurnGuard predicts churn and fires automated retention messages — live, with your questions answered.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '48px' }}>
          {['30 minutes', 'No sales pressure', 'Live dashboard walkthrough', 'Q&A included'].map(item => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#06b6d4' }}>✓</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* Calendly inline widget */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(6,182,212,0.15)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
          <div
            className="calendly-inline-widget"
            data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0f172a&text_color=f1f5f9&primary_color=06b6d4`}
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>
          {['200+ SaaS teams trust ChurnGuard', 'Setup in 5 minutes', 'Cancel anytime', 'No contracts'].map(item => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
