import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Docs — Set Up ChurnGuard in Under 10 Minutes',
  description: 'Setup guides, Stripe integration, Slack alerts, and retention playbooks. Everything you need to start preventing churn today.',
  alternates: { canonical: 'https://churnguardapp.com/docs' },
  robots: { index: true, follow: true },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
