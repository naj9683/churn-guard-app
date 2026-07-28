'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Layout from '@/app/components/Layout';
import Link from 'next/link';

export default function WidgetInstallPage() {
  const { user, isLoaded } = useUser();
  const [apiKey, setApiKey] = useState('YOUR_API_KEY');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('html');

  useEffect(() => {
    if (isLoaded && user) {
      fetch('/api/settings/api-keys')
        .then(res => res.json())
        .then(data => { if (data.apiKey) setApiKey(data.apiKey); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isLoaded, user]);

  const htmlSnippet =
`<script src="https://churnguardapp.com/widget.js"></script>
<script>
  ChurnGuard.init({ apiKey: '${apiKey}' });
</script>`;

  const reactSnippet =
`import { useEffect } from 'react';

useEffect(() => {
  if (window.ChurnGuard) {
    window.ChurnGuard.init({ apiKey: '${apiKey}' });
  }
}, []);`;

  const npmSnippet =
`npm install @churnguard/widget

// In your app entry point
import { ChurnGuard } from '@churnguard/widget';

ChurnGuard.init({ apiKey: '${apiKey}' });`;

  const codeByTab: Record<string, string> = { html: htmlSnippet, react: reactSnippet, npm: npmSnippet };

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isLoaded || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '260px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Layout
      title="Install Widget"
      subtitle="Paste one line to start. Add your user ID when you want named customers and email outreach."
    >
      {/* Step 1 — Copy the code */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <StepBadge n={1} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              Paste this snippet — works immediately
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>
              Paste before{' '}
              <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: '4px', fontSize: '13px' }}>
                {'</body>'}
              </code>{' '}
              on every page. ChurnGuard starts scoring churn risk and showing in-app save-offers to at-risk customers. Nothing else required.
            </p>

            {/* Tab bar */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '0',
              background: '#f9fafb',
              borderRadius: '8px 8px 0 0',
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}>
              {[{ id: 'html', label: 'HTML' }, { id: 'react', label: 'React' }, { id: 'npm', label: 'NPM' }].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setCopied(false); }}
                  style={{
                    padding: '10px 20px',
                    background: activeTab === tab.id ? '#fff' : 'transparent',
                    color: activeTab === tab.id ? '#6366f1' : '#6b7280',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    fontFamily: 'inherit'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code block */}
            <div style={{ position: 'relative' }}>
              <pre style={{
                margin: 0,
                padding: '20px',
                background: '#1e1e2e',
                color: '#cdd6f4',
                fontSize: '13px',
                lineHeight: '1.7',
                overflowX: 'auto',
                borderRadius: '0 0 8px 8px',
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace"
              }}>
                {codeByTab[activeTab]}
              </pre>
              <button
                onClick={() => copyToClipboard(codeByTab[activeTab])}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '6px 14px',
                  background: copied ? '#10b981' : 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'inherit'
                }}
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2 — Optional upgrade */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <StepBadge n={2} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                Optional: named customers + email outreach
              </h3>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#6366f1', background: '#eef2ff', padding: '2px 8px', borderRadius: '99px', whiteSpace: 'nowrap' }}>
                UPGRADE
              </span>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '14px', color: '#6b7280' }}>
              Without this step, ChurnGuard tracks sessions anonymously — scoring and in-app save-offers still work. Add your logged-in user&apos;s ID to see real names in your dashboard and send retention emails to customers who&apos;ve gone quiet.
            </p>
            <pre style={{
              margin: '0 0 10px',
              padding: '14px 16px',
              background: '#1e1e2e',
              color: '#cdd6f4',
              fontSize: '13px',
              lineHeight: '1.7',
              borderRadius: '8px',
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              overflowX: 'auto',
              whiteSpace: 'pre',
            }}>{`ChurnGuard.init({\n  apiKey: '${apiKey}',\n  customerId: currentUser.id  // your auth system's user ID\n});`}</pre>
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
              Pass your user&apos;s ID from Clerk, Auth0, Supabase, or any auth system. Works with any framework — see the HTML, React, or NPM tabs above for context.
            </p>
          </div>
        </div>
      </div>

      {/* Step 3 — Create messages */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <StepBadge n={3} />
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              Create retention messages
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>
              When a customer&apos;s risk score hits 50%+, ChurnGuard automatically shows your in-app save-offers. Create and manage them below.
            </p>
            <Link
              href="/widget-messages"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                background: '#6366f1',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              Manage Widget Messages →
            </Link>
          </div>
        </div>
      </div>

      {/* Your API key */}
      <div style={{
        background: '#f5f3ff',
        border: '1px solid #ddd6fe',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Your API Key
          </div>
          <code style={{ fontSize: '14px', color: '#374151', wordBreak: 'break-all' }}>
            {apiKey}
          </code>
        </div>
        <Link
          href="/settings/api-keys"
          style={{
            fontSize: '13px',
            color: '#6366f1',
            textDecoration: 'none',
            fontWeight: '500',
            whiteSpace: 'nowrap'
          }}
        >
          Manage API Keys →
        </Link>
      </div>
    </Layout>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div style={{
      width: '32px',
      height: '32px',
      background: '#6366f1',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '700',
      flexShrink: 0,
      marginTop: '2px'
    }}>
      {n}
    </div>
  );
}
