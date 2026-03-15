'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Layout from '@/app/components/Layout';

export default function InterventionsPage() {
  const { user, isLoaded } = useUser();
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) fetchInterventions();
  }, [isLoaded, user]);

  async function fetchInterventions() {
    try {
      const res = await fetch('/api/interventions');
      if (res.ok) {
        const data = await res.json();
        setInterventions(data || []);
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
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Layout 
      title="Interventions"
      subtitle="Track and manage playbook interventions"
      actions={
        <button style={{
          padding: '10px 20px',
          background: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '500',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
        }}>
          + New Intervention
        </button>
      }
    >
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Interventions', value: interventions.length, color: '#6366f1' },
            { label: 'Successful', value: interventions.filter((i: any) => i.status === 'success').length, color: '#10b981' },
            { label: 'Failed', value: interventions.filter((i: any) => i.status === 'failed').length, color: '#ef4444' },
            { label: 'Pending', value: interventions.filter((i: any) => i.status === 'pending').length, color: '#f59e0b' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '10px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                color: '#6b7280',
                fontSize: '13px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>{stat.label}</div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: stat.color
              }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#111827'
        }}>Recent Interventions</h3>

        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid #e5e7eb'}}>
              <th style={{textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Customer</th>
              <th style={{textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Playbook</th>
              <th style={{textAlign: 'center', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Status</th>
              <th style={{textAlign: 'right', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Date</th>
            </tr>
          </thead>
          <tbody>
            {interventions.map((intervention: any) => (
              <tr key={intervention.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                <td style={{padding: '16px 12px', color: '#111827', fontWeight: '500'}}>
                  {intervention.customer?.name || 'Unknown'}
                </td>
                <td style={{padding: '16px 12px', color: '#6b7280'}}>
                  {intervention.playbook?.name || 'Unknown'}
                </td>
                <td style={{padding: '16px 12px', textAlign: 'center'}}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: intervention.status === 'success' ? '#f0fdf4' : intervention.status === 'failed' ? '#fef2f2' : '#fffbeb',
                    color: intervention.status === 'success' ? '#10b981' : intervention.status === 'failed' ? '#ef4444' : '#f59e0b',
                    fontWeight: '600',
                    fontSize: '13px',
                    textTransform: 'capitalize'
                  }}>
                    {intervention.status}
                  </span>
                </td>
                <td style={{padding: '16px 12px', textAlign: 'right', color: '#6b7280'}}>
                  {new Date(intervention.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
