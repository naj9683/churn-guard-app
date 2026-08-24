'use client';

import { useState } from 'react';
import DarkShell from '@/app/components/ui/DarkShell';

const DK_BG     = '#0a0a12';
const DK_CARD   = '#0f172a';
const DK_TEXT   = '#f1f5f9';
const DK_MUTED  = '#94a3b8';
const DK_FAINT  = '#64748b';
const DK_ACCENT = '#6366f1';
const DK_BORDER = '#1e293b';
const DK_BORDER_MED = '#334155';

const comparisons = [
  {
    slug: 'churnzero',
    name: 'ChurnZero',
    tagline: 'Enterprise customer success platform',
    summary:
      'Built for dedicated CS teams managing dozens of accounts manually. Powerful but requires a CS headcount to operate.',
    bestFor: 'B2B SaaS with a full CS department',
    cgBestFor: 'Founder-led SaaS teams without a CS hire',
  },
  {
    slug: 'gainsight',
    name: 'Gainsight',
    tagline: 'The original enterprise CS platform',
    summary:
      "Gainsight invented the category. It's built for enterprises with dedicated CS ops teams and six-figure budgets.",
    bestFor: 'Enterprise SaaS with CS ops teams',
    cgBestFor: 'Small SaaS teams who need automation, not a platform',
  },
  {
    slug: 'churnkey',
    name: 'Churnkey',
    tagline: 'Cancellation flow & failed payment recovery',
    summary:
      'Churnkey excels at the cancellation moment — offboarding flows, pauses, and dunning. ChurnGuard works earlier.',
    bestFor: 'Reducing cancellations at the cancel button',
    cgBestFor: 'Catching at-risk customers before they reach the cancel button',
  },
  {
    slug: 'totango',
    name: 'Totango',
    tagline: 'Composable CS platform with a genuine free tier',
    summary:
      'A genuinely free CS platform tier vs automation that needs no configuration at all.',
    bestFor: 'Teams ready to invest setup time in a CS system',
    cgBestFor: 'Teams with no time to build or run one',
  },
  {
    slug: 'baremetrics',
    name: 'Baremetrics',
    tagline: 'The analytics standard for Stripe-based SaaS',
    summary:
      'The analytics standard vs the tool that acts on the numbers.',
    bestFor: 'Founders who want metrics clarity',
    cgBestFor: 'Founders who want churn handled, not just measured',
  },
  {
    slug: 'planhat',
    name: 'Planhat',
    tagline: 'Enterprise "agentic" customer platform',
    summary:
      'The enterprise "agentic" platform vs same-day churn automation for small teams.',
    bestFor: 'Commercial teams with sales + CS + support',
    cgBestFor: 'Founder-led SaaS, no CS hire',
  },
  {
    slug: 'vitally',
    name: 'Vitally',
    tagline: 'Copilot for customer success managers',
    summary:
      'A copilot for your CSM vs the tool for teams with no CSM.',
    bestFor: 'Scaling CS productivity',
    cgBestFor: 'Replacing the need for CS headcount (for now)',
  },
  {
    slug: 'custify',
    name: 'Custify',
    tagline: 'Churn-risk surfacing for CS teams',
    summary:
      'Churn-risk surfacing for CS teams vs automatic saves for founders.',
    bestFor: 'Teams with someone owning renewals',
    cgBestFor: 'Teams where nobody does',
  },
];

const howToChoose = [
  {
    q: 'Do you have a dedicated customer success manager?',
    a: 'If yes, ChurnZero or Gainsight may be worth evaluating. If no — those tools require a CS hire to operate. ChurnGuard is built to run without one.',
  },
  {
    q: 'Are you losing customers at the cancel flow specifically?',
    a: 'Churnkey is purpose-built for that moment. ChurnGuard targets the weeks of disengagement before a customer even reaches the cancel button.',
  },
  {
    q: 'Is your team under 20 people?',
    a: 'ChurnZero and Gainsight are built for enterprises and priced accordingly. ChurnGuard is built for small teams — setup in minutes, no CS ops required.',
  },
];

