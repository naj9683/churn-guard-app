'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      alert('Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Header with Back Arrow */}
      <header style={{background: '#1e293b', borderBottom: '1px solid #334155', padding: '1.5rem 2rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={{margin: 0, fontSize: '1.5rem'}}>Pricing</h1>
          <a href="/" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem'}}>← Back to Home</a>
        </div>
      </header>

      <main style={{maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '4rem'}}>
          <h2 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>Simple, usage-based pricing</h2>
          <p style={{color: '#94a3b8', fontSize: '1.125rem'}}>Pay only for what you use. No hidden fees.</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto'}}>
          {/* Free Plan */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '2rem'}}>
            <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1.25rem'}}>Free</h3>
            <div style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem'}}>$0</div>
            <ul style={{listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#94a3b8'}}>
              <li style={{marginBottom: '0.5rem'}}>✓ Up to 100 customers</li>
              <li style={{marginBottom: '0.5rem'}}>✓ 3 playbooks</li>
              <li style={{marginBottom: '0.5rem'}}>✓ Basic analytics</li>
            </ul>
            <button disabled style={{width: '100%', padding: '0.75rem', background: '#334155', color: 'white', border: 'none', borderRadius: '0.5rem', opacity: 0.5}}>
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '2px solid #8b5cf6', padding: '2rem', position: 'relative'}}>
            <div style={{position: 'absolute', top: '-12px', right: '20px', background: '#8b5cf6', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600'}}>
              POPULAR
            </div>
            <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1.25rem'}}>Pro</h3>
            <div style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem'}}>$8</div>
            <div style={{color: '#94a3b8', marginBottom: '1rem'}}>/month + $0.10 per customer</div>
            <ul style={{listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#94a3b8'}}>
              <li style={{marginBottom: '0.5rem'}}>✓ Unlimited customers</li>
              <li style={{marginBottom: '0.5rem'}}>✓ Unlimited playbooks</li>
              <li style={{marginBottom: '0.5rem'}}>✓ Advanced analytics</li>
              <li style={{marginBottom: '0.5rem'}}>✓ Slack alerts</li>
            </ul>
            <button 
              onClick={() => handleSubscribe('price_pro')}
              disabled={loading === 'price_pro'}
              style={{width: '100%', padding: '0.75rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600'}}
            >
              {loading === 'price_pro' ? 'Loading...' : 'Subscribe'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '2rem'}}>
            <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1.25rem'}}>Enterprise</h3>
            <div style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem'}}>$29</div>
            <div style={{color: '#94a3b8', marginBottom: '1rem'}}>/month + $0.05 per customer</div>
            <ul style={{listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#94a3b8'}}>
              <li style={{marginBottom: '0.5rem'}}>✓ Everything in Pro</li>
              <li style={{marginBottom: '0.5rem'}}>✓ Priority support</li>
              <li style={{marginBottom: '0.5rem'}}>✓ Custom integrations</li>
              <li style={{marginBottom: '0.5rem'}}>✓ Dedicated account manager</li>
            </ul>
            <button 
              onClick={() => handleSubscribe('price_enterprise')}
              disabled={loading === 'price_enterprise'}
              style={{width: '100%', padding: '0.75rem', background: '#1e293b', color: 'white', border: '1px solid #8b5cf6', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600'}}
            >
              {loading === 'price_enterprise' ? 'Loading...' : 'Subscribe'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}