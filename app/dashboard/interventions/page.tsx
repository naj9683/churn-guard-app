'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import { track, page } from '@/lib/analytics';
import { MP, mpPage } from '@/lib/mixpanel';

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [interventionType, setInterventionType] = useState('manual_outreach');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    page('Interventions');
    mpPage('Interventions');
    fetchInterventions();
  }, []);

  async function openNewIntervention() {
    setShowModal(true);
    if (customers.length === 0) {
      try {
        const res = await fetch('/api/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(Array.isArray(data) ? data : data.customers || []);
        }
      } catch {}
    }
  }

  async function submitIntervention() {
    if (!selectedCustomerId) return;
    setSubmitting(true);
    try {
      const customer = customers.find(c => c.id === selectedCustomerId);
      const res = await fetch('/api/interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          interventionType,
          mrrAtRisk: customer?.mrr || 0,
          riskScoreAtStart: customer?.riskScore || 50,
          customerSegment: customer?.plan || 'unknown',
          plan: customer?.plan || 'unknown',
          daysSinceLogin: 0,
        }),
      });
      if (res.ok) {
        track('Feature Used', {
          feature: 'Intervention Created',
          customerId: selectedCustomerId,
          interventionType,
        });
        MP.interventionCreated(interventionType, selectedCustomerId);
        MP.firstInterventionCreated();
        setShowModal(false);
        setSelectedCustomerId('');
        fetchInterventions();
      } else {
        alert('Failed to create intervention.');
      }
    } catch {
      alert('Failed to create intervention.');
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteIntervention(id: string) {
    if (!confirm('Delete this intervention?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/interventions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInterventions(prev => prev.filter((i: any) => i.id !== id));
      } else {
        alert('Failed to delete intervention.');
      }
    } catch {
      alert('Failed to delete intervention.');
    } finally {
      setDeleting(null);
    }
  }

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

  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Ensure interventions is always an array
  const safeInterventions = Array.isArray(interventions) ? interventions : [];
  const filteredInterventions = filterStatus
    ? safeInterventions.filter((i: any) => i?.status === filterStatus)
    : safeInterventions;

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
          <button
            onClick={openNewIntervention}
            style={{
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
          <div
            onClick={() => setFilterStatus(null)}
            style={{
              background: filterStatus === null ? '#6366f1' : '#fff',
              border: `1px solid ${filterStatus === null ? '#6366f1' : '#e5e7eb'}`,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }}>
            <div style={{
              color: filterStatus === null ? '#e0e7ff' : '#6b7280',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Total Interventions</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: filterStatus === null ? '#fff' : '#6366f1'
            }}>{safeInterventions.length}</div>
          </div>

          <div
            onClick={() => setFilterStatus(filterStatus === 'success' ? null : 'success')}
            style={{
              background: filterStatus === 'success' ? '#10b981' : '#fff',
              border: `1px solid ${filterStatus === 'success' ? '#10b981' : '#e5e7eb'}`,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }}>
            <div style={{
              color: filterStatus === 'success' ? '#d1fae5' : '#6b7280',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Successful</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: filterStatus === 'success' ? '#fff' : '#10b981'
            }}>{safeInterventions.filter((i: any) => i?.status === 'success').length}</div>
          </div>

          <div
            onClick={() => setFilterStatus(filterStatus === 'failed' ? null : 'failed')}
            style={{
              background: filterStatus === 'failed' ? '#ef4444' : '#fff',
              border: `1px solid ${filterStatus === 'failed' ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }}>
            <div style={{
              color: filterStatus === 'failed' ? '#fee2e2' : '#6b7280',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Failed</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: filterStatus === 'failed' ? '#fff' : '#ef4444'
            }}>{safeInterventions.filter((i: any) => i?.status === 'failed').length}</div>
          </div>

          <div
            onClick={() => setFilterStatus(filterStatus === 'pending' ? null : 'pending')}
            style={{
              background: filterStatus === 'pending' ? '#f59e0b' : '#fff',
              border: `1px solid ${filterStatus === 'pending' ? '#f59e0b' : '#e5e7eb'}`,
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }}>
            <div style={{
              color: filterStatus === 'pending' ? '#fef3c7' : '#6b7280',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Pending</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: filterStatus === 'pending' ? '#fff' : '#f59e0b'
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
          <h3 style={{margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#111827'}}>
            {filterStatus ? `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Interventions` : 'Recent Interventions'}
          </h3>

          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #e5e7eb'}}>
                <th style={{textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Customer</th>
                <th style={{textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Playbook</th>
                <th style={{textAlign: 'center', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Status</th>
                <th style={{textAlign: 'right', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Date</th>
                <th style={{textAlign: 'right', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}></th>
              </tr>
            </thead>
            <tbody>
              {filteredInterventions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{padding: '40px', textAlign: 'center', color: '#6b7280'}}>
                    <div style={{fontSize: '48px', marginBottom: '16px'}}>🎯</div>
                    <div style={{fontSize: '16px', fontWeight: '500', marginBottom: '8px'}}>
                      {filterStatus ? `No ${filterStatus} interventions` : 'No interventions yet'}
                    </div>
                    <div>{filterStatus ? 'Try a different filter' : 'Create your first intervention to get started'}</div>
                  </td>
                </tr>
              ) : (
                filteredInterventions.map((intervention: any, idx: number) => (
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
                    <td style={{padding: '16px 12px', textAlign: 'right'}}>
                      <button
                        onClick={() => deleteIntervention(intervention.id)}
                        disabled={deleting === intervention.id}
                        style={{
                          padding: '5px 12px',
                          background: deleting === intervention.id ? '#f3f4f6' : '#fef2f2',
                          color: deleting === intervention.id ? '#9ca3af' : '#ef4444',
                          border: `1px solid ${deleting === intervention.id ? '#e5e7eb' : '#fecaca'}`,
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: deleting === intervention.id ? 'not-allowed' : 'pointer'
                        }}>
                        {deleting === intervention.id ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Intervention Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', padding: '32px',
            width: '480px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{margin: '0 0 24px', fontSize: '20px', fontWeight: '700', color: '#111827'}}>
              New Intervention
            </h2>
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
                Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                style={{width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'}}
              >
                <option value="">Select a customer...</option>
                {customers.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.email} — Risk {c.riskScore}% — ${c.mrr}/mo
                  </option>
                ))}
              </select>
            </div>
            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
                Intervention Type
              </label>
              <select
                value={interventionType}
                onChange={e => setInterventionType(e.target.value)}
                style={{width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'}}
              >
                <option value="manual_outreach">Manual Outreach</option>
                <option value="discount_offer">Discount Offer</option>
                <option value="success_call">Success Call</option>
                <option value="email_campaign">Email Campaign</option>
              </select>
            </div>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button
                onClick={() => setShowModal(false)}
                style={{padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500'}}>
                Cancel
              </button>
              <button
                onClick={submitIntervention}
                disabled={!selectedCustomerId || submitting}
                style={{
                  padding: '10px 20px', background: selectedCustomerId ? '#6366f1' : '#9ca3af',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  cursor: selectedCustomerId ? 'pointer' : 'not-allowed', fontWeight: '500'
                }}>
                {submitting ? 'Creating...' : 'Start Intervention'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
