import Link from 'next/link';

export default function Home() {
  return (
    <div style={{minHeight: '100vh', background: '#0a0a1a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Navigation */}
      <nav style={{padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem'}}>
          <div style={{width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
          ChurnGuard
        </div>
        <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
          <Link href="#features" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem'}}>Features</Link>
          <Link href="#pricing" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem'}}>Pricing</Link>
          <Link href="/dashboard" style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontSize: '0.875rem'}}>
            Get Early Access
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{padding: '6rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto'}}>
        <h1 style={{fontSize: '3.5rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.1'}}>
          Stop Losing Customers to Churn
        </h1>
        <p style={{fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.6'}}>
          AI-powered churn prediction and automated retention playbooks. 
          Identify at-risk customers before they cancel and save your revenue.
        </p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
          <Link href="/dashboard" style={{
            padding: '1rem 2rem', 
            background: '#6366f1', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '0.5rem',
            fontWeight: '600'
          }}>
            Start Free Trial
          </Link>
          <a href="#pricing" style={{
            padding: '1rem 2rem', 
            background: 'transparent', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '0.5rem',
            border: '1px solid #334155',
            fontWeight: '600'
          }}>
            View Pricing
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{padding: '6rem 2rem', background: '#0f172a'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          <h2 style={{fontSize: '2rem', textAlign: 'center', marginBottom: '3rem'}}>Everything you need to reduce churn</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>🔮</div>
              <h3 style={{marginBottom: '0.5rem'}}>Predict Churn</h3>
              <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>AI identifies customers likely to churn before they cancel</p>
            </div>
            <div style={{padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⚡</div>
              <h3 style={{marginBottom: '0.5rem'}}>Automated Playbooks</h3>
              <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Run retention workflows automatically when risk is detected</p>
            </div>
            <div style={{padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>💰</div>
              <h3 style={{marginBottom: '0.5rem'}}>Save Revenue</h3>
              <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Track revenue saved and ROI from retained customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{padding: '6rem 2rem', background: '#0a0a1a'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>Simple, usage-based pricing</h2>
          <p style={{color: '#64748b', marginBottom: '3rem'}}>Pay based on your MRR. Start small, scale as you grow.</p>
          
          {/* Pricing Card - Clickable */}
          <Link href="/pricing" style={{textDecoration: 'none', color: 'inherit', display: 'block'}}>
            <div style={{background: '#1e293b', borderRadius: '1rem', padding: '3rem', border: '1px solid #334155', textAlign: 'left', cursor: 'pointer', transition: 'transform 0.2s'}}>
              <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <div style={{fontSize: '3.5rem', fontWeight: '700', color: 'white'}}>$29</div>
                <div style={{color: '#64748b'}}>/month minimum</div>
                <div style={{color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem'}}>Then $0.50 per $1,000 MRR above $50K</div>
              </div>

              {/* Examples */}
              <div style={{background: '#0f172a', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '2rem'}}>
                <div style={{color: '#64748b', fontSize: '0.75rem', fontWeight: '600', marginBottom: '1rem'}}>EXAMPLES:</div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem'}}>
                  <span style={{color: '#94a3b8'}}>$10K MRR</span>
                  <span style={{color: '#22c55e', fontWeight: '600'}}>$29/mo</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem'}}>
                  <span style={{color: '#94a3b8'}}>$50K MRR</span>
                  <span style={{color: '#22c55e', fontWeight: '600'}}>$29/mo</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem'}}>
                  <span style={{color: '#94a3b8'}}>$100K MRR</span>
                  <span style={{color: '#22c55e', fontWeight: '600'}}>$54/mo</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#94a3b8'}}>$500K MRR</span>
                  <span style={{color: '#22c55e', fontWeight: '600'}}>$254/mo</span>
                </div>
              </div>

              {/* Features */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white'}}>
                  <span style={{color: '#6366f1'}}>✓</span>
                  <span>All 3 retention playbooks included</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white'}}>
                  <span style={{color: '#6366f1'}}>✓</span>
                  <span>Unlimited workflow runs</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white'}}>
                  <span style={{color: '#6366f1'}}>✓</span>
                  <span>Stripe integration</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white'}}>
                  <span style={{color: '#6366f1'}}>✓</span>
                  <span>Slack & Email alerts</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white'}}>
                  <span style={{color: '#6366f1'}}>✓</span>
                  <span>Custom playbook builder</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white'}}>
                  <span style={{color: '#6366f1'}}>✓</span>
                  <span>Revenue saved dashboard</span>
                </div>
              </div>

              {/* CTA */}
              <div style={{
                width: '100%',
                padding: '1rem',
                background: '#6366f1',
                color: 'white',
                textAlign: 'center',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                Get Early Access →
              </div>
              
              <div style={{textAlign: 'center', marginTop: '1rem', color: '#64748b', fontSize: '0.75rem'}}>
                14-day free trial • Cancel anytime • No setup fees
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{padding: '3rem 2rem', borderTop: '1px solid #1e293b', textAlign: 'center', color: '#64748b'}}>
        <p>© 2024 ChurnGuard. All rights reserved.</p>
      </footer>
    </div>
  );
}
