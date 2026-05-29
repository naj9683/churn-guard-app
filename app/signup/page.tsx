'use client';

import { useSignUp, useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PAID_PLANS: Record<string, string> = { seed: 'Seed', growth: 'Growth', scale: 'Scale' };

const TRIAL_FEATURES = [
  '100 customers tracked',
  'Basic automation rules',
  'Slack alerts',
  'Email sequences',
  'CRM sync',
];

function SignupForm() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planSlug = searchParams.get('plan') ?? 'trial';
  const tierName = PAID_PLANS[planSlug] ?? null;

  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userLoaded || !user) return;
    if (tierName) redirectToStripe(tierName);
    else router.push('/dashboard');
  }, [userLoaded, user]);

  async function redirectToStripe(tier: string) {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      if (!res.ok) throw new Error();
      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch {
      router.push('/dashboard');
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp.create({ emailAddress: email.trim(), password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        err?.message ??
        'Sign up failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signUp || !setActive) return;
    setLoading(true);
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        if (tierName) await redirectToStripe(tierName);
        else router.push('/dashboard');
      } else {
        setError('Verification incomplete. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        err?.message ??
        'Invalid code. Please try again.';
      setError(msg);
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #d1d5db', borderRadius: '8px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    color: '#111827', background: '#fff',
  };
  const focusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#10b981';
    e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.12)';
  };
  const blurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#d1d5db';
    e.target.style.boxShadow = 'none';
  };

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
      <div style={{ width: '100%', maxWidth: '460px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '52px', height: '52px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
            }}>
              <span style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>C</span>
            </div>
          </Link>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#111827', letterSpacing: '-0.5px' }}>
            {step === 'signup' ? 'Start your free trial' : 'Verify your email'}
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
            {step === 'signup'
              ? '30 days full access · No credit card required'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '28px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          {/* Trial badge */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '10px',
            marginBottom: '24px',
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#10b981' }}>
                Free Trial — 30 days
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                {TRIAL_FEATURES.slice(0, 2).join(' · ')}
              </div>
            </div>
            <div style={{
              fontSize: '12px', fontWeight: '700', color: '#fff',
              background: '#10b981', padding: '4px 10px', borderRadius: '6px',
            }}>
              $0
            </div>
          </div>

          {step === 'signup' ? (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
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
                  style={inputStyle}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="off"
                    placeholder="At least 8 characters"
                    style={{ ...inputStyle, paddingRight: '42px' }}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                      color: '#9ca3af', display: 'flex', alignItems: 'center',
                    }}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
                  fontSize: '13px', color: '#dc2626',
                }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !email || !password}
                style={{
                  width: '100%', padding: '12px',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg,#10b981,#059669)',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '15px', fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(16,185,129,0.3)',
                }}
              >
                {loading ? 'Creating account…' : 'Start free trial →'}
              </button>
              <p style={{ margin: 0, textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
                No credit card required. Cancel anytime.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                  Verification code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                  autoFocus
                  inputMode="numeric"
                  placeholder="123456"
                  maxLength={6}
                  style={{ ...inputStyle, letterSpacing: '0.2em', fontSize: '18px', textAlign: 'center' }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
                  fontSize: '13px', color: '#dc2626',
                }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || code.length < 6}
                style={{
                  width: '100%', padding: '12px',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg,#10b981,#059669)',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '15px', fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(16,185,129,0.3)',
                }}
              >
                {loading ? 'Verifying…' : 'Verify email →'}
              </button>
              <button
                type="button"
                onClick={() => setStep('signup')}
                style={{ background: 'none', border: 'none', fontSize: '13px', color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ← Back
              </button>
            </form>
          )}

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '500' }}>
              Sign in →
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <Link href="/#pricing" style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'none' }}>
            ← Compare plans
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
