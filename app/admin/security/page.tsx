'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';

export default function AdminSecurityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetch('/api/admin/security')
      .then(r => r.json())
      .then(d => {
        if (d.error) { setFetchError(d.error); } else { setData(d); }
      })
      .catch(() => setFetchError('Failed to load security data.'))
      .finally(() => setLoading(false));
  }, []);

  const thS: React.CSSProperties = { textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' };
  const tdS: React.CSSProperties = { padding: '11px 14px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f3f4f6' };

  const stats = data?.stats ?? { totalUsers: 0, usersWithApiKeys: 0, activeWebhooks: 0 };
  const policies = data?.policies ?? { twoFactorEnforced: false, sessionTimeout: 24, maxLoginAttempts: 10, ipWhitelistEnabled: false };
  const recentActivity: any[] = data?.recentActivity ?? [];

  return (
    <AdminShell title="Security" subtitle="Security policies, access controls, and audit events" loading={loading}>
      {fetchError ? (
        <div style={{ padding: '16px 20px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '10px', fontSize: '14px' }}>
          {fetchError}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, color: '#6366f1' },
              { label: 'Users with API Keys', value: stats.usersWithApiKeys, color: '#f59e0b' },
              { label: 'Active Webhooks', value: stats.activeWebhooks, color: '#10b981' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{s.label}</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Policies */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>Security Policies</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Two-Factor Authentication', value: policies.twoFactorEnforced ? 'Enforced' : 'Optional', status: policies.twoFactorEnforced ? 'active' : 'inactive' },
                { label: 'Session Timeout', value: `${policies.sessionTimeout} hours`, status: 'neutral' },
                { label: 'Max Login Attempts', value: `${policies.maxLoginAttempts} attempts`, status: 'neutral' },
                { label: 'IP Whitelist', value: policies.ipWhitelistEnabled ? 'Enabled' : 'Disabled', status: policies.ipWhitelistEnabled ? 'active' : 'inactive' },
              ].map(p => (
                <div key={p.label} style={{ padding: '14px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>{p.label}</div>
                  <span style={{ fontSize: '12px', fontWeight: '600', padding: '3px 9px', background: p.status === 'active' ? '#dcfce7' : p.status === 'inactive' ? '#f3f4f6' : '#dbeafe', color: p.status === 'active' ? '#15803d' : p.status === 'inactive' ? '#6b7280' : '#1d4ed8', borderRadius: '20px' }}>{p.value}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '14px 0 0', fontSize: '12px', color: '#9ca3af' }}>
              Security policy configuration is managed via Clerk dashboard and environment variables.
            </p>
          </div>

          {/* Audit events */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#111827' }}>Recent Activity Events</h2>
            </div>
            {recentActivity.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No activity events yet.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    <th style={thS}>Type</th>
                    <th style={thS}>Description</th>
                    <th style={thS}>User</th>
                    <th style={thS}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((log: any) => (
                    <tr key={log.id}>
                      <td style={tdS}><span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 7px', background: '#f3f4f6', color: '#374151', borderRadius: '4px', fontFamily: 'monospace' }}>{log.type}</span></td>
                      <td style={tdS}>{log.description}</td>
                      <td style={tdS}><span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>{log.userId ? log.userId.slice(0, 8) + '…' : '—'}</span></td>
                      <td style={tdS}>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
