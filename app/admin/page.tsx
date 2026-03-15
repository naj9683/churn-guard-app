'use client';

import { useUser } from '@clerk/nextjs';
import Layout from '@/app/components/Layout';
import Link from 'next/link';

const adminSections = [
  { 
    title: 'User Management',
    description: 'Manage users, roles, and permissions',
    href: '/admin/users',
    count: '24 users',
    icon: '👥'
  },
  { 
    title: 'System Settings',
    description: 'Configure global system settings',
    href: '/admin/settings',
    icon: '⚙️'
  },
  { 
    title: 'Security',
    description: 'Security policies and access controls',
    href: '/admin/security',
    icon: '🔒'
  },
  { 
    title: 'Database',
    description: 'Database management and backups',
    href: '/admin/database',
    icon: '🗄️'
  },
  { 
    title: 'API Management',
    description: 'API keys, rate limits, and webhooks',
    href: '/admin/api',
    icon: '🔌'
  },
  { 
    title: 'Logs & Monitoring',
    description: 'System logs and performance monitoring',
    href: '/admin/logs',
    icon: '📊'
  }
];

export default function AdminPage() {
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
      title="Admin Panel"
      subtitle="System administration and management"
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        {adminSections.map((section, idx) => (
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
              background: '#fef2f2',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0
            }}>{section.icon}</div>
            <div style={{flex: 1}}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827'
                }}>{section.title}</h3>
                {section.count && (
                  <span style={{
                    padding: '4px 10px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {section.count}
                  </span>
                )}
              </div>
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
