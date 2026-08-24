import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planhat Alternative for Small SaaS — ChurnGuard',
  description:
    'Planhat is a beautiful enterprise customer platform — priced and built for companies with commercial teams. An honest comparison for small SaaS. Updated August 2026.',
  alternates: { canonical: 'https://churnguardapp.com/alternatives/planhat' },
  openGraph: {
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ChurnGuard — automated churn prevention' }],
  },
  robots: { index: true, follow: true },
};

export default function PlanhatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
