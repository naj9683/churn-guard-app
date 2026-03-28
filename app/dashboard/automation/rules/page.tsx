'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SingleCondition {
  field: string;
  operator: string;
  value: string;
}

interface ConditionGroup {
  logic: 'AND' | 'OR';
  conditions: SingleCondition[];
}

interface RuleForm {
  name: string;
  triggerType: string;
  condition: Record<string, unknown>;
  actionType: string;
  actionConfig: Record<string, unknown>;
  isActive: boolean;
}

interface AutomationRule {
  id: string;
  name: string;
  triggerType: string;
  actionType: string;
  isActive: boolean;
  createdAt: string;
  _count: { logs: number };
  logs: { executedAt: string; status: string }[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TRIGGER_TYPES = [
  { value: 'multi_condition',     label: '⚡ Multi-Condition (AND/OR)' },
  { value: 'risk_threshold',      label: 'Risk Score Threshold' },
  { value: 'payment_failed',      label: 'Payment Failed' },
  { value: 'feature_abandonment', label: 'Feature Abandonment' },
  { value: 'days_since_login',    label: 'Days Since Login' },
  { value: 'mrr_value',           label: 'MRR Value' },
  { value: 'plan_type',           label: 'Plan Type' },
  { value: 'payment_status',      label: 'Payment Status' },
  { value: 'account_age',         label: 'Account Age (Days as Customer)' },
  { value: 'feature_not_used',    label: 'Feature Not Used' },
  { value: 'support_tickets',     label: 'Support Tickets' },
  { value: 'trial_ending',        label: 'Trial Ending Soon' },
  { value: 'no_activity',         label: 'No Activity' },
];

const ACTION_TYPES = [
  { value: 'send_email',         label: 'Send Email' },
  { value: 'send_slack',         label: 'Send Slack Alert' },
  { value: 'send_sms',           label: 'Send SMS' },
  { value: 'create_intervention',label: 'Create Intervention' },
  { value: 'escalate_to_human',  label: 'Escalate to Human' },
  { value: 'trigger_sequence',   label: 'Trigger Sequence' },
];

const CONDITION_FIELDS = [
  { value: 'riskScore',      label: 'Risk Score',           type: 'number' },
  { value: 'daysSinceLogin', label: 'Days Since Login',     type: 'number' },
  { value: 'mrrValue',       label: 'MRR ($)',              type: 'number' },
  { value: 'planType',       label: 'Plan Type',            type: 'string' },
  { value: 'paymentStatus',  label: 'Payment Status',       type: 'string' },
  { value: 'featureUsed',    label: 'Feature Used',         type: 'string' },
  { value: 'loginCount',     label: 'Login Count (month)',  type: 'number' },
  { value: 'accountAge',     label: 'Account Age (days)',   type: 'number' },
];

const OPERATORS = {
  number: [
    { value: '>',  label: 'Greater than' },
    { value: '<',  label: 'Less than' },
    { value: '>=', label: 'At least' },
    { value: '<=', label: 'At most' },
    { value: '==', label: 'Equals' },
    { value: '!=', label: 'Not equals' },
  ],
  string: [
    { value: '==',       label: 'Equals' },
    { value: '!=',       label: 'Not equals' },
    { value: 'contains', label: 'Contains' },
  ],
};

// ─── Templates ────────────────────────────────────────────────────────────────

const TEMPLATES: { label: string; description: string; color: string; rule: Partial<RuleForm> }[] = [
  {
    label: 'High Risk Alert',
    description: 'Email + Slack when risk score ≥ 80',
    color: '#ef4444',
    rule: {
      name: 'High Risk Alert',
      triggerType: 'risk_threshold',
      condition: { value: 80 },
      actionType: 'send_slack',
      actionConfig: { message: 'ChurnGuard: {{name}} has a risk score of {{riskScore}}. Immediate action required.' },
    },
  },
  {
    label: 'Payment Recovery',
    description: 'Email customer 1h after payment fails',
    color: '#f59e0b',
    rule: {
      name: 'Payment Recovery Email',
      triggerType: 'payment_failed',
      condition: { withinHours: 1 },
      actionType: 'send_email',
      actionConfig: { template: 'payment_failed', subject: 'Action required: Update your payment method' },
    },
  },
  {
    label: 'Re-engagement Sequence',
    description: 'Trigger 3-step re-engagement if inactive 14d',
    color: '#8b5cf6',
    rule: {
      name: 'Feature Abandonment Re-engagement',
      triggerType: 'feature_abandonment',
      condition: { days: 14 },
      actionType: 'trigger_sequence',
      actionConfig: { sequenceType: 'risk_retention' },
    },
  },
  {
    label: 'Critical Escalation',
    description: 'Escalate to human: high MRR + high risk',
    color: '#ec4899',
    rule: {
      name: 'Critical Customer Escalation',
      triggerType: 'multi_condition',
      condition: {
        logic: 'AND',
        conditions: [
          { field: 'riskScore', operator: '>=', value: '75' },
          { field: 'mrrValue',  operator: '>=', value: '500' },
        ],
      } as unknown as Record<string, unknown>,
      actionType: 'escalate_to_human',
      actionConfig: { note: 'High-value customer at critical churn risk — requires immediate CSM outreach.' },
    },
  },
];

// ─── Empty form factory ───────────────────────────────────────────────────────

function emptyForm(): RuleForm {
  return {
    name: '',
    triggerType: 'risk_threshold',
    condition: { value: 70 },
    actionType: 'send_email',
    actionConfig: {},
    isActive: true,
  };
}

function emptyCondition(): SingleCondition {
  return { field: 'riskScore', operator: '>', value: '70' };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AutomationRulesPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [form, setForm] = useState<RuleForm>(emptyForm());
  const [multiConditions, setMultiConditions] = useState<SingleCondition[]>([emptyCondition()]);
  const [multiLogic, setMultiLogic] = useState<'AND' | 'OR'>('AND');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runMsg, setRunMsg] = useState<string | null>(null);

  useEffect(() => { fetchRules(); }, []);

  async function fetchRules() {
    setLoading(true);
    try {
      const res = await fetch('/api/automation/rules');
      if (res.ok) {
        const data = await res.json();
        setRules(data.rules ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  function applyTemplate(t: typeof TEMPLATES[0]) {
    const r = t.rule;
    setForm({
      name: r.name ?? '',
      triggerType: r.triggerType ?? 'risk_threshold',
      condition: r.condition ?? {},
      actionType: r.actionType ?? 'send_email',
      actionConfig: r.actionConfig ?? {},
      isActive: true,
    });
    if (r.triggerType === 'multi_condition' && r.condition) {
      const g = r.condition as unknown as ConditionGroup;
      setMultiLogic(g.logic ?? 'AND');
      setMultiConditions(g.conditions ?? [emptyCondition()]);
    }
    setShowBuilder(true);
  }

  async function saveRule() {
    setSaving(true);
    setSaveMsg(null);

    let finalCondition = form.condition;
    if (form.triggerType === 'multi_condition') {
      finalCondition = { logic: multiLogic, conditions: multiConditions } as unknown as Record<string, unknown>;
    }

    try {
      const res = await fetch('/api/automation/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, condition: finalCondition }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMsg('Rule created successfully');
        setShowBuilder(false);
        setForm(emptyForm());
        setMultiConditions([emptyCondition()]);
        fetchRules();
      } else {
        setSaveMsg(data.error ?? 'Save failed');
      }
    } catch {
      setSaveMsg('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function toggleRule(rule: AutomationRule) {
    await fetch('/api/automation/rules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rule.id, isActive: !rule.isActive }),
    });
    fetchRules();
  }

  async function deleteRule(id: string) {
    if (!confirm('Delete this rule?')) return;
    await fetch(`/api/automation/rules?id=${id}`, { method: 'DELETE' });
    fetchRules();
  }

  async function runNow() {
    setRunning(true);
    setRunMsg(null);
    try {
      const res = await fetch('/api/automation/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await res.json();
      if (res.ok) {
        setRunMsg(`Done — ${data.fired} fired, ${data.skipped} skipped, ${data.failed} failed`);
      } else {
        setRunMsg(data.error ?? 'Run failed');
      }
    } catch {
      setRunMsg('Network error');
    } finally {
      setRunning(false);
    }
  }

  const activeCount = rules.filter(r => r.isActive).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <Link href="/dashboard" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Dashboard</Link>
              <span style={{ color: '#d1d5db' }}>/</span>
              <span style={{ color: '#111827', fontSize: '14px', fontWeight: '500' }}>Automation Rules</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#111827', letterSpacing: '-0.02em' }}>
              Automation Rules
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
              {activeCount} active rule{activeCount !== 1 ? 's' : ''} — running every 15 minutes
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={runNow}
              disabled={running}
              style={{
                padding: '10px 20px', background: running ? '#e5e7eb' : '#fff',
                color: running ? '#9ca3af' : '#374151', border: '1px solid #e5e7eb',
                borderRadius: '8px', fontWeight: '500', fontSize: '14px',
                cursor: running ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}
            >
              {running ? 'Running...' : 'Run Now'}
            </button>
            <button
              onClick={() => { setShowBuilder(true); setForm(emptyForm()); setMultiConditions([emptyCondition()]); }}
              style={{
                padding: '10px 20px', background: '#6366f1', color: '#fff',
                border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}
            >
              + New Rule
            </button>
          </div>
        </div>

        {runMsg && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#15803d' }}>
            {runMsg}
          </div>
        )}
        {saveMsg && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#15803d' }}>
            {saveMsg}
          </div>
        )}

        {/* Templates */}
        {!showBuilder && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Quick Templates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => applyTemplate(t)}
                  style={{
                    padding: '16px', background: '#fff', border: '1px solid #e5e7eb',
                    borderRadius: '10px', textAlign: 'left', cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'box-shadow 0.15s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color, marginBottom: '10px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{t.label}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>{t.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rule Builder */}
        {showBuilder && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px', marginBottom: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>Rule Builder</h2>
              <button onClick={() => setShowBuilder(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '20px', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Name */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Rule Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. High Risk Alert"
                  style={inputStyle}
                />
              </div>

              {/* Trigger */}
              <div>
                <label style={labelStyle}>Trigger Type</label>
                <select
                  value={form.triggerType}
                  onChange={e => {
                    const t = e.target.value;
                    let cond: Record<string, unknown> = {};
                    if (t === 'risk_threshold')     cond = { value: 70 };
                    else if (t === 'payment_failed')        cond = { withinHours: 24 };
                    else if (t === 'feature_abandonment')   cond = { days: 7 };
                    else if (t === 'multi_condition')       cond = {};
                    else if (t === 'days_since_login')      cond = { days: 14 };
                    else if (t === 'mrr_value')             cond = { operator: '>', value: 100 };
                    else if (t === 'plan_type')             cond = { plan: 'free' };
                    else if (t === 'payment_status')        cond = { status: 'failed' };
                    else if (t === 'account_age')           cond = { days: 90 };
                    else if (t === 'feature_not_used')      cond = { feature: '', days: 14 };
                    else if (t === 'support_tickets')       cond = { count: 3, withinDays: 30 };
                    else if (t === 'trial_ending')          cond = { withinDays: 3 };
                    else if (t === 'no_activity')           cond = { days: 30 };
                    setForm(f => ({ ...f, triggerType: t, condition: cond }));
                  }}
                  style={inputStyle}
                >
                  {TRIGGER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {/* Action */}
              <div>
                <label style={labelStyle}>Action Type</label>
                <select
                  value={form.actionType}
                  onChange={e => setForm(f => ({ ...f, actionType: e.target.value, actionConfig: {} }))}
                  style={inputStyle}
                >
                  {ACTION_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
            </div>

            {/* Trigger config */}
            {form.triggerType === 'risk_threshold' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={labelStyle}>Risk Score Threshold (0–100)</label>
                <input
                  type="number" min={0} max={100}
                  value={String(form.condition.value ?? 70)}
                  onChange={e => setForm(f => ({ ...f, condition: { value: Number(e.target.value) } }))}
                  style={{ ...inputStyle, width: '100px' }}
                />
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>Fire for all customers whose risk score is at or above this value.</p>
              </div>
            )}

            {form.triggerType === 'payment_failed' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={labelStyle}>Within Hours</label>
                <input
                  type="number" min={1}
                  value={String(form.condition.withinHours ?? 24)}
                  onChange={e => setForm(f => ({ ...f, condition: { withinHours: Number(e.target.value) } }))}
                  style={{ ...inputStyle, width: '100px' }}
                />
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>Fire for customers who had a payment failure in the last N hours.</p>
              </div>
            )}

            {form.triggerType === 'feature_abandonment' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={labelStyle}>Inactive for (days)</label>
                <input
                  type="number" min={1}
                  value={String(form.condition.days ?? 7)}
                  onChange={e => setForm(f => ({ ...f, condition: { days: Number(e.target.value) } }))}
                  style={{ ...inputStyle, width: '100px' }}
                />
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>Fire for customers who haven&apos;t used any feature in the last N days.</p>
              </div>
            )}

            {form.triggerType === 'days_since_login' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={labelStyle}>Days since last login</label>
                <input
                  type="number" min={1}
                  value={String(form.condition.days ?? 14)}
                  onChange={e => setForm(f => ({ ...f, condition: { days: Number(e.target.value) } }))}
                  style={{ ...inputStyle, width: '100px' }}
                />
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>Fire for customers who haven&apos;t logged in for at least N days.</p>
              </div>
            )}

            {form.triggerType === 'mrr_value' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={labelStyle}>MRR Condition</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    value={String(form.condition.operator ?? '>')}
                    onChange={e => setForm(f => ({ ...f, condition: { ...f.condition, operator: e.target.value } }))}
                    style={{ ...inputStyle, width: 'auto' }}
                  >
                    <option value=">">Greater than</option>
                    <option value="<">Less than</option>
                    <option value=">=">At least</option>
                    <option value="<=">At most</option>
                    <option value="==">Equals</option>
                  </select>
                  <span style={{ fontSize: '14px', color: '#374151' }}>$</span>
                  <input
                    type="number" min={0}
                    value={String(form.condition.value ?? 100)}
                    onChange={e => setForm(f => ({ ...f, condition: { ...f.condition, value: Number(e.target.value) } }))}
                    style={{ ...inputStyle, width: '120px' }}
                  />
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>Fire for customers whose monthly recurring revenue matches this condition.</p>
              </div>
            )}

            {form.triggerType === 'plan_type' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={labelStyle}>Plan Name</label>
                <input
                  value={String(form.condition.plan ?? '')}
                  onChange={e => setForm(f => ({ ...f, condition: { plan: e.target.value } }))}
                  placeholder="e.g. free, starter, pro, enterprise"
                  style={inputStyle}
                />
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>Fire for customers on this specific plan. Must match exactly (case-sensitive).</p>
              </div>
            )}

            {form.triggerType === 'payment_status' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={labelStyle}>Payment Status</label>
                <select
                  value={String(form.condition.status ?? 'failed')}
                  onChange={e => setForm(f => ({ ...f, condition: { status: e.target.value } }))}
                  style={inputStyle}
                >
                  <option value="failed">Failed</option>
                  <option value="past_due">Past Due</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="active">Active</option>
                </select>
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>Fire for customers whose most recent payment event matches this status.</p>
              </div>
            )}

            {form.triggerType === 'account_age' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={labelStyle}>Account older than (days)</label>
                <input
                  type="number" min={1}
                  value={String(form.condition.days ?? 90)}
                  onChange={e => setForm(f => ({ ...f, condition: { days: Number(e.target.value) } }))}
                  style={{ ...inputStyle, width: '100px' }}
                />
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>Fire for customers who signed up more than N days ago.</p>
              </div>
            )}

            {form.triggerType === 'feature_not_used' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Feature name (optional)</label>
                  <input
                    value={String(form.condition.feature ?? '')}
                    onChange={e => setForm(f => ({ ...f, condition: { ...f.condition, feature: e.target.value } }))}
                    placeholder="e.g. analytics, integrations (leave blank = any feature)"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Not used in last (days)</label>
                  <input
                    type="number" min={1}
                    value={String(form.condition.days ?? 14)}
                    onChange={e => setForm(f => ({ ...f, condition: { ...f.condition, days: Number(e.target.value) } }))}
                    style={{ ...inputStyle, width: '100px' }}
                  />
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Fire for customers who haven&apos;t used the specified feature in the last N days.</p>
              </div>
            )}

            {form.triggerType === 'support_tickets' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Minimum ticket count</label>
                  <input
                    type="number" min={1}
                    value={String(form.condition.count ?? 3)}
                    onChange={e => setForm(f => ({ ...f, condition: { ...f.condition, count: Number(e.target.value) } }))}
                    style={{ ...inputStyle, width: '100px' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Within last (days)</label>
                  <input
                    type="number" min={1}
                    value={String(form.condition.withinDays ?? 30)}
                    onChange={e => setForm(f => ({ ...f, condition: { ...f.condition, withinDays: Number(e.target.value) } }))}
                    style={{ ...inputStyle, width: '100px' }}
                  />
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Fire for customers who submitted N or more support tickets in the last X days.</p>
              </div>
            )}

            {form.triggerType === 'trial_ending' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={labelStyle}>Trial ends within (days)</label>
                <input
                  type="number" min={1}
                  value={String(form.condition.withinDays ?? 3)}
                  onChange={e => setForm(f => ({ ...f, condition: { withinDays: Number(e.target.value) } }))}
                  style={{ ...inputStyle, width: '100px' }}
                />
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>Fire for customers whose trial expires within the next N days.</p>
              </div>
            )}

            {form.triggerType === 'no_activity' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={labelStyle}>No activity for (days)</label>
                <input
                  type="number" min={1}
                  value={String(form.condition.days ?? 30)}
                  onChange={e => setForm(f => ({ ...f, condition: { days: Number(e.target.value) } }))}
                  style={{ ...inputStyle, width: '100px' }}
                />
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>Fire for customers with no login AND no feature usage in the last N days.</p>
              </div>
            )}

            {/* Multi-condition builder */}
            {form.triggerType === 'multi_condition' && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Match</span>
                  <select
                    value={multiLogic}
                    onChange={e => setMultiLogic(e.target.value as 'AND' | 'OR')}
                    style={{ ...inputStyle, width: 'auto', padding: '6px 10px' }}
                  >
                    <option value="AND">ALL conditions (AND)</option>
                    <option value="OR">ANY condition (OR)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {multiConditions.map((cond, idx) => {
                    const fieldMeta = CONDITION_FIELDS.find(f => f.value === cond.field);
                    const ops = OPERATORS[fieldMeta?.type === 'number' ? 'number' : 'string'];
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {idx > 0 && (
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1', minWidth: '28px', textAlign: 'center' }}>
                            {multiLogic}
                          </span>
                        )}
                        <select
                          value={cond.field}
                          onChange={e => {
                            const updated = [...multiConditions];
                            updated[idx] = { ...cond, field: e.target.value, operator: '>', value: '' };
                            setMultiConditions(updated);
                          }}
                          style={{ ...inputStyle, width: 'auto', padding: '6px 10px', fontSize: '13px' }}
                        >
                          {CONDITION_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                        <select
                          value={cond.operator}
                          onChange={e => {
                            const updated = [...multiConditions];
                            updated[idx] = { ...cond, operator: e.target.value };
                            setMultiConditions(updated);
                          }}
                          style={{ ...inputStyle, width: 'auto', padding: '6px 10px', fontSize: '13px' }}
                        >
                          {ops.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <input
                          value={cond.value}
                          onChange={e => {
                            const updated = [...multiConditions];
                            updated[idx] = { ...cond, value: e.target.value };
                            setMultiConditions(updated);
                          }}
                          placeholder="value"
                          style={{ ...inputStyle, width: '100px', padding: '6px 10px', fontSize: '13px' }}
                        />
                        {multiConditions.length > 1 && (
                          <button
                            onClick={() => setMultiConditions(c => c.filter((_, i) => i !== idx))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '16px', lineHeight: 1, padding: '4px' }}
                          >×</button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setMultiConditions(c => [...c, emptyCondition()])}
                  style={{
                    marginTop: '12px', padding: '6px 14px', background: 'none',
                    border: '1px dashed #6366f1', color: '#6366f1', borderRadius: '6px',
                    cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit',
                  }}
                >
                  + Add Condition
                </button>
              </div>
            )}

            {/* Action config */}
            <ActionConfigEditor form={form} setForm={setForm} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={saveRule}
                disabled={saving || !form.name}
                style={{
                  padding: '11px 28px', background: saving || !form.name ? '#a5b4fc' : '#6366f1',
                  color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700',
                  fontSize: '14px', cursor: saving || !form.name ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                }}
              >
                {saving ? 'Saving...' : 'Create Rule'}
              </button>
              <button
                onClick={() => setShowBuilder(false)}
                style={{ padding: '11px 20px', background: 'none', border: '1px solid #e5e7eb', color: '#374151', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cancel
              </button>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151', marginLeft: 'auto' }}>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  style={{ width: '16px', height: '16px' }}
                />
                Active immediately
              </label>
            </div>
          </div>
        )}

        {/* Rules List */}
        <div>
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
            Your Rules {rules.length > 0 && <span style={{ color: '#9ca3af', fontWeight: '400' }}>({rules.length})</span>}
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>Loading rules…</div>
          ) : rules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚡</div>
              <p style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>No automation rules yet</p>
              <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#6b7280' }}>Create your first rule or start from a template above.</p>
              <button
                onClick={() => setShowBuilder(true)}
                style={{ padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Create First Rule
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rules.map(rule => {
                const lastLog = rule.logs?.[0];
                const triggerLabel = TRIGGER_TYPES.find(t => t.value === rule.triggerType)?.label ?? rule.triggerType;
                const actionLabel  = ACTION_TYPES.find(a => a.value === rule.actionType)?.label ?? rule.actionType;
                return (
                  <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    {/* Active indicator */}
                    <div
                      onClick={() => toggleRule(rule)}
                      title={rule.isActive ? 'Click to pause' : 'Click to activate'}
                      style={{
                        width: '36px', height: '20px', borderRadius: '10px',
                        background: rule.isActive ? '#10b981' : '#d1d5db',
                        position: 'relative', cursor: 'pointer', flexShrink: 0,
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: '2px',
                        left: rule.isActive ? '18px' : '2px',
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: '#fff', transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{rule.name}</div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={tagStyle('#ede9fe', '#7c3aed')}>{triggerLabel}</span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>→</span>
                        <span style={tagStyle('#ecfdf5', '#059669')}>{actionLabel}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{rule._count.logs} fires</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                        {lastLog ? `Last: ${new Date(lastLog.executedAt).toLocaleDateString()}` : 'Never fired'}
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteRule(rule.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: '16px', flexShrink: 0, padding: '4px', borderRadius: '4px' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
                    >×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Action Config Editor ─────────────────────────────────────────────────────

function ActionConfigEditor({ form, setForm }: { form: RuleForm; setForm: React.Dispatch<React.SetStateAction<RuleForm>> }) {
  const set = (key: string, val: string) => setForm(f => ({ ...f, actionConfig: { ...f.actionConfig, [key]: val } }));
  const get = (key: string) => (form.actionConfig[key] as string | undefined) ?? '';

  switch (form.actionType) {
    case 'send_email':
      return (
        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#374151' }}>Email Configuration</h4>
          <div>
            <label style={labelStyle}>Subject</label>
            <input value={get('subject')} onChange={e => set('subject', e.target.value)} placeholder="e.g. We miss you — let's reconnect" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Body (HTML)</label>
            <textarea value={get('html')} onChange={e => set('html', e.target.value)} placeholder="<p>Hi, we noticed...</p>" rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} />
          </div>
          <div>
            <label style={labelStyle}>Or use template</label>
            <select value={get('template')} onChange={e => set('template', e.target.value)} style={inputStyle}>
              <option value="">— custom html above —</option>
              <option value="payment_failed">Payment Failed</option>
              <option value="churn_risk">Churn Risk</option>
              <option value="re_engagement">Re-engagement</option>
            </select>
          </div>
        </div>
      );

    case 'send_slack':
      return (
        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>Slack Configuration</h4>
          <label style={labelStyle}>Message</label>
          <input value={get('message')} onChange={e => set('message', e.target.value)} placeholder="ChurnGuard: {{name}} is at risk (score: {{riskScore}})" style={inputStyle} />
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6b7280' }}>{'Leave blank to use the default message. Supports {{name}}, {{riskScore}}, {{mrr}} placeholders.'}</p>
        </div>
      );

    case 'send_sms':
      return (
        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>SMS Configuration</h4>
          <label style={labelStyle}>Message (160 chars max)</label>
          <input value={get('message')} onChange={e => set('message', e.target.value)} placeholder="Hi! We noticed you haven't logged in recently. Need help? Reply STOP to opt out." style={inputStyle} maxLength={160} />
        </div>
      );

    case 'create_intervention':
      return (
        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>Intervention Configuration</h4>
          <label style={labelStyle}>Intervention Type</label>
          <select value={get('interventionType') || 'auto_outreach'} onChange={e => set('interventionType', e.target.value)} style={inputStyle}>
            <option value="auto_outreach">Auto Outreach</option>
            <option value="discount_offer">Discount Offer</option>
            <option value="success_call">Success Call</option>
            <option value="executive_outreach">Executive Outreach</option>
          </select>
        </div>
      );

    case 'escalate_to_human':
      return (
        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>Escalation Note</h4>
          <input value={get('note')} onChange={e => set('note', e.target.value)} placeholder="Auto-escalated: high-value customer requires immediate CSM outreach" style={inputStyle} />
        </div>
      );

    case 'trigger_sequence':
      return (
        <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>Sequence Configuration</h4>
          <label style={labelStyle}>Sequence Type</label>
          <select value={get('sequenceType') || 'risk_retention'} onChange={e => set('sequenceType', e.target.value)} style={inputStyle}>
            <optgroup label="Retention">
              <option value="risk_retention">Risk Retention (3-step · immediate → 48h → day 7)</option>
              <option value="vip_early_warning">VIP Early Warning (Slack + email · 3-step)</option>
              <option value="downgrade_prevention">Downgrade Prevention (offer + Slack · 2-step)</option>
            </optgroup>
            <optgroup label="Recovery">
              <option value="dunning">Payment Recovery / Dunning (3-step)</option>
              <option value="win_back">Win-Back Campaign (40% offer · day 0 → 7 → 14)</option>
            </optgroup>
            <optgroup label="Onboarding">
              <option value="welcome">Welcome / Onboarding (3-step)</option>
              <option value="new_customer_rescue">New Customer Rescue (inactive signup · 3-step)</option>
            </optgroup>
            <optgroup label="Engagement">
              <option value="feature_adoption">Feature Adoption</option>
              <option value="support_followup">Support Ticket Follow-up (3-step)</option>
            </optgroup>
          </select>
          <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#6b7280' }}>
            Each sequence runs automatically on a schedule. Steps fire at set intervals and skip if the customer has already re-engaged.
          </p>
        </div>
      );

    default:
      return null;
  }
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb',
  borderRadius: '7px', fontSize: '14px', color: '#111827',
  background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: '600',
  color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

function tagStyle(bg: string, color: string): React.CSSProperties {
  return {
    display: 'inline-block', padding: '3px 9px', background: bg, color,
    borderRadius: '20px', fontSize: '12px', fontWeight: '500',
  };
}
