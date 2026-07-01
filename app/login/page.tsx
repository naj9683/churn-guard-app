'use client';

import { useSignIn } from '@clerk/nextjs';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setLoading(true);
    setError('');

    try {
      const si = await signIn.create({ identifier: email });

      const factor = (si.supportedFirstFactors ?? []).find(
        (f): f is { strategy: 'email_link'; emailAddressId: string } =>
          f.strategy === 'email_link',
      );

      if (!factor) {
        setError(
          'Magic link is not enabled for this account. ' +
          'Enable "Email link" in the Clerk dashboard → User & Authentication → Email, Phone, Username.',
        );
        setLoading(false);
        return;
      }

      await signIn.prepareFirstFactor({
        strategy: 'email_link',
        emailAddressId: factor.emailAddressId,
        redirectUrl: `${window.location.origin}/magic-link-verify`,
      });

      setSent(true);
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message: string }> };
      setError(
        clerkErr?.errors?.[0]?.message ??
        (err instanceof Error ? err.message : 'Something went wrong'),
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={wrap}>
        <div style={card}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
          <h1 style={h1}>Check your inbox</h1>
          <p style={sub}>
            We sent a magic link to <strong>{email}</strong>.
            <br />
            Click the link in the email — no password needed.
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '20px' }}>
            Didn&apos;t get it? Check spam or{' '}
            <button onClick={() => setSent(false)} style={linkBtn}>try again</button>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={logo}>C</div>
        <h1 style={h1}>Sign in to ChurnGuard</h1>
        <p style={{ ...sub, marginBottom: '28px' }}>
          Enter your email — we&apos;ll send you a login link.
        </p>

        <form onSubmit={sendMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            style={input}
          />
          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', margin: 0, textAlign: 'left' }}>
              {error}
            </p>
          )}
          <button type="submit" disabled={loading || !isLoaded} style={btn}>
            {loading ? 'Sending…' : 'Send magic link →'}
          </button>
        </form>
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
  padding: '40px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  textAlign: 'center',
};

const logo: React.CSSProperties = {
  width: '44px',
  height: '44px',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 auto 20px',
};

const h1: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#111827',
  margin: '0 0 8px',
};

const sub: React.CSSProperties = {
  fontSize: '14px',
  color: '#6b7280',
  margin: 0,
  lineHeight: '1.6',
};

const input: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  color: '#111827',
};

const btn: React.CSSProperties = {
  width: '100%',
  padding: '13px',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'inherit',
  boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
};

const linkBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#6366f1',
  cursor: 'pointer',
  padding: 0,
  fontSize: '13px',
  fontFamily: 'inherit',
};
