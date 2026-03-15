'use client';

import { useUser } from '@clerk/nextjs';
import Sidebar from '@/app/components/Sidebar';

export default function TeamPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(99, 102, 241, 0.1)',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)',
      display: 'flex',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <Sidebar />
      
      <div style={{
        marginLeft: '280px',
        flex: 1,
        padding: '32px',
        overflowY: 'auto'
      }}>
        <div style={{marginBottom: '32px'}}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '-0.02em'
          }}>
            Team
          </h1>
          <p style={{
            margin: 0,
            color: '#64748b',
            fontSize: '14px'
          }}>
            Manage team members and permissions
          </p>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#fff'}}>Team Members</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  color: '#fff'
                }}>
                  {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0] || 'U'}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: '500', color: '#fff'}}>
                    {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'}
                  </div>
                  <div style={{fontSize: '13px', color: '#64748b'}}>
                    {user.emailAddresses[0]?.emailAddress}
                  </div>
                </div>
                <span style={{
                  padding: '4px 8px',
                  background: '#6366f120',
                  color: '#6366f1',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Admin
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
