import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ChurnZero Alternative for Small SaaS Teams — ChurnGuard',
  description:
    "ChurnZero is built for customer success teams. ChurnGuard is built for SaaS teams that don't have one. An honest comparison — pricing, setup, and who each tool is really for. Updated August 2026.",
  alternates: { canonical: 'https://churnguardapp.com/alternatives/churnzero' },
  openGraph: {
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ChurnGuard — automated churn prevention' }],
  },
  robots: { index: true, follow: true },
};

export default function ChurnZeroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
