'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '@/app/admin/components/AdminShell';

// ── types ──────────────────────────────────────────────────────────────────

interface SlackAlert {
  id: string;
  alertType: string | null;
  messageSent: boolean | null;
  errorMessage: string | null;
  sentAt: string;
  riskScore: number | null;
  message: string | null;
}

interface CrmLog {
  id: string;
  crmType: string;
  direction: string;
  entityType: string;
  status: string;
  message: string | null;
  createdAt: string;
}

interface CrmIntegration {
  userId: string;
  type: string;
  enabled: boolean;
  syncStatus: string;
  lastError: string | null;
  lastSyncAt: string | null;
}

interface StripeEvent {
  id: string;
  event: string;
  timestamp: string;
  createdAt: string;
}

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: string;
  messageId: string | null;
  errorMessage: string | null;
  createdAt: string;
}

interface SmsLog {
  id: string;
  to: string;
  body: string;
  status: string;
  messageSid: string | null;
  errorMessage: string | null;
  createdAt: string;
}

interface WebhookRow {
  id: string;
  url: string;
  events: string;
  active: boolean;
  lastTestedAt: string | null;
  lastStatus: string | null;
  label: string | null;
  updatedAt: string;
}

interface HealthData {
  fetchedAt: string;
  slack: { recent: SlackAlert[]; total24h: number; successCount: number; failedCount: number };
  crm: { logs: CrmLog[]; integrations: CrmIntegration[]; total24h: number; successCount: number; failedCount: number };
  stripe: { events: StripeEvent[]; total24h: number };
  email: { logs: EmailLog[]; total24h: number; successCount: number; failedCount: number };
  sms: { logs: SmsLog[]; total24h: number; successCount: number; failedCount: number };
  webhooks: WebhookRow[];
}

// ── helpers ────────────────────────────────────────────────────────────────

const REFRESH_INTERVAL = 30;

function relativeTime(iso: string | null) {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function successRate(success: number, total: number) {
  if (total === 0) return null;
  return Math.round((success / total) * 100);
}

type StatusLevel = 'healthy' | 'warning' | 'error' | 'unconfigured';

function integrationStatus(
  total24h: number,
  failedCount: number,
  lastActivityIso: string | null,
  configured = true
): StatusLevel {
  if (!configured) return 'unconfigured';
  if (total24h === 0) {
    if (!lastActivityIso) return 'warning';
    const hoursSince = (Date.now() - new Date(lastActivityIso).getTime()) / 3600000;
    return hoursSince > 24 ? 'warning' : 'healthy';
  }
  const rate = successRate(total24h - failedCount, total24h) ?? 100;
  if (rate < 90) return 'error';
  return 'healthy';
}

// ── sub-components ─────────────────────────────────────────────────────────

const STATUS_COLORS: Record<StatusLevel, { bg: string; border: string; dot: string; label: string }> = {
  healthy:      { bg: '#052e16', border: '#166534', dot: '#22c55e', label: 'Healthy' },
  warning:      { bg: '#1c1a03', border: '#854d0e', dot: '#eab308', label: 'Warning' },
  error:        { bg: '#1c0a09', border: '#991b1b', dot: '#ef4444', label: 'Error' },
  unconfigured: { bg: '#111827', border: '#374151', dot: '#6b7280', label: 'Not configured' },
};

function StatusBadge({ level }: { level: StatusLevel }) {
  const c = STATUS_COLORS[level];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '12px', background: c.bg, border: `1px solid ${c.border}`, fontSize: '11px', fontWeight: '600', color: c.dot }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {c.label}
    </span>
  );
}

function StatusCard({
  icon, name, status, total24h, successCount, failedCount, lastActivity,
}: {
  icon: string; name: string; status: StatusLevel;
  total24h: number; successCount: number; failedCount: number; lastActivity: string | null;
}) {
  const c = STATUS_COLORS[status];
  const rate = successRate(successCount, total24h);
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '18px 20px', flex: '1', minWidth: '160px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</div>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#f9fafb' }}>{name}</div>
        </div>
        <StatusBadge level={status} />
      </div>
      <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.7' }}>
        <div>24h calls: <span style={{ color: '#e5e7eb' }}>{total24h}</span></div>
        {rate !== null && (
          <div>Success rate: <span style={{ color: rate >= 90 ? '#22c55e' : '#ef4444' }}>{rate}%</span></div>
        )}
        {failedCount > 0 && <div>Failed: <span style={{ color: '#ef4444' }}>{failedCount}</span></div>}
        <div>Last activity: <span style={{ color: '#d1d5db' }}>{relativeTime(lastActivity)}</span></div>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', marginTop: '28px' }}>
      {title}
    </div>
  );
}

