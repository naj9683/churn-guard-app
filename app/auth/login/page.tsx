'use client';

import { useSignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // If already signed in, redirect immediately
  useEffect(() => {
    if (!userLoaded || !user) return;
    const isAdmin = user.primaryEmailAddress?.emailAddress?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (isAdmin) {
      router.replace('/dashboard');
    } else {
      checkSubscriptionAndRoute();
    }
  }, [userLoaded, user]);

  async function checkSubscriptionAndRoute() {
    try {
      const res = await fetch('/api/subscription/status');
      if (res.ok) {
        const data = await res.json();
        router.replace(data.hasAccess ? '/dashboard' : '/pricing?msg=subscribe');
      } else {
        router.replace('/pricing?msg=subscribe');
      }
    } catch {
      router.replace('/pricing?msg=subscribe');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signIn || !setActive) return;

    setLoading(true);
    setError('');

    const isAdmin = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

    try {
      if (isAdmin) {
        // Admin bypass: server creates a Clerk sign-in token; no password required
        const res = await fetch('/api/auth/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error ?? 'Admin login failed');
        }
        const { ticket } = await res.json();

        const result = await signIn.create({ strategy: 'ticket', ticket });
        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          router.push('/dashboard');
        }
        return;
      }

      // Regular user — email + password via Clerk
      if (!password) {
        setError('Please enter your password.');
        return;
      }

      const result = await signIn.create({ identifier: email.trim(), password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        await checkSubscriptionAndRoute();
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        err?.message ??
        'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const isAdminEmail = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo + heading */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '52px', height: '52px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
            }}>
              <span style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>C</span>
            </div>
          </Link>
          <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: '700', color: '#111827', letterSpacing: '-0.5px' }}>
            Sign in to ChurnGuard
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            AI-powered churn prevention platform
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                placeholder="you@company.com"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #d1d5db', borderRadius: '8px',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  color: '#111827', background: '#fff',
                }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password — hidden for admin */}
            {!isAdminEmail && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Password
                  </label>
                  <Link
                    href="/sign-in"
                    style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1px solid #d1d5db', borderRadius: '8px',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    color: '#111827', background: '#fff',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            )}

            {/* Admin badge */}
            {isAdminEmail && (
              <div style={{
                padding: '10px 14px',
                background: '#f5f3ff', border: '1px solid #e0d9ff', borderRadius: '8px',
                fontSize: '13px', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Admin access — no password required
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px',
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
                fontSize: '13px', color: '#dc2626',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: '100%', padding: '12px',
                background: loading ? '#9ca3af' : '#6366f1',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '15px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(99,102,241,0.3)',
                transition: 'all 0.15s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f3f4f6', textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>
            Don't have an account?{' '}
            <Link href="/pricing" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '500' }}>
              View plans →
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'none' }}>
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
