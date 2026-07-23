import type { Metadata } from 'next';
import Link from 'next/link';
import PublicShell from '@/app/components/ui/PublicShell';
import { BORDER, TEXT, MUTED, FAINT, ACCENT } from '@/app/lib/design-tokens';

export const metadata: Metadata = {
  title: 'Privacy Policy — ChurnGuard',
  description: 'How ChurnGuard collects, uses, and protects your data.',
  alternates: { canonical: 'https://churnguardapp.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <PublicShell activeHref="/privacy">
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px 96px' }}>

        <h1 style={{ fontSize: '2rem', fontWeight: 500, color: TEXT, marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '13px', color: FAINT, marginBottom: '48px' }}>Last updated: June 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Who We Are</h2>
            <p>
              ChurnGuard (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is a churn prevention platform
              operated at <strong>churnguardapp.com</strong>. We help SaaS businesses identify
              at-risk customers and automate retention campaigns.
              Questions? Contact us at{' '}
              <a href="mailto:admin@churnguardapp.com" style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                admin@churnguardapp.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Data We Collect</h2>
            <p className="mb-3">
              We collect data in two ways: data you provide directly and data we receive
              from connected services (such as your Stripe account).
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account data:</strong> your name, email address, and company name
                when you sign up.
              </li>
              <li>
                <strong>Stripe data:</strong> with your explicit authorisation, we access
                customer records, subscription status, charge history, and invoice data from
                your Stripe account to calculate churn risk scores.
              </li>
              <li>
                <strong>Usage data:</strong> pages visited, features used, and interaction
                events within the ChurnGuard dashboard (collected via Segment / Mixpanel).
              </li>
              <li>
                <strong>Communication data:</strong> email addresses of your customers
                that you provide or that we receive via Stripe, used solely to send
                ChurnGuard-powered retention messages on your behalf.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Calculating churn risk scores from Stripe subscription and payment data.</li>
              <li>Sending automated retention email and SMS campaigns on your behalf.</li>
              <li>Providing analytics and reporting inside the ChurnGuard dashboard.</li>
              <li>Improving our models, features, and overall service quality.</li>
              <li>Sending product updates and support communications to you (not your customers).</li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> sell your data or your customers&rsquo; data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How We Store and Protect Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Data is stored in a PostgreSQL database hosted on NeonDB (AWS us-east-1).</li>
              <li>All data in transit is encrypted via TLS 1.2+.</li>
              <li>All data at rest is encrypted using AES-256.</li>
              <li>Access to production systems is restricted to authorised personnel only.</li>
              <li>We retain your data for as long as your account is active. You may request
                deletion at any time (see Section 7).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Stripe Data Access</h2>
            <p>
              ChurnGuard accesses your Stripe account through the Stripe Apps platform or via
              Stripe Connect OAuth. We request the minimum permissions needed: read access to
              customers, subscriptions, and charges. We do not initiate charges, modify
              subscriptions, or access payment card details.
            </p>
            <p className="mt-3">
              You can revoke ChurnGuard&rsquo;s access to your Stripe account at any time from your
              Stripe Dashboard under <em>Settings → Installed Apps</em> or your Stripe Connect
              authorisations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Cookies and Tracking</h2>
            <p>
              We use functional cookies to keep you signed in and analytics cookies
              (Segment, Mixpanel) to understand how our product is used. We do not use
              advertising or cross-site tracking cookies. You can disable analytics cookies
              in your browser without affecting core product functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="mb-3">
              Depending on your location, you may have the following rights under
              GDPR (EU/UK) or CCPA (California):
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Access:</strong> request a copy of the data we hold about you.</li>
              <li><strong>Correction:</strong> request that inaccurate data be corrected.</li>
              <li><strong>Deletion:</strong> request that we delete your account and associated data.</li>
              <li><strong>Portability:</strong> request your data in a machine-readable format.</li>
              <li><strong>Objection:</strong> object to processing based on legitimate interests.</li>
              <li><strong>Opt-out of sale:</strong> we do not sell personal data; this right is
                already satisfied.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email{' '}
              <a href="mailto:admin@churnguardapp.com" style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                admin@churnguardapp.com
              </a>{' '}
              with the subject line &ldquo;Privacy Request.&rdquo; We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Third-Party Services</h2>
            <p>We use the following sub-processors to deliver the service:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Stripe — payment and subscription data</li>
              <li>Vercel — application hosting</li>
              <li>NeonDB — database storage</li>
              <li>Resend — transactional email delivery</li>
              <li>Twilio — SMS delivery</li>
              <li>Segment / Mixpanel — product analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be
              communicated by email or an in-app notice at least 14 days before taking effect.
              Continued use of ChurnGuard after that date constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact</h2>
            <p>
              ChurnGuard<br />
              <a href="mailto:admin@churnguardapp.com" style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                admin@churnguardapp.com
              </a><br />
              <a href="https://churnguardapp.com" style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                churnguardapp.com
              </a>
            </p>
          </section>

        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: '24px', fontSize: '13px', color: FAINT }}>
          <Link href="/terms" style={{ color: MUTED, textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/" style={{ color: MUTED, textDecoration: 'none' }}>Back to ChurnGuard</Link>
        </div>

      </div>
    </PublicShell>
  );
}
