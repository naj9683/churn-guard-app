import type { Metadata } from 'next';
import Link from 'next/link';

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

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(51,65,85,0.6)' }}>
        <nav style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '18px', color: '#f1f5f9', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🛡️</div>
            ChurnGuard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>← Home</Link>
            <Link href="/audit" style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
              Free Audit →
            </Link>
          </div>
        </nav>
      </header>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '72px 24px 96px' }}>

        {/* Hero */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', fontSize: '13px', fontWeight: '600', color: '#818cf8', marginBottom: '24px' }}>
            About
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.03em', margin: '0 0 20px', color: '#f1f5f9' }}>
            We built ChurnGuard because churn<br />
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              shouldn't require a CS team to fight
            </span>
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.7', margin: 0 }}>
            Most SaaS businesses lose 20–40% of their churned customers to payment failures alone — customers who never intended to leave. The rest leave quietly, weeks before anyone notices. ChurnGuard automates the entire response: failed payment recovery, at-risk detection, and targeted retention campaigns — so founders don't have to.
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1e293b', marginBottom: '64px' }} />

        {/* Founder */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '28px', color: '#fff', flexShrink: 0 }}>
              N
            </div>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>Naj</div>
              <div style={{ fontSize: '14px', color: '#818cf8', marginBottom: '16px' }}>Founder, ChurnGuard</div>
              <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.7', margin: '0 0 16px' }}>
                I built ChurnGuard after watching too many SaaS founders — including myself — scramble to understand why customers were leaving. The data was all in Stripe. The patterns were obvious in hindsight. But nothing connected the dots automatically and acted on them.
              </p>
              <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.7', margin: 0 }}>
                ChurnGuard is the tool I wished existed: it monitors every subscriber, scores their risk, and fires the right retention message before the cancellation email lands. No CS team needed. No dashboards to check every morning.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1e293b', marginBottom: '64px' }} />

        {/* What we believe */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 32px', letterSpacing: '-0.02em' }}>What we believe</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              {
                title: 'Retention should be automated, not manual',
                body: 'A founder shouldn\'t have to manually review a dashboard to know a customer is about to churn. If the signal is in the data, the response should be automatic.',
              },
              {
                title: 'Most churn is preventable',
                body: '20–40% of SaaS churn is involuntary — failed payments, expired cards — and almost entirely recoverable. Another 15–25% is reachable with the right message at the right moment. That\'s more than half of your churn addressable without changing the product.',
              },
              {
                title: 'Small teams deserve enterprise-grade retention',
                body: 'Customer success platforms built for 20-person CS teams aren\'t the answer for a 3-person SaaS. ChurnGuard is built for founders and small teams who need the outcome — retained customers — not the overhead.',
              },
              {
                title: 'Transparency over dark patterns',
                body: 'We don\'t help you hide the cancel button or trap customers with friction. Our retention tools work because they offer genuine value at the right moment — a pause option, a downgrade, a check-in. Customers who stay because they want to are worth more than customers who stay because they can\'t leave.',
              },
            ].map(({ title, body }) => (
              <div key={title} style={{ padding: '24px 28px', background: '#1e293b', border: '1px solid #334155', borderRadius: '14px' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>{title}</div>
                <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.65', margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1e293b', marginBottom: '64px' }} />

        {/* By the numbers */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 32px', letterSpacing: '-0.02em' }}>By the numbers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { stat: '35%', label: 'Average churn reduction for active customers' },
              { stat: '30–60%', label: 'Failed payments recovered by dunning sequences' },
              { stat: '6 hrs', label: 'How often ChurnGuard re-scores every subscriber' },
              { stat: '< 10 min', label: 'Time to connect Stripe and go live' },
            ].map(({ stat, label }) => (
              <div key={stat} style={{ padding: '24px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: '800', color: '#818cf8', marginBottom: '8px', letterSpacing: '-0.02em' }}>{stat}</div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ padding: '40px', background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#f1f5f9', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Get in touch</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' }}>
            Questions about ChurnGuard, partnership enquiries, or just want to talk retention strategy — email us directly.
          </p>
          <a
            href="mailto:admin@churnguardapp.com"
            style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>
            admin@churnguardapp.com
          </a>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '32px 24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        <p style={{ margin: 0 }}>
          © 2026 ChurnGuard ·{' '}
          <Link href="/" style={{ color: '#64748b' }}>Home</Link> ·{' '}
          <Link href="/blog" style={{ color: '#64748b' }}>Blog</Link> ·{' '}
          <Link href="/privacy" style={{ color: '#64748b' }}>Privacy</Link> ·{' '}
          <Link href="/terms" style={{ color: '#64748b' }}>Terms</Link>
        </p>
      </footer>
    </div>
  );
}
