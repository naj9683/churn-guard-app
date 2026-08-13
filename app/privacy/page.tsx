import type { Metadata } from 'next';
import Link from 'next/link';
import DarkShell from '@/app/components/ui/DarkShell';

export const metadata: Metadata = {
  title: 'Privacy Policy — ChurnGuard',
  description: 'How ChurnGuard collects, uses, and protects your data.',
  alternates: { canonical: 'https://churnguardapp.com/privacy' },
};

const DK_TEXT   = '#f1f5f9';
const DK_MUTED  = '#94a3b8';
const DK_FAINT  = '#64748b';
const DK_BORDER = 'rgba(51,65,85,0.5)';
const DK_ACCENT = '#6366f1';

export default function PrivacyPage() {
  return (
    <DarkShell>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px 96px' }}>

        <h1 style={{ fontSize: '2rem', fontWeight: 500, color: DK_TEXT, marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '13px', color: DK_FAINT, marginBottom: '48px' }}>Last updated: June 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: DK_MUTED, fontSize: '16px', lineHeight: 1.8 }}>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>1. Who We Are</h2>
            <p>
              ChurnGuard (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is a churn prevention platform
              operated at <strong style={{ color: DK_TEXT }}>churnguardapp.com</strong>. We help SaaS businesses identify
              at-risk customers and automate retention campaigns.
              Questions? Contact us at{' '}
              <a href="mailto:admin@churnguardapp.com" style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                admin@churnguardapp.com
              </a>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>2. Data We Collect</h2>
            <p style={{ marginBottom: '12px' }}>
              We collect data in two ways: data you provide directly and data we receive
              from connected services (such as your Stripe account).
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong style={{ color: DK_TEXT }}>Account data:</strong> your name, email address, and company name
                when you sign up.
              </li>
              <li>
                <strong style={{ color: DK_TEXT }}>Stripe data:</strong> with your explicit authorisation, we access
                customer records, subscription status, charge history, and invoice data from
                your Stripe account to calculate churn risk scores.
              </li>
              <li>
                <strong style={{ color: DK_TEXT }}>Usage data:</strong> pages visited, features used, and interaction
                events within the ChurnGuard dashboard (collected via Segment / Mixpanel).
              </li>
              <li>
                <strong style={{ color: DK_TEXT }}>Communication data:</strong> email addresses of your customers
                that you provide or that we receive via Stripe, used solely to send
                ChurnGuard-powered retention messages on your behalf.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>3. How We Use Your Data</h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Calculating churn risk scores from Stripe subscription and payment data.</li>
              <li>Sending automated retention email and SMS campaigns on your behalf.</li>
              <li>Providing analytics and reporting inside the ChurnGuard dashboard.</li>
              <li>Improving our models, features, and overall service quality.</li>
              <li>Sending product updates and support communications to you (not your customers).</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              We do <strong style={{ color: DK_TEXT }}>not</strong> sell your data or your customers&rsquo; data to third parties.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>4. How We Store and Protect Data</h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Data is stored in a PostgreSQL database hosted on NeonDB (AWS us-east-1).</li>
              <li>All data in transit is encrypted via TLS 1.2+.</li>
              <li>All data at rest is encrypted using AES-256.</li>
              <li>Access to production systems is restricted to authorised personnel only.</li>
              <li>We retain your data for as long as your account is active. You may request
                deletion at any time (see Section 7).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>5. Stripe Data Access</h2>
            <p>
              ChurnGuard accesses your Stripe account through the Stripe Apps platform or via
              Stripe Connect OAuth. We request the minimum permissions needed: read access to
              customers, subscriptions, and charges. We do not initiate charges, modify
              subscriptions, or access payment card details.
            </p>
            <p style={{ marginTop: '12px' }}>
              You can revoke ChurnGuard&rsquo;s access to your Stripe account at any time from your
              Stripe Dashboard under <em>Settings → Installed Apps</em> or your Stripe Connect
              authorisations.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>6. Cookies and Tracking</h2>
            <p>
              We use functional cookies to keep you signed in and analytics cookies
              (Segment, Mixpanel) to understand how our product is used. We do not use
              advertising or cross-site tracking cookies. You can disable analytics cookies
              in your browser without affecting core product functionality.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>7. Your Rights</h2>
            <p style={{ marginBottom: '12px' }}>
              Depending on your location, you may have the following rights under
              GDPR (EU/UK) or CCPA (California):
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong style={{ color: DK_TEXT }}>Access:</strong> request a copy of the data we hold about you.</li>
              <li><strong style={{ color: DK_TEXT }}>Correction:</strong> request that inaccurate data be corrected.</li>
              <li><strong style={{ color: DK_TEXT }}>Deletion:</strong> request that we delete your account and associated data.</li>
              <li><strong style={{ color: DK_TEXT }}>Portability:</strong> request your data in a machine-readable format.</li>
              <li><strong style={{ color: DK_TEXT }}>Objection:</strong> object to processing based on legitimate interests.</li>
              <li><strong style={{ color: DK_TEXT }}>Opt-out of sale:</strong> we do not sell personal data; this right is
                already satisfied.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              To exercise any of these rights, email{' '}
              <a href="mailto:admin@churnguardapp.com" style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                admin@churnguardapp.com
              </a>{' '}
              with the subject line &ldquo;Privacy Request.&rdquo; We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>8. Third-Party Services</h2>
            <p>We use the following sub-processors to deliver the service:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Stripe — payment and subscription data</li>
              <li>Vercel — application hosting</li>
              <li>NeonDB — database storage</li>
              <li>Resend — transactional email delivery</li>
              <li>Twilio — SMS delivery</li>
              <li>Segment / Mixpanel — product analytics</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>9. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be
              communicated by email or an in-app notice at least 14 days before taking effect.
              Continued use of ChurnGuard after that date constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>10. Contact</h2>
            <p>
              ChurnGuard<br />
              <a href="mailto:admin@churnguardapp.com" style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                admin@churnguardapp.com
              </a><br />
              <a href="https://churnguardapp.com" style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                churnguardapp.com
              </a>
            </p>
          </section>

        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: `1px solid ${DK_BORDER}`, display: 'flex', gap: '24px', fontSize: '13px', color: DK_FAINT }}>
          <Link href="/terms" style={{ color: DK_MUTED, textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/" style={{ color: DK_MUTED, textDecoration: 'none' }}>Back to ChurnGuard</Link>
        </div>

      </div>
    </DarkShell>
  );
}
