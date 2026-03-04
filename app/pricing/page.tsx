
      cd ~/churn-guard/churn-guard-app && cat > app/pricing/page.tsx << 'ENDOFFILE'
'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [mrr, setMrr] = useState(50000);

  const calculatePrice = (mrrValue: number) => {
    if (mrrValue <= 50000) return 29;
    const excess = mrrValue - 50000;
    const units = Math.ceil(excess / 1000);
    return 29 + (units * 0.50);
  };

  const price = calculatePrice(mrr);

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/sign-in';
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mrr: mrr 
        }),
      });

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', padding: '4rem 2rem'}}>
      <div style={{maxWidth: '600px', margin: '0 auto', textAlign: 'center'}}>
        <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>Simple, Scalable Pricing</h1>
        <p style={{color: '#94a3b8', fontSize: '1.25rem', marginBottom: '3rem'}}>
          Pay based on your MRR. Start small, scale as you grow.
        </p>

        <div style={{background: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '1px solid #334155'}}>
          <div style={{marginBottom: '2rem'}}>
            <span style={{fontSize: '4rem', fontWeight: 'bold'}}>${price.toFixed(0)}</span>
            <span style={{color: '#94a3b8', fontSize: '1.25rem'}}>/month</span>
            <p style={{color: '#94a3b8', marginTop: '0.5rem'}}>
              $29 base + $0.50 per $1K MRR above $50K
            </p>
          </div>

          {/* MRR Slider */}
          <div style={{marginBottom: '3rem', textAlign: 'left'}}>
            <label style={{display: 'block', marginBottom: '1rem', color: '#94a3b8'}}>
              Your Monthly MRR: <strong style={{color: 'white'}}>${mrr.toLocaleString()}</strong>
            </label>
            <input
              type="range"
              min="10000"
              max="500000"
              step="1000"
              value={mrr}
              onChange={(e) => setMrr(parseInt(e.target.value))}
              style={{width: '100%', marginBottom: '1rem'}}
            />
            <div style={{display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.875rem'}}>
              <span>$10K</span>
              <span>$500K+</span>
            </div>
          </div>

          {/* Examples */}
          <div style={{background: '#0f172a', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'left'}}>
            <h3 style={{margin: '0 0 1rem', color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase'}}>Examples:</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#94a3b8'}}>$10K MRR</span>
                <span style={{color: '#22c55e', fontWeight: '600'}}>$29/mo</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#94a3b8'}}>$50K MRR</span>
                <span style={{color: '#22c55e', fontWeight: '600'}}>$29/mo</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#94a3b8'}}>$100K MRR</span>
                <span style={{color: '#22c55e', fontWeight: '600'}}>$54/mo</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#94a3b8'}}>$500K MRR</span>
                <span style={{color: '#22c55e', fontWeight: '600'}}>$254/mo</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <ul style={{listStyle: 'none', padding: 0, margin: '0 0 2rem', textAlign: 'left'}}>
            {[
              'All 3 retention playbooks included',
              'Unlimited workflow runs',
              'Stripe integration',
              'Slack & Email alerts',
              'Custom playbook builder',
              'Revenue saved dashboard'
            ].map((feature) => (
              <li key={feature} style={{padding: '0.75rem 0', display: 'flex', alignItems: 'center'}}>
                <span style={{color: '#8b5cf6', marginRight: '0.75rem', fontSize: '1.25rem'}}>✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              background: loading ? '#475569' : '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Loading...' : user ? 'Get Early Access' : 'Sign Up Now'}
          </button>
          
          <p style={{color: '#64748b', fontSize: '0.875rem', marginTop: '1rem'}}>
            14-day free trial • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
ENDOFFILE     