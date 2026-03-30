'use client';

import { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>{title}</h2>
        {subtitle && <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:             { bg: '#dcfce7', color: '#15803d' },
  trialing:           { bg: '#dbeafe', color: '#1d4ed8' },
  past_due:           { bg: '#fef3c7', color: '#92400e' },
  canceled:           { bg: '#f3f4f6', color: '#6b7280' },
  unpaid:             { bg: '#fef2f2', color: '#ef4444' },
  incomplete:         { bg: '#fef3c7', color: '#92400e' },
  incomplete_expired: { bg: '#fef2f2', color: '#ef4444' },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.canceled;
  return (
    <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 9px', background: style.bg, color: style.color, borderRadius: '20px' }}>
      {status === 'cancel_at_period_end' ? 'Cancels at period end' : status.replace(/_/g, ' ')}
    </span>
  );
}

function CardBrand({ brand }: { brand: string }) {
  const colors: Record<string, string> = { visa: '#1a1f71', mastercard: '#eb001b', amex: '#2e77bc', discover: '#ff6600' };
  return (
    <div style={{ width: '40px', height: '26px', background: colors[brand] || '#374151', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#fff', fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{brand.slice(0, 4)}</span>
    </div>
  );
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [hasStripeCustomer, setHasStripeCustomer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings/billing')
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); return; }
        setSubscription(d.subscription);
        setInvoices(d.invoices || []);
        setHasStripeCustomer(d.hasStripeCustomer);
      })
      .catch(() => setError('Failed to load billing info.'))
      .finally(() => setLoading(false));
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/portal-session', { method: 'POST' });
      const d = await res.json();
      if (!res.ok || !d.url) {
        const msg = d.error || 'Failed to open billing portal.';
        // Give a human-readable hint for common Stripe configuration errors
        if (msg.includes('No such customer') || msg.includes('No Stripe customer')) {
          setError('No billing account found. Please subscribe to a plan first.');
        } else if (msg.includes('portal') || msg.includes('configuration')) {
          setError('Billing portal is not configured yet. Please contact support to manage your subscription.');
        } else {
          setError(msg);
        }
        return;
      }
      window.location.href = d.url;
    } catch {
      setError('Failed to open billing portal. Please contact support.');
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) return <Layout title="Billing"><div style={{ color: '#9ca3af' }}>Loading…</div></Layout>;

  return (
    <Layout title="Billing & Subscription" subtitle="Manage your plan, payment method, and invoices">
      <div style={{ maxWidth: '720px' }}>
        {error && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '10px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Current subscription */}
        <Section title="Current Plan" subtitle="Your active subscription details">
          {subscription ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{subscription.planName}</span>
                    <StatusBadge status={subscription.cancelAtPeriodEnd ? 'cancel_at_period_end' : subscription.status} />
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#6366f1', marginBottom: '6px' }}>
                    ${(subscription.amount / 100).toFixed(0)}
                    <span style={{ fontSize: '14px', fontWeight: '400', color: '#9ca3af' }}>/{subscription.interval}</span>
                  </div>
                  {subscription.cancelAtPeriodEnd ? (
                    <div style={{ fontSize: '13px', color: '#ef4444' }}>
                      Access ends {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      Next billing date: <strong style={{ color: '#374151' }}>{new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                    </div>
                  )}
                </div>

                {/* Payment method inline */}
                {subscription.paymentMethod && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <CardBrand brand={subscription.paymentMethod.brand} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                        •••• {subscription.paymentMethod.last4}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        Expires {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Manage Billing CTA */}
              <div style={{ padding: '16px 20px', background: '#f5f3ff', border: '1px solid #e0d9ff', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#4f46e5', marginBottom: '2px' }}>Manage your subscription</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>Upgrade, downgrade, update payment method, or cancel — all in one place.</div>
                </div>
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  style={{ padding: '10px 20px', background: portalLoading ? '#9ca3af' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: portalLoading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  {portalLoading ? 'Opening…' : 'Manage Billing →'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>
                {hasStripeCustomer ? 'No active subscription found.' : 'You have no active subscription.'}
              </p>
              <a
                href="/pricing"
                style={{ display: 'inline-block', padding: '10px 24px', background: '#6366f1', color: '#fff', borderRadius: '8px', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}
              >
                View Plans →
              </a>
            </div>
          )}
        </Section>

        {/* Invoice history */}
        <Section title="Invoice History" subtitle="Download past invoices for your records">
          {invoices.length === 0 ? (
            <div style={{ fontSize: '14px', color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>No invoices yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {['Date', 'Amount', 'Status', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', padding: '8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '12px 0', fontSize: '14px', color: '#374151' }}>
                      {new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 0', fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                      ${(inv.amount / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', padding: '2px 8px', background: inv.status === 'paid' ? '#dcfce7' : '#fef3c7', color: inv.status === 'paid' ? '#15803d' : '#92400e', borderRadius: '20px' }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {inv.pdfUrl && (
                          <a href={inv.pdfUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}>PDF</a>
                        )}
                        {inv.hostedUrl && (
                          <a href={inv.hostedUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none' }}>View</a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {hasStripeCustomer && (
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={openPortal}
                disabled={portalLoading}
                style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '13px', cursor: portalLoading ? 'not-allowed' : 'pointer' }}
              >
                {portalLoading ? 'Opening…' : 'View all invoices in Stripe Portal →'}
              </button>
            </div>
          )}
        </Section>

        {/* Quick-action buttons — all open the Stripe portal */}
        <Section title="Quick Actions" subtitle="Click any action below — you'll be taken to the Stripe billing portal">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {[
              { label: 'Upgrade / Downgrade Plan', icon: '↕' },
              { label: 'Update Credit Card',        icon: '💳' },
              { label: 'Cancel Subscription',       icon: '✕' },
              { label: 'Download Invoices',         icon: '⬇' },
              { label: 'View Billing History',      icon: '📄' },
            ].map(({ label, icon }) => (
              <button
                key={label}
                onClick={openPortal}
                disabled={portalLoading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 16px', background: '#fff',
                  border: '1px solid #e5e7eb', borderRadius: '8px',
                  fontSize: '13px', fontWeight: '500', color: '#374151',
                  cursor: portalLoading ? 'not-allowed' : 'pointer',
                  textAlign: 'left', fontFamily: 'inherit',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { if (!portalLoading) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#6366f1'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
              >
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>
                <span>{label}</span>
                <span style={{ marginLeft: 'auto', color: '#9ca3af', fontSize: '12px' }}>→</span>
              </button>
            ))}
          </div>
          <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#9ca3af' }}>
            All billing changes are handled securely by Stripe. You&apos;ll be redirected back here when done.
          </p>
        </Section>
      </div>
    </Layout>
  );
}
