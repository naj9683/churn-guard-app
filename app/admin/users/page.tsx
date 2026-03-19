'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { load(q); }, []);

  async function load(search = '') {
    setLoading(true);
    const res = await fetch(`/api/admin/users?q=${encodeURIComponent(search)}`);
    if (res.ok) { const d = await res.json(); setUsers(d.users); }
    setLoading(false);
  }

  function search(e: React.FormEvent) {
    e.preventDefault();
    load(q);
  }

  async function revokeApiKey(userId: string, email: string) {
    if (!confirm(`Revoke API key for ${email}?`)) return;
    setRevoking(userId);
    const res = await fetch('/api/admin/api-keys?' + new URLSearchParams({ userId }), { method: 'DELETE' });
    if (res.ok) {
      setUsers(us => us.map(u => u.id === userId ? { ...u, apiKey: null } : u));
      setMsg(`API key revoked for ${email}`);
    }
    setRevoking(null);
  }

  const riskBadge = (score: number) => {
    if (score >= 70) return { bg: '#fef2f2', color: '#ef4444', label: 'High' };
    if (score >= 40) return { bg: '#fef3c7', color: '#92400e', label: 'Medium' };
    return { bg: '#dcfce7', color: '#15803d', label: 'Low' };
  };

  const thStyle: React.CSSProperties = { textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#6b7280', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' };
  const tdStyle: React.CSSProperties = { padding: '12px 14px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' };

  return (
    <AdminShell title="User Management" subtitle={`${users.length} users registered`} loading={false}>
      {/* Search */}
      <form onSubmit={search} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search by email or name…"
          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
          Search
        </button>
      </form>

      {msg && <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#f0fdf4', color: '#15803d', borderRadius: '8px', fontSize: '13px' }}>{msg}</div>}

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Customers</th>
                <th style={thStyle}>MRR</th>
                <th style={thStyle}>API Key</th>
                <th style={thStyle}>Joined</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ background: selectedUser?.id === u.id ? '#f5f3ff' : '#fff' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>{u.name || '—'}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{u.email}</div>
                    {u.email === 'najwa.saadi1@hotmail.com' && (
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '1px 6px', background: '#fef3c7', color: '#92400e', borderRadius: '10px' }}>ADMIN</span>
                    )}
                  </td>
                  <td style={tdStyle}>{u.company || '—'}</td>
                  <td style={tdStyle}>{u._count?.customers ?? 0}</td>
                  <td style={tdStyle}>${(u.mrr || 0).toLocaleString()}</td>
                  <td style={tdStyle}>
                    {u.apiKey ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <code style={{ fontSize: '11px', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#374151' }}>
                          {u.apiKey.slice(0, 10)}…
                        </code>
                        <button
                          onClick={() => revokeApiKey(u.id, u.email)}
                          disabled={revoking === u.id}
                          style={{ fontSize: '11px', padding: '2px 7px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Revoke
                        </button>
                      </div>
                    ) : <span style={{ fontSize: '12px', color: '#d1d5db' }}>None</span>}
                  </td>
                  <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => setSelectedUser(selectedUser?.id === u.id ? null : u)}
                      style={{ fontSize: '12px', padding: '5px 10px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      {selectedUser?.id === u.id ? 'Close' : 'Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User detail panel */}
      {selectedUser && (
        <div style={{ marginTop: '20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#111827' }}>
              {selectedUser.name || selectedUser.email}
            </h3>
            <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { label: 'Email', value: selectedUser.email },
              { label: 'Company', value: selectedUser.company || '—' },
              { label: 'Timezone', value: selectedUser.timezone || 'UTC' },
              { label: 'Stripe Customer', value: selectedUser.stripeCustomerId ? '✓ Connected' : 'Not connected' },
              { label: 'MRR', value: `$${(selectedUser.mrr || 0).toLocaleString()}` },
              { label: 'Customers', value: selectedUser._count?.customers ?? 0 },
            ].map(f => (
              <div key={f.label} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>{f.label}</div>
                <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {users.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '14px' }}>No users found.</div>
      )}
    </AdminShell>
  );
}
