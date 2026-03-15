'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterventions();
  }, []);

  async function fetchInterventions() {
    try {
      const res = await fetch('/api/interventions');
      if (res.ok) {
        const data = await res.json();
        console.log('API Response:', data); // Debug log
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setInterventions(data);
        } else if (data && Array.isArray(data.interventions)) {
          setInterventions(data.interventions);
        } else if (data && Array.isArray(data.data)) {
          setInterventions(data.data);
        } else {
          console.error('Unexpected data format:', data);
          setInterventions([]);
        }
      } else {
        console.error('API error:', res.status);
        setInterventions([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setInterventions([]);
    } finally {
      setLoading(false);
    }
  }

  // Ensure interventions is always an array
  const safeInterventions = Array.isArray(interventions) ? interventions : [];

  if (loading) {
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
        {/* Header */}
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
              color: '#111827',
              letterSpacing: '-0.02em'
            }}>
              Interventions
            </h1>
            <p style={{
              margin: 0,
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Track and manage playbook interventions
            </p>
          </div>
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
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              color: '#6b7280',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Total Interventions</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#6366f1'
            }}>{safeInterventions.length}</div>
          </div>
          
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              color: '#6b7280',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Successful</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#10b981'
            }}>{safeInterventions.filter((i: any) => i?.status === 'success').length}</div>
          </div>
          
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              color: '#6b7280',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Failed</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ef4444'
            }}>{safeInterventions.filter((i: any) => i?.status === 'failed').length}</div>
          </div>
          
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              color: '#6b7280',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Pending</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#f59e0b'
            }}>{safeInterventions.filter((i: any) => i?.status === 'pending').length}</div>
          </div>
        </div>

        {/* Table */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
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
              {safeInterventions.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{padding: '40px', textAlign: 'center', color: '#6b7280'}}>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>🎯</div>
                    <div style={{fontSize: '16px', fontWeight: '500', marginBottom: '8px'}}>No interventions yet</div>
                    <div>Create your first intervention to get started</div>
                  </td>
                </tr>
              ) : (
                safeInterventions.map((intervention: any, idx: number) => (
                  <tr key={intervention?.id || idx} style={{borderBottom: '1px solid #f3f4f6'}}>
                    <td style={{padding: '16px 12px', color: '#111827', fontWeight: '500'}}>
                      {intervention?.customer?.name || intervention?.customer?.email || 'Unknown'}
                    </td>
                    <td style={{padding: '16px 12px', color: '#6b7280'}}>
                      {intervention?.playbook?.name || 'Unknown'}
                    </td>
                    <td style={{padding: '16px 12px', textAlign: 'center'}}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: intervention?.status === 'success' ? '#f0fdf4' : intervention?.status === 'failed' ? '#fef2f2' : '#fffbeb',
                        color: intervention?.status === 'success' ? '#10b981' : intervention?.status === 'failed' ? '#ef4444' : '#f59e0b',
                        fontWeight: '600',
                        fontSize: '13px',
                        textTransform: 'capitalize'
                      }}>
                        {intervention?.status || 'pending'}
                      </span>
                    </td>
                    <td style={{padding: '16px 12px', textAlign: 'right', color: '#6b7280'}}>
                      {intervention?.createdAt ? new Date(intervention.createdAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
