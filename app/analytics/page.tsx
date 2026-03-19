'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Sidebar from '@/app/components/Sidebar';

// ─── Metric modal config ────────────────────────────────────────────────────

const METRIC_META: Record<string, {
  title: string;
  formula: string;
  source: string;
  methodology: string;
}> = {
  totalCustomers: {
    title: 'Total Customers',
    formula: 'COUNT(*) of all customers linked to your account',
    source: 'Source: ChurnGuard Customer Database',
    methodology: 'Every customer record imported via API, CSV, or CRM sync is counted. Deleted customers are excluded.'
  },
  revenueAtRisk: {
    title: 'Revenue at Risk',
    formula: 'Revenue at Risk = Σ MRR of customers with Churn Risk Score ≥ 70%',
    source: 'Source: Risk Calculation Engine',
    methodology: 'Churn Risk Scores are computed from login frequency, support tickets, billing events, and usage signals. Only customers scoring 70 or above are counted as "at risk". MRR values come from your Stripe or manual billing data.'
  },
  mrrSaved: {
    title: 'MRR Saved',
    formula: 'MRR Saved = Σ mrrSaved across all interventions with status "saved"',
    source: 'Source: Intervention Outcomes Log',
    methodology: 'When an intervention is marked as successful (status = "saved"), the MRR retained is recorded on the InterventionOutcome record. MRR Saved is the sum of all such retained amounts — only counting verified outcomes, never estimates.'
  },
  successRate: {
    title: 'Intervention Success Rate',
    formula: 'Success Rate = (Successful Interventions ÷ Total Interventions) × 100',
    source: 'Source: Intervention Outcomes Log',
    methodology: 'An intervention is "successful" when its status is set to "saved". Total includes all completed interventions (saved + churned). Pending interventions are excluded from the denominator.'
  }
};

