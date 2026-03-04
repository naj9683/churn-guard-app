'use client';

export default function DocsPage() {
  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', padding: '2rem'}}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>📚 Integration Guide</h1>
        <p style={{color: '#94a3b8', fontSize: '1.125rem', marginBottom: '2rem'}}>
          Track your users and reduce churn automatically
        </p>

        {/* Step 1 */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem'}}>
          <h2 style={{color: '#3b82f6', marginTop: 0}}>Step 1: Add the Script</h2>
          <p style={{color: '#94a3b8', marginBottom: '1rem'}}>
            Add this to your website's &lt;head&gt; or before closing &lt;/body&gt; tag:
          </p>
          <pre style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto'}}>
            <code style={{color: '#10b981', fontSize: '0.875rem'}}>
{`<script src="https://churn-guard-app.vercel.app/churnguard.js" 
  data-churnguard-key="YOUR_API_KEY">
</script>`}
            </code>
          </pre>
        </div>

        {/* Step 2 */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem'}}>
          <h2 style={{color: '#3b82f6', marginTop: 0}}>Step 2: Track Login</h2>
          <p style={{color: '#94a3b8', marginBottom: '1rem'}}>
            When user logs in, tell ChurnGuard:
          </p>
          <pre style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto'}}>
            <code style={{color: '#10b981', fontSize: '0.875rem'}}>
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
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem'}}>
          <h2 style={{color: '#3b82f6', marginTop: 0}}>Step 3: Track Important Actions</h2>
          <p style={{color: '#94a3b8', marginBottom: '1rem'}}>
            Track when users complete key actions (onboarding, purchase, etc.):
          </p>
          <pre style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto'}}>
            <code style={{color: '#10b981', fontSize: '0.875rem'}}>
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
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem'}}>
          <h2 style={{color: '#3b82f6', marginTop: 0}}>Step 4: Track Payment Failures</h2>
          <p style={{color: '#94a3b8', marginBottom: '1rem'}}>
            When payment fails, trigger retention playbook:
          </p>
          <pre style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto'}}>
            <code style={{color: '#10b981', fontSize: '0.875rem'}}>
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
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem'}}>
          <h2 style={{color: '#3b82f6', marginTop: 0}}>Step 5: Track Churn Signals</h2>
          <p style={{color: '#94a3b8', marginBottom: '1rem'}}>
            Detect when users show intent to leave:
          </p>
          <pre style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto'}}>
            <code style={{color: '#10b981', fontSize: '0.875rem'}}>
{`// User clicked "Cancel Subscription"
ChurnGuard.trackChurnSignal('clicked_cancel');

// User downgraded plan
ChurnGuard.trackChurnSignal('downgraded_plan');

// User visited help article "How to cancel"
ChurnGuard.trackChurnSignal('viewed_cancellation_help');`}
            </code>
          </pre>
        </div>

        {/* What Happens */}
        <div style={{background: '#059669', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem'}}>
          <h2 style={{marginTop: 0}}>✨ What Happens Automatically?</h2>
          <ul style={{lineHeight: '2', margin: 0, paddingLeft: '1.5rem'}}>
            <li><strong>Day 3 No Login:</strong> Onboarding rescue email sent</li>
            <li><strong>5 Days Absent:</strong> "We miss you" email + Slack alert</li>
            <li><strong>Payment Failed:</strong> 30% discount offer sent</li>
            <li><strong>High Risk Score:</strong> Automatic retention campaign</li>
            <li><strong>Churn Signal:</strong> Immediate intervention email</li>
          </ul>
        </div>

        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <a href="/dashboard" style={{
            display: 'inline-block',
            background: '#3b82f6',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}