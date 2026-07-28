'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function WidgetOnboardingPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [detected, setDetected] = useState(false);
  const [checking, setChecking] = useState(false);
  const [verifyError, setVerifyError] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Skipped user bypasses this page on any subsequent visit
  useEffect(() => {
    if (localStorage.getItem('cg_widget_skipped') === '1') {
      router.replace('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    (async () => {
      // Ensures DB user record exists (new user has none yet); uses real Clerk email
      await fetch('/api/subscription/status');
      const res = await fetch('/api/settings/api-keys');
      if (res.ok) {
        const d = await res.json();
        if (d?.apiKey) setApiKey(d.apiKey);
      }
    })();
  }, []);

  const checkInstalled = useCallback(async (): Promise<boolean> => {
    const res = await fetch('/api/onboarding/widget-status');
    if (!res.ok) return false;
    const { widgetInstalled } = await res.json();
    return widgetInstalled;
  }, []);

  useEffect(() => {
    pollRef.current = setInterval(async () => {
      const installed = await checkInstalled();
      if (installed) {
        clearInterval(pollRef.current!);
        setDetected(true);
        setTimeout(() => router.push('/dashboard?widget_installed=1'), 1500);
      }
    }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [checkInstalled, router]);

  async function handleVerify() {
    setChecking(true);
    setVerifyError(false);
    const installed = await checkInstalled();
    setChecking(false);
    if (installed) {
      clearInterval(pollRef.current!);
      setDetected(true);
      setTimeout(() => router.push('/dashboard?widget_installed=1'), 1500);
    } else {
      setVerifyError(true);
    }
  }

  function handleSkip() {
    localStorage.setItem('cg_widget_skipped', '1');
    router.push('/dashboard');
  }

  const snippet = apiKey
    ? `<script src="https://churnguardapp.com/widget.js"></script>\n<script>ChurnGuard.init({ apiKey: '${apiKey}' })</script>`
    : 'Loading your API key…';

  function handleCopy() {
    if (!apiKey) return;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '40px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* Step indicator */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              background: '#6366f1',
              color: '#fff',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '700',
              flexShrink: 0,
            }}>1</div>
            <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}>Install tracking</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>
            Paste one snippet into your app
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#6b7280', lineHeight: '1.5' }}>
            Paste before <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px', fontSize: '13px' }}>{'</body>'}</code> on every page of your site. ChurnGuard scores churn risk and shows in-app save-offers when customers go quiet.
          </p>
        </div>

        {/* Snippet box */}
        <div style={{
          background: '#0f172a',
          borderRadius: '10px',
          padding: '16px 20px',
          position: 'relative',
          marginBottom: '12px',
        }}>
          <pre style={{
            margin: 0,
            fontFamily: '"Fira Code", "Courier New", monospace',
            fontSize: '13px',
            color: '#e2e8f0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>{snippet}</pre>
          <button
            onClick={handleCopy}
            disabled={!apiKey}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: copied ? '#10b981' : 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: apiKey ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Tier callout */}
        <div style={{ margin: '0 0 28px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px 16px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
            <strong>This snippet is enough.</strong> ChurnGuard scores churn risk and shows in-app save-offers to at-risk customers — no other code required.
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
            <strong style={{ color: '#374151' }}>Want named customers + email outreach?</strong> Add{' '}
            <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' }}>
              customerId: &apos;your-user-id&apos;
            </code>{' '}
            to see real names in your dashboard and reach customers by email. That step needs a small code change to pass your logged-in user&apos;s ID.
          </p>
        </div>

        {/* Step instructions */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '28px',
        }}>
          <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '600', color: '#0369a1' }}>
            After pasting the snippet:
          </p>
          <ol style={{ margin: 0, padding: '0 0 0 20px', fontSize: '14px', color: '#0c4a6e', lineHeight: '1.8' }}>
            <li>Open your app in a new tab</li>
            <li>Navigate to any page — the snippet fires automatically</li>
            <li>Return here and click <strong>Verify installation</strong></li>
          </ol>
        </div>

        {/* Detection UI */}
        {detected ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px',
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '10px',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '20px', color: '#10b981' }}>✓</span>
            <span style={{ color: '#10b981', fontWeight: '600', fontSize: '15px' }}>
              Widget detected — taking you to your dashboard…
            </span>
          </div>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleVerify}
              disabled={checking || !apiKey}
              style={{
                width: '100%',
                padding: '14px',
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: checking || !apiKey ? 'not-allowed' : 'pointer',
                opacity: checking || !apiKey ? 0.7 : 1,
                marginBottom: '10px',
              }}
            >
              {checking ? 'Checking…' : 'Verify installation'}
            </button>
            {verifyError && (
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#ef4444', textAlign: 'center' }}>
                Not detected yet. Make sure you pasted the snippet and loaded your app in a new tab.
              </p>
            )}
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>
              Also checking automatically every 3 seconds
            </p>
          </div>
        )}

        {/* Skip */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
}
