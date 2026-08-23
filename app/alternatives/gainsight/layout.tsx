import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gainsight Alternative for Startups & Small SaaS — ChurnGuard',
  description:
    'Gainsight invented customer success software — for enterprises. ChurnGuard is automated churn prevention for small SaaS teams. An honest, dated comparison. Updated August 2026.',
  alternates: { canonical: 'https://churnguardapp.com/alternatives/gainsight' },
  openGraph: {
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ChurnGuard — automated churn prevention' }],
  },
  robots: { index: true, follow: true },
};

export default function GainsightLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
