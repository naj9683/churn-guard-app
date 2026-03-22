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
        </body>
      </html>
    </ClerkProvider>
  );
}
