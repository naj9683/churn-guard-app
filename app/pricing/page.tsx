'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicShell from '@/app/components/ui/PublicShell';
import {
  ACCENT, ACCENT_BG, ACCENT_BORDER, BORDER, BORDER_MED,
  TEXT, MUTED, FAINT, WHITE, PAGE_BG,
  SUCCESS, SUCCESS_BG, SUCCESS_BORD,
} from '@/app/lib/design-tokens';

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
    tier.freeTrial ? SUCCESS : tier.popular ? ACCENT : ACCENT;

  return (
    <PublicShell activeHref="/pricing">

      {/* ── Hero ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '999px', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT, fontSize: '13px', fontWeight: 500, marginBottom: '24px' }}>
          Guaranteed ROI — save 10× your subscription or money back
        </div>

        <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)', fontWeight: 500, color: TEXT, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Protect your revenue. Not your wallet.
        </h1>

        <p style={{ color: MUTED, fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          Flat-rate pricing based on your MRR bands. No surprise bills.
          No meter anxiety. Just predictable protection.
        </p>

        {/* ROI Calculator */}
        <div style={{ background: WHITE, border: `1px solid ${BORDER_MED}`, borderRadius: '12px', padding: '24px', maxWidth: '500px', margin: '0 auto 64px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ color: MUTED, fontSize: '14px' }}>If we prevent just 1 churn of</span>
          <select
            value={selectedMrr}
            onChange={e => setSelectedMrr(Number(e.target.value))}
            style={{ background: PAGE_BG, border: `1px solid ${BORDER_MED}`, color: SUCCESS, padding: '8px 14px', borderRadius: '6px', fontWeight: 500, fontSize: '14px', cursor: 'pointer' }}
          >
            <option value={500}>$500/mo customer</option>
            <option value={1000}>$1,000/mo customer</option>
            <option value={2000}>$2,000/mo customer</option>
            <option value={5000}>$5,000/mo customer</option>
          </select>
          <span style={{ color: MUTED, fontSize: '14px' }}>you save</span>
          <span style={{ color: SUCCESS, fontWeight: 500, fontSize: '16px' }}>
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
              background: WHITE,
              borderRadius: '12px',
              border: tier.freeTrial
                ? `2px solid ${SUCCESS}`
                : tier.popular
                  ? `2px solid ${ACCENT}`
                  : `1px solid ${BORDER}`,
              padding: '28px',
              position: 'relative',
              transform: hoveredTier === tier.name ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'transform 200ms ease',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {tier.freeTrial && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: SUCCESS, color: WHITE, padding: '3px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                No credit card
              </div>
            )}
            {tier.popular && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: ACCENT, color: WHITE, padding: '3px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                Most popular
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: tier.freeTrial ? SUCCESS : tier.popular ? ACCENT : TEXT, marginBottom: '4px' }}>
                {tier.name}
              </h3>
              <p style={{ color: FAINT, fontSize: '13px' }}>
                {tier.freeTrial ? tier.mrrRange : `For MRR ${tier.mrrRange}`}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              {tier.freeTrial ? (
                <>
                  <span style={{ fontSize: '28px', fontWeight: 500, color: TEXT }}>$0</span>
                  <span style={{ color: FAINT, fontSize: '13px', marginLeft: '4px' }}>/30 days</span>
                  {tier.priceNote && (
                    <p style={{ color: FAINT, fontSize: '12px', margin: '6px 0 0' }}>{tier.priceNote}</p>
                  )}
                </>
              ) : tier.price > 0 ? (
                <>
                  <span style={{ fontSize: '28px', fontWeight: 500, color: TEXT }}>${tier.price}</span>
                  <span style={{ color: FAINT, fontSize: '13px', marginLeft: '4px' }}>/month</span>
                  {tier.trialNote && (
                    <p style={{ fontSize: '12px', margin: '6px 0 0' }}>
                      <Link href="/signup?plan=trial" style={{ color: SUCCESS, textDecoration: 'none' }}>
                        {tier.trialNote}
                      </Link>
                    </p>
                  )}
                </>
              ) : (
                <span style={{ fontSize: '22px', fontWeight: 500, color: MUTED }}>Custom</span>
              )}

              <div style={{ marginTop: '10px', display: 'inline-block', background: tier.freeTrial ? SUCCESS_BG : ACCENT_BG, color: tier.freeTrial ? SUCCESS : ACCENT, padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, border: `1px solid ${tier.freeTrial ? SUCCESS_BORD : ACCENT_BORDER}` }}>
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
                background: tier.freeTrial ? SUCCESS : tier.popular ? ACCENT : 'transparent',
                color: (tier.freeTrial || tier.popular) ? WHITE : TEXT,
                border: (tier.freeTrial || tier.popular) ? 'none' : `1px solid ${BORDER_MED}`,
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
              <p style={{ color: FAINT, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: 500 }}>
                Features included:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {tier.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: feature.startsWith('Everything') ? FAINT : MUTED }}>
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
        <div style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, borderRadius: '12px', padding: '36px 32px' }}>
          <h3 style={{ marginBottom: '12px', color: TEXT, fontSize: '18px', fontWeight: 500 }}>
            The ChurnGuard Guarantee
          </h3>
          <p style={{ color: MUTED, fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
            We guarantee you'll save <strong style={{ color: TEXT }}>10× your subscription</strong> in prevented churn,
            or we'll refund every penny. No questions asked.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '13px', color: MUTED }}>
            {['30-day free trial', 'Cancel anytime', 'No contracts', 'No setup fees'].map(item => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="13" height="13" fill="none" stroke={SUCCESS} strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ teaser ── */}
      <div style={{ maxWidth: '600px', margin: '0 auto 64px', padding: '0 24px', textAlign: 'center', fontSize: '14px', color: FAINT }}>
        <p>Questions? <a href="mailto:admin@churnguardapp.com" style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Contact our team</a></p>
      </div>

    </PublicShell>
  );
}
