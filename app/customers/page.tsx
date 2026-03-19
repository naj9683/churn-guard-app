'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import RiskAnalysisModal, { type RiskAnalysisData } from '@/app/components/RiskAnalysisModal';
import { track, page } from '@/lib/analytics';

interface Customer {
  id: string;
  name: string | null;
  email: string;
  riskScore: number;
  mrr: number;
  arr: number;
  createdAt: string;
}

export default function CustomersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high'>('all');
  const tableRef = useRef<HTMLDivElement>(null);
  const [riskModal, setRiskModal] = useState<RiskAnalysisData | null>(null);
  const [analyzingCustomer, setAnalyzingCustomer] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      page('Customers');
      track('Feature Used', { feature: 'Risk Score Viewed' });
      fetchCustomers();
    }
  }, [isLoaded, user]);

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function analyzeRisk(customer: Customer) {
    setAnalyzingCustomer(customer.id);
    try {
      const res = await fetch(`/api/risk/analyze/${customer.id}`);
      const data = await res.json();
      if (res.ok) setRiskModal({ ...data, name: customer.name ?? undefined });
      else alert(data.error ?? 'Analysis failed');
    } catch {
      alert('Network error');
    } finally {
      setAnalyzingCustomer(null);
    }
  }

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredCustomers = filter === 'high' 
    ? customers.filter(c => c.riskScore >= 70)
    : customers;

  const highRiskCount = customers.filter(c => c.riskScore >= 70).length;
  const totalMRR = customers.reduce((sum, c) => sum + (c.mrr || 0), 0);

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
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              Customers
            </h1>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: '14px'
            }}>
              Manage your customer base and risk profiles
            </p>
          </div>
          <Link href="/dashboard/customers/new" style={{
            padding: '10px 20px',
            background: '#6366f1',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            + Add Customer
          </Link>
        </div>

        {/* Stats - CLICKABLE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Total Customers */}
          <div 
            onClick={() => {
              setFilter('all');
              scrollToTable();
            }}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '12px',
              opacity: 0.1
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div style={{
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Total Customers</div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#0f172a'
            }}>{customers.length}</div>
            <div style={{
              fontSize: '12px',
              color: '#6366f1',
              marginTop: '8px',
              fontWeight: '500'
            }}>View all →</div>
          </div>

          {/* High Risk */}
          <div 
            onClick={() => {
              setFilter('high');
              scrollToTable();
            }}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(239,68,68,0.15)';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '12px',
              opacity: 0.1
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div style={{
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>High Risk</div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ef4444'
            }}>{highRiskCount}</div>
            <div style={{
              fontSize: '12px',
              color: '#ef4444',
              marginTop: '8px',
              fontWeight: '500'
            }}>View at-risk →</div>
          </div>

          {/* Total MRR */}
          <div 
            onClick={() => router.push('/analytics')}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(16,185,129,0.15)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '12px',
              opacity: 0.1
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div style={{
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Total MRR</div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10b981'
            }}>${totalMRR.toLocaleString()}</div>
            <div style={{
              fontSize: '12px',
              color: '#10b981',
              marginTop: '8px',
              fontWeight: '500'
            }}>View analytics →</div>
          </div>
        </div>

        {/* Filter indicator */}
        {filter === 'high' && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{color: '#ef4444', fontSize: '14px', fontWeight: '500'}}>
              Showing high risk customers only
            </span>
            <button 
              onClick={() => setFilter('all')}
              style={{
                background: '#fff',
                border: '1px solid #fecaca',
                color: '#ef4444',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Table */}
        <div 
          ref={tableRef}
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: '#0f172a'
            }}>
              Customer List {filter === 'high' && <span style={{color: '#ef4444'}}>(High Risk)</span>}
            </h3>
            <div style={{fontSize: '14px', color: '#64748b'}}>
              {filteredCustomers.length} customers
            </div>
          </div>

          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #e2e8f0'}}>
                <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Customer</th>
                <th style={{textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Risk Score</th>
                <th style={{textAlign: 'right', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>MRR</th>
                <th style={{textAlign: 'right', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                  <td style={{padding: '16px 12px'}}>
                    <div style={{fontWeight: '500', color: '#0f172a'}}>{customer.name || customer.email}</div>
                    <div style={{fontSize: '13px', color: '#64748b'}}>{customer.email}</div>
                  </td>
                  <td style={{padding: '16px 12px', textAlign: 'center'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: customer.riskScore >= 70 ? '#fef2f2' : customer.riskScore >= 40 ? '#fffbeb' : '#f0fdf4',
                      color: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}>
                      {customer.riskScore}%
                    </span>
                  </td>
                  <td style={{padding: '16px 12px', textAlign: 'right', fontWeight: '500', color: '#0f172a'}}>
                    ${customer.mrr || 0}
                  </td>
                  <td style={{padding: '16px 12px', textAlign: 'right'}}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => analyzeRisk(customer)}
                        disabled={analyzingCustomer === customer.id}
                        style={{
                          padding: '6px 12px',
                          background: analyzingCustomer === customer.id ? '#f3f4f6' : '#fafafa',
                          color: analyzingCustomer === customer.id ? '#9ca3af' : '#6366f1',
                          border: '1px solid #e0d9ff',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: analyzingCustomer === customer.id ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {analyzingCustomer === customer.id ? 'Analyzing...' : 'Analyze Risk'}
                      </button>
                      <Link href={`/dashboard/customers/${customer.id}`} style={{
                        padding: '6px 12px',
                        background: '#f8fafc',
                        color: '#374151',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        border: '1px solid #e2e8f0'
                      }}>
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {riskModal && (
        <RiskAnalysisModal
          data={riskModal}
          onClose={() => setRiskModal(null)}
          onCreateIntervention={(id) => {
            setRiskModal(null);
            router.push(`/dashboard/interventions?customerId=${id}`);
          }}
        />
      )}
    </div>
  );
}
