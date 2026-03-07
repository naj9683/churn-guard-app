'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function PlaybooksPage() {
  const { user, isLoaded } = useUser();
  const [playbooks, setPlaybooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPlaybook, setNewPlaybook] = useState({
    name: '',
    trigger: 'high_risk',
    description: '',
    actions: { type: 'slack_alert' }
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchPlaybooks();
    }
  }, [isLoaded, user]);

  async function fetchPlaybooks() {
    try {
      const response = await fetch('/api/playbooks');
      if (response.ok) {
        const data = await response.json();
        setPlaybooks(data.playbooks || []);
      }
    } catch (error) {
      console.error('Error fetching playbooks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createPlaybook(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/playbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlaybook)
      });
      
      if (response.ok) {
        setShowForm(false);
        setNewPlaybook({ name: '', trigger: 'high_risk', description: '', actions: { type: 'slack_alert' } });
        fetchPlaybooks();
      }
    } catch (error) {
      alert('Failed to create playbook');
    }
  }

  async function runPlaybook(id: string) {
    try {
      const response = await fetch('/api/playbooks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbookId: id })
      });
      if (response.ok) {
        alert('Playbook executed!');
      }
    } catch (error) {
      alert('Failed to run playbook');
    }
  }

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      {/* Sidebar */}
      <aside style={{width: '250px', background: '#1e293b', borderRight: '1px solid #334155', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem', marginBottom: '2rem'}}>
          <div style={{width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
          ChurnGuard
        </div>

        <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1}}>
          <Link href="/dashboard" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>📊</span> Dashboard
          </Link>
          <Link href="/customers" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>👥</span> Customers
          </Link>
          <Link href="/playbooks" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#334155', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>⚡</span> Playbooks
          </Link>
          <Link href="/analytics" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>📈</span> Analytics
          </Link>
          <Link href="/integrations" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>🔌</span> Integrations
          </Link>
          <Link href="/settings" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>⚙️</span> Settings
          </Link>
          <Link href="/signout" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '1rem'}}>
            <span>🚪</span> Sign Out
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{flex: 1, padding: '2rem', marginLeft: '250px'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1 style={{margin: 0, fontSize: '1.875rem'}}>Playbooks</h1>
          <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none'}}>← Back to Dashboard</Link>
        </header>

        {/* Create Button */}
        <div style={{marginBottom: '2rem'}}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {showForm ? 'Cancel' : '+ Create Playbook'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155', marginBottom: '2rem'}}>
            <h3 style={{margin: '0 0 1rem 0'}}>Create New Playbook</h3>
            <form onSubmit={createPlaybook} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8'}}>Name</label>
                <input
                  type="text"
                  value={newPlaybook.name}
                  onChange={(e) => setNewPlaybook({...newPlaybook, name: e.target.value})}
                  placeholder="High Risk Alert"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8'}}>Trigger</label>
                <select
                  value={newPlaybook.trigger}
                  onChange={(e) => setNewPlaybook({...newPlaybook, trigger: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="high_risk">High Risk (Score >= 70)</option>
                  <option value="payment_failed">Payment Failed</option>
                  <option value="no_login_7_days">No Login for 7 Days</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8'}}>Description</label>
                <input
                  type="text"
                  value={newPlaybook.description}
                  onChange={(e) => setNewPlaybook({...newPlaybook, description: e.target.value})}
                  placeholder="Auto-trigger when customer risk >= 70"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8'}}>Action Type</label>
                <select
                  value={(newPlaybook.actions as any).type}
                  onChange={(e) => setNewPlaybook({...newPlaybook, actions: { type: e.target.value }})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="slack_alert">Send Slack Alert</option>
                  <option value="email">Send Email</option>
                  <option value="webhook">Call Webhook</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  padding: '0.75rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  marginTop: '0.5rem'
                }}
              >
                Create Playbook
              </button>
            </form>
          </div>
        )}

        {/* Playbooks List */}
        {playbooks.length === 0 ? (
          <div style={{background: '#1e293b', padding: '3rem', borderRadius: '0.75rem', border: '1px solid #334155', textAlign: 'center'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⚡</div>
            <h3 style={{margin: '0 0 0.5rem 0'}}>No playbooks found</h3>
            <p style={{color: '#64748b', margin: '0'}}>Create your first playbook to automate customer retention</p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {playbooks.map((playbook: any) => (
              <div key={playbook.id} style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <h3 style={{margin: '0 0 0.5rem 0'}}>{playbook.name}</h3>
                    <p style={{margin: '0', color: '#64748b', fontSize: '0.875rem'}}>
                      Trigger: {playbook.trigger} • {playbook.isActive ? '🟢 Active' : '🔴 Inactive'}
                      {playbook.lastRun && ` • Last run: ${new Date(playbook.lastRun).toLocaleDateString()}`}
                    </p>
                    {playbook.description && (
                      <p style={{margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem'}}>{playbook.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => runPlaybook(playbook.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Run Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
