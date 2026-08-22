'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

declare global { interface Window { dataLayer: unknown[] } }

const ACCENT        = '#6366f1';
const ACCENT_BG     = 'rgba(99,102,241,0.12)';
const ACCENT_BORDER = 'rgba(99,102,241,0.25)';
const BORDER_MED    = 'rgba(71,85,105,0.6)';
const TEXT          = '#f1f5f9';
const MUTED         = '#94a3b8';
const FAINT         = '#64748b';
const PAGE_BG       = '#020617';
const SUCCESS       = '#22c55e';

const HS_DONE_KEY  = 'cg_hs_done';
const HS_EMAIL_KEY = 'cg_hs_email';

export default function AuditPage() {
  const router = useRouter();
  const [showFallback, setShowFallback] = useState(false);
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    if (!document.querySelector('script[src*="js-eu1.hsforms.net/forms/embed/147977159"]')) {
      const s = document.createElement('script');
      s.src = 'https://js-eu1.hsforms.net/forms/embed/147977159.js';
      s.defer = true;
      document.head.appendChild(s);
    }

    const fallbackTimer = setTimeout(() => setShowFallback(true), 12000);

    let fired = false;
    function onMessage(ev: MessageEvent) {
      if (fired) return;
      if (!ev.data || ev.data.type !== 'hsFormCallback') return;
      const eventName: string = ev.data.eventName ?? '';
      if (eventName !== 'onFormSubmit' && eventName !== 'onFormSubmitted') return;
      fired = true;

      const fields: Array<{ name: string; value: string }> = Array.isArray(ev.data.data) ? ev.data.data : [];
      const email = fields.find(f => f.name === 'email')?.value ?? '';

      // Save email before HubSpot redirect fires — calculator reads this on mount
      try {
        sessionStorage.setItem(HS_DONE_KEY, '1');
        sessionStorage.setItem(HS_EMAIL_KEY, email);
      } catch { /* private browsing */ }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'lead_captured',
        product: 'churnguard',
        lead_type: 'churn_audit',
        source_page: window.location.pathname,
      });

      clearTimeout(fallbackTimer);
      // Navigate in case HubSpot is set to "show thank you" instead of redirect
      routerRef.current.push('/audit/calculator');
    }

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 px-5 h-14 flex items-center justify-between"
        style={{ background: '#0f172a', borderBottom: `1px solid ${BORDER_MED}` }}
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-base" style={{ color: TEXT, textDecoration: 'none' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🛡️</div>
          ChurnGuard
        </Link>
        <Link href="/#pricing" className="text-sm" style={{ color: MUTED, textDecoration: 'none' }}>
          View Plans →
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero */}
        <div className="text-center max-w-xl mb-10">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Free · No credit card · About 10 minutes
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight" style={{ color: TEXT }}>
            Free Churn Audit —<br />
            <span style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Know What You&apos;re Losing
            </span>
          </h1>
          <p className="text-lg" style={{ color: MUTED }}>
            Connect Stripe or upload a CSV — see your churn rate, revenue at risk, and highest-risk customers instantly.
          </p>
        </div>

        {/* HubSpot form card */}
        <div
          className="w-full max-w-md rounded-2xl border p-8"
          style={{ background: '#0f172a', borderColor: BORDER_MED }}
        >
          <div className="flex justify-center mb-5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              🛡️
            </div>
          </div>
          <h2 className="text-lg font-bold text-center mb-6" style={{ color: TEXT }}>
            Enter your details to see your free churn risk audit
          </h2>

          <div className="cg-hs-wrapper">
            <div
              className="hs-form-frame"
              data-region="eu1"
              data-form-id="31ad22e3-ed18-4279-8639-a51cd2ee69f7"
              data-portal-id="147977159"
            />
          </div>

          {showFallback && (
            <div className="mt-5 text-center">
              <p className="text-xs mb-1" style={{ color: FAINT }}>Form not loading? (Ad blocker?)</p>
              <button
                onClick={() => routerRef.current.push('/audit/calculator')}
                className="text-xs hover:underline"
                style={{ color: ACCENT, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Skip and go to the calculator →
              </button>
            </div>
          )}

          <p className="text-xs text-center mt-5 flex items-center justify-center gap-1.5" style={{ color: MUTED }}>
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: SUCCESS }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            No spam — we take your privacy seriously.
          </p>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs" style={{ color: MUTED }}>
          {['Stripe key never stored', 'Results shown instantly', 'No credit card needed'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: SUCCESS }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </main>

      {/* HubSpot form — dark-theme overrides */}
      <style>{`
        .cg-hs-wrapper .hs-form {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .cg-hs-wrapper .hs-form-field {
          margin-bottom: 16px !important;
        }
        .cg-hs-wrapper .hs-form-field > label {
          display: block !important;
          color: #f1f5f9 !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          margin-bottom: 6px !important;
          line-height: 1.4 !important;
        }
        .cg-hs-wrapper .hs-form-required {
          color: #ef4444 !important;
          margin-left: 2px;
        }
        .cg-hs-wrapper .hs-input,
        .cg-hs-wrapper .hs-input[type="text"],
        .cg-hs-wrapper .hs-input[type="email"],
        .cg-hs-wrapper .hs-input[type="tel"],
        .cg-hs-wrapper .hs-input[type="number"],
        .cg-hs-wrapper textarea.hs-input,
        .cg-hs-wrapper select.hs-input {
          width: 100% !important;
          box-sizing: border-box !important;
          background: #1e293b !important;
          background-color: #1e293b !important;
          color: #f1f5f9 !important;
          border: 1px solid rgba(71,85,105,0.6) !important;
          border-radius: 6px !important;
          padding: 10px 12px !important;
          font-size: 15px !important;
          min-height: 42px !important;
          font-family: inherit !important;
          transition: border-color 150ms, box-shadow 150ms !important;
          outline: none !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        .cg-hs-wrapper .hs-input::placeholder {
          color: #64748b !important;
          opacity: 1 !important;
        }
        .cg-hs-wrapper .hs-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important;
        }
        .cg-hs-wrapper .hs-input[type="checkbox"],
        .cg-hs-wrapper .hs-input[type="radio"] {
          min-height: unset !important;
          width: auto !important;
          padding: 0 !important;
          -webkit-appearance: auto !important;
          appearance: auto !important;
        }
        .cg-hs-wrapper select.hs-input {
          -webkit-appearance: auto !important;
          appearance: auto !important;
          cursor: pointer !important;
        }
        .cg-hs-wrapper .hs-error-msg,
        .cg-hs-wrapper ul.hs-error-msgs,
        .cg-hs-wrapper ul.hs-error-msgs li {
          color: #ef4444 !important;
          font-size: 13px !important;
          margin-top: 4px !important;
          padding-left: 0 !important;
          list-style: none !important;
          background: transparent !important;
        }
        .cg-hs-wrapper input[type="submit"],
        .cg-hs-wrapper .hs-button.primary {
          width: 100% !important;
          background: #6366f1 !important;
          background-color: #6366f1 !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 12px 24px !important;
          font-size: 15px !important;
          font-weight: 500 !important;
          font-family: inherit !important;
          cursor: pointer !important;
          transition: opacity 150ms !important;
          margin-top: 8px !important;
          box-shadow: none !important;
        }
        .cg-hs-wrapper input[type="submit"]:hover,
        .cg-hs-wrapper .hs-button.primary:hover {
          opacity: 0.85 !important;
        }
        .cg-hs-wrapper .submitted-message {
          color: #f1f5f9 !important;
          font-size: 15px !important;
          text-align: center !important;
          padding: 16px 0 !important;
        }
        .cg-hs-wrapper .hs-form-frame { display: block !important; width: 100% !important; }
        .cg-hs-wrapper .hs-form-frame iframe {
          width: 100% !important;
          min-height: 340px !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
