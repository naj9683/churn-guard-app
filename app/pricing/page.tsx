'use client';

import { useState } from 'react';
import Link from 'next/link';
import DarkShell from '@/app/components/ui/DarkShell';
import { SUCCESS } from '@/app/lib/design-tokens';

const DK_BG        = '#020617';
const DK_CARD      = '#0f172a';
const DK_TEXT      = '#f1f5f9';
const DK_MUTED     = '#94a3b8';
const DK_FAINT     = '#64748b';
const DK_BORDER    = 'rgba(51,65,85,0.5)';
const DK_BORDER_MD = 'rgba(71,85,105,0.6)';
const DK_ACCENT    = '#6366f1';
const DK_ACCENT_BG = 'rgba(99,102,241,0.12)';
const DK_ACCENT_BR = 'rgba(99,102,241,0.25)';
const DK_SUCCESS   = '#22c55e';
const DK_SUCC_BG   = 'rgba(34,197,94,0.1)';
const DK_SUCC_BR   = 'rgba(34,197,94,0.25)';

interface PricingTier {
  name: string;
  mrrRange: string;
  price: number;
  maxMrr: number;
  features: string[];
  cta: string;
  popular?: boolean;
  freeTrial?: boolean;
  trialNote?: string;
  priceNote?: string;
  roiText: string;
}

