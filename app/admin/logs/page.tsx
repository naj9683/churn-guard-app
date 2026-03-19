'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';

type LogType = 'activity' | 'alerts' | 'webhooks';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [logType, setLogType] = useState<LogType>('activity');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(logType); }, [logType]);

  async function load(type: LogType) {
    setLoading(true);
    const res = await fetch(`/api/admin/logs?type=${type}`);
    if (res.ok) { const d = await res.json(); setLogs(d.logs || []); }
    setLoading(false);
  }

  const TAB_LABELS: Record<LogType, string> = {
    activity: 'Activity Logs',
    alerts: 'Alert Logs',
    webhooks: 'Webhook Deliveries',
  };

  const thS: React.CSSProperties = { textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' };
  const tdS: React.CSSProperties = { padding: '11px 14px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f3f4f6', verticalAlign: 'top' };

  return (
    <AdminShell title="Logs & Monitoring" subtitle="System activity, alerts, and webhook delivery history">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#f3f4f6', padding: '4px', borderRadius: '9px', width: 'fit-content' }}>
        {(Object.keys(TAB_LABELS) as LogType[]).map(t => (
          <button
            key={t}
            onClick={() => setLogType(t)}
            style={{
              padding: '8px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: '500',
              background: logType === t ? '#fff' : 'transparent',
              color: logType === t ? '#111827' : '#6b7280',
              boxShadow: logType === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{TAB_LABELS[logType]}</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>{logs.length} entries</span>
            <button
              onClick={() => load(logType)}
              style={{ padding: '5px 12px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#374151' }}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>Loading…</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No {TAB_LABELS[logType].toLowerCase()} found.</div>
        ) : logType === 'webhooks' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={thS}>Endpoint</th>
                <th style={thS}>Status</th>
                <th style={thS}>Active</th>
                <th style={thS}>Last Tested</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id}>
                  <td style={tdS}>
                    {log.label && <div style={{ fontWeight: '600', fontSize: '12px', color: '#111827', marginBottom: '2px' }}>{log.label}</div>}
                    <code style={{ fontSize: '11px', color: '#6366f1' }}>{log.url}</code>
                  </td>
                  <td style={tdS}>
                    <span style={{ fontSize: '12px', fontWeight: '600', padding: '2px 8px', background: log.lastStatus === 'ok' ? '#dcfce7' : '#fef2f2', color: log.lastStatus === 'ok' ? '#15803d' : '#ef4444', borderRadius: '20px' }}>
                      {log.lastStatus || '—'}
                    </span>
                  </td>
                  <td style={tdS}><span style={{ fontSize: '12px', fontWeight: '600', padding: '2px 8px', background: log.active ? '#dcfce7' : '#f3f4f6', color: log.active ? '#15803d' : '#6b7280', borderRadius: '20px' }}>{log.active ? 'Active' : 'Paused'}</span></td>
                  <td style={tdS}>{log.lastTestedAt ? new Date(log.lastTestedAt).toLocaleString() : 'Never'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={thS}>Type</th>
                <th style={thS}>Message / Description</th>
                <th style={thS}>User ID</th>
                <th style={thS}>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id}>
                  <td style={tdS}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 7px', background: '#f3f4f6', color: '#374151', borderRadius: '4px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                      {log.type}
                    </span>
                  </td>
                  <td style={{ ...tdS, maxWidth: '360px' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{log.message || log.description}</span>
                  </td>
                  <td style={tdS}>
                    <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>
                      {log.userId ? log.userId.slice(0, 8) + '…' : '—'}
                    </span>
                  </td>
                  <td style={{ ...tdS, whiteSpace: 'nowrap' }}>
                    {new Date(log.sentAt || log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
