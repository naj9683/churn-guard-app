import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Churn Prevention That Pays for Itself',
  description: 'Simple, transparent pricing from $79/mo. Automated retention playbooks that act before customers cancel — backed by a 10× money-back guarantee.',
  alternates: { canonical: 'https://churnguardapp.com/pricing' },
  robots: { index: true, follow: true },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
