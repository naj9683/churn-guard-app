'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/app/components/Layout';

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  draft:     { bg: '#fffbeb', color: '#f59e0b', label: 'Draft' },
  scheduled: { bg: '#eff6ff', color: '#3b82f6', label: 'Scheduled' },
  sent:      { bg: '#f0fdf4', color: '#10b981', label: 'Sent' },
  failed:    { bg: '#fef2f2', color: '#ef4444', label: 'Failed' }
};

export default function EditEmailCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<any>(null);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [segment, setSegment] = useState('all');
  const [content, setContent] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/email-campaigns');
        if (res.ok) {
          const data = await res.json();
          const found = (data.campaigns || []).find((c: any) => c.id === id);
          if (found) {
            setCampaign(found);
            setName(found.name || '');
            setSubject(found.subject || '');
            setSegment(found.segment || 'all');
            setContent(found.content || '');
            if (found.scheduledAt) {
              // Format for datetime-local input
              const d = new Date(found.scheduledAt);
              setScheduledAt(d.toISOString().slice(0, 16));
            }
          } else {
            setError('Campaign not found.');
          }
        }
      } catch {
        setError('Failed to load campaign.');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleSaveDraft() {
    if (!name || !subject || !content) { setError('Name, subject, and content are required.'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await fetch(`/api/email-campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, content, segment, scheduledAt: scheduledAt || null, status: 'draft' })
      });
      if (res.ok) {
        const data = await res.json();
        setCampaign(data.campaign);
        setSuccess('Campaign saved as draft.');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save.');
      }
    } catch { setError('Failed to save.'); }
    finally { setSaving(false); }
  }

  async function handleSendNow() {
    if (!confirm('Send this campaign immediately?')) return;
    setSending(true); setError(''); setSuccess('');
    try {
      // Save current edits first
      await fetch(`/api/email-campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, content, segment })
      });
      const res = await fetch(`/api/email-campaigns/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sendNow: true })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || 'Campaign sent.');
        setCampaign((prev: any) => ({ ...prev, status: 'sent' }));
      } else {
        setError(data.error || 'Failed to send.');
      }
    } catch { setError('Failed to send.'); }
    finally { setSending(false); }
  }

  async function handleSchedule() {
    if (!scheduledAt) { setError('Please pick a date and time to schedule.'); return; }
    if (new Date(scheduledAt) <= new Date()) { setError('Scheduled time must be in the future.'); return; }
    setSending(true); setError(''); setSuccess('');
    try {
      await fetch(`/api/email-campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, content, segment })
      });
      const res = await fetch(`/api/email-campaigns/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || 'Campaign scheduled.');
        setCampaign((prev: any) => ({ ...prev, status: 'scheduled', scheduledAt }));
      } else {
        setError(data.error || 'Failed to schedule.');
      }
    } catch { setError('Failed to schedule.'); }
    finally { setSending(false); }
  }

  async function handleDelete() {
    if (!confirm('Delete this campaign? This cannot be undone.')) return;
    setDeleting(true); setError('');
    try {
      const res = await fetch(`/api/email-campaigns/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/email-campaigns');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete.');
        setDeleting(false);
      }
    } catch { setError('Failed to delete.'); setDeleting(false); }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '260px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statusStyle = STATUS_STYLE[campaign?.status] || STATUS_STYLE.draft;
  const isSent = campaign?.status === 'sent';

  return (
    <Layout
      title="Edit Campaign"
      subtitle={campaign?.name || ''}
      actions={
        <span style={{ padding: '6px 14px', borderRadius: '20px', background: statusStyle.bg, color: statusStyle.color, fontWeight: '600', fontSize: '13px' }}>
          {statusStyle.label}
        </span>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        {/* Main form */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          {isSent && (
            <div style={{ marginBottom: '24px', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#15803d', fontSize: '14px' }}>
              This campaign has been sent and cannot be edited.
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Campaign Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} disabled={isSent}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', background: isSent ? '#f9fafb' : '#fff' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Subject Line *</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} disabled={isSent}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', background: isSent ? '#f9fafb' : '#fff' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Recipient Segment</label>
            <select value={segment} onChange={e => setSegment(e.target.value)} disabled={isSent}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', background: isSent ? '#f9fafb' : '#fff' }}>
              <option value="all">All Customers</option>
              <option value="high_risk">High Risk (score ≥ 70)</option>
              <option value="medium_risk">Medium Risk (score 40–69)</option>
              <option value="low_risk">Low Risk (score &lt; 40)</option>
            </select>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Message Content *</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={10} disabled={isSent}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6', background: isSent ? '#f9fafb' : '#fff' }} />
          </div>

          {error && <div style={{ marginBottom: '16px', padding: '10px 16px', borderRadius: '8px', background: '#fef2f2', color: '#ef4444', fontSize: '14px' }}>{error}</div>}
          {success && <div style={{ marginBottom: '16px', padding: '10px 16px', borderRadius: '8px', background: '#f0fdf4', color: '#10b981', fontSize: '14px' }}>{success}</div>}

          {!isSent && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/email-campaigns')}
                style={{ padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}>
                Cancel
              </button>
              <button onClick={handleSaveDraft} disabled={saving}
                style={{ padding: '10px 20px', background: saving ? '#9ca3af' : '#f3f4f6', color: saving ? '#fff' : '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '14px' }}>
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
            </div>
          )}
        </div>

        {/* Actions panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isSent && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>Send Campaign</h3>

              <button onClick={handleSendNow} disabled={sending}
                style={{ width: '100%', padding: '12px', background: sending ? '#9ca3af' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: sending ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px', marginBottom: '12px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                {sending ? 'Sending...' : 'Send Now'}
              </button>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '4px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Schedule for later</label>
                <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px' }} />
                <button onClick={handleSchedule} disabled={sending || !scheduledAt}
                  style={{ width: '100%', padding: '10px', background: sending || !scheduledAt ? '#e5e7eb' : '#3b82f6', color: sending || !scheduledAt ? '#9ca3af' : '#fff', border: 'none', borderRadius: '8px', cursor: sending || !scheduledAt ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '14px' }}>
                  Schedule
                </button>
              </div>
            </div>
          )}

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>Danger Zone</h3>
            <button onClick={handleDelete} disabled={deleting}
              style={{ width: '100%', padding: '10px', background: deleting ? '#f3f4f6' : '#fef2f2', color: deleting ? '#9ca3af' : '#ef4444', border: `1px solid ${deleting ? '#e5e7eb' : '#fecaca'}`, borderRadius: '8px', cursor: deleting ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '14px' }}>
              {deleting ? 'Deleting...' : 'Delete Campaign'}
            </button>
          </div>

          {campaign?.scheduledAt && campaign.status === 'scheduled' && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#3b82f6', marginBottom: '4px' }}>Scheduled for</div>
              <div style={{ fontSize: '14px', color: '#1e40af' }}>{new Date(campaign.scheduledAt).toLocaleString()}</div>
            </div>
          )}

          {campaign?.sentAt && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#10b981', marginBottom: '4px' }}>Sent at</div>
              <div style={{ fontSize: '14px', color: '#15803d' }}>{new Date(campaign.sentAt).toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