function Table({ cols, rows }: { cols: string[]; rows: React.ReactNode[][] }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #1f2937' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ background: '#111827' }}>
            {cols.map(c => (
              <th key={c} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #1f2937' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ padding: '20px 12px', color: '#4b5563', textAlign: 'center' }}>No records</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #111827', background: i % 2 === 0 ? '#0d1117' : '#0a0e14' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '8px 12px', color: '#d1d5db' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AlertBox({ level, message }: { level: 'warning' | 'error'; message: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '6px', background: level === 'error' ? '#1c0a09' : '#1c1a03', border: `1px solid ${level === 'error' ? '#991b1b' : '#854d0e'}`, fontSize: '12px', color: level === 'error' ? '#fca5a5' : '#fde68a', marginBottom: '6px' }}>
      <span>{level === 'error' ? '🔴' : '🟡'}</span>
      {message}
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/integration-health');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setCountdown(REFRESH_INTERVAL);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const pollId = setInterval(fetchData, REFRESH_INTERVAL * 1000);
    return () => clearInterval(pollId);
  }, [fetchData]);

  useEffect(() => {
    const tickId = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : REFRESH_INTERVAL)), 1000);
    return () => clearInterval(tickId);
  }, []);

  // ── derive statuses ──────────────────────────────────────────────────────

  const slackStatus = data
    ? integrationStatus(data.slack.total24h, data.slack.failedCount, data.slack.recent[0]?.sentAt ?? null)
    : 'unconfigured';

  const hubspotIntegrations = data?.crm.integrations.filter(i => i.type === 'hubspot') ?? [];
  const salesforceIntegrations = data?.crm.integrations.filter(i => i.type === 'salesforce') ?? [];
  const crmConfigured = hubspotIntegrations.some(i => i.enabled) || salesforceIntegrations.some(i => i.enabled);
  const crmStatus = data
    ? integrationStatus(data.crm.total24h, data.crm.failedCount, data.crm.logs[0]?.createdAt ?? null, crmConfigured)
    : 'unconfigured';

  const stripeStatus = data
    ? (data.stripe.total24h > 0 ? 'healthy' : 'warning') as StatusLevel
    : 'unconfigured';

  const emailStatus = data
    ? integrationStatus(data.email.total24h, data.email.failedCount, data.email.logs[0]?.createdAt ?? null)
    : 'unconfigured';

  const smsStatus = data
    ? integrationStatus(data.sms.total24h, data.sms.failedCount, data.sms.logs[0]?.createdAt ?? null)
    : 'unconfigured';

  const webhookStatus: StatusLevel = data
    ? data.webhooks.some(w => w.lastStatus === 'error' || w.lastStatus === 'failed') ? 'error'
      : data.webhooks.some(w => w.active && !w.lastTestedAt) ? 'warning'
      : 'healthy'
    : 'unconfigured';

  // ── alerts ───────────────────────────────────────────────────────────────

  const alerts: { level: 'warning' | 'error'; message: string }[] = [];

  if (data) {
    if (slackStatus === 'warning') alerts.push({ level: 'warning', message: 'Slack: no activity in the last 24 hours' });
    if (data.slack.failedCount > 0 && data.slack.total24h > 0) {
      const rate = successRate(data.slack.successCount, data.slack.total24h)!;
      if (rate < 90) alerts.push({ level: 'error', message: `Slack: ${rate}% success rate (${data.slack.failedCount} failures in 24h)` });
    }
    if (emailStatus === 'error') alerts.push({ level: 'error', message: `Email: ${successRate(data.email.successCount, data.email.total24h)}% success rate` });
    if (smsStatus === 'error') alerts.push({ level: 'error', message: `SMS/Twilio: ${successRate(data.sms.successCount, data.sms.total24h)}% success rate` });
    if (crmStatus === 'warning') alerts.push({ level: 'warning', message: 'CRM: no sync activity in the last 24 hours' });
    if (crmStatus === 'error') alerts.push({ level: 'error', message: `CRM: ${successRate(data.crm.successCount, data.crm.total24h)}% success rate` });
    if (webhookStatus === 'error') alerts.push({ level: 'error', message: 'Webhooks: one or more webhooks last reported an error' });
    data.sms.logs.forEach(log => {
      if (log.status === 'sent' && !log.messageSid) {
        const age = Date.now() - new Date(log.createdAt).getTime();
        if (age > 5 * 60 * 1000) {
          alerts.push({ level: 'warning', message: `SMS to ${log.to}: sent over 5 min ago but no SID — may be stuck` });
        }
      }
    });
  }

  // ── render ────────────────────────────────────────────────────────────────

  if (loading) return <AdminShell title="Integration Health" loading>{null}</AdminShell>;

  return (
    <AdminShell
      title="Integration Health"
      subtitle="Live status of all connected integrations"
    >
      {/* Auto-refresh bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Last fetched: {data ? new Date(data.fetchedAt).toLocaleTimeString() : '—'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          Auto-refresh in {countdown}s
          <button
            onClick={fetchData}
            style={{ marginLeft: '4px', padding: '3px 10px', background: '#1f2937', border: '1px solid #374151', borderRadius: '6px', color: '#d1d5db', fontSize: '11px', cursor: 'pointer' }}
          >
            Refresh now
          </button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {alerts.map((a, i) => <AlertBox key={i} level={a.level} message={a.message} />)}
        </div>
      )}

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#1c0a09', border: '1px solid #991b1b', color: '#fca5a5', fontSize: '13px', marginBottom: '20px' }}>
          Failed to load: {error}
        </div>
      )}

      {/* Status cards */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <StatusCard icon="💳" name="Stripe" status={stripeStatus}
          total24h={data?.stripe.total24h ?? 0} successCount={data?.stripe.total24h ?? 0} failedCount={0}
          lastActivity={data?.stripe.events[0]?.createdAt ?? null} />
        <StatusCard icon="📧" name="Email" status={emailStatus}
          total24h={data?.email.total24h ?? 0} successCount={data?.email.successCount ?? 0} failedCount={data?.email.failedCount ?? 0}
          lastActivity={data?.email.logs[0]?.createdAt ?? null} />
        <StatusCard icon="💬" name="SMS / Twilio" status={smsStatus}
          total24h={data?.sms.total24h ?? 0} successCount={data?.sms.successCount ?? 0} failedCount={data?.sms.failedCount ?? 0}
          lastActivity={data?.sms.logs[0]?.createdAt ?? null} />
        <StatusCard icon="🔔" name="Slack" status={slackStatus}
          total24h={data?.slack.total24h ?? 0} successCount={data?.slack.successCount ?? 0} failedCount={data?.slack.failedCount ?? 0}
          lastActivity={data?.slack.recent[0]?.sentAt ?? null} />
        <StatusCard icon="🏢" name="HubSpot / SF" status={crmStatus}
          total24h={data?.crm.total24h ?? 0} successCount={data?.crm.successCount ?? 0} failedCount={data?.crm.failedCount ?? 0}
          lastActivity={data?.crm.logs[0]?.createdAt ?? null} />
        <StatusCard icon="🔗" name="Webhooks" status={webhookStatus}
          total24h={data?.webhooks.filter(w => w.lastTestedAt).length ?? 0} successCount={data?.webhooks.filter(w => w.lastStatus === 'success').length ?? 0} failedCount={data?.webhooks.filter(w => w.lastStatus === 'error' || w.lastStatus === 'failed').length ?? 0}
          lastActivity={data?.webhooks[0]?.lastTestedAt ?? null} />
      </div>

      {/* ── Slack ─────────────────────────────────────────────────────────── */}
      <SectionHeader title="Slack Notifications — last 10" />
      {slackStatus === 'warning' && <AlertBox level="warning" message="No Slack notifications in the last 24 hours" />}
      <Table
        cols={['Time', 'Alert Type', 'Risk Score', 'Status', 'Error']}
        rows={(data?.slack.recent.slice(0, 10) ?? []).map(a => [
          fmtTime(a.sentAt),
          a.alertType ?? '—',
          a.riskScore !== null ? String(a.riskScore) : '—',
          <span key="s" style={{ color: a.messageSent ? '#22c55e' : '#ef4444', fontWeight: '600' }}>{a.messageSent ? 'Sent' : 'Failed'}</span>,
          <span key="e" style={{ color: '#fca5a5', fontSize: '11px' }}>{a.errorMessage ?? ''}</span>,
        ])}
      />

      {/* ── Email ─────────────────────────────────────────────────────────── */}
      <SectionHeader title="Email Log — last 10" />
      <Table
        cols={['Time', 'To', 'Subject', 'Status', 'Message ID / Error']}
        rows={(data?.email.logs.slice(0, 10) ?? []).map(l => [
          fmtTime(l.createdAt),
          l.to,
          <span key="sub" style={{ maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.subject}</span>,
          <span key="st" style={{ color: l.status === 'failed' ? '#ef4444' : l.status === 'mock' ? '#eab308' : '#22c55e', fontWeight: '600', textTransform: 'capitalize' }}>{l.status}</span>,
          <span key="m" style={{ fontSize: '11px', color: l.errorMessage ? '#fca5a5' : '#6b7280', fontFamily: 'monospace' }}>{l.errorMessage ?? l.messageId ?? '—'}</span>,
        ])}
      />

      {/* ── SMS / Twilio ───────────────────────────────────────────────────── */}
      <SectionHeader title="SMS / Twilio — last 10" />
      <Table
        cols={['Time', 'To', 'Preview', 'SID', 'Status']}
        rows={(data?.sms.logs.slice(0, 10) ?? []).map(l => {
          const age = Date.now() - new Date(l.createdAt).getTime();
          const stuck = l.status === 'sent' && !l.messageSid && age > 5 * 60 * 1000;
          return [
            fmtTime(l.createdAt),
            l.to,
            <span key="b" style={{ maxWidth: '180px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.body}</span>,
            <span key="sid" style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6b7280' }}>{l.messageSid ?? '—'}</span>,
            <span key="st" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: l.status === 'failed' ? '#ef4444' : '#22c55e', fontWeight: '600', textTransform: 'capitalize' }}>{l.status}</span>
              {stuck && <span style={{ padding: '1px 6px', background: '#1c1a03', border: '1px solid #854d0e', borderRadius: '4px', fontSize: '10px', color: '#eab308', fontWeight: '700' }}>STUCK</span>}
            </span>,
          ];
        })}
      />

      {/* ── CRM ───────────────────────────────────────────────────────────── */}
      <SectionHeader title="CRM Sync Log — last 10" />
      {data?.crm.integrations && data.crm.integrations.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {data.crm.integrations.map(ci => (
            <div key={ci.userId + ci.type} style={{ padding: '4px 10px', background: '#111827', border: '1px solid #1f2937', borderRadius: '6px', fontSize: '11px', color: '#9ca3af' }}>
              <span style={{ color: '#e5e7eb', fontWeight: '600', textTransform: 'capitalize' }}>{ci.type}</span>
              {' · '}
              <span style={{ color: ci.syncStatus === 'connected' ? '#22c55e' : ci.syncStatus === 'error' ? '#ef4444' : '#6b7280' }}>{ci.syncStatus}</span>
              {ci.lastSyncAt && <span>{' · last sync '}{relativeTime(ci.lastSyncAt)}</span>}
            </div>
          ))}
        </div>
      )}
      <Table
        cols={['Time', 'CRM', 'Direction', 'Entity', 'Status', 'Message']}
        rows={(data?.crm.logs.slice(0, 10) ?? []).map(l => [
          fmtTime(l.createdAt),
          <span key="t" style={{ textTransform: 'capitalize' }}>{l.crmType}</span>,
          l.direction,
          l.entityType,
          <span key="st" style={{ color: l.status === 'success' ? '#22c55e' : '#ef4444', fontWeight: '600' }}>{l.status}</span>,
          <span key="m" style={{ fontSize: '11px', color: l.status === 'error' ? '#fca5a5' : '#6b7280' }}>{l.message ?? '—'}</span>,
        ])}
      />

      {/* ── Stripe Events ─────────────────────────────────────────────────── */}
      <SectionHeader title="Stripe Events — last 10 (24h)" />
      <Table
        cols={['Time', 'Event']}
        rows={(data?.stripe.events.slice(0, 10) ?? []).map(e => [
          fmtTime(e.createdAt),
          <span key="ev" style={{ fontFamily: 'monospace', fontSize: '11px' }}>{e.event}</span>,
        ])}
      />

      {/* ── Webhooks ──────────────────────────────────────────────────────── */}
      <SectionHeader title="User Webhooks" />
      <Table
        cols={['Label / URL', 'Events', 'Active', 'Last Tested', 'Status']}
        rows={(data?.webhooks ?? []).map(w => [
          <div key="url">
            <div style={{ fontWeight: '600', color: '#e5e7eb', fontSize: '12px' }}>{w.label ?? 'Unnamed'}</div>
            <div style={{ fontSize: '10px', color: '#4b5563', wordBreak: 'break-all' }}>{w.url}</div>
          </div>,
          <span key="ev" style={{ fontSize: '11px', color: '#6b7280' }}>{w.events}</span>,
          <span key="ac" style={{ color: w.active ? '#22c55e' : '#ef4444', fontWeight: '600' }}>{w.active ? 'Yes' : 'No'}</span>,
          relativeTime(w.lastTestedAt),
          <span key="st" style={{ color: !w.lastStatus ? '#6b7280' : w.lastStatus === 'success' ? '#22c55e' : '#ef4444', fontWeight: '600', textTransform: 'capitalize' }}>{w.lastStatus ?? '—'}</span>,
        ])}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </AdminShell>
  );
}
