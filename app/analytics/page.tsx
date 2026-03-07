'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  async function fetchCustomerDetails(customerId: string) {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/customers/${customerId}`);
      if (res.ok) {
        const details = await res.json();
        setCustomerDetails(details);
        setSelectedCustomer(details.customer);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingDetails(false);
    }
  }

  function closeModal() {
    setSelectedCustomer(null);
    setCustomerDetails(null);
  }

  // Filter customers based on selected segment
  const filteredCustomers = data?.recentActivity?.filter((customer: any) => {
    if (selectedSegment === 'all') return true;
    if (selectedSegment === 'high') return customer.riskScore >= 70;
    if (selectedSegment === 'medium') return customer.riskScore >= 40 && customer.riskScore < 70;
    if (selectedSegment === 'low') return customer.riskScore < 40;
    return true;
  }) || [];

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading analytics...</div>;
  }

  if (!data) return <div>No data available</div>;

  const { overview, riskDistribution, monthlyTrend } = data;

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      {/* Sidebar */}
      <aside style={{width: '250px', background: '#1e293b', borderRight: '1px solid #334155', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem', marginBottom: '2rem'}}>
          <div style={{width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
          ChurnGuard
        </div>
        <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <Link href="/dashboard" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>📊 Dashboard</Link>
          <Link href="/customers" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>👥 Customers</Link>
          <Link href="/playbooks" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>⚡ Playbooks</Link>
          <Link href="/widget-messages" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>💬 Widget</Link>
          <Link href="/email-campaigns" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>📧 Email Campaigns</Link>
          <Link href="/analytics" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#334155', color: 'white', textDecoration: 'none'}}>📈 Analytics</Link>
          <Link href="/settings" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>⚙️ Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{flex: 1, padding: '2rem', marginLeft: '250px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1 style={{margin: 0, fontSize: '1.875rem'}}>📈 Customer Analytics & Segmentation</h1>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button 
              onClick={() => setSelectedSegment('all')}
              style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'all' ? '#6366f1' : '#334155', color: 'white', cursor: 'pointer', fontWeight: selectedSegment === 'all' ? '600' : '400'}}
            >
              All ({overview.totalCustomers})
            </button>
            <button 
              onClick={() => setSelectedSegment('high')}
              style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'high' ? '#ef4444' : '#334155', color: 'white', cursor: 'pointer', fontWeight: selectedSegment === 'high' ? '600' : '400'}}
            >
              High Risk ({overview.highRiskCount})
            </button>
            <button 
              onClick={() => setSelectedSegment('medium')}
              style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'medium' ? '#f59e0b' : '#334155', color: 'white', cursor: 'pointer', fontWeight: selectedSegment === 'medium' ? '600' : '400'}}
            >
              Medium Risk ({overview.mediumRiskCount})
            </button>
            <button 
              onClick={() => setSelectedSegment('low')}
              style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'low' ? '#10b981' : '#334155', color: 'white', cursor: 'pointer', fontWeight: selectedSegment === 'low' ? '600' : '400'}}
            >
              Low Risk ({overview.lowRiskCount})
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          <MetricCard 
            title="Total Customers" 
            value={overview.totalCustomers} 
            subtitle="Active accounts"
            color="#6366f1"
            icon="👥"
          />
          <MetricCard 
            title="High Risk" 
            value={overview.highRiskCount} 
            subtitle={`${overview.churnRate}% churn risk`}
            color="#ef4444"
            icon="🔥"
            trend="up"
          />
          <MetricCard 
            title="Monthly Revenue" 
            value={`$${overview.totalMRR}`} 
            subtitle={`$${overview.atRiskMRR} at risk`}
            color="#10b981"
            icon="💰"
          />
          <MetricCard 
            title="Safe Customers" 
            value={overview.lowRiskCount} 
            subtitle="Healthy accounts"
            color="#3b82f6"
            icon="✅"
          />
        </div>

        {/* Charts Section */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          
          {/* Risk Distribution */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.125rem'}}>Risk Distribution</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {riskDistribution.map((segment: any) => (
                <div key={segment.name} style={{cursor: 'pointer'}} onClick={() => {
                  if (segment.name.includes('High')) setSelectedSegment('high');
                  else if (segment.name.includes('Medium')) setSelectedSegment('medium');
                  else if (segment.name.includes('Low')) setSelectedSegment('low');
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <span style={{width: '12px', height: '12px', borderRadius: '50%', background: segment.color}}></span>
                      {segment.name}
                    </span>
                    <span style={{fontWeight: '600'}}>{segment.count} ({segment.percentage}%)</span>
                  </div>
                  <div style={{height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden'}}>
                    <div style={{width: `${segment.percentage}%`, height: '100%', background: segment.color, transition: 'width 0.3s'}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.125rem'}}>Monthly Growth Trend</h3>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px', padding: '1rem 0'}}>
              {monthlyTrend.map((month: any, idx: number) => {
                const maxVal = Math.max(...monthlyTrend.map((m: any) => m.newCustomers));
                const height = (month.newCustomers / maxVal) * 100;
                return (
                  <div key={idx} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                      <div 
                        style={{
                          width: '100%', 
                          height: `${height}%`, 
                          background: 'linear-gradient(to top, #6366f1, #8b5cf6)', 
                          borderRadius: '4px 4px 0 0',
                          minHeight: '20px'
                        }}
                        title={`${month.newCustomers} new customers`}
                      ></div>
                    </div>
                    <span style={{fontSize: '0.75rem', color: '#94a3b8'}}>{month.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filtered Customer List */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{margin: 0, fontSize: '1.125rem'}}>
              {selectedSegment === 'all' ? 'All Customers' : 
               selectedSegment === 'high' ? '🔥 High Risk Customers' :
               selectedSegment === 'medium' ? '⚠️ Medium Risk Customers' : '✅ Low Risk Customers'}
              {' '}({filteredCustomers.length})
            </h3>
            {selectedSegment !== 'all' && (
              <button 
                onClick={() => setSelectedSegment('all')}
                style={{padding: '0.5rem 1rem', background: '#334155', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem'}}
              >
                View All
              </button>
            )}
          </div>
          
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '1px solid #334155'}}>
                  <th style={{textAlign: 'left', padding: '0.75rem', color: '#94a3b8', fontWeight: '500'}}>Customer</th>
                  <th style={{textAlign: 'center', padding: '0.75rem', color: '#94a3b8', fontWeight: '500'}}>Risk Score</th>
                  <th style={{textAlign: 'center', padding: '0.75rem', color: '#94a3b8', fontWeight: '500'}}>MRR</th>
                  <th style={{textAlign: 'center', padding: '0.75rem', color: '#94a3b8', fontWeight: '500'}}>Status</th>
                  <th style={{textAlign: 'right', padding: '0.75rem', color: '#94a3b8', fontWeight: '500'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{padding: '2rem', textAlign: 'center', color: '#64748b'}}>
                      No customers in this segment
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer: any) => (
                    <tr 
                      key={customer.id} 
                      style={{
                        borderBottom: '1px solid #334155',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onClick={() => fetchCustomerDetails(customer.id)}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{padding: '0.75rem'}}>
                        <div style={{fontWeight: '500'}}>{customer.externalId}</div>
                      </td>
                      <td style={{padding: '0.75rem', textAlign: 'center'}}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          background: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
                          color: 'white'
                        }}>
                          {customer.riskScore}
                        </span>
                      </td>
                      <td style={{padding: '0.75rem', textAlign: 'center'}}>${customer.mrr || 0}</td>
                      <td style={{padding: '0.75rem', textAlign: 'center'}}>
                        <span style={{color: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981'}}>
                          {customer.riskScore >= 70 ? '🔥 At Risk' : customer.riskScore >= 40 ? '⚠️ Watch' : '✅ Healthy'}
                        </span>
                      </td>
                      <td style={{padding: '0.75rem', textAlign: 'right'}}>
                        <button 
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchCustomerDetails(customer.id);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '2rem'
        }} onClick={closeModal}>
          <div 
            style={{
              background: '#1e293b',
              borderRadius: '1rem',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              border: '1px solid #334155',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {loadingDetails ? (
              <div style={{padding: '3rem', textAlign: 'center'}}>Loading customer details...</div>
            ) : (
              <>
                {/* Modal Header */}
                <div style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: selectedCustomer.riskScore >= 70 ? '#ef4444' : selectedCustomer.riskScore >= 40 ? '#f59e0b' : '#10b981'
                }}>
                  <div>
                    <h2 style={{margin: 0, fontSize: '1.5rem', color: 'white'}}>{selectedCustomer.externalId}</h2>
                    <p style={{margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.9)'}}>
                      Risk Score: {selectedCustomer.riskScore} | MRR: ${selectedCustomer.mrr || 0}
                    </p>
                  </div>
                  <button 
                    onClick={closeModal}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      color: 'white',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Modal Body */}
                <div style={{padding: '1.5rem'}}>
                  {/* Customer Info Grid */}
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
                    <InfoCard label="Customer ID" value={selectedCustomer.externalId} />
                    <InfoCard label="Email" value={selectedCustomer.email || 'Not provided'} />
                    <InfoCard label="Risk Score" value={selectedCustomer.riskScore} color={selectedCustomer.riskScore >= 70 ? '#ef4444' : selectedCustomer.riskScore >= 40 ? '#f59e0b' : '#10b981'} />
                    <InfoCard label="Monthly Revenue" value={`$${selectedCustomer.mrr || 0}`} />
                    <InfoCard label="Created" value={new Date(selectedCustomer.createdAt).toLocaleDateString()} />
                    <InfoCard label="Last Updated" value={new Date(selectedCustomer.updatedAt).toLocaleDateString()} />
                  </div>

                  {/* Risk Factors */}
                  <div style={{background: '#0f172a', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem'}}>
                    <h3 style={{margin: '0 0 1rem 0', fontSize: '1.125rem'}}>🎯 Risk Analysis</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#1e293b', borderRadius: '0.5rem'}}>
                        <span>Status</span>
                        <span style={{color: selectedCustomer.riskScore >= 70 ? '#ef4444' : selectedCustomer.riskScore >= 40 ? '#f59e0b' : '#10b981', fontWeight: '600'}}>
                          {selectedCustomer.riskScore >= 70 ? '🔥 High Risk - Immediate Action Required' : 
                           selectedCustomer.riskScore >= 40 ? '⚠️ Medium Risk - Monitor Closely' : 
                           '✅ Low Risk - Healthy Account'}
                        </span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#1e293b', borderRadius: '0.5rem'}}>
                        <span>Recommended Action</span>
                        <span style={{color: '#6366f1', fontWeight: '600'}}>
                          {selectedCustomer.riskScore >= 70 ? 'Send retention email + Call' : 
                           selectedCustomer.riskScore >= 40 ? 'Send check-in email' : 
                           'Continue monitoring'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Events */}
                  {customerDetails?.events && (
                    <div>
                      <h3 style={{margin: '0 0 1rem 0', fontSize: '1.125rem'}}>📊 Recent Activity</h3>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                        {customerDetails.events.slice(0, 5).map((event: any, idx: number) => (
                          <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #6366f1'}}>
                            <div>
                              <div style={{fontWeight: '600', marginBottom: '0.25rem'}}>{event.event}</div>
                              <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>
                                {Object.keys(event.metadata || {}).length > 0 && JSON.stringify(event.metadata)}
                              </div>
                            </div>
                            <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                              {new Date(event.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #334155'}}>
                    <Link 
                      href={`/email-campaigns?customer=${selectedCustomer.id}`}
                      style={{
                        flex: 1,
                        padding: '1rem',
                        background: '#6366f1',
                        color: 'white',
                        textAlign: 'center',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600'
                      }}
                    >
                      📧 Send Email
                    </Link>
                    <button 
                      onClick={closeModal}
                      style={{
                        flex: 1,
                        padding: '1rem',
                        background: '#334155',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, subtitle, color, icon, trend }: any) {
  return (
    <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155', position: 'relative', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: color}}></div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
        <span style={{fontSize: '2rem'}}>{icon}</span>
        {trend && (
          <span style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            background: trend === 'up' ? '#fef3c7' : '#dcfce7',
            color: trend === 'up' ? '#92400e' : '#166534'
          }}>
            {trend === 'up' ? '↑ High' : '↓ Low'}
          </span>
        )}
      </div>
      <h3 style={{margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em'}}>{title}</h3>
      <div style={{fontSize: '2rem', fontWeight: '700', color: color, marginBottom: '0.5rem'}}>{value}</div>
      <p style={{margin: 0, color: '#64748b', fontSize: '0.875rem'}}>{subtitle}</p>
    </div>
  );
}

function InfoCard({ label, value, color }: any) {
  return (
    <div style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem'}}>
      <div style={{fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem'}}>{label}</div>
      <div style={{fontSize: '1.125rem', fontWeight: '600', color: color || 'white'}}>{value}</div>
    </div>
  );
}
