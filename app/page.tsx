import type { Metadata } from 'next';
import LandingPage from '@/app/components/LandingPage';

export const metadata: Metadata = {
  title: 'ChurnGuard - AI Churn Prevention for SaaS',
  description:
    'Stop losing revenue to churn. AI-powered Revenue at Risk dashboard with automated retention via Email, SMS (Twilio), and Slack. Set it up once—AI does the rest.',
  keywords: [
    'churn prevention',
    'SaaS churn',
    'revenue at risk',
    'customer retention',
    'AI churn prediction',
    'automated retention',
    'HubSpot integration',
    'Salesforce integration',
  ],
  openGraph: {
    title: 'ChurnGuard - AI Churn Prevention for SaaS',
    description:
      'Know exactly how many dollars are at risk. Automated retention via Email, SMS, and Slack. Zero manual work.',
    url: 'https://churnguardapp.com',
    siteName: 'ChurnGuard',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChurnGuard - AI Churn Prevention for SaaS',
    description:
      'Stop losing revenue to churn. AI analyzes customers every 6 hours and auto-sends retention messages via Email, SMS, and Slack.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://churnguardapp.com',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ChurnGuard',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://churnguardapp.com',
  description:
    'AI-powered Revenue at Risk dashboard with automated churn prevention via Email, SMS (Twilio), and Slack for SaaS companies.',
  offers: [
    {
      '@type': 'Offer',
      name: 'Seed',
      price: '79',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
    },
    {
      '@type': 'Offer',
      name: 'Growth',
      price: '149',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
    },
    {
      '@type': 'Offer',
      name: 'Scale',
      price: '299',
      priceCurrency: 'USD',
      billingIncrement: 'P1M',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '50',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
