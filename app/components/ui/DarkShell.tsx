'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';

const NAV_LINKS: [string, string][] = [
  ['/#features', 'Features'],
  ['/pricing',   'Pricing'],
  ['/blog',      'Blog'],
  ['/audit',     'Free Audit'],
];

interface DarkShellProps {
  children: React.ReactNode;
}

export default function DarkShell({ children }: DarkShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-white no-underline">
              <Shield className="w-7 h-7 text-indigo-500" />
              <span className="text-lg font-bold tracking-tight">ChurnGuard</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(([href, label]) => (
                <a key={href} href={href}
                  className="text-slate-400 hover:text-white text-sm transition-colors no-underline">
                  {label}
                </a>
              ))}
              <a href="/auth/login"
                className="text-slate-400 hover:text-white text-sm transition-colors no-underline">
                Login
              </a>
              <Link href="/signup"
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20 text-white no-underline">
                Get Started
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href}
                className="text-slate-400 hover:text-white text-sm transition-colors py-1 no-underline"
                onClick={() => setMobileOpen(false)}>
                {label}
              </a>
            ))}
            <a href="/auth/login"
              className="text-slate-400 hover:text-white text-sm transition-colors py-1 no-underline"
              onClick={() => setMobileOpen(false)}>
              Login
            </a>
            <Link href="/signup"
              className="mt-1 bg-indigo-600 hover:bg-indigo-500 text-white text-center py-3 rounded-xl font-semibold text-sm transition-colors no-underline"
              onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* ── Page content ── */}
      {children}

      {/* ── Footer ── */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 text-white no-underline">
            <Shield className="w-5 h-5 text-indigo-500" />
            <span className="font-bold">ChurnGuard</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <a href="/#features"  className="hover:text-slate-300 transition-colors no-underline">Features</a>
            <a href="/pricing"    className="hover:text-slate-300 transition-colors no-underline">Pricing</a>
            <a href="/blog"       className="hover:text-slate-300 transition-colors no-underline">Blog</a>
            <a href="/audit"      className="hover:text-slate-300 transition-colors no-underline">Free Audit</a>
            <a href="/privacy"    className="hover:text-slate-300 transition-colors no-underline">Privacy</a>
            <a href="/terms"      className="hover:text-slate-300 transition-colors no-underline">Terms</a>
            <a href="mailto:admin@churnguardapp.com" className="hover:text-slate-300 transition-colors no-underline">Contact</a>
            <a href="https://marketplace.stripe.com/apps/churnguard" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors no-underline">Stripe Marketplace</a>
            <a href="https://alternativeto.net/software/churnguardapp/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors no-underline">AlternativeTo</a>
          </div>

          <p className="text-slate-600 text-sm">© 2026 ChurnGuard</p>
        </div>
      </footer>

    </div>
  );
}
