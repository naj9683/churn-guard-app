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
            background: '#6366f1',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            + Create Playbook
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
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
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <h3 style={{margin: 0, fontSize: '18px', fontWeight: '600', color: '#0f172a'}}>{playbook.name}</h3>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: playbook.isActive ? '#f0fdf4' : '#f1f5f9',
                  color: playbook.isActive ? '#10b981' : '#64748b',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {playbook.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p style={{margin: '0 0 20px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5'}}>{playbook.description}</p>
              <Link href={`/playbooks/${playbook.id}`} style={{
                padding: '10px 16px',
                background: '#f8fafc',
                color: '#0f172a',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                border: '1px solid #e2e8f0',
                display: 'inline-block',
                textAlign: 'center',
                width: '100%',
                transition: 'all 0.2s ease'
              }}>
                Edit Playbook
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
