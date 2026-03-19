'use client';

import { useSignIn } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const VALID_KEY = 'your-secret-key-123';

function AdminAccessInner() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [status, setStatus] = useState<'checking' | 'signing-in' | 'error'>('checking');

  useEffect(() => {
    if (!isLoaded) return;

    // Wrong or missing key — render nothing (404-like blank)
    if (!key || key !== VALID_KEY) {
      setStatus('error');
      return;
    }

    handleAdminLogin();
  }, [isLoaded, key]);

  async function handleAdminLogin() {
    setStatus('signing-in');
    try {
      // Get a short-lived sign-in token from the server
      const res = await fetch('/api/admin-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      if (!res.ok) {
        setStatus('error');
        return;
      }

      const { token } = await res.json();

      // Use Clerk's ticket strategy to create a session
      const result = await signIn!.create({
        strategy: 'ticket',
        ticket: token,
      });

      await setActive!({ session: result.createdSessionId });
      router.replace('/dashboard');
    } catch (err) {
      console.error('Admin login failed:', err);
      setStatus('error');
    }
  }

  // Wrong key → show nothing (behaves like 404)
  if (status === 'error') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'system-ui'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '6rem', fontWeight: '700', color: '#1e293b' }}>404</div>
          <div style={{ color: '#475569' }}>Page not found</div>
        </div>
      </div>
    );
  }

  // Loading / signing in
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #1e293b',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <div style={{ color: '#475569', fontSize: '14px' }}>Signing in...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

export default function AdminAccessPage() {
  return (
    <Suspense>
      <AdminAccessInner />
    </Suspense>
  );
}
