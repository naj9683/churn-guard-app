'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PricingTier {
  name: string;
  mrrRange: string;
  price: number;
  maxMrr: number;
  features: string[];
  cta: string;
  popular?: boolean;
  roiText: string;
}

const tiers: PricingTier[] = [
  {
    name: 'Seed',
    mrrRange: '$0 – $50K',
    price: 79,
    maxMrr: 50000,
    roiText: 'Protect $50K MRR for 0.16%',
    features: [
      'Revenue at Risk (RaR) Dashboard',
      'Up to 100 customers tracked',
      'Slack risk alerts (3 channels)',
      'Basic playbooks (3 active)',
      'Email support',
      '7-day data retention'
    ],
    cta: 'Start Protecting Revenue'
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
      '90-day data retention'
    ],
    cta: 'Most Popular – Get Started'
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
      '1-year data retention'
    ],
    cta: 'Scale with Confidence'
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
      'Lifetime data retention'
    ],
    cta: 'Contact Sales'
  }
];

export default function PricingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const handleSubscribe = async (tierName: string, price: number) => {
    if (!user) {
      window.location.href = '/sign-in';
      return;
    }

    if (tierName === 'Enterprise') {
      window.location.href = 'mailto:sales@churnguard.io?subject=Enterprise Inquiry';
      return;
    }

    setLoading(tierName);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tier: tierName,
          price: price 
        }),
      });

      if (!response.ok) throw new Error('Checkout failed');

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui' }}>
      {/* Header */}
      <header style={{
        background: '#1e293b', 
        borderBottom: '1px solid #334155', 
        padding: '1.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: 'white', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.75rem' }}>🛡️</span> ChurnGuard
          </Link>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '4rem 2rem 2rem',
        textAlign: 'center' 
      }}>
        <div style={{ 
          display: 'inline-block', 
          background: 'rgba(99, 102, 241, 0.1)', 
          color: '#818cf8',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          💰 Guaranteed ROI: Save 10× your subscription or money back
        </div>
        
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '800', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.1'
        }}>
          Protect Your Revenue.<br/>Not Your Wallet.
        </h1>
        
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '1.25rem', 
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.6'
        }}>
          Flat-rate pricing based on your MRR bands. No surprise bills. 
          No meter anxiety. Just predictable protection.
        </p>

        {/* ROI Calculator Mini */}
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '1rem',
          padding: '1.5rem',
          maxWidth: '500px',
          margin: '0 auto 4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ color: '#94a3b8' }}>If we prevent just 1 churn of</span>
          <select style={{
            background: '#0f172a',
            border: '1px solid #334155',
            color: '#10b981',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            <option>$500/mo customer</option>
            <option>$1,000/mo customer</option>
            <option>$2,000/mo customer</option>
          </select>
          <span style={{ color: '#94a3b8' }}>you save</span>
          <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.25rem' }}>$6,000/yr</span>
        </div>
      </div>

      {/* Pricing Grid */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 2rem 4rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {tiers.map((tier) => (
          <div
            key={tier.name}
            onMouseEnter={() => setHoveredTier(tier.name)}
            onMouseLeave={() => setHoveredTier(null)}
            style={{
              background: tier.popular ? '#1e293b' : 'rgba(30, 41, 59, 0.5)',
              borderRadius: '1rem',
              border: tier.popular ? '2px solid #6366f1' : '1px solid #334155',
              padding: '2rem',
              position: 'relative',
              transform: hoveredTier === tier.name ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.3s ease',
              boxShadow: tier.popular ? '0 20px 25px -5px rgba(99, 102, 241, 0.2)' : 'none',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {tier.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#6366f1',
                color: 'white',
                padding: '0.25rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Most Popular
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem',
                color: tier.popular ? '#818cf8' : 'white'
              }}>
                {tier.name}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                For MRR {tier.mrrRange}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              {tier.price > 0 ? (
                <>
                  <span style={{ fontSize: '3rem', fontWeight: '800' }}>${tier.price}</span>
                  <span style={{ color: '#94a3b8', fontSize: '1rem' }}>/month</span>
                </>
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: '700', color: '#94a3b8' }}>Custom</span>
              )}
              
              <div style={{ 
                marginTop: '0.75rem',
                display: 'inline-block',
                background: tier.popular ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                color: tier.popular ? '#10b981' : '#818cf8',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {tier.roiText}
              </div>
            </div>

            <button
              onClick={() => handleSubscribe(tier.name, tier.price)}
              disabled={loading === tier.name}
              style={{
                width: '100%',
                padding: '0.875rem',
                marginBottom: '2rem',
                fontSize: '1rem',
                fontWeight: '600',
                background: tier.popular ? '#6366f1' : (tier.name === 'Enterprise' ? '#334155' : 'transparent'),
                color: 'white',
                border: tier.popular ? 'none' : '2px solid #334155',
                borderRadius: '0.5rem',
                cursor: loading === tier.name ? 'not-allowed' : 'pointer',
                opacity: loading === tier.name ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
            >
              {loading === tier.name ? 'Processing...' : tier.cta}
            </button>

            <div style={{ flex: 1 }}>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                Features included:
              </p>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {tier.features.map((feature, idx) => (
                  <li key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: feature.startsWith('Everything') ? '#64748b' : '#e2e8f0'
                  }}>
                    <span style={{ 
                      color: tier.popular ? '#10b981' : '#6366f1',
                      fontSize: '1rem',
                      lineHeight: '1.25'
                    }}>
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Trust/Guarantee Section */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto 4rem', 
        padding: '0 2rem',
        textAlign: 'center' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
          border: '1px solid #334155',
          borderRadius: '1rem',
          padding: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>
            🛡️ The ChurnGuard Guarantee
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            "We guarantee you'll save <strong style={{ color: 'white' }}>10× your subscription</strong> in prevented churn, 
            or we'll refund every penny. No questions asked."
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '2rem',
            flexWrap: 'wrap',
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            <span>✓ Cancel anytime</span>
            <span>✓ No setup fees</span>
            <span>✓ 14-day free trial</span>
          </div>
        </div>
      </div>

      {/* FAQ Teaser */}
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto 4rem', 
        padding: '0 2rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.875rem'
      }}>
        <p>Questions? <Link href="/contact" style={{ color: '#818cf8', textDecoration: 'none' }}>Contact our team</Link> or check our <Link href="/docs" style={{ color: '#818cf8', textDecoration: 'none' }}>documentation</Link>.</p>
      </div>
    </div>
  );
}