export default function AlternativesPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <DarkShell>
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '80px 24px 96px' }}>

        {/* Hero */}
        <div style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: DK_ACCENT, marginBottom: '14px' }}>
            Alternatives
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: DK_TEXT, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Customer success tool alternatives — compared honestly
          </h1>
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '18px 22px', marginBottom: '0' }}>
            <p style={{ fontSize: '15px', color: DK_MUTED, lineHeight: 1.7, margin: 0 }}>
              Most comparison pages are written by vendors who want you to pick them. This one names the cases where a competitor is the right call — because the wrong tool costs more than the right subscription.
              <br /><br />
              All facts are sourced from public pricing pages and documentation, dated August 2026. We update when things change.
            </p>
          </div>
        </div>

        {/* Comparison cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '64px' }}>
          {comparisons.map(c => (
            <a
              key={c.slug}
              href={`/alternatives/${c.slug}`}
              style={{ textDecoration: 'none' }}
              onMouseEnter={() => setHovered(c.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{
                background: DK_CARD,
                border: `1px solid ${hovered === c.slug ? DK_ACCENT : DK_BORDER}`,
                borderRadius: '14px',
                padding: '28px 28px 24px',
                transition: 'border-color 150ms',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: DK_TEXT, margin: '0 0 4px' }}>
                      ChurnGuard vs {c.name}
                    </h2>
                    <p style={{ fontSize: '13px', color: DK_FAINT, margin: 0 }}>{c.tagline}</p>
                  </div>
                  <span style={{ fontSize: '13px', color: DK_ACCENT, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Read comparison →
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: DK_MUTED, lineHeight: 1.65, margin: '0 0 16px' }}>{c.summary}</p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ background: '#1a1a2e', border: `1px solid ${DK_BORDER_MED}`, borderRadius: '8px', padding: '10px 14px', flex: '1', minWidth: '200px' }}>
                    <p style={{ fontSize: '11px', color: DK_FAINT, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, margin: '0 0 4px' }}>{c.name} best for</p>
                    <p style={{ fontSize: '13px', color: DK_MUTED, margin: 0 }}>{c.bestFor}</p>
                  </div>
                  <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '10px 14px', flex: '1', minWidth: '200px' }}>
                    <p style={{ fontSize: '11px', color: DK_FAINT, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, margin: '0 0 4px' }}>ChurnGuard best for</p>
                    <p style={{ fontSize: '13px', color: DK_MUTED, margin: 0 }}>{c.cgBestFor}</p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* How to choose */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: DK_TEXT, margin: '0 0 24px' }}>How to choose</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {howToChoose.map((item, i) => (
              <div key={i} style={{
                borderTop: `1px solid ${DK_BORDER}`,
                padding: '20px 0',
                ...(i === howToChoose.length - 1 ? { borderBottom: `1px solid ${DK_BORDER}` } : {}),
              }}>
                <p style={{ fontSize: '15px', fontWeight: 600, color: DK_TEXT, margin: '0 0 8px' }}>{item.q}</p>
                <p style={{ fontSize: '14px', color: DK_MUTED, lineHeight: 1.65, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: DK_CARD, border: `1px solid ${DK_BORDER}`, borderRadius: '14px', padding: '40px 28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: DK_TEXT, margin: '0 0 12px' }}>
            Not sure which tool fits?
          </h2>
          <p style={{ fontSize: '15px', color: DK_MUTED, lineHeight: 1.65, margin: '0 0 24px' }}>
            Run the free churn audit first. You'll see your monthly churn rate, revenue at risk, and annualised loss — in two minutes, no account required.
          </p>
          <a href="/audit" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '15px',
            padding: '14px 32px',
            borderRadius: '10px',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}>
            Run Your Free Churn Audit →
          </a>
          <p style={{ fontSize: '12px', color: DK_FAINT, marginTop: '12px' }}>No account. No credit card. Results in 2 minutes.</p>
        </div>

      </main>
    </DarkShell>
  );
}
