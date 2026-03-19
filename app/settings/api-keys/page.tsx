'use client';

import { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>{title}</h2>
        {subtitle && <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings/api-keys').then(r => r.json()).then(d => {
      setApiKey(d.apiKey || null);
    }).finally(() => setLoading(false));
  }, []);

  async function regenerateKey() {
    if (!confirm('Regenerating your API key will immediately invalidate the old one. Any existing integrations using it will stop working. Continue?')) return;
    setRegenerating(true);
    setMsg('');
    const res = await fetch('/api/settings/api-keys', { method: 'POST' });
    if (res.ok) {
      const d = await res.json();
      setApiKey(d.apiKey);
      setShowKey(true);
      setMsg('New API key generated. Copy it now — it will be partially hidden after you leave.');
    } else {
      setMsg('Failed to regenerate key.');
    }
    setRegenerating(false);
  }

  function copyKey() {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function maskKey(key: string) {
    return key.slice(0, 8) + '••••••••••••••••••••••••' + key.slice(-4);
  }

  if (loading) return <Layout title="API Keys"><div style={{ color: '#9ca3af' }}>Loading…</div></Layout>;

  return (
    <Layout title="API Keys" subtitle="Authenticate your server-side integrations with ChurnGuard">
      <div style={{ maxWidth: '680px' }}>
        <Section title="Your API Key" subtitle="Use this key to authenticate requests to the ChurnGuard API">
          {apiKey ? (
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                <code style={{ flex: 1, padding: '10px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', color: '#374151', wordBreak: 'break-all' }}>
                  {showKey ? apiKey : maskKey(apiKey)}
                </code>
                <button
                  onClick={() => setShowKey(v => !v)}
                  style={{ padding: '10px 14px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={copyKey}
                  style={{ padding: '10px 14px', background: copied ? '#dcfce7' : '#f3f4f6', color: copied ? '#15803d' : '#374151', border: `1px solid ${copied ? '#bbf7d0' : '#e5e7eb'}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {msg && <div style={{ padding: '10px 14px', borderRadius: '8px', background: msg.startsWith('New') ? '#f0fdf4' : '#fef2f2', color: msg.startsWith('New') ? '#15803d' : '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{msg}</div>}
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
                Keep this key secure. Never expose it in client-side code or public repositories.
              </p>
              <button
                onClick={regenerateKey}
                disabled={regenerating}
                style={{ padding: '10px 20px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: regenerating ? 'not-allowed' : 'pointer' }}
              >
                {regenerating ? 'Regenerating…' : 'Regenerate API Key'}
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>No API key yet. Generate one to get started.</p>
              <button
                onClick={regenerateKey}
                disabled={regenerating}
                style={{ padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: regenerating ? 'not-allowed' : 'pointer' }}
              >
                {regenerating ? 'Generating…' : 'Generate API Key'}
              </button>
            </div>
          )}
        </Section>

        <Section title="How to Use" subtitle="Authenticate API requests using the Authorization header">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Send events to ChurnGuard:</div>
            <pre style={{ background: '#1e1e2e', color: '#cdd6f4', padding: '16px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto', margin: 0 }}>{`curl -X POST https://churnguard.vercel.app/api/track \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerId": "cus_123",
    "event": "login",
    "timestamp": 1700000000000
  }'`}</pre>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>List customers:</div>
            <pre style={{ background: '#1e1e2e', color: '#cdd6f4', padding: '16px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto', margin: 0 }}>{`curl https://churnguard.vercel.app/api/customers \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
          </div>
        </Section>

        <Section title="Security Best Practices">
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {[
              'Store your API key in environment variables, never in source code.',
              'Rotate your key immediately if you suspect it has been compromised.',
              'Use server-side code only — never expose keys in browser JavaScript.',
              'Scope your requests to only the data you need.',
            ].map(tip => (
              <li key={tip} style={{ fontSize: '13px', color: '#6b7280', padding: '4px 0' }}>{tip}</li>
            ))}
          </ul>
        </Section>
      </div>
    </Layout>
  );
}
