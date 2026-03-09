'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function IntegrationsPage() {
  const { user, isLoaded } = useUser();
  const [slackStatus, setSlackStatus] = useState<any>(null);
  const [hubspotStatus, setHubspotStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      checkIntegrations();
    }
  }, [isLoaded, user]);

  async function checkIntegrations() {
    try {
      const slackRes = await fetch('/api/slack/configure');
      if (slackRes.ok) {
        const slackData = await slackRes.json();
        setSlackStatus(slackData);
      }
      const hubspotRes = await fetch('/api/integrations/status');
      if (hubspotRes.ok) {
        const hubspotData = await hubspotRes.json();
        setHubspotStatus(hubspotData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function connectHubSpot() {
    try {
      const res = await fetch('/api/integrations/hubspot/auth');
      if (res.ok) {
        const { authUrl } = await res.json();
        window.open(authUrl, 'hubspotAuth', 'width=800,height=600');
      }
    } catch (error) {
      alert('Failed');
    }
  }

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      <div style={{padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155'}}>
        <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      <main style={{padding: '2rem'}}>
        <h1 style={{margin: '0 0 2rem 0', fontSize: '1.875rem'}}>Integrations</h1>

        <div style={{display: 'grid', gap: '1.5rem'}}>

          {/* HubSpot - NEW */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: hubspotStatus?.connected ? '2px solid #ff7a59' : '1px solid #334155', padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '48px', height: '48px', background: '#ff7a59', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>🍊</div>
                <div>
                  <h3 style={{margin: '0 0 0.25rem 0'}}>HubSpot</h3>
                  <p style={{margin: 0, color: '#94a3b8', fontSize: '0.875rem'}}>Sync churn risk scores with your CRM</p>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '8px', height: '8px', background: hubspotStatus?.connected ? '#10b981' : '#64748b', borderRadius: '50%'}}></div>
                <span style={{color: hubspotStatus?.connected ? '#10b981' : '#64748b', fontSize: '0.875rem'}}>{hubspotStatus?.connected ? 'Connected' : 'Not Connected'}</span>
              </div>
            </div>
            <button onClick={connectHubSpot} style={{padding: '0.5rem 1rem', background: '#ff7a59', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer'}}>
              {hubspotStatus?.connected ? 'Reconnect HubSpot' : 'Connect HubSpot'} →
            </button>
          </div>

          {/* Slack */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '48px', height: '48px', background: '#4A154B', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>💬</div>
                <div>
                  <h3 style={{margin: '0 0 0.25rem 0'}}>Slack</h3>
                  <p style={{margin: 0, color: '#94a3b8', fontSize: '0.875rem'}}>Get churn alerts in your Slack workspace</p>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '8px', height: '8px', background: slackStatus?.configured ? '#10b981' : '#64748b', borderRadius: '50%'}}></div>
                <span style={{color: slackStatus?.configured ? '#10b981' : '#64748b', fontSize: '0.875rem'}}>{slackStatus?.configured ? 'Connected' : 'Not Connected'}</span>
              </div>
            </div>
            <a href="https://api.slack.com/apps" target="_blank" style={{padding: '0.5rem 1rem', background: '#4A154B', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontSize: '0.875rem'}}>Configure Slack →</a>
          </div>

          {/* Stripe */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '48px', height: '48px', background: '#635BFF', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>💳</div>
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
            <a href="https://dashboard.stripe.com" target="_blank" style={{padding: '0.5rem 1rem', background: '#635BFF', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontSize: '0.875rem'}}>Stripe Dashboard →</a>
          </div>

          {/* Widget */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '48px', height: '48px', background: '#6366f1', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>🧩</div>
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
              <code style={{fontSize: '0.75rem', color: '#94a3b8'}}>&lt;script src="https://churn-guard-app.vercel.app/widget.js"&gt;&lt;/script&gt;</code>
            </div>
          </div>

          {/* API Access */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '48px', height: '48px', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>🔑</div>
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
            <Link href="/settings" style={{padding: '0.5rem 1rem', background: '#334155', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontSize: '0.875rem'}}>View API Keys →</Link>
          </div>

        </div>
      </main>
    </div>
  );
}
