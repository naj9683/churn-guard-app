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
          <Link href="/pricing" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem'}}>Pricing</Link>
          <Link href="/pricing" style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontSize: '0.875rem'}}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{padding: '6rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto'}}>
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
          💰 Guaranteed: Save 10× your subscription or money back
        </div>

        <h1 style={{fontSize: '3.5rem', fontWeight: '700', marginBottom: '1.5rem', lineHeight: '1.1'}}>
          Stop Losing Revenue to Churn
        </h1>
        <p style={{fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.6'}}>
          AI-powered Revenue at Risk (RaR) dashboard. Know exactly how many dollars are at risk,
          not just percentages. Automated playbooks that save customers before they churn.
        </p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
          <Link href="/pricing" style={{
            padding: '1rem 2rem',
            background: '#6366f1',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600'
          }}>
            Get Started
          </Link>
          <Link href="/dashboard" style={{
            padding: '1rem 2rem',
            background: 'transparent',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            border: '1px solid #334155',
            fontWeight: '600'
          }}>
            View Demo
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{padding: '6rem 2rem', background: '#0f172a'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          <h2 style={{fontSize: '2rem', textAlign: 'center', marginBottom: '3rem'}}>Everything you need to reduce churn</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>💰</div>
              <h3 style={{marginBottom: '0.5rem'}}>Revenue at Risk (RaR)</h3>
              <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>See exact dollar amounts at risk, not just percentages. CFO-level financial forecasting.</p>
            </div>
            <div style={{padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⚡</div>
              <h3 style={{marginBottom: '0.5rem'}}>Automated Playbooks</h3>
              <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Run retention workflows automatically when risk is detected</p>
            </div>
            <div style={{padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>📱</div>
              <h3 style={{marginBottom: '0.5rem'}}>Slack Command Center</h3>
              <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Get alerts with action buttons: View Account, Mark Contacted, Create Task</p>
            </div>
            <div style={{padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>🍊</div>
              <h3 style={{marginBottom: '0.5rem'}}>HubSpot & Salesforce Sync</h3>
              <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Bi-directional CRM integration. Sync churn risk scores directly to your CRM.</p>
            </div>
            <div style={{padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>🔮</div>
              <h3 style={{marginBottom: '0.5rem'}}>Predict Churn</h3>
              <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>AI identifies customers likely to churn before they cancel</p>
            </div>
            <div style={{padding: '1.5rem', background: '#1e293b', borderRadius: '0.75rem'}}>
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⭐</div>
              <h3 style={{marginBottom: '0.5rem'}}>VIP Alerts</h3>
              <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Special notifications for high-value customers at risk</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{padding: '6rem 2rem', background: '#0a0a1a'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>Simple, tier-based pricing</h2>
          <p style={{color: '#64748b', marginBottom: '3rem'}}>Flat-rate based on your MRR band. No meter anxiety. Predictable billing.</p>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
            {/* Seed */}
            <div style={{background: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '1px solid #334155', textAlign: 'left'}}>
              <div style={{marginBottom: '1rem'}}>
                <h3 style={{fontSize: '1.25rem', marginBottom: '0.25rem'}}>Seed</h3>
                <p style={{color: '#64748b', fontSize: '0.875rem'}}>Up to $50K MRR</p>
              </div>
              <div style={{marginBottom: '1.5rem'}}>
                <span style={{fontSize: '2.5rem', fontWeight: '700'}}>$79</span>
                <span style={{color: '#64748b'}}>/month</span>
              </div>
              <Link href="/pricing" style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                background: 'transparent',
                color: 'white',
                textAlign: 'center',
                borderRadius: '0.5rem',
                border: '1px solid #334155',
                textDecoration: 'none',
                fontWeight: '600',
                marginBottom: '1.5rem'
              }}>
                Get Started
              </Link>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#94a3b8'}}>
                <div>✓ Up to 100 customers</div>
                <div>✓ Basic playbooks</div>
                <div>✓ Slack alerts</div>
              </div>
            </div>

            {/* Growth */}
            <div style={{background: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '2px solid #6366f1', textAlign: 'left'}}>
              <div style={{marginBottom: '1rem'}}>
                <h3 style={{fontSize: '1.25rem', marginBottom: '0.25rem', color: '#818cf8'}}>Growth</h3>
                <p style={{color: '#64748b', fontSize: '0.875rem'}}>$50K – $200K MRR</p>
              </div>
              <div style={{marginBottom: '1.5rem'}}>
                <span style={{fontSize: '2.5rem', fontWeight: '700'}}>$149</span>
                <span style={{color: '#64748b'}}>/month</span>
              </div>
              <Link href="/pricing" style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                background: '#6366f1',
                color: 'white',
                textAlign: 'center',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                marginBottom: '1.5rem'
              }}>
                Get Started
              </Link>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#94a3b8'}}>
                <div>✓ Unlimited customers</div>
                <div>✓ Advanced playbooks</div>
                <div>✓ VIP alerts</div>
              </div>
            </div>

            {/* Scale */}
            <div style={{background: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '1px solid #334155', textAlign: 'left'}}>
              <div style={{marginBottom: '1rem'}}>
                <h3 style={{fontSize: '1.25rem', marginBottom: '0.25rem'}}>Scale</h3>
                <p style={{color: '#64748b', fontSize: '0.875rem'}}>$200K – $1M MRR</p>
              </div>
              <div style={{marginBottom: '1.5rem'}}>
                <span style={{fontSize: '2.5rem', fontWeight: '700'}}>$299</span>
                <span style={{color: '#64748b'}}>/month</span>
              </div>
              <Link href="/pricing" style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                background: 'transparent',
                color: 'white',
                textAlign: 'center',
                borderRadius: '0.5rem',
                border: '1px solid #334155',
                textDecoration: 'none',
                fontWeight: '600',
                marginBottom: '1.5rem'
              }}>
                Get Started
              </Link>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#94a3b8'}}>
                <div>✓ Unlimited everything</div>
                <div>✓ API access</div>
                <div>✓ Custom risk models</div>
              </div>
            </div>
          </div>

          <div style={{marginTop: '2rem', color: '#64748b', fontSize: '0.875rem'}}>
            Cancel anytime • No setup fees • Money-back guarantee
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{padding: '3rem 2rem', borderTop: '1px solid #1e293b', textAlign: 'center', color: '#64748b'}}>
        <p>© 2024 ChurnGuard. All rights reserved.</p>
      </footer>
    </div>
  );
}
