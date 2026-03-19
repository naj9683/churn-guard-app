'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';

export default function NewEmailCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [segment, setSegment] = useState('all');
  const [content, setContent] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent, sendNow = false) {
    e.preventDefault();
    if (!name || !subject || !content) {
      setError('Campaign name, subject line, and message content are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, content, segment, scheduledAt: scheduledAt || null })
      });
      if (res.ok) {
        const data = await res.json();
        if (sendNow) {
          await fetch(`/api/email-campaigns/${data.campaign.id}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sendNow: true })
          });
        }
        router.push('/email-campaigns');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create campaign.');
      }
    } catch {
      setError('Failed to create campaign.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout
      title="New Email Campaign"
      subtitle="Create a campaign to reach your customers"
    >
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '680px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
              Campaign Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Win-back Q1 2026"
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box'}}
            />
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
              Subject Line *
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. We miss you — here's an exclusive offer"
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box'}}
            />
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
              Recipient Segment
            </label>
            <select
              value={segment}
              onChange={e => setSegment(e.target.value)}
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'}}
            >
              <option value="all">All Customers</option>
              <option value="high_risk">High Risk (score ≥ 70)</option>
              <option value="medium_risk">Medium Risk (score 40–69)</option>
              <option value="low_risk">Low Risk (score &lt; 40)</option>
            </select>
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
              Message Content *
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your email message here..."
              rows={8}
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.6'}}
            />
          </div>

          <div style={{marginBottom: '28px'}}>
            <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
              Send Schedule <span style={{color: '#9ca3af', fontWeight: '400'}}>(optional — leave blank to save as draft)</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box'}}
            />
          </div>

          {error && (
            <div style={{marginBottom: '20px', padding: '10px 16px', borderRadius: '8px', background: '#fef2f2', color: '#ef4444', fontSize: '14px'}}>
              {error}
            </div>
          )}

          <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
            <button
              type="button"
              onClick={() => router.push('/email-campaigns')}
              style={{padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px'}}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              onClick={e => handleSubmit(e, false)}
              style={{padding: '10px 20px', background: saving ? '#9ca3af' : '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '14px'}}
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={e => handleSubmit(e as any, true)}
              style={{padding: '10px 24px', background: saving ? '#9ca3af' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '500', fontSize: '14px', boxShadow: saving ? 'none' : '0 4px 12px rgba(99,102,241,0.3)'}}
            >
              {saving ? 'Sending...' : 'Save & Send Now'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
