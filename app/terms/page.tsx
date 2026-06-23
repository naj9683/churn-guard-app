import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — ChurnGuard',
  description: 'Terms and conditions for using the ChurnGuard platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-sm text-indigo-600 hover:underline">← churnguardapp.com</Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: June 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using ChurnGuard (&ldquo;Service&rdquo;) at churnguardapp.com, you agree
              to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, do not
              use the Service. These Terms apply to all users, including those who access the
              Service through the Stripe App Marketplace.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
            <p>
              ChurnGuard is a churn prevention platform that connects to your Stripe account,
              calculates customer churn risk scores, and helps you automate email and SMS
              retention campaigns. The Service includes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>A Stripe Dashboard app for real-time risk monitoring</li>
              <li>AI-powered churn risk scoring based on Stripe data</li>
              <li>Automated retention playbooks (email and SMS)</li>
              <li>Analytics and intervention outcome tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Accounts and Eligibility</h2>
            <p>
              You must be at least 18 years old and have the legal authority to enter into
              these Terms on behalf of yourself or your organisation. You are responsible for
              maintaining the confidentiality of your account credentials and for all
              activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Subscription and Pricing</h2>
            <p className="mb-3">
              ChurnGuard offers a free 30-day trial with no credit card required. After the
              trial, continued use requires a paid subscription. Pricing is based on your
              monthly recurring revenue (MRR) as described on our{' '}
              <Link href="/pricing" className="text-indigo-600 hover:underline">pricing page</Link>.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Billing cycle:</strong> subscriptions are billed monthly in advance.
                Annual plans are billed once per year.
              </li>
              <li>
                <strong>Upgrades:</strong> upgrading your plan takes effect immediately;
                you are charged the prorated difference.
              </li>
              <li>
                <strong>Downgrades:</strong> downgrades take effect at the start of the
                next billing cycle.
              </li>
              <li>
                <strong>Taxes:</strong> prices are exclusive of applicable taxes; taxes
                will be added where required by law.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refund Policy</h2>
            <p>
              We offer a <strong>7-day money-back guarantee</strong> on your first paid month.
              If you are unsatisfied for any reason, contact{' '}
              <a href="mailto:admin@churnguardapp.com" className="text-indigo-600 hover:underline">
                admin@churnguardapp.com
              </a>{' '}
              within 7 days of your first charge and we will issue a full refund. No refunds
              are issued after 7 days or for partial billing periods beyond the first month.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the Service to send spam, unsolicited bulk messages, or illegal content.</li>
              <li>Reverse-engineer, decompile, or attempt to extract source code.</li>
              <li>Resell or sublicense the Service without our written permission.</li>
              <li>Use the Service in any way that violates applicable law or third-party rights.</li>
              <li>Misrepresent your identity or your customers&rsquo; data within the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Stripe Data Access</h2>
            <p>
              By connecting your Stripe account, you authorise ChurnGuard to access your
              Stripe customer, subscription, and charge data solely to provide the Service.
              You represent that you have the right to grant this access and that your use
              of Stripe data through ChurnGuard complies with Stripe&rsquo;s terms of service
              and applicable privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Intellectual Property</h2>
            <p>
              ChurnGuard and its original content, features, and functionality are owned by
              ChurnGuard and protected by copyright, trademark, and other intellectual property
              laws. You retain ownership of all data you provide to the Service. You grant
              ChurnGuard a limited licence to process that data solely to operate and improve
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p className="mb-3">
              To the fullest extent permitted by applicable law:
            </p>
            <ul className="list-disc pl-5 space-y-2">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Termination</h2>
            <p>
              You may cancel your account at any time from the Settings page or by emailing
              us. We may suspend or terminate your account immediately if you breach these
              Terms or if we are required to do so by law. Upon termination, your right to
              use the Service ceases and we will delete your data within 30 days, unless
              legally required to retain it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Material changes will be communicated
              by email at least 14 days before taking effect. Continued use of the Service
              after the effective date constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the
              State of Delaware, United States, without regard to its conflict of law
              provisions. Disputes will be resolved through binding arbitration under the
              JAMS rules, except either party may seek injunctive relief in a court of
              competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Contact</h2>
            <p>
              Questions about these Terms?<br />
              ChurnGuard<br />
              <a href="mailto:admin@churnguardapp.com" className="text-indigo-600 hover:underline">
                admin@churnguardapp.com
              </a><br />
              <a href="https://churnguardapp.com" className="text-indigo-600 hover:underline">
                churnguardapp.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex gap-6 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
          <Link href="/" className="hover:text-gray-900">Back to ChurnGuard</Link>
        </div>

      </div>
    </main>
  );
}
