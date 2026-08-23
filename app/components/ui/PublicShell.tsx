'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ACCENT, ACCENT_BG, ACCENT_BORDER, BORDER, BORDER_MED,
  TEXT, MUTED, FAINT, WHITE, PAGE_BG, FONT, btnPrimary,
} from '@/app/lib/design-tokens';

const NAV_LINKS: [string, string][] = [
  ['#features', 'Product'],
  ['#pricing',  'Pricing'],
  ['/blog',     'Blog'],
  ['/audit',    'Free audit'],
  ['/login',    'Login'],
];

const FOOTER_PRODUCT: [string, string][] = [
  ['#features', 'How it works'],
  ['#pricing',  'Pricing'],
  ['/audit',    'Free churn audit'],
  ['/blog',     'Blog'],
];

const FOOTER_COMPANY: [string, string][] = [
  ['/about',     'About'],
  ['/privacy',   'Privacy'],
  ['/terms',     'Terms'],
  ['/book-demo', 'Book a call'],
  ['https://marketplace.stripe.com/apps/churnguard', 'Stripe Marketplace'],
  ['https://alternativeto.net/software/churnguardapp/',  'AlternativeTo'],
  ['/alternatives', 'Alternatives'],
];

function globalCSS() {
  return `
    .cg-range { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px;
      background: #e5e7eb; outline: none; cursor: pointer; }
    .cg-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px;
      border-radius: 50%; background: ${ACCENT}; border: 2px solid ${WHITE};
      box-shadow: 0 1px 2px rgba(0,0,0,0.15); }
    .cg-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%;
      background: ${ACCENT}; border: 2px solid ${WHITE}; box-shadow: 0 1px 2px rgba(0,0,0,0.15); }

    details > summary { list-style: none; cursor: pointer; }
    details > summary::-webkit-details-marker { display: none; }
    details[open] .cg-chevron { transform: rotate(180deg); }
    .cg-chevron { transition: transform 150ms ease; }

    a:focus-visible, button:focus-visible, input:focus-visible, summary:focus-visible {
      outline: 2px solid ${ACCENT}; outline-offset: 2px; border-radius: 2px; }

    .cg-nav-link:hover { color: ${TEXT} !important; }
    .cg-outline-btn:hover { border-color: #9ca3af !important; }

    @media (max-width: 639px) {
      .cg-risk-header { display: none !important; }
      .cg-risk-row {
        display: flex !important; flex-direction: column !important;
        gap: 6px !important; padding: 14px 16px !important; }
      .cg-risk-row > span:first-child { font-weight: 500; color: ${TEXT}; }
    }

    @media (max-width: 639px) {
      .cg-cta-group { flex-direction: column !important; align-items: stretch !important; }
      .cg-cta-group a { text-align: center !important; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { transition: none !important; animation: none !important; }
    }
  `;
}

interface PublicShellProps {
  children: React.ReactNode;
  /** href of the current page — highlights the matching nav link */
  activeHref?: string;
}

export default function PublicShell({ children, activeHref }: PublicShellProps) {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: FONT, background: PAGE_BG, color: TEXT, overflowX: 'hidden' }}>

      <style dangerouslySetInnerHTML={{ __html: globalCSS() }} />

      {/* ── Nav ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50, background: WHITE,
        borderBottom: `1px solid ${scrolled ? BORDER : 'transparent'}`,
        transition: 'border-color 150ms',
      }}>
        <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link href="/" aria-label="ChurnGuard home" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo-purple.png" alt="ChurnGuard" width={116} height={28}
              style={{ height: '28px', width: 'auto', display: 'block' }} />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '28px' }}>
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href} className="cg-nav-link"
                style={{
                  fontSize: '14px',
                  color: activeHref === href ? TEXT : MUTED,
                  textDecoration: 'none',
                  transition: 'color 150ms',
                  fontWeight: activeHref === href ? 500 : undefined,
                }}>
                {label}
              </a>
            ))}
            <Link href="/signup"
              style={{ ...btnPrimary, fontSize: '14px', padding: '8px 18px' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Start free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: TEXT }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </nav>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden"
            style={{ borderTop: `1px solid ${BORDER}`, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px', background: WHITE }}>
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href}
                style={{ fontSize: '14px', color: MUTED, textDecoration: 'none' }}
                onClick={() => setMobileOpen(false)}>
                {label}
              </a>
            ))}
            <Link href="/signup"
              style={{ ...btnPrimary, textAlign: 'center', padding: '12px' }}
              onClick={() => setMobileOpen(false)}>
              Start free
            </Link>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      {children}

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '48px 24px 32px', background: WHITE }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10" style={{ marginBottom: '40px' }}>

            <div>
              <img src="/logo-purple.png" alt="ChurnGuard" width={116} height={28}
                style={{ height: '28px', width: 'auto', display: 'block', marginBottom: '12px' }} />
              <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.7, marginBottom: '14px' }}>
                Customer retention platform for SaaS founders.
              </p>
              <a href="mailto:admin@churnguardapp.com"
                style={{ fontSize: '13px', color: MUTED, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
                admin@churnguardapp.com
              </a>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: FAINT, marginBottom: '14px' }}>Product</div>
              {FOOTER_PRODUCT.map(([href, label]) => (
                <a key={label} href={href}
                  style={{ display: 'block', fontSize: '13px', color: MUTED, textDecoration: 'none', marginBottom: '9px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
                  {label}
                </a>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: FAINT, marginBottom: '14px' }}>Company</div>
              {FOOTER_COMPANY.map(([href, label]) => (
                <a key={label} href={href}
                  style={{ display: 'block', fontSize: '13px', color: MUTED, textDecoration: 'none', marginBottom: '9px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
                  {label}
                </a>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: FAINT, marginBottom: '14px' }}>Resources</div>
              <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.7, marginBottom: '10px' }}>
                Read about churn prevention, retention tactics, and SaaS benchmarks on our{' '}
                <Link href="/blog" style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>blog</Link>.
              </p>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '12px', color: FAINT }}>© 2026 ChurnGuard · All rights reserved</p>
            <p style={{ fontSize: '12px', color: FAINT }}>Built for SaaS founders who care about retention</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
