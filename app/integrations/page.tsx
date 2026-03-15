'use client';

import { useUser } from '@clerk/nextjs';
import Layout from '@/app/components/Layout';

const integrations = [
  { name: 'Stripe', category: 'Payments', description: 'Payment processing and billing', icon: '💳', connected: true },
  { name: 'HubSpot', category: 'CRM', description: 'Customer relationship management', icon: '📊', connected: false },
  { name: 'Salesforce', category: 'CRM', description: 'Enterprise CRM platform', icon: '☁️', connected: false },
  { name: 'Slack', category: 'Messaging', description: 'Team communication', icon: '💬', connected: true },
  { name: 'Zapier', category: 'Automation', description: 'Connect apps and automate workflows', icon: '⚡', connected: false },
  { name: 'Segment', category: 'Analytics', description: 'Customer data platform', icon: '📈', connected: false },
  { name: 'Intercom', category: 'Support', description: 'Customer messaging platform', icon: '🎧', connected: false },
  { name: 'Zendesk', category: 'Support', description: 'Customer service software', icon: '🎫', connected: false }
];

export default function IntegrationsPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '260px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Layout 
      title="Integrations"
      subtitle="Connect ChurnGuard with your favorite tools"
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        {integrations.map((integration, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '24px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#f5f3ff',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0
            }}>{integration.icon}</div>
            <div style={{flex: 1}}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '4px'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827'
                }}>{integration.name}</h3>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: integration.connected ? '#f0fdf4' : '#f3f4f6',
                  color: integration.connected ? '#10b981' : '#6b7280',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {integration.connected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6366f1',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>{integration.category}</div>
              <p style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5'
              }}>{integration.description}</p>
              <button style={{
                padding: '8px 16px',
                background: integration.connected ? '#fef2f2' : '#f5f3ff',
                color: integration.connected ? '#ef4444' : '#6366f1',
                border: '1px solid',
                borderColor: integration.connected ? '#fecaca' : '#ddd6fe',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                {integration.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