const tiers: PricingTier[] = [
  {
    name: 'Free Trial',
    mrrRange: '30 days full access',
    price: -1,
    maxMrr: 0,
    freeTrial: true,
    roiText: 'No credit card required',
    priceNote: 'Then $79/mo (Seed plan)',
    features: [
      '100 customers tracked',
      'Basic automation rules',
      'Slack alerts',
      'Email sequences',
      'CRM sync',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Seed',
    mrrRange: '$0 – $50K',
    price: 79,
    maxMrr: 50000,
    roiText: 'Protect $50K MRR for 0.16%',
    trialNote: 'Or start with 30-day free trial',
    features: [
      'Revenue at Risk (RaR) Dashboard',
      'Up to 100 customers tracked',
      'Slack risk alerts (3 channels)',
      'Basic playbooks (3 active)',
      'Email support',
      '7-day data retention',
    ],
    cta: 'Start Protecting Revenue',
  },
  {
    name: 'Growth',
    mrrRange: '$50K – $200K',
    price: 149,
    maxMrr: 200000,
    roiText: 'Protect $200K MRR for 0.07%',
    popular: true,
    features: [
      'Everything in Seed, plus:',
      'Unlimited customers tracked',
      'Slack command center (unlimited)',
      'Advanced playbooks (10 active)',
      'VIP customer alerts (>$500 MRR)',
      '30-day risk forecasting',
      'Priority support',
      '90-day data retention',
    ],
    cta: 'Most Popular – Get Started',
  },
  {
    name: 'Scale',
    mrrRange: '$200K – $1M',
    price: 299,
    maxMrr: 1000000,
    roiText: 'Protect $1M MRR for 0.03%',
    features: [
      'Everything in Growth, plus:',
      'Unlimited active playbooks',
      'Custom risk scoring models',
      'Advanced analytics & cohorts',
      'Team collaboration (10 seats)',
      'API access',
      'Webhook integrations',
      '1-year data retention',
    ],
    cta: 'Scale with Confidence',
  },
  {
    name: 'Enterprise',
    mrrRange: '$1M+',
    price: 0,
    maxMrr: Infinity,
    roiText: 'Custom ROI optimization',
    features: [
      'Everything in Scale, plus:',
      'White-glove onboarding',
      'Custom SLA guarantees',
      'Dedicated success manager',
      'SSO & advanced security',
      'Custom contracts',
      'Unlimited seats',
      'Lifetime data retention',
    ],
    cta: 'Contact Sales',
  },
];

export default function PricingPage() {
  const [hoveredTier,  setHoveredTier]  = useState<string | null>(null);
  const [selectedMrr, setSelectedMrr]  = useState(2000);

  const calculateSavings = (mrr: number) => (mrr * 12).toLocaleString();

  const handleSubscribe = (tierName: string) => {
    if (tierName === 'Enterprise') {
      window.location.href = 'mailto:admin@churnguardapp.com?subject=Enterprise Inquiry';
      return;
    }
    const slug = tierName === 'Free Trial' ? 'trial' : tierName.toLowerCase();
    window.location.href = `/signup?plan=${slug}`;
  };

  const checkColor = (tier: PricingTier) =>
    tier.freeTrial ? DK_SUCCESS : DK_ACCENT;

  return (
    <DarkShell>

      {/* ── Hero ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '999px', background: DK_ACCENT_BG, border: `1px solid ${DK_ACCENT_BR}`, color: DK_ACCENT, fontSize: '13px', fontWeight: 500, marginBottom: '24px' }}>
          Guaranteed ROI — save 10× your subscription or money back
        </div>

        <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)', fontWeight: 500, color: DK_TEXT, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Protect your revenue. Not your wallet.
        </h1>

        <p style={{ color: DK_MUTED, fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          Flat-rate pricing based on your MRR bands. No surprise bills.
          No meter anxiety. Just predictable protection.
        </p>

        {/* ROI Calculator */}
        <div style={{ background: DK_CARD, border: `1px solid ${DK_BORDER_MD}`, borderRadius: '12px', padding: '24px', maxWidth: '500px', margin: '0 auto 64px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ color: DK_MUTED, fontSize: '14px' }}>If we prevent just 1 churn of</span>
          <select
            value={selectedMrr}
            onChange={e => setSelectedMrr(Number(e.target.value))}
            style={{ background: DK_BG, border: `1px solid ${DK_BORDER_MD}`, color: DK_SUCCESS, padding: '8px 14px', borderRadius: '6px', fontWeight: 500, fontSize: '14px', cursor: 'pointer' }}
          >
            <option value={500}>$500/mo customer</option>
            <option value={1000}>$1,000/mo customer</option>
            <option value={2000}>$2,000/mo customer</option>
            <option value={5000}>$5,000/mo customer</option>
          </select>
          <span style={{ color: DK_MUTED, fontSize: '14px' }}>you save</span>
          <span style={{ color: DK_SUCCESS, fontWeight: 500, fontSize: '16px' }}>
            ${calculateSavings(selectedMrr)}/yr
          </span>
        </div>
      </div>

      {/* ── Pricing grid ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 64px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {tiers.map(tier => (
          <div
            key={tier.name}
            onMouseEnter={() => setHoveredTier(tier.name)}
            onMouseLeave={() => setHoveredTier(null)}
            style={{
              background: DK_CARD,
              borderRadius: '12px',
              border: tier.freeTrial
                ? `2px solid ${DK_SUCCESS}`
                : tier.popular
                  ? `2px solid ${DK_ACCENT}`
                  : `1px solid ${DK_BORDER}`,
              padding: '28px',
              position: 'relative',
              transform: hoveredTier === tier.name ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'transform 200ms ease',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {tier.freeTrial && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: DK_SUCCESS, color: '#fff', padding: '3px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                No credit card
              </div>
            )}
            {tier.popular && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: DK_ACCENT, color: '#fff', padding: '3px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                Most popular
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: tier.freeTrial ? DK_SUCCESS : tier.popular ? DK_ACCENT : DK_TEXT, marginBottom: '4px' }}>
                {tier.name}
              </h3>
              <p style={{ color: DK_FAINT, fontSize: '13px' }}>
                {tier.freeTrial ? tier.mrrRange : `For MRR ${tier.mrrRange}`}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              {tier.freeTrial ? (
                <>
                  <span style={{ fontSize: '28px', fontWeight: 500, color: DK_TEXT }}>$0</span>
                  <span style={{ color: DK_FAINT, fontSize: '13px', marginLeft: '4px' }}>/30 days</span>
                  {tier.priceNote && (
                    <p style={{ color: DK_FAINT, fontSize: '12px', margin: '6px 0 0' }}>{tier.priceNote}</p>
                  )}
                </>
              ) : tier.price > 0 ? (
                <>
                  <span style={{ fontSize: '28px', fontWeight: 500, color: DK_TEXT }}>${tier.price}</span>
                  <span style={{ color: DK_FAINT, fontSize: '13px', marginLeft: '4px' }}>/month</span>
                  {tier.trialNote && (
                    <p style={{ fontSize: '12px', margin: '6px 0 0' }}>
                      <Link href="/signup?plan=trial" style={{ color: DK_SUCCESS, textDecoration: 'none' }}>
                        {tier.trialNote}
                      </Link>
                    </p>
                  )}
                </>
              ) : (
                <span style={{ fontSize: '22px', fontWeight: 500, color: DK_MUTED }}>Custom</span>
              )}

              <div style={{ marginTop: '10px', display: 'inline-block', background: tier.freeTrial ? DK_SUCC_BG : DK_ACCENT_BG, color: tier.freeTrial ? DK_SUCCESS : DK_ACCENT, padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, border: `1px solid ${tier.freeTrial ? DK_SUCC_BR : DK_ACCENT_BR}` }}>
                {tier.roiText}
              </div>
            </div>

            <button
              onClick={() => handleSubscribe(tier.name)}
              style={{
                width: '100%',
                padding: '11px',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: 500,
                background: tier.freeTrial ? DK_SUCCESS : tier.popular ? DK_ACCENT : 'transparent',
                color: (tier.freeTrial || tier.popular) ? '#fff' : DK_TEXT,
                border: (tier.freeTrial || tier.popular) ? 'none' : `1px solid ${DK_BORDER_MD}`,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'opacity 150ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {tier.cta}
            </button>

            <div style={{ flex: 1 }}>
              <p style={{ color: DK_FAINT, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: 500 }}>
                Features included:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {tier.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: feature.startsWith('Everything') ? DK_FAINT : DK_MUTED }}>
                    <svg width="14" height="14" fill="none" stroke={checkColor(tier)} strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, marginTop: '1px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* ── Guarantee ── */}
      <div style={{ maxWidth: '800px', margin: '0 auto 64px', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: DK_ACCENT_BG, border: `1px solid ${DK_ACCENT_BR}`, borderRadius: '12px', padding: '36px 32px' }}>
          <h3 style={{ marginBottom: '12px', color: DK_TEXT, fontSize: '18px', fontWeight: 500 }}>
            The ChurnGuard Guarantee
          </h3>
          <p style={{ color: DK_MUTED, fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
            We guarantee you'll save <strong style={{ color: DK_TEXT }}>10× your subscription</strong> in prevented churn,
            or we'll refund every penny. No questions asked.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '13px', color: DK_MUTED }}>
            {['30-day free trial', 'Cancel anytime', 'No contracts', 'No setup fees'].map(item => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="13" height="13" fill="none" stroke={DK_SUCCESS} strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ teaser ── */}
      <div style={{ maxWidth: '600px', margin: '0 auto 64px', padding: '0 24px', textAlign: 'center', fontSize: '14px', color: DK_FAINT }}>
        <p>Questions? <a href="mailto:admin@churnguardapp.com" style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Contact our team</a></p>
      </div>

    </DarkShell>
  );
}
