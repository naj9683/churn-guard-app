import type { Metadata } from 'next';
import Link from 'next/link';
import DarkShell from '@/app/components/ui/DarkShell';

export const metadata: Metadata = {
  title: 'Terms of Service — ChurnGuard',
  description: 'Terms and conditions for using the ChurnGuard platform.',
  alternates: { canonical: 'https://churnguardapp.com/terms' },
};

const DK_TEXT   = '#f1f5f9';
const DK_MUTED  = '#94a3b8';
const DK_FAINT  = '#64748b';
const DK_BORDER = 'rgba(51,65,85,0.5)';
const DK_ACCENT = '#6366f1';

export default function TermsPage() {
  return (
    <DarkShell>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px 96px' }}>

        <h1 style={{ fontSize: '2rem', fontWeight: 500, color: DK_TEXT, marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: '13px', color: DK_FAINT, marginBottom: '48px' }}>Last updated: June 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: DK_MUTED, fontSize: '16px', lineHeight: 1.8 }}>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>1. Acceptance of Terms</h2>
            <p>
              By accessing or using ChurnGuard (&ldquo;Service&rdquo;) at churnguardapp.com, you agree
              to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, do not
              use the Service. These Terms apply to all users, including those who access the
              Service through the Stripe App Marketplace.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>2. Service Description</h2>
            <p>
              ChurnGuard is a churn prevention platform that connects to your Stripe account,
              calculates customer churn risk scores, and helps you automate email and SMS
              retention campaigns. The Service includes:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>A Stripe Dashboard app for real-time risk monitoring</li>
              <li>AI-powered churn risk scoring based on Stripe data</li>
              <li>Automated retention playbooks (email and SMS)</li>
              <li>Analytics and intervention outcome tracking</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>3. Accounts and Eligibility</h2>
            <p>
              You must be at least 18 years old and have the legal authority to enter into
              these Terms on behalf of yourself or your organisation. You are responsible for
              maintaining the confidentiality of your account credentials and for all
              activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>4. Subscription and Pricing</h2>
            <p style={{ marginBottom: '12px' }}>
              ChurnGuard offers a free 30-day trial with no credit card required. After the
              trial, continued use requires a paid subscription. Pricing is based on your
              monthly recurring revenue (MRR) as described on our{' '}
              <Link href="/pricing" style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>pricing page</Link>.
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong style={{ color: DK_TEXT }}>Billing cycle:</strong> subscriptions are billed monthly in advance.
                Annual plans are billed once per year.
              </li>
              <li>
                <strong style={{ color: DK_TEXT }}>Upgrades:</strong> upgrading your plan takes effect immediately;
                you are charged the prorated difference.
              </li>
              <li>
                <strong style={{ color: DK_TEXT }}>Downgrades:</strong> downgrades take effect at the start of the
                next billing cycle.
              </li>
              <li>
                <strong style={{ color: DK_TEXT }}>Taxes:</strong> prices are exclusive of applicable taxes; taxes
                will be added where required by law.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>5. Refund Policy</h2>
            <p>
              We offer a <strong style={{ color: DK_TEXT }}>7-day money-back guarantee</strong> on your first paid month.
              If you are unsatisfied for any reason, contact{' '}
              <a href="mailto:admin@churnguardapp.com" style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                admin@churnguardapp.com
              </a>{' '}
              within 7 days of your first charge and we will issue a full refund. No refunds
              are issued after 7 days or for partial billing periods beyond the first month.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Use the Service to send spam, unsolicited bulk messages, or illegal content.</li>
              <li>Reverse-engineer, decompile, or attempt to extract source code.</li>
              <li>Resell or sublicense the Service without our written permission.</li>
              <li>Use the Service in any way that violates applicable law or third-party rights.</li>
              <li>Misrepresent your identity or your customers&rsquo; data within the Service.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>7. Stripe Data Access</h2>
            <p>
              By connecting your Stripe account, you authorise ChurnGuard to access your
              Stripe customer, subscription, and charge data solely to provide the Service.
              You represent that you have the right to grant this access and that your use
              of Stripe data through ChurnGuard complies with Stripe&rsquo;s terms of service
              and applicable privacy laws.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>8. Intellectual Property</h2>
            <p>
              ChurnGuard and its original content, features, and functionality are owned by
              ChurnGuard and protected by copyright, trademark, and other intellectual property
              laws. You retain ownership of all data you provide to the Service. You grant
              ChurnGuard a limited licence to process that data solely to operate and improve
              the Service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>9. Limitation of Liability</h2>
            <p style={{ marginBottom: '12px' }}>
              To the fullest extent permitted by applicable law:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express
                or implied, including merchantability, fitness for a particular purpose,
                or non-infringement.
              </li>
              <li>
                ChurnGuard shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including lost profits or data, arising
                from your use of or inability to use the Service.
              </li>
              <li>
                Our total cumulative liability to you for any claims arising under these
                Terms shall not exceed the amount you paid us in the 3 months preceding
                the claim.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>10. Termination</h2>
            <p>
              You may cancel your account at any time from the Settings page or by emailing
              us. We may suspend or terminate your account immediately if you breach these
              Terms or if we are required to do so by law. Upon termination, your right to
              use the Service ceases and we will delete your data within 30 days, unless
              legally required to retain it.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>11. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Material changes will be communicated
              by email at least 14 days before taking effect. Continued use of the Service
              after the effective date constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>12. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the
              State of Delaware, United States, without regard to its conflict of law
              provisions. Disputes will be resolved through binding arbitration under the
              JAMS rules, except either party may seek injunctive relief in a court of
              competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>13. Contact</h2>
            <p>
              Questions about these Terms?<br />
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
          <Link href="/privacy" style={{ color: DK_MUTED, textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/" style={{ color: DK_MUTED, textDecoration: 'none' }}>Back to ChurnGuard</Link>
        </div>

      </div>
    </DarkShell>
  );
}
