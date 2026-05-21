'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminShell from '@/app/admin/components/AdminShell';

interface TemplateRow {
  key: string;
  name: string;
  subject: string;
  bodyHtml: string;
  isCustom: boolean;
  isActive: boolean;
  updatedAt: string | null;
  sentCount: number;
}

const VARIABLE_DOCS = [
  { var: '{{firstName}}',        desc: 'User\'s first name' },
  { var: '{{appUrl}}',           desc: 'App base URL' },
  { var: '{{revenueAtRisk}}',    desc: 'Day 10 only — MRR at risk (e.g. 4,200)' },
  { var: '{{annualizedLoss}}',   desc: 'Day 10 only — annual loss (e.g. 50,400)' },
  { var: '{{recoveryEstimate}}', desc: 'Day 10 only — 35% recovery estimate' },
  { var: '{{stripeStatus}}',     desc: 'Day 10 only — "based on Stripe" or "estimated"' },
  { var: '{{customers}}',        desc: 'Day 13 only — customers tracked' },
  { var: '{{playbooks}}',        desc: 'Day 13 only — active playbook count' },
  { var: '{{avgRisk}}',          desc: 'Day 13 only — average risk score' },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates]   = useState<TemplateRow[]>([]);
  const [selected, setSelected]     = useState<TemplateRow | null>(null);
  const [subject, setSubject]       = useState('');
  const [bodyHtml, setBodyHtml]     = useState('');
  const [testEmail, setTestEmail]   = useState('');
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [testing, setTesting]       = useState(false);
  const [saveMsg, setSaveMsg]       = useState('');
  const [testMsg, setTestMsg]       = useState('');
  const [showVars, setShowVars]     = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/email-templates');
    const data = await res.json();
    setTemplates(data.templates ?? []);
    if (data.templates?.length && !selected) {
      const first = data.templates[0];
      setSelected(first);
      setSubject(first.subject);
      setBodyHtml(first.bodyHtml);
    }
    setLoading(false);
  }, [selected]);

  useEffect(() => { load(); }, []);

  function selectTemplate(tpl: TemplateRow) {
    setSelected(tpl);
    setSubject(tpl.subject);
    setBodyHtml(tpl.bodyHtml);
    setSaveMsg('');
    setTestMsg('');
    setPreviewMode(false);
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    setSaveMsg('');
    const res = await fetch('/api/admin/email-templates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: selected.key, subject, bodyHtml }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setSaveMsg('Saved ✓');
      load();
    } else {
      setSaveMsg(`Error: ${data.error}`);
    }
  }

  async function handleReset() {
    if (!selected || !confirm('Reset to code default? This removes any edits.')) return;
    await fetch('/api/admin/email-templates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: selected.key }),
    });
    await load();
    // Reload the freshly-reset template
    const freshTemplates = await fetch('/api/admin/email-templates').then(r => r.json());
    const fresh = freshTemplates.templates?.find((t: TemplateRow) => t.key === selected.key);
    if (fresh) selectTemplate(fresh);
  }

  async function handleTest() {
    if (!selected || !testEmail) return;
    setTesting(true);
    setTestMsg('');
    const res = await fetch('/api/admin/email-templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: selected.key, testEmail }),
    });
    const data = await res.json();
    setTesting(false);
    setTestMsg(data.ok ? `Sent to ${testEmail} ✓` : `Failed: ${data.error}`);
  }

  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
  };

  return (
    <AdminShell title="Email Templates" subtitle="Edit and test the 5-step trial email sequence" loading={loading}>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left: template list */}
        <div style={card}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Trial Sequence
            </p>
          </div>
          {templates.map(tpl => {
            const isActive = selected?.key === tpl.key;
            return (
              <button
                key={tpl.key}
                onClick={() => selectTemplate(tpl)}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 16px',
                  background: isActive ? '#eef2ff' : 'transparent',
                  border: 'none', borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer', display: 'block',
                }}
              >
                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: isActive ? '#4338ca' : '#111827' }}>
                  {tpl.name}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
                  {tpl.sentCount > 0 ? `${tpl.sentCount} sent` : 'No sends yet'}
                  {tpl.isCustom && <span style={{ marginLeft: '6px', color: '#f59e0b' }}>● edited</span>}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right: editor */}
        {selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Header bar */}
            <div style={{ ...card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>{selected.name}</h2>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                  Key: <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: '4px' }}>{selected.key}</code>
                  {selected.updatedAt && ` · Last edited ${new Date(selected.updatedAt).toLocaleDateString()}`}
                </p>
              </div>
              <button
                onClick={() => setPreviewMode(p => !p)}
                style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', background: previewMode ? '#f0fdf4' : '#f9fafb', color: previewMode ? '#16a34a' : '#374151', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >
                {previewMode ? '✏️ Edit' : '👁 Preview'}
              </button>
              {selected.isCustom && (
                <button
                  onClick={handleReset}
                  style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Reset to Default
                </button>
              )}
            </div>

            {previewMode ? (
              /* HTML preview */
              <div style={{ ...card, padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>
                  Preview (variables replaced with sample data)
                </div>
                <iframe
                  srcDoc={bodyHtml
                    .replace(/\{\{firstName\}\}/g, 'Alex')
                    .replace(/\{\{appUrl\}\}/g, 'https://churnguardapp.com')
                    .replace(/\{\{revenueAtRisk\}\}/g, '4,200')
                    .replace(/\{\{annualizedLoss\}\}/g, '50,400')
                    .replace(/\{\{recoveryEstimate\}\}/g, '1,470')
                    .replace(/\{\{stripeStatus\}\}/g, 'based on your connected Stripe account,')
                    .replace(/\{\{customers\}\}/g, '42')
                    .replace(/\{\{playbooks\}\}/g, '3')
                    .replace(/\{\{avgRisk\}\}/g, '65')
                  }
                  style={{ width: '100%', height: '600px', border: 'none' }}
                  title="Email preview"
                />
              </div>
            ) : (
              /* Edit form */
              <>
                <div style={card}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em' }}>Subject Line</p>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <input
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#111827', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={card}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em' }}>HTML Body</p>
                    <button
                      onClick={() => setShowVars(v => !v)}
                      style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                    >
                      {showVars ? '▼ Hide variables' : '▶ Show variables'}
                    </button>
                  </div>

                  {showVars && (
                    <div style={{ padding: '12px 16px', background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        {VARIABLE_DOCS.map(v => (
                          <div key={v.var} style={{ fontSize: '12px' }}>
                            <code style={{ background: '#f0f0fe', color: '#4338ca', padding: '1px 5px', borderRadius: '4px', marginRight: '6px' }}>{v.var}</code>
                            <span style={{ color: '#6b7280' }}>{v.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '12px 16px' }}>
                    <textarea
                      value={bodyHtml}
                      onChange={e => setBodyHtml(e.target.value)}
                      rows={22}
                      style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', color: '#111827', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.5' }}
                    />
                  </div>

                  <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{ padding: '9px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
                    >
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                    {saveMsg && (
                      <span style={{ fontSize: '13px', color: saveMsg.startsWith('Error') ? '#dc2626' : '#16a34a', fontWeight: '600' }}>
                        {saveMsg}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Test send */}
            <div style={card}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em' }}>Send Test Email</p>
              </div>
              <div style={{ padding: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="email"
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#111827' }}
                />
                <button
                  onClick={handleTest}
                  disabled={testing || !testEmail}
                  style={{ padding: '9px 18px', background: '#f9fafb', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: testing || !testEmail ? 'not-allowed' : 'pointer', opacity: testing || !testEmail ? 0.6 : 1, whiteSpace: 'nowrap' }}
                >
                  {testing ? 'Sending…' : 'Send Test'}
                </button>
                {testMsg && (
                  <span style={{ fontSize: '13px', color: testMsg.startsWith('Failed') ? '#dc2626' : '#16a34a', fontWeight: '600' }}>
                    {testMsg}
                  </span>
                )}
              </div>
              <div style={{ padding: '10px 16px 14px', color: '#9ca3af', fontSize: '12px' }}>
                Sends the current version (saved or unsaved) with sample variable data. Subject will be prefixed with [TEST].
              </div>
            </div>

          </div>
        ) : (
          <div style={{ ...card, padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            Select a template from the left to edit it.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
