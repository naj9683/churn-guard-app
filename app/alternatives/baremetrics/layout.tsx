import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Baremetrics Alternative — From Churn Analytics to Churn Action | ChurnGuard',
  description:
    'Baremetrics shows you beautiful churn dashboards. ChurnGuard does something about them — automatically. An honest comparison for Stripe-based SaaS. Updated August 2026.',
  alternates: { canonical: 'https://churnguardapp.com/alternatives/baremetrics' },
  openGraph: {
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ChurnGuard — automated churn prevention' }],
  },
  robots: { index: true, follow: true },
};

export default function BaremetricsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
