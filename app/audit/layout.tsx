import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Churn Audit — Find Your Churn Leaks',
  description: 'Connect Stripe and get a free churn audit: failed payments, silent churn, and onboarding stalls — with the exact playbooks to fix each one.',
  alternates: { canonical: 'https://churnguardapp.com/audit' },
  robots: { index: true, follow: true },
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
