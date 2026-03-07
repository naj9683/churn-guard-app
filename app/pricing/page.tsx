'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_early_access' }),
      });
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      alert('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#0a0a1a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Header with Logo, Nav, and Back Arrow */}
      <header style={{padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem'}}>
          <div style={{width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
          ChurnGuard
        </div>
        <nav style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
          <Link href="/#features" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem'}}>Features</Link>
          <Link href="/pricing" style={{color: 'white', textDecoration: 'none', fontSize: '0.875rem'}}>Pricing</Link>
          <a href="/" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem'}}>← Back</a>
          <button style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer'}}>
            Get Early Access
          </button>
        </nav>
      </header>

      <main style={{maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem'}}>
        {/* Price Header */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <div style={{fontSize: '4rem', fontWeight: '700', marginBottom: '0.5rem'}}>$29</div>
          <div style={{color: '#64748b', marginBottom: '0.5rem'}}>/month minimum</div>
          <div style={{color: '#64748b'}}>Then $0.50 per $1,000 MRR above $50K</div>
        </div>

        {/* Examples Table */}
        <div style={{background: '#111827', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '3rem'}}>
          <div style={{color: '#64748b', fontSize: '0.75rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '0.05em'}}>EXAMPLES:</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
              <span style={{color: '#94a3b8'}}>$10K MRR</span>
              <span style={{color: '#22c55e', fontWeight: '600'}}>$29/mo</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
              <span style={{color: '#94a3b8'}}>$50K MRR</span>
              <span style={{color: '#22c55e', fontWeight: '600'}}>$29/mo</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
              <span style={{color: '#94a3b8'}}>$100K MRR</span>
              <span style={{color: '#22c55e', fontWeight: '600'}}>$54/mo</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
              <span style={{color: '#94a3b8'}}>$500K MRR</span>
              <span style={{color: '#22c55e', fontWeight: '600'}}>$254/mo</span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span style={{color: '#6366f1'}}>✓</span>
            <span>All 3 retention playbooks included</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span style={{color: '#6366f1'}}>✓</span>
            <span>Unlimited workflow runs</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span style={{color: '#6366f1'}}>✓</span>
            <span>Stripe integration</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span style={{color: '#6366f1'}}>✓</span>
            <span>Slack & Email alerts</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span style={{color: '#6366f1'}}>✓</span>
            <span>Custom playbook builder</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span style={{color: '#6366f1'}}>✓</span>
            <span>Revenue saved dashboard</span>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            marginBottom: '1rem'
          }}
        >
          {loading ? 'Loading...' : 'Get Early Access'}
        </button>

        <div style={{textAlign: 'center', color: '#64748b', fontSize: '0.75rem'}}>
          14-day free trial • Cancel anytime • No setup fees
        </div>
      </main>
    </div>
  );
}