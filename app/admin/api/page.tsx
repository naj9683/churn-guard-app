'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';

export default function AdminApiPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/api-keys').then(r => r.json()).then(d => { setKeys(d.keys || []); setLoading(false); });
  }, []);

  async function revokeKey(userId: string, email: string) {
    if (!confirm(`Revoke API key for ${email}? Their integrations will stop working immediately.`)) return;
    setRevoking(userId);
    const res = await fetch(`/api/admin/api-keys?userId=${userId}`, { method: 'DELETE' });
    if (res.ok) {
      setKeys(ks => ks.filter(k => k.id !== userId));
      setMsg(`API key for ${email} has been revoked.`);
    }
    setRevoking(null);
  }

  function copyKey(key: string, id: string) {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const thS: React.CSSProperties = { textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' };
  const tdS: React.CSSProperties = { padding: '12px 14px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' };

  return (
    <AdminShell title="API Management" subtitle="View and manage API keys across all users" loading={loading}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Active API Keys', value: keys.length, color: '#6366f1' },
          { label: 'Total Customers Tracked', value: keys.reduce((s, k) => s + (k._count?.customers ?? 0), 0), color: '#10b981' },
          { label: 'Rate Limit', value: '1,000 req/hr', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {msg && <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', fontSize: '13px' }}>{msg}</div>}

      {/* Keys table */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#111827' }}>Active API Keys</h2>
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>{keys.length} key{keys.length !== 1 ? 's' : ''}</span>
        </div>

        {keys.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No active API keys.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={thS}>User</th>
                <th style={thS}>API Key</th>
                <th style={thS}>Customers</th>
                <th style={thS}>Created</th>
                <th style={thS}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map(k => (
                <tr key={k.id}>
                  <td style={tdS}>
                    <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>{k.name || k.email}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{k.email}</div>
                  </td>
                  <td style={tdS}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <code style={{ fontSize: '11px', background: '#f3f4f6', padding: '3px 8px', borderRadius: '4px', color: '#374151', fontFamily: 'monospace' }}>
                        {k.apiKey ? k.apiKey.slice(0, 14) + '…' + k.apiKey.slice(-4) : '—'}
                      </code>
                      {k.apiKey && (
                        <button
                          onClick={() => copyKey(k.apiKey, k.id)}
                          style={{ fontSize: '11px', padding: '2px 7px', background: copiedId === k.id ? '#dcfce7' : '#f3f4f6', color: copiedId === k.id ? '#15803d' : '#6b7280', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          {copiedId === k.id ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={tdS}>{k._count?.customers ?? 0}</td>
                  <td style={tdS}>{new Date(k.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={tdS}>
                    <button
                      onClick={() => revokeKey(k.id, k.email)}
                      disabled={revoking === k.id}
                      style={{ padding: '5px 12px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                    >
                      {revoking === k.id ? 'Revoking…' : 'Revoke'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Rate limits info */}
      <div style={{ marginTop: '20px', padding: '16px 20px', background: '#f5f3ff', border: '1px solid #e0d9ff', borderRadius: '10px', fontSize: '13px', color: '#6b7280' }}>
        <strong style={{ color: '#4f46e5' }}>Rate Limiting:</strong> Global rate limit is 1,000 requests/hour per API key. Adjust in <strong>/admin/settings</strong>. Rate limiting is enforced at the middleware level.
      </div>
    </AdminShell>
  );
}
