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
  const [savedData, setSavedData] = useState({ 
    mrrSaved: 0, 
    customersSaved: 0, 
    interventions: 0,
    successRate: 0,
    revenueAtRisk: 0
  });
  const [churnTrend, setChurnTrend] = useState<any[]>([]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchAnalytics();
      calculateSavedMetrics();
      generateChurnTrend();
    }
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

  async function calculateSavedMetrics() {
    try {
      const res = await fetch('/api/interventions');
      if (res.ok) {
        const interventions = await res.json();
        const successful = interventions.filter((i: any) => i.status === 'success');
        const failed = interventions.filter((i: any) => i.status === 'failed');
        const total = interventions.length;
        const successRate = total > 0 ? Math.round((successful.length / total) * 100) : 0;
        
        const mrrSaved = successful.reduce((sum: number, i: any) => sum + (i.revenueImpact || 0), 0);
        
        // Calculate revenue at risk from high-risk customers
        const customersRes = await fetch('/api/customers');
        const customers = await customersRes.json();
        const atRiskCustomers = customers.customers?.filter((c: any) => c.riskScore >= 70) || [];
        const revenueAtRisk = atRiskCustomers.reduce((sum: number, c: any) => sum + (c.mrr || 0), 0);
        
        setSavedData({
          mrrSaved: mrrSaved,
          customersSaved: successful.length,
          interventions: total,
          successRate: successRate,
          revenueAtRisk: revenueAtRisk
        });
      }
    } catch (error) {
      console.error('Error calculating saved metrics:', error);
    }
  }

  function generateChurnTrend() {
    // Generate last 6 months of churn data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trend = months.map((month, index) => ({
      month,
      churnRate: Math.max(2, 15 - (index * 2) + Math.random() * 3), // Simulated improvement
      churnedCustomers: Math.floor(Math.random() * 5) + 1
    }));
    setChurnTrend(trend);
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

  // Get top at-risk customers by MRR
  const topAtRiskCustomers = data?.recentActivity
    ?.filter((c: any) => c.riskScore >= 70)
    ?.sort((a: any, b: any) => (b.mrr || 0) - (a.mrr || 0))
    ?.slice(0, 10) || [];

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  if (!data) return <div>No data</div>;

  const { overview, monthlyTrend } = data;

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

        {/* KEY METRICS ROW */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', borderLeft: '4px solid #6366f1'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>TOTAL CUSTOMERS</div>
            <div style={{fontSize: '2.5rem', fontWeight: '800', color: '#6366f1'}}>{overview.totalCustomers}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', borderLeft: '4px solid #ef4444'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>REVENUE AT RISK</div>
            <div style={{fontSize: '2.5rem', fontWeight: '800', color: '#ef4444'}}>${savedData.revenueAtRisk.toLocaleString()}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', borderLeft: '4px solid #10b981'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>MRR SAVED</div>
            <div style={{fontSize: '2.5rem', fontWeight: '800', color: '#10b981'}}>${savedData.mrrSaved.toLocaleString()}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', borderLeft: '4px solid #3b82f6'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>INTERVENTION SUCCESS</div>
            <div style={{fontSize: '2.5rem', fontWeight: '800', color: '#3b82f6'}}>{savedData.successRate}%</div>
          </div>
        </div>

        {/* CHARTS ROW 1: Revenue Comparison & Success Rate */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
          {/* Revenue At Risk vs Saved - Comparison */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.125rem'}}>💰 Revenue: At Risk vs Saved</h3>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3rem', height: '220px', padding: '1rem'}}>
              {/* At Risk Bar */}
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{fontSize: '0.875rem', fontWeight: '600', color: '#ef4444'}}>
                  ${savedData.revenueAtRisk > 0 ? (savedData.revenueAtRisk / 1000).toFixed(1) : 0}k
                </div>
                <div style={{
                  width: '80px',
                  height: `${Math.min(180, (savedData.revenueAtRisk / 50000) * 180)}px`,
                  background: 'linear-gradient(to top, #ef4444, #f87171)',
                  borderRadius: '8px 8px 0 0',
                  minHeight: '20px',
                  position: 'relative'
                }}>
                  <div style={{position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#ef4444'}}>
                    AT RISK
                  </div>
                </div>
              </div>
              
              {/* Saved Bar */}
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{fontSize: '0.875rem', fontWeight: '600', color: '#10b981'}}>
                  ${savedData.mrrSaved > 0 ? (savedData.mrrSaved / 1000).toFixed(1) : 0}k
                </div>
                <div style={{
                  width: '80px',
                  height: `${Math.min(180, (savedData.mrrSaved / 50000) * 180)}px`,
                  background: 'linear-gradient(to top, #10b981, #34d399)',
                  borderRadius: '8px 8px 0 0',
                  minHeight: '20px',
                  position: 'relative'
                }}>
                  <div style={{position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: '#10b981'}}>
                    SAVED
                  </div>
                </div>
              </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '1rem', color: '#94a3b8', fontSize: '0.875rem'}}>
              Total Revenue Protected: ${(savedData.mrrSaved + savedData.revenueAtRisk).toLocaleString()}
            </div>
          </div>

          {/* Intervention Success Rate - Donut Chart */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.125rem'}}>🎯 Intervention Success Rate</h3>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px'}}>
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: `conic-gradient(
                  #10b981 ${savedData.successRate * 3.6}deg, 
                  #ef4444 ${savedData.successRate * 3.6}deg ${(savedData.successRate + (100 - savedData.successRate)) * 3.6}deg
                )`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{fontSize: '2rem', fontWeight: '800', color: savedData.successRate >= 50 ? '#10b981' : '#ef4444'}}>
                    {savedData.successRate}%
                  </div>
                  <div style={{fontSize: '0.625rem', color: '#94a3b8'}}>SUCCESS</div>
                </div>
              </div>
              <div style={{marginLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '12px', height: '12px', background: '#10b981', borderRadius: '2px'}}></div>
                  <span style={{fontSize: '0.875rem', color: '#94a3b8'}}>Success: {savedData.customersSaved}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px'}}></div>
                  <span style={{fontSize: '0.875rem', color: '#94a3b8'}}>Failed: {savedData.interventions - savedData.customersSaved}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '12px', height: '12px', background: '#334155', borderRadius: '2px'}}></div>
                  <span style={{fontSize: '0.875rem', color: '#94a3b8'}}>Total: {savedData.interventions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS ROW 2: Churn Trend & Customer Growth */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
          {/* Churn Rate Trend - Line Chart */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.125rem'}}>📉 Churn Rate Trend (Last 6 Months)</h3>
            <div style={{height: '200px', position: 'relative', padding: '1rem 0'}}>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${i * 25}%`,
                  borderTop: '1px dashed #334155',
                  height: 0
                }} />
              ))}
              
              {/* Line chart */}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width: '100%', height: '100%'}}>
                <defs>
                  <linearGradient id="churnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${churnTrend.map((point, i) => {
                    const x = (i / (churnTrend.length - 1)) * 100;
                    const y = 100 - ((point.churnRate / 20) * 100);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')} L 100 100 L 0 100 Z`}
                  fill="url(#churnGradient)"
                />
                <path
                  d={churnTrend.map((point, i) => {
                    const x = (i / (churnTrend.length - 1)) * 100;
                    const y = 100 - ((point.churnRate / 20) * 100);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {churnTrend.map((point, i) => {
                  const x = (i / (churnTrend.length - 1)) * 100;
                  const y = 100 - ((point.churnRate / 20) * 100);
                  return (
                    <circle key={i} cx={x} cy={y} r="2" fill="#ef4444" />
                  );
                })}
              </svg>
              
              {/* X-axis labels */}
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', padding: '0 0.5rem'}}>
                {churnTrend.map((point, i) => (
                  <div key={i} style={{fontSize: '0.75rem', color: '#64748b', textAlign: 'center'}}>
                    {point.month}
                    <div style={{fontSize: '0.625rem', color: '#ef4444', marginTop: '0.25rem'}}>
                      {point.churnRate.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Growth Chart */}
          {monthlyTrend && monthlyTrend.length > 0 && (
            <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
              <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.125rem'}}>📊 Customer Growth Trend</h3>
              <div style={{display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px', padding: '1rem 0'}}>
                {monthlyTrend.map((month: any, index: number) => {
                  const maxCount = Math.max(...monthlyTrend.map((m: any) => m.count));
                  const height = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
                  return (
                    <div key={index} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600'}}>{month.count}</div>
                      <div style={{
                        width: '100%',
                        height: `${height}%`,
                        background: 'linear-gradient(to top, #6366f1, #8b5cf6)',
                        borderRadius: '4px 4px 0 0',
                        minHeight: '4px'
                      }} />
                      <div style={{fontSize: '0.75rem', color: '#64748b'}}>{month.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* TOP AT-RISK CUSTOMERS TABLE */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #ef444440'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{margin: 0, fontSize: '1.125rem', color: '#ef4444'}}>🔥 Top At-Risk Customers (Immediate Action Required)</h3>
            <span style={{fontSize: '0.875rem', color: '#94a3b8'}}>
              Total at risk: ${savedData.revenueAtRisk.toLocaleString()}
            </span>
          </div>
          
          {topAtRiskCustomers.length > 0 ? (
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #334155'}}>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Customer</th>
                  <th style={{textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Risk Score</th>
                  <th style={{textAlign: 'right', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>MRR at Risk</th>
                  <th style={{textAlign: 'right', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {topAtRiskCustomers.map((customer: any, index: number) => (
                  <tr key={customer.id} style={{
                    borderBottom: '1px solid #334155',
                    background: index % 2 === 0 ? 'transparent' : 'rgba(239, 68, 68, 0.05)'
                  }}>
                    <td style={{padding: '1rem'}}>
                      <div style={{fontWeight: '600'}}>{customer.externalId || customer.name || 'Unknown'}</div>
                      <div style={{fontSize: '0.875rem', color: '#64748b'}}>{customer.email}</div>
                    </td>
                    <td style={{padding: '1rem', textAlign: 'center'}}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        background: customer.riskScore >= 80 ? '#ef4444' : '#f59e0b',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '0.875rem'
                      }}>
                        {customer.riskScore}%
                      </span>
                    </td>
                    <td style={{padding: '1rem', textAlign: 'right', fontWeight: '700', color: '#ef4444'}}>
                      ${customer.mrr || 0}
                    </td>
                    <td style={{padding: '1rem', textAlign: 'right'}}>
                      <button
                        onClick={() => openCustomerModal(customer)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Intervene Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              🎉 No high-risk customers! Great job keeping customers healthy.
            </div>
          )}
        </div>

        {/* ALL CUSTOMERS LIST */}
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
