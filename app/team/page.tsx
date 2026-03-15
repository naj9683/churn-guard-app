'use client';

import { useUser } from '@clerk/nextjs';
import Sidebar from '@/app/components/Sidebar';

export default function TeamPage() {
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
          border: '3px solid #e2e8f0',
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
      background: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex'
    }}>
      <Sidebar />
      
      <div style={{
        marginLeft: '260px',
        flex: 1,
        padding: '32px'
      }}>
        <div style={{marginBottom: '32px'}}>
          <h1 style={{
            margin: '0 0 4px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#0f172a',
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
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a'}}>Team Members</h3>
            <button style={{
              padding: '8px 16px',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              + Invite Member
            </button>
          </div>

          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#fff'
              }}>
                {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0] || 'U'}
              </div>
              <div style={{flex: 1}}>
                <div style={{fontWeight: '600', color: '#0f172a', marginBottom: '2px'}}>
                  {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'}
                </div>
                <div style={{fontSize: '14px', color: '#64748b'}}>
                  {user.emailAddresses[0]?.emailAddress}
                </div>
              </div>
              <span style={{
                padding: '4px 12px',
                background: '#6366f1',
                color: '#fff',
                borderRadius: '20px',
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
  );
}
