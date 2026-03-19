'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout';

export default function NewWidgetMessagePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [trigger, setTrigger] = useState('high_risk');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/widget/messages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, trigger, isActive })
      });
      if (res.ok) {
        router.push('/widget-messages');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create message.');
      }
    } catch {
      setError('Failed to create message.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout
      title="Create Widget Message"
      subtitle="Set up an in-app message for at-risk customers"
    >
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '640px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Special offer just for you"
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box'}}
            />
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
              Message Content *
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your message to the customer..."
              rows={4}
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical'}}
            />
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
              Trigger / Timing Rule
            </label>
            <select
              value={trigger}
              onChange={e => setTrigger(e.target.value)}
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px'}}
            >
              <option value="high_risk">High Risk (risk score ≥ 70)</option>
              <option value="manual">Manual (always show)</option>
            </select>
          </div>

          <div style={{marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              style={{width: '16px', height: '16px', cursor: 'pointer'}}
            />
            <label htmlFor="isActive" style={{fontSize: '14px', color: '#374151', cursor: 'pointer'}}>
              Active (message will be shown to customers)
            </label>
          </div>

          {error && (
            <div style={{marginBottom: '20px', padding: '10px 16px', borderRadius: '8px', background: '#fef2f2', color: '#ef4444', fontSize: '14px'}}>
              {error}
            </div>
          )}

          <div style={{display: 'flex', gap: '12px'}}>
            <button
              type="button"
              onClick={() => router.push('/widget-messages')}
              style={{padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px'}}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '10px 24px',
                background: saving ? '#9ca3af' : '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              {saving ? 'Creating...' : 'Create Message'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
