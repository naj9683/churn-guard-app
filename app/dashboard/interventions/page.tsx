'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Intervention {
  id: string;
  customerId: string;
  interventionType: string;
  status: string;
  riskScoreAtStart: number;
  customerSegment: string;
  plan: string;
  createdAt: string;
  mrrAtRisk: number;
}

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, saved: 0, churned: 0 });
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchInterventions();
  }, []);

  async function fetchInterventions() {
    try {
      const res = await fetch('/api/interventions');
      const data = await res.json();
      if (data.interventions) {
        setInterventions(data.interventions);
        const pending = data.interventions.filter((i: Intervention) => i.status === 'pending').length;
        const saved = data.interventions.filter((i: Intervention) => i.status === 'saved').length;
        const churned = data.interventions.filter((i: Intervention) => i.status === 'churned').length;
        setStats({
          total: data.interventions.length,
          pending,
          saved,
          churned
        });
      }
    } catch (error) {
      console.error('Error fetching interventions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteIntervention(id: string) {
    if (!confirm('Are you sure you want to delete this intervention?')) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/interventions?id=${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setInterventions(prev => prev.filter(i => i.id !== id));
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          pending: prev.pending - 1
        }));
      } else {
        alert('Failed to delete intervention');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting intervention');
    } finally {
      setDeleting(null);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
      case 'saved': return { bg: '#d1fae5', text: '#065f46', border: '#10b981' };
      case 'churned': return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#9ca3af' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>Loading interventions...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#94a3b8',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #334155'
          }}>
            <span>←</span> Back to Dashboard
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
            🔧 Interventions
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            Track and manage all customer retention interventions
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Interventions</div>
            <div style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}>{stats.total}</div>
          </div>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155', borderTop: '3px solid #f59e0b' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Pending</div>
            <div style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: '700' }}>{stats.pending}</div>
          </div>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155', borderTop: '3px solid #10b981' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Saved</div>
            <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: '700' }}>{stats.saved}</div>
          </div>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155', borderTop: '3px solid #ef4444' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Churned</div>
            <div style={{ color: '#ef4444', fontSize: '2rem', fontWeight: '700' }}>{stats.churned}</div>
          </div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>All Interventions</h2>
            <Link href="/dashboard/next-best-action" style={{
              background: '#6366f1',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>+</span> New Intervention
            </Link>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Customer ID</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Risk Score</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Segment</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>MRR at Risk</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interventions.map((intervention) => {
                  const statusStyle = getStatusColor(intervention.status);
                  return (
                    <tr key={intervention.id} style={{ borderTop: '1px solid #334155' }}>
                      <td style={{ padding: '1.25rem 1.5rem', color: 'white', fontWeight: '500' }}>
                        {intervention.customerId.substring(0, 20)}...
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#cbd5e1', textTransform: 'capitalize' }}>
                        {intervention.interventionType.replace(/_/g, ' ')}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`
                        }}>
                          {intervention.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: intervention.riskScoreAtStart >= 70 ? '#ef4444' : '#f59e0b', fontWeight: '600' }}>
                        {intervention.riskScoreAtStart}%
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#cbd5e1', textTransform: 'capitalize' }}>
                        {intervention.customerSegment}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#94a3b8' }}>
                        {formatDate(intervention.createdAt)}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#ef4444', fontWeight: '600' }}>
                        ${intervention.mrrAtRisk.toLocaleString()}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <button
                          onClick={() => deleteIntervention(intervention.id)}
                          disabled={deleting === intervention.id}
                          style={{
                            background: 'transparent',
                            color: deleting === intervention.id ? '#64748b' : '#ef4444',
                            border: '1px solid #ef4444',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: deleting === intervention.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            opacity: deleting === intervention.id ? 0.5 : 1
                          }}
                        >
                          {deleting === intervention.id ? '⏳' : '🗑️'} 
                          {deleting === intervention.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {interventions.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
              <div>No interventions yet. Start by creating one from the AI Actions page.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}