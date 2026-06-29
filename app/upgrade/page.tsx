'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PLANS = [
  {
    name: 'Seed',
    price: '$79',
    mrr: 'Up to $50K MRR',
    features: [
      'AI churn prediction',
      'Email & Slack alerts',
      'Playbook automation',
      'Stripe integration',
      'Dashboard & analytics',
    ],
    highlighted: false,
    cta: 'Get Seed',
  },
  {
    name: 'Growth',
    price: '$149',
    mrr: '$50K – $200K MRR',
    features: [
      'Everything in Seed',
      'SMS campaigns (Twilio)',
      'Advanced automation rules',
      'CRM sync (HubSpot)',
      'Priority email support',
    ],
    highlighted: true,
    cta: 'Get Growth',
  },
  {
    name: 'Scale',
    price: '$299',
    mrr: '$200K – $1M MRR',
    features: [
      'Everything in Growth',
      'Unlimited team members',
      'Custom API webhooks',
      'Intervention tracking',
      'Dedicated CSM',
    ],
    highlighted: false,
    cta: 'Get Scale',
  },
];

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleUpgrade(tier: string) {
    setLoading(tier);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? 'Failed to create checkout session');
      }
      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({ sessionId });
      if (result?.error) throw new Error(result.error.message);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #080e1c 0%, #0d1829 60%, #0b1524 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>

      {/* Logo */}
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
        }}>
          🛡️
        </div>
        <span style={{ color: '#fff', fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em' }}>
          ChurnGuard
        </span>
      </div>

      {/* Trial expired badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        marginBottom: '24px',
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        padding: '6px 16px',
        borderRadius: '999px',
      }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
        <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600' }}>Free trial ended</span>
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: 'clamp(28px, 5vw, 44px)',
        fontWeight: '800',
        color: '#fff',
        letterSpacing: '-0.03em',
        textAlign: 'center',
        margin: '0 0 12px',
        maxWidth: '640px',
      }}>
        Your free trial has ended
      </h1>
      <p style={{
        color: 'rgba(255,255,255,0.45)',
        fontSize: '17px',
        textAlign: 'center',
        maxWidth: '480px',
        margin: '0 0 8px',
        lineHeight: '1.6',
      }}>
        Upgrade to keep protecting your revenue and accessing your customer data.
      </p>
      <p style={{
        color: 'rgba(255,255,255,0.25)',
        fontSize: '13px',
        textAlign: 'center',
        marginBottom: '48px',
      }}>
        Your data is safe and will be restored immediately after upgrading.
      </p>

      {/* Pricing cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        width: '100%',
        maxWidth: '860px',
        marginBottom: '32px',
      }}>
        {PLANS.map(plan => (
          <div key={plan.name} style={{
            position: 'relative',
            background: plan.highlighted
              ? 'linear-gradient(160deg, rgba(6,182,212,0.09) 0%, rgba(99,102,241,0.06) 100%)'
              : 'rgba(255,255,255,0.03)',
            border: `1px solid ${plan.highlighted ? 'rgba(6,182,212,0.35)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: '16px',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {plan.highlighted && (
              <div style={{
                position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #06b6d4, #6366f1)',
                color: '#fff', fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em',
                padding: '4px 16px', borderRadius: '999px', textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                Most Popular
              </div>
            )}

            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 0 3px' }}>
              {plan.name}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: '0 0 18px' }}>
              {plan.mrr}
            </p>

            <div style={{ marginBottom: '22px' }}>
              <span style={{ color: '#fff', fontSize: '34px', fontWeight: '800', letterSpacing: '-0.02em' }}>
                {plan.price}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginLeft: '4px' }}>/mo</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {plan.features.map(f => (
                <li key={f} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#10b981', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.name)}
              disabled={loading !== null}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: plan.highlighted
                  ? 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)'
                  : 'rgba(255,255,255,0.07)',
                color: '#fff',
                border: plan.highlighted ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                opacity: loading !== null && loading !== plan.name ? 0.5 : 1,
                transition: 'opacity 0.15s, transform 0.1s',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              {loading === plan.name ? 'Opening checkout…' : plan.cta + ' →'}
            </button>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          maxWidth: '460px', width: '100%', marginBottom: '20px',
          padding: '12px 16px',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '8px',
          color: '#ef4444', fontSize: '13px', textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* Footer links */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <a
          href="mailto:admin@churnguardapp.com"
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', textDecoration: 'none' }}
        >
          Need help or have an edge case? Contact support →
        </a>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', textDecoration: 'none' }}>
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
