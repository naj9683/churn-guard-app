import type { Metadata } from 'next';
import LandingPage from '@/app/components/LandingPage';
import ChatWidget from '@/app/components/ChatWidget';

export const metadata: Metadata = {
  title: 'ChurnGuard — know who\'s about to cancel before they do',
  description:
    'Connect Stripe and get a ranked list of at-risk accounts with the revenue attached. Automated retention runs on its own — email, SMS, and Slack. 15 minutes to first score. From $79/mo.',
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
    title: 'ChurnGuard — know who\'s about to cancel before they do',
    description:
      'Connect Stripe and get a ranked list of at-risk accounts with the revenue attached. Automated retention runs on its own. 15 minutes to first score. From $79/mo.',
    url: 'https://churnguardapp.com',
    siteName: 'ChurnGuard',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChurnGuard — know who\'s about to cancel before they do',
    description:
      'Connect Stripe and get a ranked list of at-risk accounts with the revenue attached. Automated retention runs on its own. From $79/mo.',
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE}/#organization`,
  name: 'ChurnGuard',
  url: BASE,
  logo: `${BASE}/logo-purple.png`,
  description:
    'ChurnGuard is a customer retention platform for SaaS businesses. It monitors engagement, payment health, and feature usage to score every customer for churn risk, then automatically fires targeted retention campaigns via email, SMS, and Slack — reducing churn by up to 35%.',
  foundingDate: '2026',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'admin@churnguardapp.com',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE}/#website`,
  url: BASE,
  name: 'ChurnGuard',
  description: 'AI-powered churn prevention software for SaaS businesses',
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
    'ChurnGuard monitors engagement, payment health, and feature usage to score every customer for churn risk using deterministic behavioral scoring. It automatically sends retention campaigns via email, SMS (Twilio), and Slack when a customer enters the at-risk zone. Connects to Stripe for billing data, HubSpot for CRM sync, and installs an embeddable widget on your app for engagement tracking. Also automates failed payment recovery (dunning) and provides a real-time Revenue at Risk dashboard.',
  featureList: [
    'Behavioral risk scoring updated every 6 hours',
    'Embeddable widget for engagement tracking (page views, feature usage, login activity)',
    'Automated retention campaigns via email, SMS, and Slack',
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
      name: 'How long does setup take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Install the widget on your app or connect Stripe in under 10 minutes. First risk scores appear within 6 hours. You can also add customers manually or sync from HubSpot.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is our customer data secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AES-256 encryption at rest, GDPR compliant, SOC2 Type II aligned. Stripe access is read-only by default — we never write to your Stripe account.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I exceed my MRR band?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We move you up automatically — no service interruption, no surprise bills. You will receive an email notice 7 days before the change.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it work with HubSpot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — native two-way sync. Contacts pull from HubSpot into ChurnGuard, and risk scores push back to HubSpot contact properties every 6 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to send messages manually?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Automated playbooks send every message via email, SMS, and Slack. Retention emails are personalized by Claude AI. You review results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need Stripe to use ChurnGuard?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Stripe is one of several data sources. You can install the widget for engagement tracking, sync from HubSpot, or add customers manually. Stripe is optional.',
      },
    },
  ],
};

const schemas = [organizationSchema, websiteSchema, softwareSchema, faqSchema];

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
