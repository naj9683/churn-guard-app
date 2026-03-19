'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/app/components/Layout';

export default function EditWidgetMessagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [trigger, setTrigger] = useState('high_risk');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMessage() {
      try {
        const res = await fetch('/api/widget/messages/list');
        if (res.ok) {
          const data = await res.json();
          const msg = (data.messages || []).find((m: any) => m.id === id);
          if (msg) {
            setTitle(msg.title || '');
            setContent(msg.content || '');
            setTrigger(msg.trigger || 'high_risk');
            setIsActive(msg.isActive !== false);
          } else {
            setError('Message not found.');
          }
        }
      } catch {
        setError('Failed to load message.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchMessage();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/widget/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, trigger, isActive })
      });
      if (res.ok) {
        router.push('/widget-messages');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update message.');
      }
    } catch {
      setError('Failed to update message.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '260px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Layout
      title="Edit Widget Message"
      subtitle="Update the in-app message content and settings"
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
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
