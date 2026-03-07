'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedSegment, setSelectedSegment] = useState('all');

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

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading analytics...</div>;
  }

  if (!data) return <div>No data available</div>;

  const { overview, riskDistribution, monthlyTrend, recentActivity } = data;

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
              style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'all' ? '#6366f1' : '#334155', color: 'white', cursor: 'pointer'}}
            >
              All
            </button>
            <button 
              onClick={() => setSelectedSegment('high')}
              style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'high' ? '#ef4444' : '#334155', color: 'white', cursor: 'pointer'}}
            >
              High Risk
            </button>
            <button 
              onClick={() => setSelectedSegment('medium')}
              style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'medium' ? '#f59e0b' : '#334155', color: 'white', cursor: 'pointer'}}
            >
              Medium Risk
            </button>
            <button 
              onClick={() => setSelectedSegment('low')}
              style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: selectedSegment === 'low' ? '#10b981' : '#334155', color: 'white', cursor: 'pointer'}}
            >
              Low Risk
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
                <div key={segment.name}>
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

        {/* Recent Activity Table */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
          <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.125rem'}}>Recent Customer Activity</h3>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '1px solid #334155'}}>
                  <th style={{textAlign: 'left', padding: '0.75rem', color: '#94a3b8', fontWeight: '500'}}>Customer</th>
                  <th style={{textAlign: 'center', padding: '0.75rem', color: '#94a3b8', fontWeight: '500'}}>Risk Score</th>
                  <th style={{textAlign: 'center', padding: '0.75rem', color: '#94a3b8', fontWeight: '500'}}>MRR</th>
                  <th style={{textAlign: 'center', padding: '0.75rem', color: '#94a3b8', fontWeight: '500'}}>Status</th>
                  <th style={{textAlign: 'right', padding: '0.75rem', color: '#94a3b8', fontWeight: '500'}}>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((customer: any) => (
                  <tr key={customer.id} style={{borderBottom: '1px solid #334155'}}>
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
                    <td style={{padding: '0.75rem', textAlign: 'right', color: '#94a3b8', fontSize: '0.875rem'}}>
                      {new Date(customer.lastActivity).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
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
