'use client';

import { useSignIn } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminAccessPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fired = useRef(false);

  useEffect(() => {
    if (!isLoaded || fired.current) return;
    fired.current = true;
    handleAdminLogin();
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdminLogin() {
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY ?? 'cg-admin-2024' }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(`API error ${res.status}: ${body.error ?? 'unknown'}`);
        setStatus('error');
        return;
      }

      const { token } = await res.json();
      const result = await signIn!.create({ strategy: 'ticket', ticket: token });
      await setActive!({ session: result.createdSessionId });
      router.replace('/dashboard');
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Unexpected error');
      setStatus('error');
    }
  }

  function retry() {
    fired.current = false;
    handleAdminLogin();
  }

  const center: React.CSSProperties = {
    minHeight: '100vh', background: '#0a0a1a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
  };

  if (status === 'error') {
    return (
      <div style={center}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', fontWeight: '700', color: '#1e293b' }}>404</div>
          <div style={{ color: '#475569', marginBottom: '8px' }}>Page not found</div>
          {errorMsg && (
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px', fontFamily: 'monospace' }}>
              {errorMsg}
            </div>
          )}
          <button
            onClick={retry}
            style={{
              padding: '8px 18px', background: '#6366f1', color: '#fff',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontSize: '13px', fontWeight: '500',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={center}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{
          width: '36px', height: '36px',
          border: '3px solid #1e293b', borderTopColor: '#6366f1',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          margin: '0 auto 14px',
        }} />
        <div style={{ color: '#475569', fontSize: '14px' }}>Signing in…</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
