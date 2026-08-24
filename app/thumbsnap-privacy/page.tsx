import type { Metadata } from 'next';
import DarkShell from '@/app/components/ui/DarkShell';

export const metadata: Metadata = {
  title: 'Privacy Policy — ThumbSnap',
  description: 'Privacy policy for ThumbSnap, the AI YouTube thumbnail maker by SAADI LLC.',
  alternates: { canonical: 'https://churnguardapp.com/thumbsnap-privacy' },
  robots: { index: true, follow: true },
};

const DK_TEXT   = '#f1f5f9';
const DK_MUTED  = '#94a3b8';
const DK_FAINT  = '#64748b';
const DK_ACCENT = '#6366f1';

export default function ThumbSnapPrivacyPage() {
  return (
    <DarkShell>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px 96px' }}>

        <h1 style={{ fontSize: '2rem', fontWeight: 500, color: DK_TEXT, marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Privacy Policy — ThumbSnap
        </h1>
        <p style={{ fontSize: '13px', color: DK_FAINT, marginBottom: '48px' }}>Last updated: August 24, 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: DK_MUTED, fontSize: '16px', lineHeight: 1.8 }}>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>1. About ThumbSnap</h2>
            <p>
              ThumbSnap is an AI-powered YouTube thumbnail maker for Android, developed and operated by{' '}
              <strong style={{ color: DK_TEXT }}>SAADI LLC</strong>. This privacy policy explains how the app
              handles your data. If you have questions, contact us at{' '}
              <a href="mailto:najwasaadi1@gmail.com" style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                najwasaadi1@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>2. No Accounts Required</h2>
            <p>
              ThumbSnap does not require you to create an account or sign up. You can use the app without
              providing any personal information such as your name, email address, or phone number.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>3. Data We Do Not Collect</h2>
            <p>We do not collect, store, or share any personal data. Specifically:</p>
            <ul style={{ marginTop: '12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>No name, email, or contact information</li>
              <li>No device identifiers or advertising IDs</li>
              <li>No location data</li>
              <li>No usage analytics or behavioral tracking</li>
              <li>No crash reports sent to our servers</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>4. Photo and Camera Access</h2>
            <p>
              ThumbSnap may request access to your device&apos;s photo library or camera solely to allow you
              to import images you choose to use in a thumbnail, or to save a completed thumbnail to your
              device. Photos are accessed only when you explicitly initiate an import or save action. Your
              images are never uploaded to our servers, never shared with third parties, and never stored
              beyond the current session.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>5. AI Generation — Google Gemini API</h2>
            <p>
              Thumbnail generation is powered by the{' '}
              <strong style={{ color: DK_TEXT }}>Google Gemini API</strong>. When you generate a thumbnail,
              your prompt or input image may be sent to Google&apos;s servers for processing. This data is
              handled in accordance with{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                Google&apos;s Privacy Policy
              </a>
              . SAADI LLC does not retain or store any prompts or images sent to the Gemini API.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>6. Payments — Google Play Billing &amp; RevenueCat</h2>
            <p>
              In-app purchases and subscriptions are processed through{' '}
              <strong style={{ color: DK_TEXT }}>Google Play Billing</strong>. Purchase management and
              entitlement verification are handled by{' '}
              <strong style={{ color: DK_TEXT }}>RevenueCat</strong>. Neither SAADI LLC nor ThumbSnap
              directly collects or stores your payment card details. Any billing data is governed by
              Google Play&apos;s and RevenueCat&apos;s respective privacy policies. RevenueCat may collect
              a pseudonymous user identifier for the purpose of tracking subscription status; this
              identifier is not linked to any personal information on our end.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>7. Third-Party Services</h2>
            <p>ThumbSnap integrates with the following third-party services, each governed by their own privacy policies:</p>
            <ul style={{ marginTop: '12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong style={{ color: DK_TEXT }}>Google Gemini API</strong> — AI image generation.{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                  style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <strong style={{ color: DK_TEXT }}>Google Play Billing</strong> — payment processing.{' '}
                <a href="https://payments.google.com/payments/apis-secure/u/0/get_legal_document?ldo=0&ldt=privacynotice" target="_blank" rel="noopener noreferrer"
                  style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                  Google Payments Privacy Notice
                </a>
              </li>
              <li>
                <strong style={{ color: DK_TEXT }}>RevenueCat</strong> — subscription management.{' '}
                <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer"
                  style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                  RevenueCat Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>8. Children&apos;s Privacy</h2>
            <p>
              ThumbSnap is not directed at children under the age of 13. We do not knowingly collect
              personal information from children. If you believe a child has provided personal information
              through the app, please contact us and we will promptly address it.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be reflected by an updated
              date at the top of this page. Continued use of ThumbSnap after any changes constitutes
              acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: DK_TEXT, marginBottom: '12px' }}>10. Contact</h2>
            <p>
              For any questions or concerns about this privacy policy, contact SAADI LLC at:{' '}
              <a href="mailto:najwasaadi1@gmail.com" style={{ color: DK_ACCENT, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                najwasaadi1@gmail.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </DarkShell>
  );
}
