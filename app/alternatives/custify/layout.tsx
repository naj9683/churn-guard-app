import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custify Alternative — From Surfacing Risk to Saving Customers | ChurnGuard',
  description:
    'Custify surfaces churn risk for CS teams to act on. ChurnGuard acts on it automatically. An honest comparison for small SaaS teams. Updated August 2026.',
  alternates: { canonical: 'https://churnguardapp.com/alternatives/custify' },
  openGraph: {
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ChurnGuard — automated churn prevention' }],
  },
  robots: { index: true, follow: true },
};

export default function CustifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
