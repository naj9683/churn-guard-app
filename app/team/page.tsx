'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'viewer', label: 'Viewer' }
];

export default function TeamPage() {
  const { user, isLoaded } = useUser();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isLoaded && user) fetchTeam();
  }, [isLoaded, user]);

  async function fetchTeam() {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.teamMembers || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function inviteMember(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, name: inviteName, role: inviteRole })
      });

      if (res.ok) {
        setStatus(`✅ Invitation sent!`);
        setInviteEmail('');
        setInviteName('');
        setShowInvite(false);
        fetchTeam();
      } else {
        const err = await res.json();
        setStatus(`❌ Failed: ${err.error}`);
      }
    } catch (error) {
      setStatus('❌ Error');
    }
  }

  async function removeMember(memberId: string) {
    if (!confirm('Remove this member?')) return;
    try {
      await fetch(`/api/team?id=${memberId}`, { method: 'DELETE' });
      fetchTeam();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', padding: '2rem'}}>
      <Link href="/dashboard" style={{color: '#94a3b8'}}>← Back</Link>
      <h1 style={{marginTop: '2rem'}}>👥 Team Management</h1>
      
      {status && <div style={{background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', margin: '1rem 0'}}>{status}</div>}

      <button onClick={() => setShowInvite(!showInvite)} style={{padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', margin: '1rem 0'}}>
        {showInvite ? 'Cancel' : '+ Invite Member'}
      </button>

      {showInvite && (
        <form onSubmit={inviteMember} style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem'}}>
          <input type="email" placeholder="Email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required style={{display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}} />
          <input type="text" placeholder="Name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} style={{display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}} />
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}}>
            {ROLES.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
          </select>
          <button type="submit" style={{padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.5rem'}}>Send Invitation</button>
        </form>
      )}

      <h3>Members ({teamMembers.length})</h3>
      {teamMembers.map((member: any) => (
        <div key={member.id} style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h4>{member.name || member.email}</h4>
            <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>{member.email}</p>
            <span style={{padding: '0.25rem 0.5rem', background: '#6366f1', borderRadius: '0.25rem', fontSize: '0.75rem'}}>{member.role}</span>
          </div>
          <button onClick={() => removeMember(member.id)} style={{padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem'}}>Remove</button>
        </div>
      ))}
    </div>
  );
}
