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
                ChurnGuard automatically monitors customer behavior and triggers smart interventions. No manual setup required.
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
            <div>
              <div style={{fontSize: '24px', fontWeight: '700'}}>
                {playbooks.reduce((sum, p) => sum + (p.successRate || 0), 0) / (playbooks.length || 1)}%
              </div>
              <div style={{fontSize: '12px', opacity: 0.8}}>Avg. Success Rate</div>
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
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {playbook.isSystem && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 8px',
                  background: '#f0fdf4',
                  color: '#10b981',
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  AI Managed
                </div>
              )}
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                marginTop: playbook.isSystem ? '8px' : '0'
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
                    {playbook.triggerType === 'risk_score' && <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>}
                    {playbook.triggerType === 'days_since_login' && <><path d="M12 2v20M2 12h20"/></>}
                    {playbook.triggerType === 'mrr_drop' && <><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}
                    {playbook.triggerType === 'feature_usage' && <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/></>}
                    {playbook.triggerType === 'expansion_ready' && <><path d="M23 6l-9.5 5.5-5.5-3.5L1 14"/><path d="M17 6h6v6"/></>}
                    {playbook.triggerType === 'cancellation_intent' && <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
                  </svg>
                </div>
                <div>
                  <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a'}}>{playbook.name}</h3>
                  <div style={{fontSize: '12px', color: '#64748b', marginTop: '2px'}}>
                    Triggers: {playbook.triggerType === 'risk_score' ? `Risk ≥ ${playbook.triggerValue}%` : 
                              playbook.triggerType === 'days_since_login' ? `No login ≥ ${playbook.triggerValue} days` :
                              playbook.triggerType === 'mrr_drop' ? `MRR drop ≥ ${playbook.triggerValue}%` :
                              playbook.triggerType === 'feature_usage' ? `Uses < ${playbook.triggerValue} features` :
                              playbook.triggerType === 'expansion_ready' ? `Health score ≥ ${playbook.triggerValue}%` :
                              'Cancellation detected'}
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
                  <div style={{fontSize: '12px', color: '#64748b'}}>Last 7 days</div>
                  <div style={{fontSize: '18px', fontWeight: '700', color: '#0f172a'}}>
                    {playbook.triggerCount || 0} <span style={{fontSize: '12px', fontWeight: '400', color: '#64748b'}}>triggers</span>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '12px', color: '#64748b'}}>Success rate</div>
                  <div style={{fontSize: '18px', fontWeight: '700', color: '#10b981'}}>
                    {playbook.successRate || 0}%
                  </div>
                </div>
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
