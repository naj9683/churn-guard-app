import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vitally Alternative — Automation for Teams With No CSM | ChurnGuard',
  description:
    "Vitally is a copilot for customer success managers. ChurnGuard is for SaaS teams that don't have one. Honest comparison, updated August 2026.",
  alternates: { canonical: 'https://churnguardapp.com/alternatives/vitally' },
  openGraph: {
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ChurnGuard — automated churn prevention' }],
  },
  robots: { index: true, follow: true },
};

export default function VitallyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
