'use client';

import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MagicLinkVerifyPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (!isLoaded || !signIn || !setActive) return;

    signIn
      .attemptFirstFactor({ strategy: 'email_link' })
      .then(async result => {
        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          // Auth callback sets the paywall cookie and sends admin to /dashboard
          router.replace('/api/auth/callback');
        } else {
          setErrMsg('Verification did not complete. Please try logging in again.');
          setFailed(true);
        }
      })
      .catch(err => {
        const clerkErr = err as { errors?: Array<{ message: string }> };
        setErrMsg(
          clerkErr?.errors?.[0]?.message ??
          'Link expired or already used. Please request a new one.',
        );
        setFailed(true);
      });
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  if (failed) {
    return (
      <div style={wrap}>
        <div style={card}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h1 style={h1}>Link expired or invalid</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
            {errMsg}
          </p>
          <a href="/login" style={backBtn}>Back to login →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={spinner} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h1 style={h1}>Signing you in…</h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Verifying your magic link.</p>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f8fafc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  padding: '48px 40px',
  width: '100%',
  maxWidth: '380px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  textAlign: 'center',
};

const spinner: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '3px solid #e5e7eb',
  borderTop: '3px solid #6366f1',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  margin: '0 auto 24px',
};

const h1: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#111827',
  margin: '0 0 8px',
};

const backBtn: React.CSSProperties = {
  display: 'inline-block',
  padding: '11px 24px',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
};
