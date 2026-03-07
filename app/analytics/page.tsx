'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalCustomer, setModalCustomer] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && user) fetchAnalytics();
  }, [isLoaded, user]);

  async function fetchAnalytics() {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const analyticsData = await res.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCustomerModal(customer: any) {
    setModalCustomer(customer);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setModalCustomer(null);
  }

  const filteredCustomers = data?.recentActivity?.filter((customer: any) => {
    if (selectedSegment === 'all') return true;
    if (selectedSegment === 'high') return customer.riskScore >= 70;
    if (selectedSegment === 'medium') return customer.riskScore >= 40 && customer.riskScore < 70;
    if (selectedSegment === 'low') return customer.riskScore < 40;
    return true;
  }) || [];

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  if (!data) return <div>No data</div>;

  const { overview } = data;

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Back to Dashboard */}
      <div style={{padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155'}}>
        <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      <main style={{padding: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1 style={{margin: 0, fontSize: '1.875rem'}}>📈 Customer Analytics & Segmentation</h1>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button onClick={() => setSelectedSegment('all')} style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'all' ? '#6366f1' : '#334155', color: 'white', cursor: 'pointer'}}>
              All ({overview.totalCustomers})
            </button>
            <button onClick={() => setSelectedSegment('high')} style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'high' ? '#ef4444' : '#334155', color: 'white', cursor: 'pointer'}}>
              High Risk ({overview.highRiskCount})
            </button>
            <button onClick={() => setSelectedSegment('medium')} style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'medium' ? '#f59e0b' : '#334155', color: 'white', cursor: 'pointer'}}>
              Medium Risk ({overview.mediumRiskCount})
            </button>
            <button onClick={() => setSelectedSegment('low')} style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'low' ? '#10b981' : '#334155', color: 'white', cursor: 'pointer'}}>
              Low Risk ({overview.lowRiskCount})
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', borderTop: '4px solid #6366f1'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>👥</div>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>TOTAL CUSTOMERS</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#6366f1'}}>{overview.totalCustomers}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', borderTop: '4px solid #ef4444'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔥</div>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>HIGH RISK</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#ef4444'}}>{overview.highRiskCount}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', borderTop: '4px solid #10b981'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>💰</div>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>MONTHLY REVENUE</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#10b981'}}>${overview.totalMRR}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', borderTop: '4px solid #3b82f6'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>✅</div>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>SAFE CUSTOMERS</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#3b82f6'}}>{overview.lowRiskCount}</div>
          </div>
        </div>

        {/* Customer List */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <h3 style={{margin: '0 0 1.5rem 0'}}>
            {selectedSegment === 'all' ? 'All Customers' :
             selectedSegment === 'high' ? '🔥 High Risk Customers' :
             selectedSegment === 'medium' ? '⚠️ Medium Risk Customers' : '✅ Low Risk Customers'}
            {' '}({filteredCustomers.length})
          </h3>

          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #334155'}}>
                <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8'}}>Customer</th>
                <th style={{textAlign: 'center', padding: '1rem', color: '#94a3b8'}}>Risk Score</th>
                <th style={{textAlign: 'center', padding: '1rem', color: '#94a3b8'}}>Status</th>
                <th style={{textAlign: 'right', padding: '1rem', color: '#94a3b8'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer: any) => (
                <tr key={customer.id} style={{borderBottom: '1px solid #334155'}}>
                  <td style={{padding: '1rem'}}>{customer.externalId}</td>
                  <td style={{padding: '1rem', textAlign: 'center'}}>
                    <span style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      background: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      {customer.riskScore}
                    </span>
                  </td>
                  <td style={{padding: '1rem', textAlign: 'center'}}>
                    {customer.riskScore >= 70 ? '🔥 At Risk' : customer.riskScore >= 40 ? '⚠️ Watch' : '✅ Healthy'}
                  </td>
                  <td style={{padding: '1rem', textAlign: 'right'}}>
                    <button
                      onClick={() => openCustomerModal(customer)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL */}
      {showModal && modalCustomer && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: '#1e293b',
              padding: '2rem',
              borderRadius: '1rem',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid #334155'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{margin: '0 0 1rem 0'}}>{modalCustomer.externalId}</h2>
            <p><strong>Email:</strong> {modalCustomer.email || 'Not provided'}</p>
            <p><strong>Risk Score:</strong> {modalCustomer.riskScore}</p>
            <p><strong>MRR:</strong> ${modalCustomer.mrr || 0}</p>
            <p><strong>Created:</strong> {new Date(modalCustomer.lastActivity).toLocaleDateString()}</p>

            <button
              onClick={closeModal}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                background: '#334155',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
