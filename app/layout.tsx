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
  title: "ChurnGuard - Churn Prevention Platform",
  description: "AI-powered churn prevention for SaaS",
  other: {
    'cache-control': 'no-store, no-cache, must-revalidate',
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
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
          <SegmentScript />
          <MixpanelInit />
          <Analytics />
          <Script strategy="afterInteractive">{`function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"69cd6d96e58c5900110a11b2"})},document.head.appendChild(o)}initApollo();`}</Script>
        </body>
      </html>
    </ClerkProvider>
  );
}
