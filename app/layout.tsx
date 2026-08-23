import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import SegmentScript from '@/app/components/SegmentScript';
import MixpanelInit from '@/app/components/MixpanelInit';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://churnguardapp.com'),
  icons: {
    icon: '/logo-purple.png',
    apple: '/logo-purple.png',
  },
  title: {
    default: 'ChurnGuard — Stop Churn Before It Happens',
    template: '%s | ChurnGuard',
  },
  description:
    'ChurnGuard monitors your Stripe customers for churn risk and automatically sends retention campaigns before they cancel. Reduce churn by up to 35%.',
  keywords: [
    'churn prevention',
    'customer retention software',
    'SaaS churn rate',
    'reduce churn',
    'failed payment recovery',
    'churn prediction',
    'retention automation',
    'Stripe churn',
  ],
  openGraph: {
    type: 'website',
    siteName: 'ChurnGuard',
    title: 'ChurnGuard — Churn Prevention Software for SaaS',
    description:
      'Monitor Stripe customers for churn risk. Automatically send retention campaigns before they cancel. Reduce churn by up to 35%.',
    url: 'https://churnguardapp.com',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'ChurnGuard — Churn Prevention Software',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@churnguard',
    title: 'ChurnGuard — Churn Prevention Software for SaaS',
    description:
      'Monitor Stripe customers for churn risk. Automatically send retention campaigns before they cancel.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://churnguardapp.com/#organization',
  name: 'ChurnGuard',
  url: 'https://churnguardapp.com',
  logo: 'https://churnguardapp.com/og-default.png',
  description: 'Automated retention playbooks that act before customers cancel. Built for founder-led, Stripe-billing SaaS teams.',
  sameAs: [
    'https://marketplace.stripe.com/apps/churnguard',
    'https://alternativeto.net/software/churnguardapp/',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
      <html lang="en">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
          {/* Google Tag Manager */}
          <Script id="gtm-head" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PFKGBVVW');`}</Script>
          <script dangerouslySetInnerHTML={{ __html: `function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"69cd6d96e58c5900110a11b2"})},document.head.appendChild(o)}initApollo();` }} />
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>
          {/* Google Tag Manager (noscript) */}
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PFKGBVVW" height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
          {children}
          <SegmentScript />
          <MixpanelInit />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
