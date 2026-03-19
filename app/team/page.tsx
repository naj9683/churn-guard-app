'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Sidebar from '@/app/components/Sidebar';

export default function TeamPage() {
  const { user, isLoaded } = useUser();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [inviting, setInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');

  async function submitInvite() {
    if (!inviteEmail) return;
    setInviting(true);
    setInviteMessage('');
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, name: inviteName, role: inviteRole })
      });
      const data = await res.json();
      if (res.ok) {
        setInviteMessage(`Invitation sent to ${inviteEmail}`);
        setInviteEmail('');
        setInviteName('');
        setInviteRole('viewer');
        setTimeout(() => { setShowInviteModal(false); setInviteMessage(''); }, 1500);
      } else {
        setInviteMessage(data.error || 'Failed to send invitation');
      }
    } catch {
      setInviteMessage('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  }

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
            <button
              onClick={() => setShowInviteModal(true)}
              style={{
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

      {showInviteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', padding: '32px',
            width: '440px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{margin: '0 0 24px', fontSize: '20px', fontWeight: '700', color: '#0f172a'}}>
              Invite Team Member
            </h2>
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
                Email *
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                style={{width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box'}}
              />
            </div>
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
                Name
              </label>
              <input
                type="text"
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
                placeholder="Full name"
                style={{width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box'}}
              />
            </div>
            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
                Role
              </label>
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                style={{width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px'}}
              >
                <option value="viewer">Viewer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {inviteMessage && (
              <div style={{
                marginBottom: '16px', padding: '10px 16px', borderRadius: '8px',
                background: inviteMessage.startsWith('Invitation') ? '#f0fdf4' : '#fef2f2',
                color: inviteMessage.startsWith('Invitation') ? '#10b981' : '#ef4444',
                fontSize: '14px'
              }}>
                {inviteMessage}
              </div>
            )}
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button
                onClick={() => { setShowInviteModal(false); setInviteMessage(''); }}
                style={{padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'}}>
                Cancel
              </button>
              <button
                onClick={submitInvite}
                disabled={!inviteEmail || inviting}
                style={{
                  padding: '10px 20px',
                  background: inviteEmail && !inviting ? '#6366f1' : '#9ca3af',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  cursor: inviteEmail && !inviting ? 'pointer' : 'not-allowed', fontWeight: '500'
                }}>
                {inviting ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
