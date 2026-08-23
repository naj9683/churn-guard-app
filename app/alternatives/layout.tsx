import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Success & Churn Tool Alternatives — Honest Comparisons | ChurnGuard',
  description:
    'Comparing churn prevention and customer success tools? Honest, dated comparisons of ChurnZero, Gainsight, Churnkey and more — written for small SaaS teams without a CS department.',
  alternates: { canonical: 'https://churnguardapp.com/alternatives' },
  openGraph: {
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ChurnGuard — automated churn prevention' }],
  },
  robots: { index: true, follow: true },
};

export default function AlternativesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
