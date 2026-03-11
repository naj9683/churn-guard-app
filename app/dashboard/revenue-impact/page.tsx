'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RevenueImpactPage() {
  const { user } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  async function fetchData() {
    try {
      const res = await fetch('/api/revenue-impact');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: 'white' }}>
        Loading Revenue Impact...
      </div>
    );
  }

  const s = data?.summary || {};

  return (
    <div style={{ padding: '2rem', color: 'white', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰 Revenue Impact</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        Track which interventions actually retained revenue vs. just sent emails
      </p>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <MetricCard 
          title="Total MRR Saved" 
          value={`$${s.totalMrrSaved?.toLocaleString() || 0}`}
          subtitle="Revenue retained through interventions"
          color="#10b981"
        />
        <MetricCard 
          title="Success Rate" 
          value={`${s.successRate || 0}%`}
          subtitle={`${s.saved || 0} saved out of ${s.totalInterventions || 0} interventions`}
          color="#6366f1"
        />
        <MetricCard 
          title="ROI" 
          value={`${s.roi || 0}%`}
          subtitle={`$${s.netBenefit?.toLocaleString() || 0} net benefit`}
          color="#f59e0b"
        />
        <MetricCard 
          title="MRR at Risk Prevented" 
          value={`$${s.totalMrrAtRisk?.toLocaleString() || 0}`}
          subtitle="Total value of interventions attempted"
          color="#ef4444"
        />
      </div>

      {/* By Intervention Type */}
      <div style={{ 
        background: '#1e293b', 
        borderRadius: '1rem', 
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Performance by Intervention Type</h2>
        
        {data?.byType && Object.entries(data.byType).length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(data.byType).map(([type, stats]: [string, any]) => (
              <div key={type} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                background: '#0f172a',
                borderRadius: '0.5rem'
              }}>
                <div>
                  <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                    {type.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                    {stats.count} attempts • {stats.saved} saved • {stats.lost} lost
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                    ${stats.mrrSaved.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                    MRR Saved
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
            No intervention data yet. Start tracking outcomes from your playbooks.
          </div>
        )}
      </div>

      {/* Recent Outcomes */}
      <div style={{ 
        background: '#1e293b', 
        borderRadius: '1rem', 
        padding: '1.5rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Interventions</h2>
        
        {data?.recentOutcomes?.length > 0 ? (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {data.recentOutcomes.map((outcome: any) => (
              <div key={outcome.id} style={{ 
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '1rem',
                padding: '1rem',
                background: '#0f172a',
                borderRadius: '0.5rem',
                alignItems: 'center',
                fontSize: '0.875rem'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{outcome.customer?.name || 'Unknown'}</div>
                  <div style={{ color: '#94a3b8' }}>{outcome.interventionType.replace(/_/g, ' ')}</div>
                </div>
                <div style={{ color: '#94a3b8' }}>
                  {new Date(outcome.startedAt).toLocaleDateString()}
                </div>
                <div style={{ 
                  color: outcome.status === 'saved' ? '#10b981' : 
                         outcome.status === 'churned' ? '#ef4444' : '#f59e0b',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {outcome.status}
                </div>
                <div style={{ textAlign: 'right' }}>
                  ${outcome.mrrSaved > 0 ? outcome.mrrSaved.toLocaleString() : outcome.mrrAtRisk.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
            No interventions tracked yet. Use the API to log playbook outcomes.
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, color }: { title: string, value: string, subtitle: string, color: string }) {
  return (
    <div style={{ 
      background: '#1e293b', 
      borderRadius: '1rem', 
      padding: '1.5rem',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
        {title}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {value}
      </div>
      <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
        {subtitle}
      </div>
    </div>
  );
}
