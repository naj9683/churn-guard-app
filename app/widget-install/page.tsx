'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WidgetInstallPage() {
  const { user } = useUser();
  const [apiKey, setApiKey] = useState('YOUR_API_KEY');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('html');

  useEffect(() => {
    fetch('/api/settings/api-key')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) setApiKey(data.apiKey);
      })
      .catch(() => {});
  }, []);

  const installCode = `<script src="https://churnguardapp.com/widget.js"></script>
<script>
  ChurnGuard.init({
    apiKey: '${apiKey}',
    customerId: 'USER_ID_FROM_YOUR_APP'
  });
</script>`;

  const reactCode = `import { useEffect } from 'react';

useEffect(() => {
  if (window.ChurnGuard && currentUser?.id) {
    window.ChurnGuard.init({
      apiKey: '${apiKey}',
      customerId: currentUser.id
    });
  }
}, [currentUser]);`;

  const npmCode = `npm install @churnguard/widget

// In your app entry point
import { ChurnGuard } from '@churnguard/widget';

ChurnGuard.init({
  apiKey: '${apiKey}',
  customerId: userId
});`;

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const getActiveCode = () => {
    switch(activeTab) {
      case 'react': return reactCode;
      case 'npm': return npmCode;
      default: return installCode;
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Header */}
      <div style={{padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <Link href="/widget-messages" style={{color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            ← Back
          </Link>
        </div>
      </div>

      <main style={{padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto'}}>
        <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '700'}}>Install Widget</h1>
        <p style={{color: '#94a3b8', marginBottom: '3rem', fontSize: '1.125rem'}}>
          Add ChurnGuard to your website in 30 seconds. Track customer activity and show retention messages automatically.
        </p>

        {/* Steps */}
        <div style={{display: 'grid', gap: '2rem', marginBottom: '3rem'}}>
          
          {/* Step 1 */}
          <div style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-start'}}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#6366f1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '1.125rem',
              flexShrink: 0
            }}>
              1
            </div>
            <div style={{flex: 1}}>
              <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1.25rem'}}>Copy the code</h3>
              <p style={{color: '#94a3b8', marginBottom: '1rem'}}>
                Paste this before the closing <code style={{background: '#1e293b', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', color: '#818cf8'}}>&lt;/body&gt;</code> tag on every page.
              </p>

              {/* Code Frame */}
              <div style={{
                background: '#1e293b',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
                overflow: 'hidden'
              }}>
                {/* Tabs */}
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid #334155',
                  background: '#0f172a'
                }}>
                  {[
                    { id: 'html', label: 'HTML' },
                    { id: 'react', label: 'React' },
                    { id: 'npm', label: 'NPM' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: activeTab === tab.id ? '#1e293b' : 'transparent',
                        color: activeTab === tab.id ? 'white' : '#94a3b8',
                        border: 'none',
                        borderBottom: activeTab === tab.id ? '2px solid #6366f1' : 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Code Area */}
                <div style={{position: 'relative'}}>
                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(getActiveCode())}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      padding: '0.5rem 1rem',
                      background: copied ? '#10b981' : '#334155',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      zIndex: 10
                    }}
                  >
                    {copied ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                      </>
                    )}
                  </button>

                  {/* Code Content */}
                  <pre style={{
                    margin: 0,
                    padding: '1.5rem',
                    background: '#0f172a',
                    color: '#e2e8f0',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    overflow: 'auto',
                    maxHeight: '300px'
                  }}>
                    <code>{getActiveCode()}</code>
                  </pre>
                </div>
              </div>

              <p style={{color: '#64748b', fontSize: '0.875rem', marginTop: '0.75rem'}}>
                💡 <strong>Tip:</strong> Add this to your main layout file so it loads on every page.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-start'}}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#6366f1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '1.125rem',
              flexShrink: 0
            }}>
              2
            </div>
            <div>
              <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1.25rem'}}>Replace USER_ID</h3>
              <p style={{color: '#94a3b8'}}>
                Replace <code style={{background: '#1e293b', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', color: '#f59e0b'}}>USER_ID_FROM_YOUR_APP</code> with your actual user ID variable from your auth system (Clerk, Auth0, etc.)
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{display: 'flex', gap: '1.5rem', alignItems: 'flex-start'}}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#6366f1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '1.125rem',
              flexShrink: 0
            }}>
              3
            </div>
            <div>
              <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1.25rem'}}>Create retention messages</h3>
              <p style={{color: '#94a3b8', marginBottom: '1rem'}}>
                Go to the message manager to create offers that appear when customers are at risk.
              </p>
              <Link 
                href="/widget-messages" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: '#6366f1',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500'
                }}
              >
                Create Messages →
              </Link>
            </div>
          </div>

        </div>

        {/* Test Section */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{margin: '0 0 0.25rem 0'}}>Want to test it first?</h3>
            <p style={{margin: 0, color: '#94a3b8', fontSize: '0.875rem'}}>See the widget in action with our live demo</p>
          </div>
          <Link 
            href="/widget-demo" 
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: '#818cf8',
              border: '1px solid #6366f1',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            View Live Demo
          </Link>
        </div>
      </main>
    </div>
  );
}
