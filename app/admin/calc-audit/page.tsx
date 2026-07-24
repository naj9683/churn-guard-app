'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import { computeRiskScore } from '@/lib/risk-formula';

// ─── Audit wrapper ────────────────────────────────────────────────────────────
// computeRiskScore is the single source of truth — same function used when
// storing the score. A mismatch here means the record pre-dates this formula version.

interface CalcSteps {
  daysSinceLogin: number | null;
  billingPts: number;
  recencyPts: number;
  activityPts: number;
  hasEngagementData: boolean;
  failedPayments30d: number;
  calculatedScore: number;
  storedScore: number;
  storedRevenueAtRisk: number;
  calculatedRevenueAtRisk: number;
  mismatch: boolean;
}

function runFormula(c: any): CalcSteps {
  const events = Array.isArray(c.events)
    ? c.events.map((e: any) => ({ event: e.event, timestamp: Number(e.timestamp) }))
    : [];

  const result = computeRiskScore({
    lastLoginAt: c.lastLoginAt ? new Date(c.lastLoginAt) : null,
    loginCountThisMonth: c.loginCountThisMonth ?? 0,
    recentEvents: events,
  });

  const storedScore = c.riskScore ?? 0;
  const storedRevenueAtRisk = Math.round((c.mrr ?? 0) * storedScore / 100);
  const calculatedRevenueAtRisk = Math.round((c.mrr ?? 0) * result.score / 100);
  const mismatch = Math.abs(result.score - storedScore) > 15;

  return {
    daysSinceLogin: result.daysSinceLogin,
    billingPts: result.billingPts,
    recencyPts: result.recencyPts,
    activityPts: result.activityPts,
    hasEngagementData: result.hasEngagementData,
    failedPayments30d: result.failedPayments30d,
    calculatedScore: result.score,
    storedScore,
    storedRevenueAtRisk,
    calculatedRevenueAtRisk,
    mismatch,
  };
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const card: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const thS: React.CSSProperties = { textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', padding: '9px 14px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #f3f4f6', background: '#f9fafb' };
const tdS: React.CSSProperties = { padding: '11px 14px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f3f4f6', verticalAlign: 'top' };
const labelS: React.CSSProperties = { fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' };
const valueS: React.CSSProperties = { fontSize: '20px', fontWeight: '700', color: '#111827' };

function fmt(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function RiskBadge({ score }: { score: number }) {
  const [bg, color] = score >= 75 ? ['#fef2f2', '#ef4444'] : score >= 50 ? ['#fff7ed', '#f97316'] : ['#f0fdf4', '#16a34a'];
  return <span style={{ fontSize: '12px', fontWeight: '700', padding: '2px 9px', background: bg, color, borderRadius: '20px' }}>{score}</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CalcAuditPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/calc-audit')
      .then(r => r.json())
      .then(d => {
        if (d.users) setUsers(d.users);
        else if (d.error?.includes('Forbidden') || d.error?.includes('admin')) setError('Admin access required. Make sure you are signed in as najwa.saadi1@hotmail.com.');
        else setError(d.error || 'Failed to load users');
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoadingUsers(false));
  }, []);

  useEffect(() => {
    if (!selectedUserId) { setCustomers([]); setSelectedCustomerId(''); setShowCalc(false); return; }
    setLoadingCustomers(true);
    setShowCalc(false);
    setSelectedCustomerId('');
    fetch(`/api/admin/calc-audit?userId=${selectedUserId}`)
      .then(r => r.json())
      .then(d => { if (d.customers) setCustomers(d.customers); else setError(d.error || 'Failed to load customers'); })
      .catch(() => setError('Failed to load customers'))
      .finally(() => setLoadingCustomers(false));
  }, [selectedUserId]);

  const customer = customers.find(c => c.id === selectedCustomerId);
  const steps = customer ? runFormula(customer) : null;

  const selectStyle: React.CSSProperties = {
    padding: '9px 14px', fontSize: '14px', border: '1px solid #e5e7eb', borderRadius: '8px',
    background: '#fff', color: '#111827', cursor: 'pointer', minWidth: '280px', outline: 'none',
  };

  return (
    <AdminShell title="Calculation Audit" subtitle="Inspect stored scores vs. raw source data and re-run the deterministic formula">
      {error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* ── Selectors ── */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ ...labelS, marginBottom: '6px' }}>Select Account</div>
          <select
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
            style={selectStyle}
            disabled={loadingUsers}
          >
            <option value="">{loadingUsers ? 'Loading users…' : '— choose an account —'}</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.email}{u.company ? ` (${u.company})` : ''} · {u._count.customers} customers
              </option>
            ))}
          </select>
        </div>

        {customers.length > 0 && (
          <div>
            <div style={{ ...labelS, marginBottom: '6px' }}>Select Customer</div>
            <select
              value={selectedCustomerId}
              onChange={e => { setSelectedCustomerId(e.target.value); setShowCalc(false); }}
              style={selectStyle}
              disabled={loadingCustomers}
            >
              <option value="">{loadingCustomers ? 'Loading…' : '— choose a customer —'}</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name || c.email} · Risk {c.riskScore} · ${(c.mrr / 100).toFixed(0)}/mo
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Customer audit panel ── */}
      {customer && steps && (
        <>
          {/* Side-by-side cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

            {/* LEFT — Stored values */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '16px' }}>💾</span>
                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>Stored (ChurnGuard)</h2>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thS}>Field</th>
                    <th style={{ ...thS, textAlign: 'right' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdS}>Churn Score</td>
                    <td style={{ ...tdS, textAlign: 'right' }}><RiskBadge score={steps.storedScore} /></td>
                  </tr>
                  <tr>
                    <td style={tdS}>Revenue at Risk</td>
                    <td style={{ ...tdS, textAlign: 'right', fontWeight: '600', color: '#ef4444' }}>
                      ${steps.storedRevenueAtRisk.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td style={tdS}>Risk Reason</td>
                    <td style={{ ...tdS, textAlign: 'right', color: '#6b7280', fontSize: '12px', maxWidth: '180px' }}>
                      {customer.riskReason || '—'}
                    </td>
                  </tr>
                  <tr>
                    <td style={tdS}>Last Updated</td>
                    <td style={{ ...tdS, textAlign: 'right', color: '#6b7280' }}>{fmt(customer.updatedAt)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* RIGHT — Raw source data */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '16px' }}>🗄️</span>
                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>Raw Source Data</h2>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thS}>Field</th>
                    <th style={{ ...thS, textAlign: 'right' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdS}>Stripe MRR</td>
                    <td style={{ ...tdS, textAlign: 'right', fontWeight: '600' }}>${(customer.mrr ?? 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={tdS}>Plan</td>
                    <td style={{ ...tdS, textAlign: 'right' }}>{customer.plan || '—'}</td>
                  </tr>
                  <tr>
                    <td style={tdS}>Widget Data</td>
                    <td style={{ ...tdS, textAlign: 'right' }}>
                      {steps.hasEngagementData
                        ? <span style={{ color: '#16a34a', fontWeight: '600' }}>Present</span>
                        : <span style={{ color: '#ef4444', fontWeight: '600' }}>Missing — install widget</span>}
                    </td>
                  </tr>
                  <tr>
                    <td style={tdS}>Last Login</td>
                    <td style={{ ...tdS, textAlign: 'right' }}>
                      {customer.lastLoginAt ? (
                        <>
                          {fmt(customer.lastLoginAt)}
                          <span style={{ marginLeft: '6px', fontSize: '11px', color: steps.daysSinceLogin! > 14 ? '#ef4444' : '#9ca3af' }}>
                            ({steps.daysSinceLogin}d ago)
                          </span>
                        </>
                      ) : <span style={{ color: '#9ca3af' }}>No data</span>}
                    </td>
                  </tr>
                  <tr>
                    <td style={tdS}>Logins This Month</td>
                    <td style={{ ...tdS, textAlign: 'right' }}>
                      {steps.hasEngagementData
                        ? <span style={{ color: (customer.loginCountThisMonth ?? 0) === 0 ? '#ef4444' : '#374151' }}>{customer.loginCountThisMonth ?? 0}</span>
                        : <span style={{ color: '#9ca3af' }}>No data</span>}
                    </td>
                  </tr>
                  <tr>
                    <td style={tdS}>Failed Payments (30d)</td>
                    <td style={{ ...tdS, textAlign: 'right' }}>
                      <span style={{ color: steps.failedPayments30d > 0 ? '#ef4444' : '#374151', fontWeight: steps.failedPayments30d > 0 ? '700' : '400' }}>
                        {steps.failedPayments30d}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={tdS}>Features Used</td>
                    <td style={{ ...tdS, textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>
                      {Array.isArray(customer.featuresUsed) && customer.featuresUsed.length
                        ? (customer.featuresUsed as string[]).join(', ')
                        : '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Recalculate ── */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showCalc ? '24px' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🧮</span>
                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>Recalculate</h2>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>Deterministic rule-based formula</span>
              </div>
              <button
                onClick={() => setShowCalc(s => !s)}
                style={{
                  padding: '8px 18px', background: '#6366f1', color: '#fff', border: 'none',
                  borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                }}
              >
                {showCalc ? 'Hide Formula' : 'Run Formula ▶'}
              </button>
            </div>

            {showCalc && (
              <>
                {/* Formula steps */}
                <div style={{ background: '#0f172a', borderRadius: '10px', padding: '20px 24px', fontFamily: 'ui-monospace,SFMono-Regular,monospace', fontSize: '13px', lineHeight: '2', marginBottom: '20px', color: '#e2e8f0' }}>

                  <div style={{ color: '#94a3b8', marginBottom: '4px' }}>{'// Step 1 — Billing Failures  (max 40 pts)'}</div>
                  <div>
                    failed_payments_30d = <span style={{ color: '#fbbf24' }}>{steps.failedPayments30d}</span>
                  </div>
                  <div>
                    billing_pts = min({steps.failedPayments30d} × 20, 40) = <span style={{ color: '#818cf8' }}>{steps.billingPts} pts</span>
                  </div>

                  <div style={{ color: '#94a3b8', marginTop: '12px', marginBottom: '4px' }}>{'// Step 2 — Login Recency  (max 35 pts, only if widget data present)'}</div>
                  <div>
                    engagement_data = <span style={{ color: steps.hasEngagementData ? '#34d399' : '#f87171' }}>{steps.hasEngagementData ? 'yes' : 'no — widget not installed'}</span>
                  </div>
                  {steps.hasEngagementData ? (
                    <>
                      <div>
                        days_since_login = <span style={{ color: '#fbbf24' }}>{steps.daysSinceLogin}</span>
                      </div>
                      <div>
                        capped_days = min(<span style={{ color: '#fbbf24' }}>{steps.daysSinceLogin}</span>, 30) = <span style={{ color: '#34d399' }}>{Math.min(steps.daysSinceLogin!, 30)}</span>
                      </div>
                      <div>
                        recency_pts = {Math.min(steps.daysSinceLogin!, 30)} / 30 × 35 = <span style={{ color: '#818cf8' }}>{steps.recencyPts} pts</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ color: '#64748b' }}>recency_pts = 0 pts  {'// absent data ≠ risk'}</div>
                  )}

                  <div style={{ color: '#94a3b8', marginTop: '12px', marginBottom: '4px' }}>{'// Step 3 — Login Frequency  (max 25 pts, only if widget data present)'}</div>
                  {steps.hasEngagementData ? (
                    <>
                      <div>
                        logins_this_month = <span style={{ color: '#fbbf24' }}>{customer.loginCountThisMonth ?? 0}</span>
                      </div>
                      <div>
                        activity_pts = <span style={{ color: '#818cf8' }}>{steps.activityPts} pts</span>
                        <span style={{ color: '#94a3b8' }}> ({(customer.loginCountThisMonth ?? 0) === 0 ? '0 logins → 25' : (customer.loginCountThisMonth ?? 0) < 3 ? '<3 logins → 12' : '≥3 logins → 0'})</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ color: '#64748b' }}>activity_pts = 0 pts  {'// absent data ≠ risk'}</div>
                  )}

                  <div style={{ borderTop: '1px solid #1e293b', marginTop: '16px', paddingTop: '16px', color: '#94a3b8', marginBottom: '4px' }}>{'// Result'}</div>
                  <div>
                    calculated_score = {steps.billingPts} + {steps.recencyPts} + {steps.activityPts} = <span style={{ color: '#34d399', fontWeight: '700' }}>{steps.calculatedScore}</span>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    revenue_at_risk = ${(customer.mrr ?? 0).toLocaleString()} × ({steps.calculatedScore} / 100) = <span style={{ color: '#f87171', fontWeight: '700' }}>${steps.calculatedRevenueAtRisk.toLocaleString()}</span>
                  </div>
                </div>

                {/* Comparison table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                  <thead>
                    <tr>
                      <th style={thS}>Metric</th>
                      <th style={{ ...thS, textAlign: 'center' }}>Stored</th>
                      <th style={{ ...thS, textAlign: 'center' }}>Calculated (Formula)</th>
                      <th style={{ ...thS, textAlign: 'center' }}>Delta</th>
                      <th style={{ ...thS, textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdS}>Churn Score</td>
                      <td style={{ ...tdS, textAlign: 'center' }}><RiskBadge score={steps.storedScore} /></td>
                      <td style={{ ...tdS, textAlign: 'center' }}><RiskBadge score={steps.calculatedScore} /></td>
                      <td style={{ ...tdS, textAlign: 'center', fontWeight: '600', color: Math.abs(steps.calculatedScore - steps.storedScore) > 15 ? '#ef4444' : '#374151' }}>
                        {steps.calculatedScore > steps.storedScore ? '+' : ''}{steps.calculatedScore - steps.storedScore}
                      </td>
                      <td style={{ ...tdS, textAlign: 'center' }}>
                        {steps.mismatch
                          ? <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px' }}>MISMATCH</span>
                          : <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '4px' }}>OK</span>
                        }
                      </td>
                    </tr>
                    <tr>
                      <td style={tdS}>Revenue at Risk</td>
                      <td style={{ ...tdS, textAlign: 'center', color: '#ef4444', fontWeight: '600' }}>${steps.storedRevenueAtRisk.toLocaleString()}</td>
                      <td style={{ ...tdS, textAlign: 'center', color: '#ef4444', fontWeight: '600' }}>${steps.calculatedRevenueAtRisk.toLocaleString()}</td>
                      <td style={{ ...tdS, textAlign: 'center', fontWeight: '600', color: Math.abs(steps.calculatedRevenueAtRisk - steps.storedRevenueAtRisk) > 100 ? '#ef4444' : '#374151' }}>
                        {steps.calculatedRevenueAtRisk > steps.storedRevenueAtRisk ? '+' : ''}${(steps.calculatedRevenueAtRisk - steps.storedRevenueAtRisk).toLocaleString()}
                      </td>
                      <td style={{ ...tdS, textAlign: 'center' }}>
                        {steps.mismatch
                          ? <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px' }}>MISMATCH</span>
                          : <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '4px' }}>OK</span>
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>

                {steps.mismatch && (
                  <div style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>🚨</span>
                    <div>
                      <div style={{ fontWeight: '700', color: '#ef4444', fontSize: '14px', marginBottom: '2px' }}>CALCULATION MISMATCH — Stale Record</div>
                      <div style={{ fontSize: '13px', color: '#7f1d1d' }}>
                        Stored score ({steps.storedScore}) was written before the current formula was applied.
                        Re-run the AI analysis for this customer to sync the stored score to the formula value ({steps.calculatedScore}).
                      </div>
                    </div>
                  </div>
                )}

                {!steps.mismatch && (
                  <div style={{ padding: '14px 18px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>✅</span>
                    <div style={{ fontSize: '13px', color: '#14532d' }}>
                      <strong>Scores align.</strong> Stored score and formula are within 15 points — no anomaly detected.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {selectedUserId && customers.length === 0 && !loadingCustomers && (
        <div style={{ ...card, color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '40px' }}>
          No customers found for this account.
        </div>
      )}
    </AdminShell>
  );
}
