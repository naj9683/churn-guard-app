'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Playbook {
  id: string;
  name: string;
  trigger: string;
  isActive: boolean;
  description: string | null;
  lastRun: string | null;
}

export default function PlaybooksPage() {
  const { user, isLoaded } = useUser();
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchPlaybooks();
    }
  }, [isLoaded, user]);

  async function fetchPlaybooks() {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setPlaybooks(data.playbooks || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function runPlaybook(id: string) {
    setRunningId(id);
    try {
      const response = await fetch('/api/playbooks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbookId: id })
      });
      if (response.ok) {
        alert('Playbook executed!');
        fetchPlaybooks();
      } else {
        alert('Failed to run playbook');
      }
    } catch (error) {
      alert('Error running playbook');
    } finally {
      setRunningId(null);
    }
  }

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      <header style={{background: '#1e293b', borderBottom: '1px solid #334155', padding: '1.5rem 2rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={{margin: 0}}>Playbooks</h1>
          <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none'}}>← Back to Dashboard</Link>
        </div>
      </header>

      <main style={{maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem'}}>
        <div style={{display: 'grid', gap: '1.5rem'}}>
          {playbooks.length === 0 ? (
            <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '3rem', textAlign: 'center', color: '#64748b'}}>
              <p>No playbooks found.</p>
            </div>
          ) : (
            playbooks.map((playbook) => (
              <div key={playbook.id} style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <div>
                    <h3 style={{margin: '0 0 0.5rem 0'}}>{playbook.name}</h3>
                    <p style={{margin: 0, color: '#94a3b8', fontSize: '0.875rem'}}>{playbook.description || `Trigger: ${playbook.trigger}`}</p>
                  </div>
                  <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      background: playbook.isActive ? '#10b981' : '#64748b',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}>
                      {playbook.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <button 
                      onClick={() => runPlaybook(playbook.id)}
                      disabled={runningId === playbook.id}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: runningId === playbook.id ? 'not-allowed' : 'pointer',
                        opacity: runningId === playbook.id ? 0.5 : 1
                      }}
                    >
                      {runningId === playbook.id ? 'Running...' : 'Run Now'}
                    </button>
                  </div>
                </div>
                <div style={{color: '#64748b', fontSize: '0.875rem'}}>
                  Last run: {playbook.lastRun ? new Date(playbook.lastRun).toLocaleString() : 'Never'}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}