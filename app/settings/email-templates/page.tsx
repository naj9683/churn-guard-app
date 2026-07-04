'use client';

import { useEffect, useState, useCallback } from 'react';
import Layout from '@/app/components/Layout';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  variables: string | null;
  isDefault: boolean;
  updatedAt: string;
}

const VARIABLE_CHIPS = [
  { label: '{{customer.name}}', value: '{{customer.name}}' },
  { label: '{{planType}}', value: '{{planType}}' },
  { label: '{{mrrValue}}', value: '{{mrrValue}}' },
  { label: '{{riskScore}}', value: '{{riskScore}}' },
  { label: '{{daysSinceLogin}}', value: '{{daysSinceLogin}}' },
  { label: '{{failedPaymentCount}}', value: '{{failedPaymentCount}}' },
  { label: '{{lastInvoiceDate}}', value: '{{lastInvoiceDate}}' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
};

const btnPrimary: React.CSSProperties = {
  background: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  background: '#fff',
  color: '#374151',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
};

const btnDanger: React.CSSProperties = {
  background: '#fff',
  color: '#ef4444',
  border: '1px solid #fca5a5',
  borderRadius: '8px',
  padding: '8px 14px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
};

function parseVariables(raw: string | null): string[] {
  if (!raw) return [];
  try { return JSON.parse(raw) as string[]; } catch { return []; }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface ModalProps {
  template: Partial<EmailTemplate> | null;
  onClose: () => void;
  onSave: (data: { name: string; subject: string; bodyHtml: string; variables: string[] }) => Promise<void>;
}

function TemplateModal({ template, onClose, onSave }: ModalProps) {
  const [name, setName] = useState(template?.name ?? '');
  const [subject, setSubject] = useState(template?.subject ?? '');
  const [bodyHtml, setBodyHtml] = useState(template?.bodyHtml ?? '');
  const [variables, setVariables] = useState<string[]>(parseVariables(template?.variables ?? null));
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  function insertVariable(v: string) {
    setBodyHtml(prev => prev + v);
    if (!variables.includes(v)) setVariables(prev => [...prev, v]);
  }

  async function handleSave() {
    if (!name.trim() || !subject.trim() || !bodyHtml.trim()) {
      setErr('Name, subject, and body are required.');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      await onSave({ name, subject, bodyHtml, variables });
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', width: '760px', maxWidth: '95vw',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              {template?.id ? 'Edit Template' : 'New Template'}
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#9ca3af', lineHeight: 1 }}>×</button>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
            {(['edit', 'preview'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '500',
                background: tab === t ? '#6366f1' : 'transparent',
                color: tab === t ? '#fff' : '#6b7280',
              }}>
                {t === 'edit' ? 'Edit' : 'Preview'}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {tab === 'edit' ? (
            <>
              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Template Name</label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. High-Risk Churn Warning" />
              </div>

              {/* Subject */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Email Subject</label>
                <input style={inputStyle} value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Quick check-in, {{customer.name}}" />
              </div>

              {/* Variable chips */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Insert Variable</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {VARIABLE_CHIPS.map(chip => (
                    <button key={chip.value} onClick={() => insertVariable(chip.value)} style={{
                      background: '#f5f3ff', color: '#6366f1', border: '1px solid #c4b5fd',
                      borderRadius: '20px', padding: '4px 12px', fontSize: '12px',
                      fontWeight: '500', cursor: 'pointer',
                    }}>
                      {chip.label}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>Click to insert at the end of the body</p>
              </div>

              {/* Body */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Body HTML</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '220px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px' }}
                  value={bodyHtml}
                  onChange={e => setBodyHtml(e.target.value)}
                  placeholder={'<div style="font-family:Arial,sans-serif;max-width:600px;padding:24px">\n  <p>Hi {{customer.name}},</p>\n  <p>...</p>\n  <p>Best regards,<br>ChurnGuard Team</p>\n</div>'}
                />
              </div>

              {err && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px' }}>{err}</p>}
            </>
          ) : (
            <div>
              <div style={{ marginBottom: '12px', padding: '10px 14px', background: '#f9fafb', borderRadius: '8px', fontSize: '13px', color: '#374151' }}>
                <strong>Subject:</strong> {subject || <span style={{ color: '#9ca3af' }}>(empty)</span>}
              </div>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: '#f3f4f6', padding: '8px 14px', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Preview</div>
                {bodyHtml ? (
                  <iframe
                    srcDoc={bodyHtml}
                    style={{ width: '100%', minHeight: '340px', border: 'none', display: 'block' }}
                    sandbox="allow-same-origin"
                    title="Email preview"
                  />
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                    No body content yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button style={btnSecondary} onClick={onClose}>Cancel</button>
          <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Template'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalTemplate, setModalTemplate] = useState<Partial<EmailTemplate> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/email-templates');
    if (res.ok) {
      const data = await res.json() as { templates: EmailTemplate[] };
      setTemplates(data.templates);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function openCreate() {
    setModalTemplate({});
    setModalOpen(true);
  }

  function openEdit(t: EmailTemplate) {
    setModalTemplate(t);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalTemplate(null);
  }

  async function handleSave(data: { name: string; subject: string; bodyHtml: string; variables: string[] }) {
    const isEdit = !!modalTemplate?.id;
    const url = isEdit ? `/api/email-templates/${modalTemplate!.id}` : '/api/email-templates';
    const method = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const d = await res.json() as { error?: string };
      throw new Error(d.error || 'Save failed');
    }

    closeModal();
    await load();
    showToast(isEdit ? 'Template updated.' : 'Template created.');
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/email-templates/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDeleteId(null);
      await load();
      showToast('Template deleted.');
    }
  }

  return (
    <Layout title="Email Templates" subtitle="Create and manage reusable email templates for your outreach campaigns">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 2000,
          background: '#111827', color: '#fff', borderRadius: '8px',
          padding: '12px 20px', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          {toast}
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          {templates.length} template{templates.length !== 1 ? 's' : ''}
        </p>
        <button style={btnPrimary} onClick={openCreate}>+ New Template</button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>Loading…</div>
        ) : templates.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📧</div>
            <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 20px' }}>No templates yet. Create your first one.</p>
            <button style={btnPrimary} onClick={openCreate}>+ New Template</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Variables</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Updated</th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < templates.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: '500', color: '#111827' }}>{t.name}</div>
                    {t.isDefault && (
                      <span style={{ fontSize: '11px', background: '#f5f3ff', color: '#6366f1', borderRadius: '10px', padding: '2px 8px', marginTop: '4px', display: 'inline-block' }}>Default</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#374151', maxWidth: '260px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {parseVariables(t.variables).map(v => (
                        <span key={v} style={{ background: '#f5f3ff', color: '#6366f1', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: '500' }}>{v}</span>
                      ))}
                      {parseVariables(t.variables).length === 0 && <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '13px' }}>{formatDate(t.updatedAt)}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button style={{ ...btnSecondary, padding: '6px 14px', fontSize: '13px' }} onClick={() => openEdit(t)}>Edit</button>
                      {deleteId === t.id ? (
                        <>
                          <button style={{ ...btnDanger }} onClick={() => handleDelete(t.id)}>Confirm</button>
                          <button style={{ ...btnSecondary, padding: '6px 14px', fontSize: '13px' }} onClick={() => setDeleteId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button style={{ ...btnDanger }} onClick={() => setDeleteId(t.id)}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <TemplateModal
          template={modalTemplate}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
}
