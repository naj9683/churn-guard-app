'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';

export default function PlaybooksPage() {
  const { user, isLoaded } = useUser();
  const [playbooks, setPlaybooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) fetchPlaybooks();
  }, [isLoaded, user]);

  async function fetchPlaybooks() {
    try {
      const res = await fetch('/api/playbooks');
      if (res.ok) {
        const data = await res.json();
        setPlaybooks(data.playbooks || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded || loading) {
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
        <div style={{marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{
              margin: '0 0 8px 0',
              fontSize: '28px',
              fontWeight: '700',
              color: '#fff',
              letterSpacing: '-0.02em'
            }}>
              Playbooks
            </h1>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: '14px'
            }}>
              Automated workflows to prevent churn
            </p>
          </div>
          <Link href="/playbooks/new" style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            + Create Playbook
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {playbooks.map((playbook) => (
            <div key={playbook.id} style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(99, 102, 241, 0.15)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                fontSize: '20px'
              }}>🔮</div>
              <h3 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#fff'}}>{playbook.name}</h3>
              <p style={{margin: '0 0 16px 0', fontSize: '14px', color: '#64748b'}}>{playbook.description}</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: playbook.isActive ? '#10b98120' : '#64748b20',
                  color: playbook.isActive ? '#10b981' : '#64748b',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {playbook.isActive ? 'Active' : 'Inactive'}
                </span>
                <Link href={`/playbooks/${playbook.id}`} style={{
                  padding: '6px 12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#6366f1',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
