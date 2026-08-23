import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Churnkey Alternative — Churn Prevention Before the Cancel Button | ChurnGuard',
  description:
    'Churnkey is excellent at the cancellation moment. ChurnGuard works earlier — catching churn risk in the weeks of silence before the cancel click. Honest comparison, updated August 2026.',
  alternates: { canonical: 'https://churnguardapp.com/alternatives/churnkey' },
  openGraph: {
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ChurnGuard — automated churn prevention' }],
  },
  robots: { index: true, follow: true },
};

export default function ChurnkeyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
