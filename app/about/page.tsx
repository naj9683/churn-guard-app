import type { Metadata } from 'next';
import Link from 'next/link';
import DarkShell from '@/app/components/ui/DarkShell';

export const metadata: Metadata = {
  title: 'About — ChurnGuard',
  description:
    'ChurnGuard is an AI-powered churn prevention platform for SaaS businesses. Learn about the founder, why we built it, and what we stand for.',
  alternates: { canonical: 'https://churnguardapp.com/about' },
  openGraph: {
    title: 'About ChurnGuard',
    description:
      'ChurnGuard is an AI-powered churn prevention platform for SaaS businesses. Learn about the founder, why we built it, and what we stand for.',
    url: 'https://churnguardapp.com/about',
    siteName: 'ChurnGuard',
    type: 'website',
  },
};

const DK_CARD      = '#0f172a';
const DK_TEXT      = '#f1f5f9';
const DK_MUTED     = '#94a3b8';
const DK_FAINT     = '#64748b';
const DK_BORDER    = 'rgba(51,65,85,0.5)';
const DK_ACCENT    = '#6366f1';
const DK_ACCENT_BG = 'rgba(99,102,241,0.12)';
const DK_ACCENT_BR = 'rgba(99,102,241,0.25)';

export default function AboutPage() {
  return (
    <DarkShell>
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px 96px' }}>

        {/* Hero */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '999px', background: DK_ACCENT_BG, border: `1px solid ${DK_ACCENT_BR}`, fontSize: '13px', fontWeight: 500, color: DK_ACCENT, marginBottom: '24px' }}>
            About
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 20px', color: DK_TEXT }}>
            We built ChurnGuard because churn shouldn't require a CS team to fight
          </h1>
          <p style={{ fontSize: '18px', color: DK_MUTED, lineHeight: 1.7, margin: 0 }}>
            Most SaaS businesses lose 20–40% of their churned customers to payment failures alone — customers who never intended to leave. The rest leave quietly, weeks before anyone notices. ChurnGuard automates the entire response: failed payment recovery, at-risk detection, and targeted retention campaigns — so founders don't have to.
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${DK_BORDER}`, marginBottom: '64px' }} />

        {/* Founder */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: DK_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '28px', color: '#fff', flexShrink: 0 }}>
              N
            </div>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ fontSize: '18px', fontWeight: 500, color: DK_TEXT, marginBottom: '4px' }}>Naj</div>
              <div style={{ fontSize: '13px', color: DK_ACCENT, marginBottom: '16px' }}>Founder, ChurnGuard</div>
              <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 16px' }}>
                I built ChurnGuard after watching too many SaaS founders — including myself — scramble to understand why customers were leaving. The data was all in Stripe. The patterns were obvious in hindsight. But nothing connected the dots automatically and acted on them.
              </p>
              <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: 0 }}>
                ChurnGuard is the tool I wished existed: it monitors every subscriber, scores their risk, and fires the right retention message before the cancellation email lands. No CS team needed. No dashboards to check every morning.
              </p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${DK_BORDER}`, marginBottom: '64px' }} />

        {/* What we believe */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', fontWeight: 500, color: DK_TEXT, margin: '0 0 32px', letterSpacing: '-0.01em' }}>What we believe</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                title: 'Retention should be automated, not manual',
                body: "A founder shouldn't have to manually review a dashboard to know a customer is about to churn. If the signal is in the data, the response should be automatic.",
              },
              {
                title: 'Most churn is preventable',
                body: "20–40% of SaaS churn is involuntary — failed payments, expired cards — and almost entirely recoverable. Another 15–25% is reachable with the right message at the right moment. That's more than half of your churn addressable without changing the product.",
              },
              {
                title: 'Small teams deserve enterprise-grade retention',
                body: "Customer success platforms built for 20-person CS teams aren't the answer for a 3-person SaaS. ChurnGuard is built for founders and small teams who need the outcome — retained customers — not the overhead.",
              },
              {
                title: 'Transparency over dark patterns',
                body: "We don't help you hide the cancel button or trap customers with friction. Our retention tools work because they offer genuine value at the right moment — a pause option, a downgrade, a check-in. Customers who stay because they want to are worth more than customers who stay because they can't leave.",
              },
            ].map(({ title, body }) => (
              <div key={title} style={{ padding: '24px 28px', background: DK_CARD, border: `1px solid ${DK_BORDER}`, borderRadius: '12px' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: DK_TEXT, marginBottom: '8px' }}>{title}</div>
                <p style={{ fontSize: '14px', color: DK_MUTED, lineHeight: 1.7, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${DK_BORDER}`, marginBottom: '64px' }} />

        {/* By the numbers */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', fontWeight: 500, color: DK_TEXT, margin: '0 0 32px', letterSpacing: '-0.01em' }}>By the numbers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { stat: '35%',    label: 'Average churn reduction for active customers' },
              { stat: '30–60%', label: 'Failed payments recovered by dunning sequences' },
              { stat: '6 hrs',  label: 'How often ChurnGuard re-scores every subscriber' },
              { stat: '< 10 min', label: 'Time to connect Stripe and go live' },
            ].map(({ stat, label }) => (
              <div key={stat} style={{ padding: '24px', background: DK_ACCENT_BG, border: `1px solid ${DK_ACCENT_BR}`, borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 500, color: DK_ACCENT, marginBottom: '8px', letterSpacing: '-0.02em' }}>{stat}</div>
                <div style={{ fontSize: '13px', color: DK_MUTED, lineHeight: 1.5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ padding: '40px', background: DK_CARD, border: `1px solid ${DK_BORDER}`, borderRadius: '12px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 500, color: DK_TEXT, margin: '0 0 12px', letterSpacing: '-0.01em' }}>Get in touch</h2>
          <p style={{ color: DK_MUTED, fontSize: '15px', lineHeight: 1.7, margin: '0 0 24px' }}>
            Questions about ChurnGuard, partnership enquiries, or just want to talk retention strategy — email us directly.
          </p>
          <a
            href="mailto:admin@churnguardapp.com"
            style={{ display: 'inline-block', padding: '11px 26px', borderRadius: '6px', background: DK_ACCENT, color: '#fff', fontWeight: 500, fontSize: '15px', textDecoration: 'none' }}>
            admin@churnguardapp.com
          </a>
        </div>

      </main>
    </DarkShell>
  );
}
