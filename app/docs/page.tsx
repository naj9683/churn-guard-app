'use client';

import PublicShell from '@/app/components/ui/PublicShell';
import {
  ACCENT, ACCENT_BG, ACCENT_BORDER, BORDER, TEXT, MUTED, WHITE,
} from '@/app/lib/design-tokens';

export default function DocsPage() {
  return (
    <PublicShell activeHref="/docs">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px 96px' }}>

        <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 500, color: TEXT, marginBottom: '8px', letterSpacing: '-0.02em' }}>
          📚 Integration Guide
        </h1>
        <p style={{ color: MUTED, fontSize: '16px', marginBottom: '40px', lineHeight: 1.6 }}>
          Track your users and reduce churn automatically
        </p>

        {/* Step 1 */}
        <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ color: ACCENT, marginTop: 0, fontSize: '16px', fontWeight: 500 }}>Step 1: Add the Script</h2>
          <p style={{ color: MUTED, marginBottom: '16px', fontSize: '14px', lineHeight: 1.7 }}>
            Add this to your website&apos;s &lt;head&gt; or before closing &lt;/body&gt; tag:
          </p>
          <pre style={{ background: '#1e1e2e', padding: '16px', borderRadius: '6px', overflow: 'auto', margin: 0 }}>
            <code style={{ color: '#cdd6f4', fontSize: '13px' }}>
{`<script src="https://churnguardapp.com/widget.js"
  data-churnguard-key="YOUR_API_KEY">
</script>`}
            </code>
          </pre>
        </div>

        {/* Step 2 */}
        <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ color: ACCENT, marginTop: 0, fontSize: '16px', fontWeight: 500 }}>Step 2: Track Login</h2>
          <p style={{ color: MUTED, marginBottom: '16px', fontSize: '14px', lineHeight: 1.7 }}>
            When user logs in, tell ChurnGuard:
          </p>
          <pre style={{ background: '#1e1e2e', padding: '16px', borderRadius: '6px', overflow: 'auto', margin: 0 }}>
            <code style={{ color: '#cdd6f4', fontSize: '13px' }}>
{`// After successful login
ChurnGuard.trackLogin({
  id: 'user_123',
  email: 'user@example.com',
  name: 'John Doe'
});`}
            </code>
          </pre>
        </div>

        {/* Step 3 */}
        <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ color: ACCENT, marginTop: 0, fontSize: '16px', fontWeight: 500 }}>Step 3: Track Important Actions</h2>
          <p style={{ color: MUTED, marginBottom: '16px', fontSize: '14px', lineHeight: 1.7 }}>
            Track when users complete key actions (onboarding, purchase, etc.):
          </p>
          <pre style={{ background: '#1e1e2e', padding: '16px', borderRadius: '6px', overflow: 'auto', margin: 0 }}>
            <code style={{ color: '#cdd6f4', fontSize: '13px' }}>
{`// User completed onboarding
ChurnGuard.trackFeature('onboarding_complete');

// User made a purchase
ChurnGuard.trackFeature('purchase', {
  amount: 99,
  plan: 'pro'
});

// User used key feature
ChurnGuard.trackFeature('exported_report');`}
            </code>
          </pre>
        </div>

        {/* Step 4 */}
        <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ color: ACCENT, marginTop: 0, fontSize: '16px', fontWeight: 500 }}>Step 4: Track Payment Failures</h2>
          <p style={{ color: MUTED, marginBottom: '16px', fontSize: '14px', lineHeight: 1.7 }}>
            When payment fails, trigger retention playbook:
          </p>
          <pre style={{ background: '#1e1e2e', padding: '16px', borderRadius: '6px', overflow: 'auto', margin: 0 }}>
            <code style={{ color: '#cdd6f4', fontSize: '13px' }}>
{`// When Stripe payment fails
ChurnGuard.trackPaymentFailed({
  amount: 99,
  error: 'card_declined',
  attempt: 2
});`}
            </code>
          </pre>
        </div>

        {/* Step 5 */}
        <div style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ color: ACCENT, marginTop: 0, fontSize: '16px', fontWeight: 500 }}>Step 5: Track Churn Signals</h2>
          <p style={{ color: MUTED, marginBottom: '16px', fontSize: '14px', lineHeight: 1.7 }}>
            Detect when users show intent to leave:
          </p>
          <pre style={{ background: '#1e1e2e', padding: '16px', borderRadius: '6px', overflow: 'auto', margin: 0 }}>
            <code style={{ color: '#cdd6f4', fontSize: '13px' }}>
{`// User clicked "Cancel Subscription"
ChurnGuard.trackChurnSignal('clicked_cancel');

// User downgraded plan
ChurnGuard.trackChurnSignal('downgraded_plan');

// User visited help article "How to cancel"
ChurnGuard.trackChurnSignal('viewed_cancellation_help');`}
            </code>
          </pre>
        </div>

        {/* What Happens Automatically */}
        <div style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, borderRadius: '10px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ color: TEXT, marginTop: 0, fontSize: '16px', fontWeight: 500 }}>What Happens Automatically</h2>
          <ul style={{ lineHeight: 2, margin: 0, paddingLeft: '20px', color: MUTED, fontSize: '14px' }}>
            <li><strong style={{ color: TEXT }}>Day 3 No Login:</strong> Onboarding rescue email sent</li>
            <li><strong style={{ color: TEXT }}>5 Days Absent:</strong> &quot;We miss you&quot; email + Slack alert</li>
            <li><strong style={{ color: TEXT }}>Payment Failed:</strong> 30% discount offer sent</li>
            <li><strong style={{ color: TEXT }}>High Risk Score:</strong> Automatic retention campaign</li>
            <li><strong style={{ color: TEXT }}>Churn Signal:</strong> Immediate intervention email</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="/dashboard" style={{ display: 'inline-block', background: ACCENT, color: WHITE, padding: '11px 26px', borderRadius: '6px', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
            ← Back to Dashboard
          </a>
        </div>

      </div>
    </PublicShell>
  );
}
