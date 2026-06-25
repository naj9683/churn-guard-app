import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import SegmentScript from '@/app/components/SegmentScript';
import MixpanelInit from '@/app/components/MixpanelInit';
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://churnguardapp.com'),
  title: {
    default: 'ChurnGuard — Churn Prevention Software for SaaS',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
      <html lang="en">
        <head>
          <script dangerouslySetInnerHTML={{ __html: `function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"69cd6d96e58c5900110a11b2"})},document.head.appendChild(o)}initApollo();` }} />
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
          <SegmentScript />
          <MixpanelInit />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
