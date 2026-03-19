'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import Link from 'next/link';

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';

const NAV = [
  { href: '/admin', label: 'Overview', icon: '🏠' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { href: '/admin/security', label: 'Security', icon: '🔒' },
  { href: '/admin/database', label: 'Database', icon: '🗄️' },
  { href: '/admin/api', label: 'API', icon: '🔌' },
  { href: '/admin/logs', label: 'Logs', icon: '📊' },
];

export default function AdminShell({
  title,
  subtitle,
  children,
  loading = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const isAdmin = isLoaded && user && email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { router.replace('/sign-in'); return; }
    if (email !== ADMIN_EMAIL) { router.replace('/'); }
  }, [isLoaded, user]);

  if (!isLoaded || !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '260px' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter,-apple-system,BlinkMacSystemFont,sans-serif', display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Admin top bar */}
        <div style={{ background: '#1e1b4b', padding: '0 32px', display: 'flex', alignItems: 'center', gap: '0', minHeight: '44px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '1px', marginRight: '24px' }}>
            🛡 Admin
          </span>
          {NAV.map(n => {
            const active = typeof window !== 'undefined' && window.location.pathname === n.href;
            return (
              <Link key={n.href} href={n.href} style={{
                padding: '12px 14px', fontSize: '13px', fontWeight: '500',
                color: active ? '#fff' : '#a5b4fc',
                textDecoration: 'none', borderBottom: active ? '2px solid #818cf8' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: '5px'
              }}>
                {n.icon} {n.label}
              </Link>
            );
          })}
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6366f1' }}>{email}</span>
        </div>

        {/* Page content */}
        <div style={{ padding: '32px', flex: 1 }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }}>{title}</h1>
              <span style={{ padding: '3px 9px', background: '#fef3c7', color: '#92400e', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>ADMIN</span>
            </div>
            {subtitle && <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{subtitle}</p>}
          </div>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af', fontSize: '14px' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid #e5e7eb', borderTop: '2px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Loading…
            </div>
          ) : children}
        </div>
      </div>
    </div>
  );
}
