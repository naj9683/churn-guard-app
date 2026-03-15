'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const ADMIN_USER_IDS = ['user_3AP7xokH0oin2NoqgK37ER9Y4su'];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const isAdmin = user && ADMIN_USER_IDS.includes(user.id);

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/customers', label: 'Customers' },
    { href: '/playbooks', label: 'Playbooks' },
    { href: '/dashboard/interventions', label: 'Interventions' },
    { href: '/widget-messages', label: 'Widget' },
    { href: '/email-campaigns', label: 'Email Campaigns' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/integrations', label: 'Integrations', adminOnly: true },
    { href: '/admin', label: 'Admin Panel', adminOnly: true },
    { href: '/settings', label: 'Settings' },
    { href: '/audit', label: 'Audit Logs' },
    { href: '/team', label: 'Team' },
    { href: '/export', label: 'Export' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: '#0f172a',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      zIndex: 50
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <span style={{color: '#fff', fontSize: '16px', fontWeight: '700'}}>C</span>
          </div>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '-0.5px'
            }}>ChurnGuard</div>
            <div style={{
              fontSize: '11px',
              color: '#64748b',
              marginTop: '-2px'
            }}>Protect Revenue</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        overflowY: 'auto'
      }}>
        <div style={{
          fontSize: '10px',
          fontWeight: '600',
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '0 12px',
          marginBottom: '8px',
          marginTop: '8px'
        }}>Main</div>
        
        {menuItems.filter(i => !i.adminOnly).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '8px',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? '500' : '400',
                marginBottom: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
              {isActive && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: '#6366f1',
                  borderRadius: '50%'
                }} />
              )}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div style={{
              fontSize: '10px',
              fontWeight: '600',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0 12px',
              marginBottom: '8px',
              marginTop: '24px'
            }}>Admin</div>
            {menuItems.filter(i => i.adminOnly).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: isActive ? '#fff' : '#94a3b8',
                    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? '500' : '400',
                    marginBottom: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.label}
                  {isActive && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      background: '#6366f1',
                      borderRadius: '50%'
                    }} />
                  )}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User Section */}
      {isLoaded && user && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          marginTop: 'auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              color: '#fff'
            }}>
              {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0] || 'U'}
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b'
              }}>
                {isAdmin ? 'Administrator' : 'Member'}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
