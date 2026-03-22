'use client';

import { useSignIn } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'najwa.saadi1@hotmail.com';

export default function AdminAccessPage() {
  const { signIn, isLoaded } = useSignIn();
  const [status, setStatus] = useState<'sending' | 'sent' | 'error'>('sending');
  const sent = useRef(false);

  useEffect(() => {
    if (!isLoaded || sent.current) return;
    sent.current = true;
    sendMagicLink();
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  async function sendMagicLink() {
    try {
      const origin = window.location.origin;
      const attempt = await signIn!.create({ identifier: ADMIN_EMAIL });
      const emailFactor = attempt.supportedFirstFactors?.find(
        (f: any) => f.strategy === 'email_link'
      ) as any;

      if (!emailFactor) throw new Error('Email link not supported');

      const { startEmailLinkFlow } = signIn!.createEmailLinkFlow();
      // Fire-and-forget — user will click the link in email, this call hangs until then
      startEmailLinkFlow({
        emailAddressId: emailFactor.emailAddressId,
        redirectUrl: `${origin}/api/auth/callback`,
      }).catch(() => {}); // ignore — link was sent, navigation happens via email

      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  const bg = '#0a0a1a';
  const center: React.CSSProperties = {
    minHeight: '100vh', background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
  };

  if (status === 'sending') {
    return (
      <div style={center}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{
            width: '36px', height: '36px',
            border: '3px solid #1e293b', borderTopColor: '#6366f1',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            margin: '0 auto 14px',
          }} />
          <div style={{ color: '#475569', fontSize: '14px' }}>Sending magic link…</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={center}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', fontWeight: '700', color: '#1e293b' }}>404</div>
          <div style={{ color: '#475569' }}>Page not found</div>
        </div>
      </div>
    );
  }

  // sent
  return (
    <div style={center}>
      <div style={{ textAlign: 'center', maxWidth: '360px', padding: '0 24px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📬</div>
        <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700', margin: '0 0 10px' }}>
          Check your email
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
          A magic link has been sent to your email address.<br />
          Click it to sign in automatically.
        </p>
      </div>
    </div>
  );
}
