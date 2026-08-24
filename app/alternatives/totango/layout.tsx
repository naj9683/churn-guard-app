import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Totango Alternative — Zero-Configuration Churn Prevention | ChurnGuard',
  description:
    'Totango has a real free tier — but even free software needs someone to configure it. An honest comparison for small SaaS teams. Updated August 2026.',
  alternates: { canonical: 'https://churnguardapp.com/alternatives/totango' },
  openGraph: {
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ChurnGuard — automated churn prevention' }],
  },
  robots: { index: true, follow: true },
};

export default function TotangoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
