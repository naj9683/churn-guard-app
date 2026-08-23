import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Churn Prevention That Pays for Itself',
  description: 'Simple pricing based on your MRR. Every plan includes all retention playbooks, dunning, and win-back sequences. 30-day free trial — no card required. Cancel anytime.',
  alternates: { canonical: 'https://churnguardapp.com/pricing' },
  robots: { index: true, follow: true },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
