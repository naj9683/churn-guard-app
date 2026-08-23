import type { Metadata } from 'next';
import LandingPage from '@/app/components/LandingPage';
import ChatWidget from '@/app/components/ChatWidget';

export const metadata: Metadata = {
  title: 'ChurnGuard — stop losing customers you didn\'t know were leaving',
  description:
    'Paste one line on your site and ChurnGuard scores every customer for churn risk, then automatically emails at-risk customers to keep them. Failed payments recovered within the hour. From $79/mo.',
  keywords: [
    'churn prevention',
    'SaaS churn',
    'revenue at risk',
    'customer retention',
    'behavioral risk scoring',
    'automated retention',
    'HubSpot integration',
    'widget engagement tracking',
    'churn prevention platform',
  ],
  openGraph: {
    title: 'ChurnGuard — stop losing customers you didn\'t know were leaving',
    description:
      'Paste one line on your site and ChurnGuard scores every customer for churn risk, then automatically emails at-risk customers to keep them. Failed payments recovered within the hour. From $79/mo.',
    url: 'https://churnguardapp.com',
    siteName: 'ChurnGuard',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'ChurnGuard — automated churn prevention' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChurnGuard — stop losing customers you didn\'t know were leaving',
    description:
      'Paste one line on your site and ChurnGuard scores every customer for churn risk, then automatically emails at-risk customers to keep them. From $79/mo.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://churnguardapp.com',
  },
};

const BASE = 'https://churnguardapp.com';

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE}/#website`,
  url: BASE,
  name: 'ChurnGuard',
  description: 'Churn prevention software for SaaS businesses',
  publisher: { '@id': `${BASE}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/blog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${BASE}/#software`,
  name: 'ChurnGuard',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: BASE,
  description:
    'ChurnGuard monitors engagement, payment health, and feature usage to score every customer for churn risk using deterministic behavioral scoring. It automatically sends retention emails when a customer enters the at-risk zone, recovers failed payments before they become cancellations, and sends Slack pings when a customer needs attention. Connects to Stripe for billing data, HubSpot for CRM sync, and installs an embeddable widget on your app for engagement tracking.',
  featureList: [
    'Behavioral risk scoring updated every 6 hours',
    'Embeddable widget for engagement tracking (page views, feature usage, login activity)',
    'Automated retention emails and failed-payment recovery sequences',
    'Failed payment recovery and dunning sequences',
    'Revenue at Risk dashboard',
    'Stripe integration for billing and subscription data',
    'HubSpot two-way CRM sync',
    'Real-time customer health monitoring',
    'Cancellation flow with save offers',
    'AI-personalized email copy via Claude',
  ],
  offers: [
    { '@type': 'Offer', name: 'Seed',       price: '79',  priceCurrency: 'USD', billingIncrement: 'P1M' },
    { '@type': 'Offer', name: 'Growth',     price: '149', priceCurrency: 'USD', billingIncrement: 'P1M' },
    { '@type': 'Offer', name: 'Scale',      price: '299', priceCurrency: 'USD', billingIncrement: 'P1M' },
    { '@type': 'Offer', name: 'Enterprise', priceCurrency: 'USD', description: 'Custom pricing — contact sales' },
  ],
  publisher: { '@id': `${BASE}/#organization` },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is ChurnGuard different from Baremetrics or ChartMogul?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'They show you churn analytics. ChurnGuard acts on them — automatically running retention playbooks the moment a customer shows risk signals. Analytics tell you what happened. Playbooks change what happens next.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need Stripe to use ChurnGuard?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Stripe is where ChurnGuard is deepest today — failed-payment recovery, subscription signals, one-click setup. More billing integrations are on the roadmap.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does setup take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'About 5 minutes. Connect Stripe, paste one line of code on your site (or skip it for billing-only signals), pick your playbooks. No developers, no flowcharts, no CS degree.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does the free churn audit include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Connect your Stripe (read-only) and we'll show your at-risk customers, failed-payment losses, and exactly which playbooks would recover them. Free, no card required, 48-hour turnaround — most finish in minutes.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does ChurnGuard email my customers without my say?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Nothing sends until you activate a playbook, and every email template is yours to edit before it ever goes out. You stay in control of what your customers see.',
      },
    },
  ],
};

const schemas = [websiteSchema, softwareSchema, faqSchema];

export default function Home() {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LandingPage />
      <ChatWidget />
    </>
  );
}
