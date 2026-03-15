'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Sidebar from '@/app/components/Sidebar';

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [savedData, setSavedData] = useState({ 
    mrrSaved: 14500, 
    customersSaved: 12, 
    interventions: 28,
    successRate: 78,
    revenueAtRisk: 42300
  });
  const [churnTrend, setChurnTrend] = useState<any[]>([]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchAnalytics();
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

  function generateChurnTrend() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trend = months.map((month, index) => ({
      month,
      churnRate: Math.max(2, 15 - (index * 2) + Math.random() * 3),
      churnedCustomers: Math.floor(Math.random() * 5) + 1
    }));
    setChurnTrend(trend);
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

  if (!data) return <div style={{marginLeft: '260px', padding: '32px'}}>No data</div>;

  const { overview, monthlyTrend } = data;

  const filteredCustomers = data?.recentActivity?.filter((customer: any) => {
    if (selectedSegment === 'all') return true;
    if (selectedSegment === 'high') return customer.riskScore >= 70;
    if (selectedSegment === 'medium') return customer.riskScore >= 40 && customer.riskScore < 70;
    if (selectedSegment === 'low') return customer.riskScore < 40;
    return true;
  }) || [];

  const topAtRiskCustomers = data?.recentActivity
    ?.filter((c: any) => c.riskScore >= 70)
    ?.sort((a: any, b: any) => (b.mrr || 0) - (a.mrr || 0))
    ?.slice(0, 10) || [];

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
        padding: '32px',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{marginBottom: '32px'}}>
          <h1 style={{
            margin: '0 0 4px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827',
            letterSpacing: '-0.02em'
          }}>
            Analytics
          </h1>
          <p style={{
            margin: 0,
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Customer insights and segmentation
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          {['all', 'high', 'medium', 'low'].map((segment) => {
            const labels: any = {
              all: `All (${overview.totalCustomers})`,
              high: `High Risk (${overview.highRiskCount})`,
              medium: `Medium (${overview.mediumRiskCount})`,
              low: `Low Risk (${overview.lowRiskCount})`
            };
            const colors: any = {
              all: '#6366f1',
              high: '#ef4444',
              medium: '#f59e0b',
              low: '#10b981'
            };
            
            return (
              <button
                key={segment}
                onClick={() => setSelectedSegment(segment)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedSegment === segment ? colors[segment] : '#e5e7eb',
                  background: selectedSegment === segment ? `${colors[segment]}15` : '#fff',
                  color: selectedSegment === segment ? colors[segment] : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {labels[segment]}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Customers', value: overview.totalCustomers, color: '#6366f1' },
            { label: 'Revenue at Risk', value: `$${savedData.revenueAtRisk.toLocaleString()}`, color: '#ef4444' },
            { label: 'MRR Saved', value: `$${savedData.mrrSaved.toLocaleString()}`, color: '#10b981' },
            { label: 'Success Rate', value: `${savedData.successRate}%`, color: '#3b82f6' }
          ].map((metric, idx) => (
            <div key={idx} style={{
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
              }}>{metric.label}</div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: metric.color
              }}>{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Revenue Comparison Chart */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{
            margin: '0 0 24px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827'
          }}>Revenue: At Risk vs Saved</h3>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '48px',
            height: '200px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#ef4444'
              }}>
                ${(savedData.revenueAtRisk / 1000).toFixed(1)}k
              </div>
              <div style={{
                width: '80px',
                height: `${Math.min(160, (savedData.revenueAtRisk / 50000) * 160)}px`,
                background: 'linear-gradient(to top, #ef4444, #f87171)',
                borderRadius: '12px 12px 0 0',
                minHeight: '40px'
              }} />
              <div style={{
                fontSize: '12px',
                color: '#ef4444',
                fontWeight: '600',
                letterSpacing: '0.1em'
              }}>
                AT RISK
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#10b981'
              }}>
                ${(savedData.mrrSaved / 1000).toFixed(1)}k
              </div>
              <div style={{
                width: '80px',
                height: `${Math.min(160, (savedData.mrrSaved / 50000) * 160)}px`,
                background: 'linear-gradient(to top, #10b981, #34d399)',
                borderRadius: '12px 12px 0 0',
                minHeight: '40px'
              }} />
              <div style={{
                fontSize: '12px',
                color: '#10b981',
                fontWeight: '600',
                letterSpacing: '0.1em'
              }}>
                SAVED
              </div>
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            marginTop: '16px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Total Revenue Protected: ${(savedData.mrrSaved + savedData.revenueAtRisk).toLocaleString()}
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Churn Rate Trend */}
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              margin: '0 0 24px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827'
            }}>Churn Rate Trend (6 Months)</h3>
            <div style={{height: '200px', position: 'relative'}}>
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
                  return <circle key={i} cx={x} cy={y} r="2" fill="#ef4444" />;
                })}
              </svg>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px'
              }}>
                {churnTrend.map((point, i) => (
                  <div key={i} style={{textAlign: 'center'}}>
                    <div style={{fontSize: '11px', color: '#9ca3af'}}>{point.month}</div>
                    <div style={{fontSize: '10px', color: '#ef4444', marginTop: '2px'}}>{point.churnRate.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Growth */}
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              margin: '0 0 24px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827'
            }}>Customer Growth</h3>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px',
              height: '200px',
              padding: '10px 0'
            }}>
              {monthlyTrend?.map((month: any, index: number) => {
                const maxCount = Math.max(...monthlyTrend.map((m: any) => m.count));
                const height = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
                return (
                  <div key={index} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      fontWeight: '600'
                    }}>{month.count}</div>
                    <div style={{
                      width: '100%',
                      height: `${height}%`,
                      background: 'linear-gradient(to top, #6366f1, #8b5cf6)',
                      borderRadius: '6px 6px 0 0',
                      minHeight: '4px'
                    }} />
                    <div style={{fontSize: '11px', color: '#9ca3af'}}>{month.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Intervention Success Rate */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{
            margin: '0 0 24px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827'
          }}>Intervention Success Rate</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px'
          }}>
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
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: savedData.successRate >= 50 ? '#10b981' : '#ef4444'
                }}>
                  {savedData.successRate}%
                </div>
                <div style={{fontSize: '0.625rem', color: '#6b7280'}}>SUCCESS</div>
              </div>
            </div>
            <div style={{marginLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '12px', height: '12px', background: '#10b981', borderRadius: '2px'}}></div>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Success: {savedData.customersSaved}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px'}}></div>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Failed: {savedData.interventions - savedData.customersSaved}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '12px', height: '12px', background: '#e5e7eb', borderRadius: '2px'}}></div>
                <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Total: {savedData.interventions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top At-Risk Customers */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#ef4444'
            }}>Top At-Risk Customers</h3>
            <span style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Total at risk: ${savedData.revenueAtRisk.toLocaleString()}
            </span>
          </div>

          {topAtRiskCustomers.length > 0 ? (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px',
                      color: '#6b7280',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Customer</th>
                    <th style={{
                      textAlign: 'center',
                      padding: '12px',
                      color: '#6b7280',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Risk Score</th>
                    <th style={{
                      textAlign: 'right',
                      padding: '12px',
                      color: '#6b7280',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>MRR at Risk</th>
                    <th style={{
                      textAlign: 'right',
                      padding: '12px',
                      color: '#6b7280',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {topAtRiskCustomers.map((customer: any, index: number) => (
                    <tr key={customer.id} style={{
                      borderBottom: '1px solid #f3f4f6',
                      background: index % 2 === 0 ? 'transparent' : '#f9fafb'
                    }}>
                      <td style={{padding: '12px'}}>
                        <div style={{fontWeight: '500', color: '#111827'}}>
                          {customer.externalId || customer.name || 'Unknown'}
                        </div>
                        <div style={{fontSize: '13px', color: '#6b7280'}}>
                          {customer.email}
                        </div>
                      </td>
                      <td style={{padding: '12px', textAlign: 'center'}}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          background: customer.riskScore >= 80 ? '#fef2f2' : '#fffbeb',
                          color: customer.riskScore >= 80 ? '#ef4444' : '#f59e0b',
                          fontWeight: '600',
                          fontSize: '13px'
                        }}>
                          {customer.riskScore}%
                        </span>
                      </td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: '#ef4444'
                      }}>
                        ${customer.mrr || 0}
                      </td>
                      <td style={{padding: '12px', textAlign: 'right'}}>
                        <button style={{
                          padding: '8px 16px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '13px'
                        }}>
                          Intervene
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              No high-risk customers! Great job keeping customers healthy.
            </div>
          )}
        </div>

        {/* All Customers Table */}
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
          }}>
            {selectedSegment === 'all' ? 'All Customers' :
             selectedSegment === 'high' ? 'High Risk Customers' :
             selectedSegment === 'medium' ? 'Medium Risk' : 'Low Risk Customers'}
            {' '}({filteredCustomers.length})
          </h3>

          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #e5e7eb'}}>
                <th style={{textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Customer</th>
                <th style={{textAlign: 'center', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Risk Score</th>
                <th style={{textAlign: 'center', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer: any) => (
                <tr key={customer.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                  <td style={{padding: '12px'}}>
                    <div style={{fontWeight: '500', color: '#111827'}}>{customer.externalId}</div>
                    <div style={{fontSize: '13px', color: '#6b7280'}}>{customer.email}</div>
                  </td>
                  <td style={{padding: '12px', textAlign: 'center'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: customer.riskScore >= 70 ? '#fef2f2' : customer.riskScore >= 40 ? '#fffbeb' : '#f0fdf4',
                      color: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}>
                      {customer.riskScore}
                    </span>
                  </td>
                  <td style={{padding: '12px', textAlign: 'center', color: '#6b7280'}}>
                    {customer.riskScore >= 70 ? 'At Risk' : customer.riskScore >= 40 ? 'Watch' : 'Healthy'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