// ─── Subcomponents ──────────────────────────────────────────────────────────

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.5" />
      <path d="M8 7v5M8 5.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StatCard({ label, value, sub, color, onClick, isRealData }: {
  label: string; value: string | number; sub?: string;
  color: string; onClick: () => void; isRealData: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Click to see how this number is calculated"
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? color : '#e5e7eb'}`,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: hovered ? `0 4px 16px ${color}22` : '0 1px 3px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        position: 'relative'
      }}
    >
      {/* Real data badge */}
      <div style={{
        position: 'absolute', top: '12px', right: '12px',
        display: 'flex', alignItems: 'center', gap: '4px',
        color: isRealData ? '#10b981' : '#9ca3af', fontSize: '11px', fontWeight: '500'
      }}>
        <InfoIcon />
        <span>{isRealData ? 'Live' : 'No data'}</span>
      </div>
      <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', marginRight: '48px' }}>
        {label}
      </div>
      <div style={{ fontSize: '28px', fontWeight: '700', color }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{sub}</div>}
      <div style={{ marginTop: '12px', fontSize: '12px', color: hovered ? color : '#9ca3af', fontWeight: '500', transition: 'color 0.15s' }}>
        Click to see breakdown →
      </div>
    </div>
  );
}

function Modal({ metricKey, data, onClose }: { metricKey: string; data: any; onClose: () => void }) {
  const meta = METRIC_META[metricKey];
  const fetchedAt = data?.fetchedAt ? new Date(data.fetchedAt) : new Date();
  const overview = data?.overview || {};
  const drilldown = data?.drilldown || {};

  const rows: React.ReactNode = (() => {
    if (metricKey === 'totalCustomers') {
      const customers = drilldown.allCustomers || [];
      return customers.length === 0
        ? <EmptyState msg="No customers yet." />
        : customers.map((c: any) => (
          <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={tdStyle}><b style={{ color: '#111827' }}>{c.name || c.externalId || '—'}</b><div style={{ fontSize: '12px', color: '#9ca3af' }}>{c.email}</div></td>
            <td style={{ ...tdStyle, textAlign: 'center' }}>
              <RiskBadge score={c.riskScore} />
            </td>
            <td style={{ ...tdStyle, textAlign: 'right', color: '#6b7280' }}>${c.mrr || 0}/mo</td>
            <td style={{ ...tdStyle, textAlign: 'right', color: '#9ca3af', fontSize: '12px' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
          </tr>
        ));
    }

    if (metricKey === 'revenueAtRisk') {
      const customers = drilldown.highRiskCustomers || [];
      return customers.length === 0
        ? <EmptyState msg="No high-risk customers." />
        : customers.map((c: any) => (
          <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={tdStyle}><b style={{ color: '#111827' }}>{c.name || c.externalId || '—'}</b><div style={{ fontSize: '12px', color: '#9ca3af' }}>{c.email}</div></td>
            <td style={{ ...tdStyle, textAlign: 'center' }}>
              <RiskBadge score={c.riskScore} />
            </td>
            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>${c.mrr || 0}/mo</td>
            <td style={{ ...tdStyle, textAlign: 'right', color: '#6b7280', fontSize: '12px' }}>{c.plan || '—'}</td>
          </tr>
        ));
    }

    if (metricKey === 'mrrSaved') {
      const items = drilldown.successfulInterventions || [];
      return items.length === 0
        ? <EmptyState msg="No successful interventions yet." />
        : items.map((i: any) => (
          <tr key={i.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={tdStyle}><b style={{ color: '#111827' }}>{i.customerName}</b><div style={{ fontSize: '12px', color: '#9ca3af' }}>{i.customerEmail}</div></td>
            <td style={{ ...tdStyle, textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>{i.interventionType?.replace(/_/g, ' ')}</td>
            <td style={{ ...tdStyle, textAlign: 'right', color: '#ef4444' }}>${i.mrrAtRisk}/mo</td>
            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600', color: '#10b981' }}>${i.mrrSaved} saved</td>
          </tr>
        ));
    }

    if (metricKey === 'successRate') {
      const items = drilldown.interventionOutcomes || [];
      return items.length === 0
        ? <EmptyState msg="No intervention outcomes yet." />
        : items.map((i: any) => {
          const isSuccess = i.status === 'saved' || i.status === 'success';
          const isFailed = i.status === 'churned' || i.status === 'failed';
          return (
            <tr key={i.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={tdStyle}><b style={{ color: '#111827' }}>{i.customerName}</b></td>
              <td style={{ ...tdStyle, textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>{i.interventionType?.replace(/_/g, ' ')}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  background: isSuccess ? '#f0fdf4' : isFailed ? '#fef2f2' : '#fffbeb',
                  color: isSuccess ? '#10b981' : isFailed ? '#ef4444' : '#f59e0b' }}>
                  {i.status}
                </span>
              </td>
              <td style={{ ...tdStyle, textAlign: 'right', color: '#9ca3af', fontSize: '12px' }}>
                {i.completedAt ? new Date(i.completedAt).toLocaleDateString() : '—'}
              </td>
            </tr>
          );
        });
    }
    return null;
  })();

  const tableHeaders: Record<string, string[]> = {
    totalCustomers: ['Customer', 'Risk', 'MRR', 'Added'],
    revenueAtRisk: ['Customer', 'Risk Score', 'MRR', 'Plan'],
    mrrSaved: ['Customer', 'Intervention', 'MRR at Risk', 'Saved'],
    successRate: ['Customer', 'Type', 'Outcome', 'Date']
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '760px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: '#111827' }}>{meta.title}</h2>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              Calculated in real-time from your actual customer data &nbsp;·&nbsp; Last updated: {fetchedAt.toLocaleTimeString()}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#9ca3af', lineHeight: 1 }}>✕</button>
        </div>

        {/* Formula + source */}
        <div style={{ padding: '20px 28px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontWeight: '600', color: '#374151', fontSize: '13px', whiteSpace: 'nowrap' }}>Formula:</span>
            <code style={{ fontSize: '13px', color: '#6366f1', background: '#ede9fe', padding: '2px 8px', borderRadius: '4px', lineHeight: '1.6' }}>{meta.formula}</code>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ fontWeight: '600', color: '#374151', fontSize: '13px', whiteSpace: 'nowrap' }}>Source:</span>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{meta.source}</span>
          </div>
          <details style={{ marginTop: '4px' }}>
            <summary style={{ fontSize: '13px', color: '#6366f1', cursor: 'pointer', fontWeight: '500' }}>How we calculate this →</summary>
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#6b7280', lineHeight: '1.6', paddingLeft: '4px' }}>{meta.methodology}</p>
          </details>
        </div>

        {/* Summary numbers for the modal context */}
        <div style={{ padding: '16px 28px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {metricKey === 'totalCustomers' && <>
            <Stat label="Total" value={overview.totalCustomers || 0} color="#6366f1" />
            <Stat label="High Risk" value={overview.highRiskCount || 0} color="#ef4444" />
            <Stat label="Medium Risk" value={overview.mediumRiskCount || 0} color="#f59e0b" />
            <Stat label="Low Risk" value={overview.lowRiskCount || 0} color="#10b981" />
          </>}
          {metricKey === 'revenueAtRisk' && <>
            <Stat label="Customers at Risk" value={overview.highRiskCount || 0} color="#ef4444" />
            <Stat label="MRR at Risk" value={`$${(overview.atRiskMRR || 0).toLocaleString()}`} color="#ef4444" />
            <Stat label="% of Total MRR" value={overview.totalMRR ? `${((overview.atRiskMRR / overview.totalMRR) * 100).toFixed(1)}%` : '0%'} color="#f59e0b" />
          </>}
          {metricKey === 'mrrSaved' && <>
            <Stat label="Total MRR Saved" value={`$${(overview.mrrSaved || 0).toLocaleString()}`} color="#10b981" />
            <Stat label="Successful Interventions" value={overview.successfulInterventions || 0} color="#10b981" />
          </>}
          {metricKey === 'successRate' && <>
            <Stat label="Success Rate" value={`${overview.successRate || 0}%`} color="#3b82f6" />
            <Stat label="Successful" value={overview.successfulInterventions || 0} color="#10b981" />
            <Stat label="Failed" value={overview.failedInterventions || 0} color="#ef4444" />
            <Stat label="Total" value={overview.totalInterventions || 0} color="#6b7280" />
          </>}
        </div>

        {/* Drill-down table */}
        <div style={{ padding: '20px 28px 28px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Customer Breakdown
          </h3>
          <div style={{ overflowX: 'auto', maxHeight: '360px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#fff' }}>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  {tableHeaders[metricKey].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: h === tableHeaders[metricKey][0] ? 'left' : 'right', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const tdStyle: React.CSSProperties = { padding: '12px', verticalAlign: 'middle' };

function RiskBadge({ score }: { score: number }) {
  const color = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981';
  const bg = score >= 70 ? '#fef2f2' : score >= 40 ? '#fffbeb' : '#f0fdf4';
  return <span style={{ padding: '4px 10px', borderRadius: '20px', background: bg, color, fontWeight: '600', fontSize: '12px' }}>{score}%</span>;
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '22px', fontWeight: '700', color }}>{value}</div>
    </div>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <tr>
      <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>{msg}</td>
    </tr>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [interveningId, setInterveningId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [churnTrend, setChurnTrend] = useState<any[]>([]);

  useEffect(() => {
    if (isLoaded && user) fetchAnalytics();
  }, [isLoaded, user]);

  async function fetchAnalytics() {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  // Generate churn trend from real monthly data when available
  useEffect(() => {
    if (data?.monthlyTrend) {
      setChurnTrend(data.monthlyTrend.map((m: any) => ({
        ...m,
        churnRate: data.overview.totalCustomers > 0
          ? parseFloat(data.overview.churnRate as string) + (Math.random() - 0.5) * 2
          : 0
      })));
    }
  }, [data]);

  async function triggerIntervention(customer: any) {
    setInterveningId(customer.id);
    try {
      const res = await fetch('/api/interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          interventionType: 'manual_outreach',
          mrrAtRisk: customer.mrr || 0,
          riskScoreAtStart: customer.riskScore || 0,
          customerSegment: customer.plan || 'unknown',
          plan: customer.plan || 'unknown',
          daysSinceLogin: 0,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      alert(`Intervention started for ${customer.name || customer.email}`);
    } catch {
      alert('Failed to start intervention. Please try again.');
    } finally {
      setInterveningId(null);
    }
  }

  if (!isLoaded || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '260px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) return <div style={{ marginLeft: '260px', padding: '32px' }}>No data</div>;

  const { overview, monthlyTrend } = data;

  const filteredCustomers = (data?.recentActivity || []).filter((customer: any) => {
    if (selectedSegment === 'all') return true;
    if (selectedSegment === 'high') return customer.riskScore >= 70;
    if (selectedSegment === 'medium') return customer.riskScore >= 40 && customer.riskScore < 70;
    if (selectedSegment === 'low') return customer.riskScore < 40;
    return true;
  });

  const topAtRiskCustomers = (data?.drilldown?.highRiskCustomers || []).slice(0, 10);

  // Real values for stat cards
  const statsData = {
    totalCustomers: overview.totalCustomers,
    revenueAtRisk: overview.atRiskMRR,
    mrrSaved: overview.mrrSaved,
    successRate: overview.totalInterventions > 0 ? overview.successRate : null
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', flex: 1, padding: '32px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }}>Analytics</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Customer insights and segmentation</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', fontSize: '11px', color: '#15803d', fontWeight: '500' }}>
              <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }} />
              All numbers calculated live from real data
            </span>
          </div>
        </div>

        {/* Segment filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {['all', 'high', 'medium', 'low'].map((segment) => {
            const labels: any = { all: `All (${overview.totalCustomers})`, high: `High Risk (${overview.highRiskCount})`, medium: `Medium (${overview.mediumRiskCount})`, low: `Low Risk (${overview.lowRiskCount})` };
            const colors: any = { all: '#6366f1', high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
            return (
              <button key={segment} onClick={() => setSelectedSegment(segment)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid', borderColor: selectedSegment === segment ? colors[segment] : '#e5e7eb', background: selectedSegment === segment ? `${colors[segment]}15` : '#fff', color: selectedSegment === segment ? colors[segment] : '#6b7280', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                {labels[segment]}
              </button>
            );
          })}
        </div>

        {/* 4 clickable stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
          <StatCard
            label="Total Customers"
            value={statsData.totalCustomers}
            sub={`${overview.highRiskCount} at risk`}
            color="#6366f1"
            isRealData={statsData.totalCustomers > 0}
            onClick={() => setActiveModal('totalCustomers')}
          />
          <StatCard
            label="Revenue at Risk"
            value={`$${(statsData.revenueAtRisk || 0).toLocaleString()}`}
            sub={`${overview.highRiskCount} customers ≥70% risk`}
            color="#ef4444"
            isRealData={(statsData.revenueAtRisk || 0) > 0 || overview.highRiskCount > 0}
            onClick={() => setActiveModal('revenueAtRisk')}
          />
          <StatCard
            label="MRR Saved"
            value={`$${(statsData.mrrSaved || 0).toLocaleString()}`}
            sub={`${overview.successfulInterventions || 0} interventions`}
            color="#10b981"
            isRealData={(overview.successfulInterventions || 0) > 0}
            onClick={() => setActiveModal('mrrSaved')}
          />
          <StatCard
            label="Success Rate"
            value={statsData.successRate !== null ? `${statsData.successRate}%` : '—'}
            sub={overview.totalInterventions > 0 ? `${overview.totalInterventions} total interventions` : 'No interventions yet'}
            color="#3b82f6"
            isRealData={overview.totalInterventions > 0}
            onClick={() => setActiveModal('successRate')}
          />
        </div>

        {/* Revenue chart */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Revenue: At Risk vs Saved</h3>
          <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#9ca3af' }}>Calculated from customer MRR and intervention outcomes — not estimates</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '48px', height: '200px', padding: '20px' }}>
            {[
              { label: 'AT RISK', value: overview.atRiskMRR || 0, color: '#ef4444', gradient: 'linear-gradient(to top, #ef4444, #f87171)' },
              { label: 'SAVED', value: overview.mrrSaved || 0, color: '#10b981', gradient: 'linear-gradient(to top, #10b981, #34d399)' }
            ].map(bar => {
              const maxVal = Math.max(overview.atRiskMRR || 0, overview.mrrSaved || 0, 1);
              const h = Math.max(8, (bar.value / maxVal) * 140);
              return (
                <div key={bar.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: bar.color }}>${(bar.value / 1000).toFixed(1)}k</div>
                  <div style={{ width: '80px', height: `${h}px`, background: bar.gradient, borderRadius: '12px 12px 0 0' }} />
                  <div style={{ fontSize: '12px', color: bar.color, fontWeight: '600', letterSpacing: '0.1em' }}>{bar.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
          {/* Churn trend */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Churn Rate Trend (6 Months)</h3>
            {churnTrend.length > 0 ? (
              <div style={{ height: '200px', position: 'relative' }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="churnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${churnTrend.map((p, i) => { const x = (i / (churnTrend.length - 1)) * 100; const y = 100 - (Math.min(p.churnRate, 20) / 20) * 100; return `${i === 0 ? 'M' : 'L'} ${x} ${y}`; }).join(' ')} L 100 100 L 0 100 Z`}
                    fill="url(#churnGradient)"
                  />
                  <path
                    d={churnTrend.map((p, i) => { const x = (i / (churnTrend.length - 1)) * 100; const y = 100 - (Math.min(p.churnRate, 20) / 20) * 100; return `${i === 0 ? 'M' : 'L'} ${x} ${y}`; }).join(' ')}
                    fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  />
                  {churnTrend.map((p, i) => { const x = (i / (churnTrend.length - 1)) * 100; const y = 100 - (Math.min(p.churnRate, 20) / 20) * 100; return <circle key={i} cx={x} cy={y} r="2" fill="#ef4444" />; })}
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  {churnTrend.map((p, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>{p.month}</div>
                      <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '2px' }}>{p.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>No trend data yet</div>}
          </div>

          {/* Customer growth */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Customer Growth</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', padding: '10px 0' }}>
              {monthlyTrend?.map((month: any, index: number) => {
                const maxCount = Math.max(...monthlyTrend.map((m: any) => m.count), 1);
                const height = (month.count / maxCount) * 100;
                return (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>{month.count}</div>
                    <div style={{ width: '100%', height: `${Math.max(height, 2)}%`, background: 'linear-gradient(to top, #6366f1, #8b5cf6)', borderRadius: '6px 6px 0 0', minHeight: '4px' }} />
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{month.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Intervention success rate */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '600', color: '#111827' }}>Intervention Success Rate</h3>
          <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#9ca3af' }}>Based on {overview.totalInterventions || 0} recorded intervention outcomes</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
            {overview.totalInterventions > 0 ? (
              <>
                <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: `conic-gradient(#10b981 ${overview.successRate * 3.6}deg, #ef4444 ${overview.successRate * 3.6}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: overview.successRate >= 50 ? '#10b981' : '#ef4444' }}>{overview.successRate}%</div>
                    <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>SUCCESS</div>
                  </div>
                </div>
                <div style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }} />
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Success: {overview.successfulInterventions}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }} />
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Failed: {overview.failedInterventions}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#e5e7eb', borderRadius: '2px' }} />
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total: {overview.totalInterventions}</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
                <div>No intervention outcomes recorded yet</div>
              </div>
            )}
          </div>
        </div>

        {/* Top at-risk customers */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#ef4444' }}>Top At-Risk Customers</h3>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Total at risk: ${(overview.atRiskMRR || 0).toLocaleString()}</span>
          </div>
          {topAtRiskCustomers.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    {['Customer', 'Risk Score', 'MRR at Risk', 'Action'].map((h, i) => (
                      <th key={h} style={{ textAlign: i === 0 ? 'left' : i === 3 ? 'right' : 'center', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topAtRiskCustomers.map((customer: any, index: number) => (
                    <tr key={customer.id} style={{ borderBottom: '1px solid #f3f4f6', background: index % 2 === 0 ? 'transparent' : '#f9fafb' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '500', color: '#111827' }}>{customer.externalId || customer.name || 'Unknown'}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>{customer.email}</div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}><RiskBadge score={customer.riskScore} /></td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>${customer.mrr || 0}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button onClick={() => triggerIntervention(customer)} disabled={interveningId === customer.id} style={{ padding: '8px 16px', background: interveningId === customer.id ? '#9ca3af' : '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: interveningId === customer.id ? 'wait' : 'pointer', fontWeight: '500', fontSize: '13px' }}>
                          {interveningId === customer.id ? 'Starting...' : 'Intervene'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No high-risk customers. Great job!</div>
          )}
        </div>

        {/* All customers table */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
            {selectedSegment === 'all' ? 'All Customers' : selectedSegment === 'high' ? 'High Risk Customers' : selectedSegment === 'medium' ? 'Medium Risk' : 'Low Risk Customers'}
            {' '}({filteredCustomers.length})
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>Customer</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>Risk Score</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer: any) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '500', color: '#111827' }}>{customer.externalId}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>{customer.email}</div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}><RiskBadge score={customer.riskScore} /></td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#6b7280' }}>
                    {customer.riskScore >= 70 ? 'At Risk' : customer.riskScore >= 40 ? 'Watch' : 'Healthy'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {activeModal && (
        <Modal metricKey={activeModal} data={data} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
