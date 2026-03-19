'use client';

import { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';

const ALL_EVENTS = [
  { id: 'customer.created', label: 'Customer Created', desc: 'A new customer is added' },
  { id: 'customer.risk_changed', label: 'Risk Score Changed', desc: 'A customer\'s risk score changes' },
  { id: 'customer.high_risk', label: 'High Risk Alert', desc: 'Customer crosses risk threshold' },
  { id: 'intervention.started', label: 'Intervention Started', desc: 'A playbook intervention begins' },
  { id: 'intervention.completed', label: 'Intervention Completed', desc: 'An intervention is resolved' },
  { id: 'customer.churned', label: 'Customer Churned', desc: 'Customer cancels or churns' },
  { id: 'customer.saved', label: 'Customer Saved', desc: 'At-risk customer retained' },
];

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>{title}</h2>
        {subtitle && <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['customer.high_risk', 'intervention.completed']);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const r = await fetch('/api/settings/webhooks');
    if (r.ok) { const d = await r.json(); setWebhooks(d.webhooks || []); }
    setLoading(false);
  }

  async function createWebhook() {
    if (!url.trim()) { setMsg('URL is required.'); return; }
    if (selectedEvents.length === 0) { setMsg('Select at least one event.'); return; }
    setSaving(true); setMsg('');
    const res = await fetch('/api/settings/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.trim(), label: label.trim(), events: selectedEvents })
    });
    if (res.ok) {
      setUrl(''); setLabel(''); setSelectedEvents(['customer.high_risk', 'intervention.completed']);
      setShowForm(false);
      await load();
    } else {
      setMsg('Failed to create webhook.');
    }
    setSaving(false);
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/settings/webhooks/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active })
    });
    setWebhooks(wh => wh.map(w => w.id === id ? { ...w, active } : w));
  }

  async function testWebhook(id: string) {
    setTesting(id);
    const res = await fetch(`/api/settings/webhooks/${id}/test`, { method: 'POST' });
    const d = await res.json();
    setWebhooks(wh => wh.map(w => w.id === id ? { ...w, lastStatus: d.status, lastTestedAt: new Date().toISOString() } : w));
    setTesting(null);
  }

  async function deleteWebhook(id: string) {
    if (!confirm('Delete this webhook?')) return;
    setDeleting(id);
    await fetch(`/api/settings/webhooks/${id}`, { method: 'DELETE' });
    setWebhooks(wh => wh.filter(w => w.id !== id));
    setDeleting(null);
  }

  function toggleEvent(eventId: string) {
    setSelectedEvents(ev => ev.includes(eventId) ? ev.filter(e => e !== eventId) : [...ev, eventId]);
  }

  if (loading) return <Layout title="Webhooks"><div style={{ color: '#9ca3af' }}>Loading…</div></Layout>;

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' };

  return (
    <Layout title="Webhooks" subtitle="Get notified when events happen in ChurnGuard">
      <div style={{ maxWidth: '720px' }}>
        <Section title="Active Webhooks" subtitle={`${webhooks.length} endpoint${webhooks.length !== 1 ? 's' : ''} configured`}>
          {webhooks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af', fontSize: '14px' }}>
              No webhooks yet. Add your first endpoint below.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {webhooks.map(wh => {
                const events: string[] = (() => { try { return JSON.parse(wh.events); } catch { return []; } })();
                return (
                  <div key={wh.id} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {wh.label && <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>{wh.label}</div>}
                        <code style={{ fontSize: '12px', color: '#6366f1', wordBreak: 'break-all' }}>{wh.url}</code>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                          {events.map(e => (
                            <span key={e} style={{ fontSize: '11px', padding: '2px 7px', background: '#f3f4f6', color: '#374151', borderRadius: '4px', fontFamily: 'monospace' }}>{e}</span>
                          ))}
                        </div>
                        {wh.lastTestedAt && (
                          <div style={{ marginTop: '6px', fontSize: '12px', color: '#9ca3af' }}>
                            Last tested: {new Date(wh.lastTestedAt).toLocaleString()} —{' '}
                            <span style={{ color: wh.lastStatus === 'ok' ? '#15803d' : '#ef4444', fontWeight: '500' }}>
                              {wh.lastStatus === 'ok' ? 'Success' : 'Failed'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button
                          onClick={() => toggleActive(wh.id, !wh.active)}
                          style={{ padding: '6px 12px', background: wh.active ? '#dcfce7' : '#f3f4f6', color: wh.active ? '#15803d' : '#6b7280', border: '1px solid transparent', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          {wh.active ? 'Active' : 'Paused'}
                        </button>
                        <button
                          onClick={() => testWebhook(wh.id)}
                          disabled={testing === wh.id}
                          style={{ padding: '6px 12px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          {testing === wh.id ? 'Testing…' : 'Test'}
                        </button>
                        <button
                          onClick={() => deleteWebhook(wh.id)}
                          disabled={deleting === wh.id}
                          style={{ padding: '6px 12px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          {deleting === wh.id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </div>
                    {wh.secret && (
                      <div style={{ marginTop: '10px', padding: '8px 12px', background: '#f9fafb', borderRadius: '6px', fontSize: '12px', color: '#6b7280' }}>
                        Signing secret: <code style={{ color: '#374151', fontFamily: 'monospace' }}>{wh.secret.slice(0, 12)}••••••••</code>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: '16px' }}>
            {!showForm ? (
              <button onClick={() => setShowForm(true)} style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                + Add Endpoint
              </button>
            ) : (
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', background: '#fafafa' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>New Webhook Endpoint</h3>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Endpoint URL *</label>
                  <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://yourapp.com/webhooks/churnguard" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Label (optional)</label>
                  <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Slack Relay, CRM Sync" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '10px' }}>Events to send *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {ALL_EVENTS.map(ev => (
                      <label key={ev.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', background: selectedEvents.includes(ev.id) ? '#f5f3ff' : '#fff', border: `1px solid ${selectedEvents.includes(ev.id) ? '#c4b5fd' : '#e5e7eb'}` }}>
                        <input type="checkbox" checked={selectedEvents.includes(ev.id)} onChange={() => toggleEvent(ev.id)} style={{ marginTop: '2px', accentColor: '#6366f1' }} />
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', fontFamily: 'monospace' }}>{ev.id}</div>
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>{ev.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {msg && <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' }}>{msg}</div>}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={createWebhook} disabled={saving} style={{ padding: '10px 20px', background: saving ? '#9ca3af' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: saving ? 'not-allowed' : 'pointer' }}>
                    {saving ? 'Creating…' : 'Create Endpoint'}
                  </button>
                  <button onClick={() => { setShowForm(false); setMsg(''); }} style={{ padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </Section>

        <Section title="Payload Format" subtitle="All webhooks send JSON POST requests with this structure">
          <pre style={{ background: '#1e1e2e', color: '#cdd6f4', padding: '16px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto', margin: 0 }}>{`{
  "event": "customer.high_risk",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "customerId": "cus_abc123",
    "email": "customer@example.com",
    "riskScore": 87,
    "mrr": 499
  }
}`}</pre>
          <div style={{ marginTop: '12px', fontSize: '13px', color: '#6b7280' }}>
            Verify authenticity using the <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>X-ChurnGuard-Secret</code> header included in every request.
          </div>
        </Section>
      </div>
    </Layout>
  );
}
