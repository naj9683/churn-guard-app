'use client';

import { useUser } from '@clerk/nextjs';
import Layout from '@/app/components/Layout';
import Link from 'next/link';

export default function SettingsPage() {
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

  const settingsSections = [
    { 
      title: 'General',
      description: 'Manage your account settings and preferences',
      href: '/settings/general',
      icon: '⚙️'
    },
    { 
      title: 'Notifications',
      description: 'Configure email and Slack notifications',
      href: '/settings/notifications',
      icon: '🔔'
    },
    { 
      title: 'Billing',
      description: 'Manage your subscription and payment methods',
      href: '/settings/billing',
      icon: '💳'
    },
    { 
      title: 'API Keys',
      description: 'Manage API keys for integrations',
      href: '/settings/api-keys',
      icon: '🔑'
    },
    { 
      title: 'Webhooks',
      description: 'Configure webhook endpoints',
      href: '/settings/webhooks',
      icon: '🔗'
    },
    { 
      title: 'Integrations',
      description: 'Connect with third-party services',
      href: '/settings/integrations',
      icon: '🔌'
    }
  ];

  return (
    <Layout 
      title="Settings"
      subtitle="Manage your account and application settings"
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        {settingsSections.map((section, idx) => (
          <Link 
            key={idx}
            href={section.href}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              padding: '24px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
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
            }}>{section.icon}</div>
            <div style={{flex: 1}}>
              <h3 style={{
                margin: '0 0 4px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827'
              }}>{section.title}</h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5'
              }}>{section.description}</p>
            </div>
            <div style={{
              color: '#9ca3af',
              fontSize: '20px'
            }}>→</div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
