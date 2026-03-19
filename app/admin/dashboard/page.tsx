'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import Link from 'next/link';

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';
const ADMIN_USER_IDS = ['user_3AP7xokH0oin2NoqgK37ER9Y4su'];

export default function AdminDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const email = user?.emailAddresses?.[0]?.emailAddress;
  const isAdmin = user && (ADMIN_USER_IDS.includes(user.id) || email === ADMIN_EMAIL);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace('/sign-in');
      return;
    }
    if (!isAdmin) {
      router.replace('/');
      return;
    }
    fetchDashboardData();
  }, [isLoaded, user]);

  async function fetchDashboardData() {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded || loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f8fafc',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '260px'
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '3px solid #e5e7eb', borderTop: '3px solid #6366f1',
          borderRadius: '50%', animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const stats = [
    { label: 'Total Customers', value: dashboardData?.totalCustomers ?? 0, color: '#6366f1' },
    { label: 'At Risk', value: dashboardData?.atRisk ?? 0, color: '#ef4444' },
    { label: 'Active Playbooks', value: dashboardData?.activePlaybooks ?? 0, color: '#10b981' },
    { label: 'MRR Saved', value: `$${dashboardData?.totalSaved ?? 0}`, color: '#3b82f6' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex'
    }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }}>
                Dashboard
              </h1>
              <span style={{
                padding: '3px 10px', background: '#fef3c7', color: '#92400e',
                borderRadius: '20px', fontSize: '12px', fontWeight: '600'
              }}>
                Admin
              </span>
            </div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
              Signed in as {email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/customers" style={{
              padding: '10px 20px', background: '#fff', color: '#374151',
              textDecoration: 'none', borderRadius: '8px', fontWeight: '500',
              fontSize: '14px', border: '1px solid #e5e7eb'
            }}>
              View Customers
            </Link>
            <Link href="/playbooks" style={{
              padding: '10px 20px', background: '#6366f1', color: '#fff',
              textDecoration: 'none', borderRadius: '8px', fontWeight: '500', fontSize: '14px'
            }}>
              AI Playbooks
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{
              background: '#fff', border: '1px solid #e5e7eb',
              borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                color: '#6b7280', fontSize: '13px', fontWeight: '500',
                textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px'
              }}>{stat.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { href: '/customers', label: 'Customers', desc: 'View and manage all customers' },
            { href: '/playbooks', label: 'Playbooks', desc: 'Configure AI automation' },
            { href: '/analytics', label: 'Analytics', desc: 'Revenue and churn insights' },
            { href: '/dashboard/interventions', label: 'Interventions', desc: 'Track active interventions' },
            { href: '/settings', label: 'Settings', desc: 'Account and integrations' },
            { href: '/admin', label: 'Admin Panel', desc: 'System administration' },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{
              display: 'block', padding: '20px', background: '#fff',
              border: '1px solid #e5e7eb', borderRadius: '12px',
              textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{link.label}</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{link.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
