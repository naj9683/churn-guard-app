'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';

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

  const filteredCustomers = data?.recentActivity?.filter((customer: any) => {
    if (selectedSegment === 'all') return true;
    if (selectedSegment === 'high') return customer.riskScore >= 70;
    if (selectedSegment === 'medium') return customer.riskScore >= 40 && customer.riskScore < 70;
    if (selectedSegment === 'low') return customer.riskScore < 40;
    return true;
  }) || [];

  if (!isLoaded || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(99, 102, 241, 0.1)',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) return <div>No data</div>;

  const { overview } = data;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)',
      display: 'flex',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <Sidebar />
      
      <div style={{
        marginLeft: '280px',
        flex: 1,
        padding: '32px',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{marginBottom: '32px'}}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '-0.02em'
          }}>
            Analytics
          </h1>
          <p style={{
            margin: 0,
            color: '#64748b',
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
                  borderColor: selectedSegment === segment ? colors[segment] : 'rgba(255, 255, 255, 0.1)',
                  background: selectedSegment === segment ? `${colors[segment]}20` : 'rgba(255, 255, 255, 0.03)',
                  color: selectedSegment === segment ? colors[segment] : '#94a3b8',
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
            { label: 'Total Customers', value: overview.totalCustomers, color: '#6366f1', icon: '👥' },
            { label: 'High Risk', value: overview.highRiskCount, color: '#ef4444', icon: '🔥' },
            { label: 'Monthly Revenue', value: `$${overview.totalMRR}`, color: '#10b981', icon: '💰' },
            { label: 'Safe Customers', value: overview.lowRiskCount, color: '#3b82f6', icon: '✅' }
          ].map((metric, idx) => (
            <div key={idx} style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: `${metric.color}15`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                fontSize: '18px'
              }}>{metric.icon}</div>
              <div style={{
                color: '#64748b',
                fontSize: '12px',
                textTransform: 'uppercase',
                marginBottom: '4px'
              }}>{metric.label}</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: metric.color
              }}>{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Customer Table */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff'
          }}>
            {selectedSegment === 'all' ? 'All Customers' :
             selectedSegment === 'high' ? '🔥 High Risk Customers' :
             selectedSegment === 'medium' ? '⚠️ Medium Risk' : '✅ Low Risk Customers'}
            {' '}({filteredCustomers.length})
          </h3>

          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase'}}>Customer</th>
                <th style={{textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase'}}>Risk Score</th>
                <th style={{textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer: any) => (
                <tr key={customer.id} style={{borderBottom: '1px solid rgba(255, 255, 255, 0.05)'}}>
                  <td style={{padding: '12px'}}>
                    <div style={{fontWeight: '500', color: '#fff'}}>{customer.externalId}</div>
                    <div style={{fontSize: '13px', color: '#64748b'}}>{customer.email}</div>
                  </td>
                  <td style={{padding: '12px', textAlign: 'center'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: customer.riskScore >= 70 ? '#ef444420' : customer.riskScore >= 40 ? '#f59e0b20' : '#10b98120',
                      color: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}>
                      {customer.riskScore}
                    </span>
                  </td>
                  <td style={{padding: '12px', textAlign: 'center', color: '#94a3b8'}}>
                    {customer.riskScore >= 70 ? '🔥 At Risk' : customer.riskScore >= 40 ? '⚠️ Watch' : '✅ Healthy'}
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
