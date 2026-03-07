'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [slackStatus, setSlackStatus] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      fetchSettings();
    }
  }, [isLoaded, user]);

  async function fetchSettings() {
    try {
      const [slackRes, apiRes] = await Promise.all([
        fetch('/api/slack/configure'),
        fetch('/api/user/api-key')
      ]);
      
      if (slackRes.ok) {
        const data = await slackRes.json();
        setSlackStatus(data);
        if (data.webhookUrl) {
          setSlackWebhookUrl(data.webhookUrl);
        }
      }
      
      if (apiRes.ok) {
        const data = await apiRes.json();
        setApiKey(data.apiKey);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSlackWebhook(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/slack/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: slackWebhookUrl })
      });
      
      if (response.ok) {
        setSlackStatus({ configured: true, webhookUrl: slackWebhookUrl });
        alert('Slack webhook saved!');
      } else {
        alert('Failed to save webhook');
      }
    } catch (error) {
      alert('Error saving webhook');
    } finally {
      setSaving(false);
    }
  }

  async function testSlackAlert() {
    setTestResult('Sending...');
    try {
      const response = await fetch('/api/slack/test', {
        method: 'POST'
      });
      
      if (response.ok) {
        setTestResult('✅ Test message sent! Check your Slack channel.');
      } else {
        const error = await response.json();
        setTestResult(`❌ Failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      setTestResult('❌ Error sending test');
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
          <Link href="/integrations" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>🔌</span> Integrations
          </Link>
          <Link href="/settings" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#334155', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>⚙️</span> Settings
          </Link>
          <Link href="/signout" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '1rem'}}>
            <span>🚪</span> Sign Out
          </Link>
        </nav>

        <div style={{paddingTop: '1rem', borderTop: '1px solid #334155'}}>
          <div style={{color: '#64748b', fontSize: '0.75rem'}}>Free Plan</div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{flex: 1, padding: '2rem', marginLeft: '250px', overflow: 'auto'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1 style={{margin: 0, fontSize: '1.875rem'}}>Settings</h1>
          <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none'}}>← Back to Dashboard</Link>
        </header>

        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          
          {/* API Key Section */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <h3 style={{margin: '0 0 1rem 0'}}>API Key</h3>
            <p style={{color: '#94a3b8', marginBottom: '1rem'}}>Use this key to track events from your backend</p>
            <div style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', marginBottom: '1rem'}}>
              {apiKey || 'Loading...'}
            </div>
            <button 
              onClick={() => {navigator.clipboard.writeText(apiKey); alert('API Key copied!');}}
              style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer'}}
            >
              Copy API Key
            </button>
          </div>

          {/* Slack Integration - NOW CONFIGURABLE */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <h3 style={{margin: '0 0 1rem 0'}}>Slack Integration</h3>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
              <div style={{width: '12px', height: '12px', borderRadius: '50%', background: slackStatus?.configured ? '#10b981' : '#64748b'}}></div>
              <span>{slackStatus?.configured ? '✅ Connected' : '❌ Not Connected'}</span>
            </div>

            <form onSubmit={saveSlackWebhook} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem'}}>
                  Slack Webhook URL
                </label>
                <input
                  type="url"
                  value={slackWebhookUrl}
                  onChange={(e) => setSlackWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '0.875rem'
                  }}
                />
                <p style={{color: '#64748b', fontSize: '0.75rem', marginTop: '0.5rem'}}>
                  Get this from your Slack app under Incoming Webhooks
                </p>
              </div>

              <div style={{display: 'flex', gap: '1rem'}}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    opacity: saving ? 0.5 : 1
                  }}
                >
                  {saving ? 'Saving...' : 'Save Webhook'}
                </button>

                {slackStatus?.configured && (
                  <button
                    type="button"
                    onClick={testSlackAlert}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Test Alert
                  </button>
                )}
              </div>

              {testResult && (
                <p style={{color: testResult.includes('✅') ? '#10b981' : '#ef4444', fontSize: '0.875rem', margin: 0}}>
                  {testResult}
                </p>
              )}
            </form>
          </div>

          {/* Billing */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <h3 style={{margin: '0 0 1rem 0'}}>Plan</h3>
            <p style={{color: '#94a3b8', marginBottom: '1rem'}}>Free Plan - 60/100 customers</p>
            <Link href="/pricing" style={{color: '#8b5cf6', textDecoration: 'none'}}>Upgrade →</Link>
          </div>

          {/* Account */}
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <h3 style={{margin: '0 0 1rem 0'}}>Account</h3>
            <p style={{color: '#94a3b8'}}>Signed in as: {user?.emailAddresses[0]?.emailAddress}</p>
          </div>

        </div>
      </main>
    </div>
  );
}
