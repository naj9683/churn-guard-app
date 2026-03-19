import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import SegmentScript from '@/app/components/SegmentScript';
import MixpanelInit from '@/app/components/MixpanelInit';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ChurnGuard - Churn Prevention Platform",
  description: "AI-powered churn prevention for SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
          <SegmentScript />
          <MixpanelInit />
        </body>
      </html>
    </ClerkProvider>
  );
}
