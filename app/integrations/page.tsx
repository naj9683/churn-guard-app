'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function IntegrationsPage() {
  const { user, isLoaded } = useUser();
  const [slackStatus, setSlackStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      checkIntegrations();
    }
  }, [isLoaded, user]);

  async function checkIntegrations() {
    try {
      const response = await fetch('/api/slack/configure');
      if (response.ok) {
        const data = await response.json();
        setSlackStatus(data);
      }
    } catch (error) {
      console.error('Error checking integrations:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      {/* Sidebar */}
      <aside style={{width: '250px', background: '#1e293b', borderRight: '1px solid #334155', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem', marginBottom: '2rem'}}>
          <div style={{width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
          ChurnGuard
        </div>
        
        <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1}}>
          <Link href="/dashboard" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>📊</span> Dashboard
          </Link>
          <Link href="/customers" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>👥</span> Customers
          </Link>
          <Link href="/playbooks" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>⚡</span> Playbooks
          </Link>
          <Link href="/analytics" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>📈</span> Analytics
          </Link>
          <Link href="/integrations" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#334155', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>🔌</span> Integrations
          </Link>
          <Link href="/settings" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>⚙️</span> Settings
          </Link>
        </nav>

        <div style={{paddingTop: '1rem', borderTop: '1px solid #334155'}}>
          <div style={{color: '#64748b', fontSize: '0.75rem'}}>Free Plan</div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{flex: 1, padding: '2rem', marginLeft: '250px', overflow: 'auto'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1 style={{margin: 0, fontSize: '1.875rem'}}>Integrations</h1>
          <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none'}}>← Back to Dashboard</Link>
        </header>

        <div style={{display: 'grid', gap: '1.5rem'}}>
          
          {/* Slack Integration */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '48px', height: '48px', background: '#4A154B', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
                  💬
                </div>
                <div>
                  <h3 style={{margin: '0 0 0.25rem 0'}}>Slack</h3>
                  <p style={{margin: 0, color: '#94a3b8', fontSize: '0.875rem'}}>Get churn alerts in your Slack workspace</p>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '8px', height: '8px', background: slackStatus?.configured ? '#10b981' : '#64748b', borderRadius: '50%'}}></div>
                <span style={{color: slackStatus?.configured ? '#10b981' : '#64748b', fontSize: '0.875rem'}}>
                  {slackStatus?.configured ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <a href="https://api.slack.com/apps" target="_blank" style={{
                padding: '0.5rem 1rem',
                background: '#4A154B',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Configure Slack →
              </a>
            </div>
          </div>

          {/* Stripe Integration */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '48px', height: '48px', background: '#635BFF', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
                  💳
                </div>
                <div>
                  <h3 style={{margin: '0 0 0.25rem 0'}}>Stripe</h3>
                  <p style={{margin: 0, color: '#94a3b8', fontSize: '0.875rem'}}>Billing and subscription management</p>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%'}}></div>
                <span style={{color: '#10b981', fontSize: '0.875rem'}}>Connected</span>
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <a href="https://dashboard.stripe.com" target="_blank" style={{
                padding: '0.5rem 1rem',
                background: '#635BFF',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Stripe Dashboard →
              </a>
            </div>
          </div>

          {/* Widget/SDK Integration */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '48px', height: '48px', background: '#6366f1', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
                  🧩
                </div>
                <div>
                  <h3 style={{margin: '0 0 0.25rem 0'}}>ChurnGuard Widget</h3>
                  <p style={{margin: 0, color: '#94a3b8', fontSize: '0.875rem'}}>In-app retention messages for your customers</p>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%'}}></div>
                <span style={{color: '#f59e0b', fontSize: '0.875rem'}}>Ready to Install</span>
              </div>
            </div>
            <div style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
              <code style={{fontSize: '0.75rem', color: '#94a3b8'}}>
                &lt;script src="https://churn-guard-app.vercel.app/widget.js"&gt;&lt;/script&gt;
              </code>
            </div>
            <p style={{color: '#64748b', fontSize: '0.875rem', margin: 0}}>
              Add this code to your website to show retention widgets to at-risk customers.
            </p>
          </div>

          {/* API Access */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '48px', height: '48px', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
                  🔑
                </div>
                <div>
                  <h3 style={{margin: '0 0 0.25rem 0'}}>API Access</h3>
                  <p style={{margin: 0, color: '#94a3b8', fontSize: '0.875rem'}}>Connect your backend to track customers</p>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%'}}></div>
                <span style={{color: '#10b981', fontSize: '0.875rem'}}>Active</span>
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <Link href="/settings" style={{
                padding: '0.5rem 1rem',
                background: '#334155',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}>
                View API Keys →
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
