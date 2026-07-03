import type { Metadata } from 'next';
import LandingPage from '@/app/components/LandingPage';
import ChatWidget from '@/app/components/ChatWidget';

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

const BASE = 'https://churnguardapp.com';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE}/#organization`,
  name: 'ChurnGuard',
  url: BASE,
  logo: `${BASE}/logo-purple.png`,
  description:
    'ChurnGuard is an AI-powered churn prevention platform for SaaS businesses. It monitors Stripe customers for churn risk and automatically sends targeted retention campaigns via email, SMS, and Slack — reducing churn by up to 35%.',
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
    'ChurnGuard connects to Stripe, scores every customer for churn risk using AI, and automatically sends retention campaigns via email, SMS (Twilio), and Slack when a customer enters the at-risk zone. It also automates failed payment recovery (dunning) and provides a real-time Revenue at Risk dashboard.',
  featureList: [
    'AI churn risk scoring updated every 6 hours',
    'Automated retention campaigns via email, SMS, and Slack',
    'Failed payment recovery and dunning sequences',
    'Revenue at Risk dashboard',
    'Stripe integration — no code required',
    'HubSpot CRM sync',
    'Real-time customer health monitoring',
    'Cancellation flow with save offers',
  ],
  offers: [
    { '@type': 'Offer', name: 'Seed', price: '79', priceCurrency: 'USD', billingIncrement: 'P1M' },
    { '@type': 'Offer', name: 'Growth', price: '149', priceCurrency: 'USD', billingIncrement: 'P1M' },
    { '@type': 'Offer', name: 'Scale', price: '299', priceCurrency: 'USD', billingIncrement: 'P1M' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '50',
  },
  publisher: { '@id': `${BASE}/#organization` },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a good SaaS churn rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A good monthly churn rate depends on your customer segment. For SMB SaaS (under $10K ACV), below 2% monthly churn (roughly 22% annual) is considered good; below 1% monthly is excellent. For mid-market ($10K–$50K ACV), target below 8–15% annual. Enterprise SaaS (over $50K ACV) should aim for below 5% annual churn. Self-serve and PLG products typically see 25–50% annual churn, which is within normal range for that segment. Benchmarks also improve with scale: at over $20M ARR, top-quartile companies achieve below 0.5% monthly churn.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I reduce SaaS churn?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The fastest way to reduce SaaS churn is to fix involuntary churn first — 20–40% of SaaS churn is from failed payments, not deliberate cancellations. Set up a dunning sequence (automated emails on day 1, 3, 7, and 14 after a failed payment) to recover 30–60% of those customers. Then: improve onboarding so customers reach their activation milestone within 14 days; build an early warning system to identify disengaged customers 30 days before they cancel; and redesign your cancellation flow to include a save offer (pause option, downgrade, or discount). Tools like ChurnGuard automate the full retention playbook for Stripe-billing SaaS.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is involuntary churn in SaaS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Involuntary churn is when customer subscriptions lapse due to payment failures rather than a deliberate cancellation decision. Causes include expired credit cards, bank-flagged transactions, and insufficient funds. Involuntary churn accounts for 20–40% of total SaaS churn. Unlike voluntary churn, it is highly recoverable — a proper dunning email sequence can recover 30–60% of failed payment customers before they permanently lapse.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a dunning sequence?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A dunning sequence is a series of automated emails sent to customers after a payment failure, designed to prompt them to update their payment details before their subscription is cancelled. A standard dunning sequence sends emails at day 1 (gentle alert), day 3 (reminder), day 7 (final warning before suspension), and day 14 (win-back offer after lapse). A well-designed dunning sequence recovers 30–60% of failed payment customers. Adding in-app banners and SMS for high-value accounts can push recovery rates above 65%.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is net revenue retention (NRR) in SaaS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Net Revenue Retention (NRR), also called Net Dollar Retention (NDR), measures how much revenue you retain from existing customers over a period, including expansion revenue (upgrades, upsells) minus lost revenue (cancellations, downgrades). An NRR above 100% means your existing customers generate more revenue over time than you lose — called negative net churn. SaaS companies with NRR above 120% typically command 2–3× higher valuation multiples than those with sub-100% NRR.',
      },
    },
    {
      '@type': 'Question',
      name: 'What causes SaaS churn?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The main causes of SaaS churn are: (1) Failed payments / involuntary churn (20–40% of total churn) — cards expire, banks decline transactions; (2) Poor onboarding — customers who do not reach their activation milestone within 14 days are 3× more likely to cancel within 60 days; (3) Value not realised — customers who never use the core features that justify the price; (4) Price sensitivity — especially in SMB; (5) Competition — a better-positioned competitor at the wrong moment; (6) Product gaps — a specific missing feature a competitor has. Drivers 1 and 3 are the most automatable and highest-ROI to address first.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does ChurnGuard work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ChurnGuard connects to your Stripe account in minutes and analyzes customer behaviour every 6 hours. It assigns each subscriber a churn risk score based on payment history, subscription status, and billing patterns. When a customer crosses a risk threshold, ChurnGuard automatically sends a targeted retention message via email, SMS (Twilio), or Slack. It also runs dunning sequences for failed payments and surfaces a Revenue at Risk dashboard showing exactly which customers are at risk and how much MRR is at stake. There is no code required — setup takes under 10 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is customer churn rate and how do you calculate it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Customer churn rate is the percentage of customers who cancel in a given period. Formula: Churn Rate = (Customers Lost in Period / Customers at Start of Period) × 100. Example: 400 customers at the start of the month, 18 cancelled → (18 / 400) × 100 = 4.5% monthly churn. To annualise: Annual Churn ≈ 1 − (1 − Monthly Churn)^12. A 3% monthly churn compounds to roughly 31% annual churn. Revenue churn rate is usually more useful than customer churn rate because it weights high-value accounts appropriately.',
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
