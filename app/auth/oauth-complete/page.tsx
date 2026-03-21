'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OAuthCompleteInner() {
  const params = useSearchParams();
  const success = params.get('success');
  const error = params.get('error');
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (window.opener) {
      // Popup mode: signal parent then close
      window.opener.postMessage(
        { type: 'oauth-complete', success: !!success && !error, crm: success?.split('_')[0], error },
        window.location.origin
      );
      setTimeout(() => { window.close(); setClosed(true); }, 800);
    } else {
      // Main-window mode: redirect back to integrations after a short delay
      const crm = success?.replace('_connected', '') ?? '';
      const dest = error
        ? `/integrations?error=${encodeURIComponent(error)}`
        : `/integrations?connected=${encodeURIComponent(crm)}`;
      setTimeout(() => { window.location.href = dest; }, 1200);
    }
  }, [success, error]);

  const isError = !!error;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: isError ? '#fef2f2' : '#f0fdf4', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        textAlign: 'center', padding: '48px 40px', background: '#fff', borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '400px', width: '90vw',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {isError ? '❌' : '✅'}
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: isError ? '#dc2626' : '#15803d' }}>
          {isError ? 'Connection Failed' : 'Connected!'}
        </h2>
        <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
          {isError
            ? `Error: ${error}. Please close this window and try again.`
            : closed
              ? 'This window should close automatically.'
              : 'Closing this window…'}
        </p>
        <button
          onClick={() => window.close()}
          style={{
            padding: '10px 24px', background: isError ? '#ef4444' : '#10b981',
            color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer',
          }}
        >
          Close Window
        </button>
      </div>
    </div>
  );
}

export default function OAuthCompletePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ color: '#6b7280' }}>Completing authorization…</p>
      </div>
    }>
      <OAuthCompleteInner />
    </Suspense>
  );
}
