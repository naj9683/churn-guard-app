'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';

export default function PlaybooksPage() {
  const { user, isLoaded } = useUser();
  const [playbooks, setPlaybooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetchPlaybooks();
    }
  }, [isLoaded, user]);

  async function initializeAIPlaybooks() {
    setInitializing(true);
    try {
      const res = await fetch('/api/playbooks/seed', { method: 'POST' });
      if (res.ok) {
        await fetchPlaybooks();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setInitializing(false);
    }
  }

  async function fetchPlaybooks() {
    try {
      const res = await fetch('/api/playbooks');
      if (res.ok) {
        const data = await res.json();
        setPlaybooks(data.playbooks || []);
        // Auto-initialize if empty
        if ((!data.playbooks || data.playbooks.length === 0) && !initializing) {
          initializeAIPlaybooks();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePlaybook(id: string, currentStatus: boolean) {
    try {
      await fetch(`/api/playbooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      fetchPlaybooks();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function getTriggerDisplay(trigger: string) {
    if (trigger.includes('risk_score')) return 'Risk Score';
    if (trigger.includes('days_since_login')) return 'Login Activity';
    if (trigger.includes('feature_usage')) return 'Feature Usage';
    if (trigger.includes('mrr_drop')) return 'MRR Change';
    if (trigger.includes('health_score')) return 'Health Score';
    if (trigger.includes('cancellation')) return 'Cancellation';
    return 'Custom';
  }

  function getTriggerValue(trigger: string) {
    const match = trigger.match(/[<>!=]+(\d+)/);
    return match ? match[1] : 'N/A';
  }

  if (!isLoaded || loading) {
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
        {/* AI Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          color: '#fff'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h2 style={{margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600'}}>AI-Driven Playbooks</h2>
              <p style={{margin: 0, opacity: 0.9, fontSize: '14px'}}>
                ChurnGuard automatically monitors customer behavior and triggers smart interventions.
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '24px',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div>
              <div style={{fontSize: '24px', fontWeight: '700'}}>{playbooks.filter(p => p.isActive).length}</div>
              <div style={{fontSize: '12px', opacity: 0.8}}>Active AI Playbooks</div>
            </div>
            <div>
              <div style={{fontSize: '24px', fontWeight: '700'}}>
                {playbooks.reduce((sum, p) => sum + (p.triggerCount || 0), 0)}
              </div>
              <div style={{fontSize: '12px', opacity: 0.8}}>Auto-Triggers This Week</div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 4px 0',
              fontSize: '28px',
              fontWeight: '700',
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              Smart Playbooks
            </h1>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: '14px'
            }}>
              AI automatically triggers these based on customer behavior
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '24px'
        }}>
          {playbooks.map((playbook) => (
            <div key={playbook.id} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: playbook.isActive ? '#f0fdf4' : '#f1f5f9',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={playbook.isActive ? '#10b981' : '#64748b'} strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a'}}>{playbook.name}</h3>
                  <div style={{fontSize: '12px', color: '#64748b', marginTop: '2px'}}>
                    Trigger: {getTriggerDisplay(playbook.trigger)}
                  </div>
                </div>
              </div>
              
              <p style={{margin: '0 0 16px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5'}}>{playbook.description}</p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{fontSize: '12px', color: '#64748b'}}>Last triggered</div>
                  <div style={{fontSize: '14px', fontWeight: '600', color: '#0f172a'}}>
                    {playbook.lastRun ? new Date(playbook.lastRun).toLocaleDateString() : 'Never'}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: playbook.isActive ? '#f0fdf4' : '#f1f5f9',
                  color: playbook.isActive ? '#10b981' : '#64748b',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {playbook.isActive ? 'AI Active' : 'Paused'}
                </span>
              </div>

              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={() => togglePlaybook(playbook.id, playbook.isActive)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: playbook.isActive ? '#fef2f2' : '#f0fdf4',
                    color: playbook.isActive ? '#ef4444' : '#10b981',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {playbook.isActive ? 'Pause AI' : 'Activate AI'}
                </button>
                <Link href={`/playbooks/${playbook.id}`} style={{
                  padding: '8px 12px',
                  background: '#f8fafc',
                  color: '#0f172a',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: '1px solid #e2e8f0'
                }}>
                  Configure
                </Link>
                <button
                  onClick={async () => {
                    if (confirm('Delete this AI playbook?')) {
                      await fetch(`/api/playbooks/${playbook.id}`, { method: 'DELETE' });
                      fetchPlaybooks();
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    background: '#fef2f2',
                    color: '#ef4444',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
