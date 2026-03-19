'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';
import Link from 'next/link';

export default function WidgetMessagesPage() {
  const { user, isLoaded } = useUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) fetchMessages();
  }, [isLoaded, user]);

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/widget/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
      } else {
        alert('Failed to delete message.');
      }
    } catch {
      alert('Failed to delete message.');
    } finally {
      setDeleting(null);
    }
  }

  async function fetchMessages() {
    try {
      const res = await fetch('/api/widget/messages/list');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded || loading) {
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
      title="Widget Messages"
      subtitle="Manage in-app messages for at-risk customers"
      actions={
        <Link href="/widget-messages/new" style={{
          padding: '10px 20px',
          background: '#6366f1',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '500',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
        }}>
          + Create Message
        </Link>
      }
    >
      {messages.length === 0 && (
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '60px',
          textAlign: 'center',
          color: '#6b7280',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>💬</div>
          <div style={{fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: '#111827'}}>No widget messages yet</div>
          <div>Create your first message to engage at-risk customers</div>
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {messages.map((message) => (
          <div key={message.id} style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827'
              }}>{message.title}</h3>
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: message.isActive ? '#f0fdf4' : '#f3f4f6',
                color: message.isActive ? '#10b981' : '#6b7280',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {message.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.5'
            }}>{message.content}</p>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <Link href={`/widget-messages/${message.id}/edit`} style={{
                padding: '8px 16px',
                background: '#f9fafb',
                color: '#374151',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                border: '1px solid #e5e7eb',
                flex: 1,
                textAlign: 'center'
              }}>
                Edit
              </Link>
              <button
                onClick={() => deleteMessage(message.id)}
                disabled={deleting === message.id}
                style={{
                  padding: '8px 16px',
                  background: deleting === message.id ? '#f3f4f6' : '#fef2f2',
                  color: deleting === message.id ? '#9ca3af' : '#ef4444',
                  border: `1px solid ${deleting === message.id ? '#e5e7eb' : '#fecaca'}`,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: deleting === message.id ? 'not-allowed' : 'pointer'
                }}
              >
                {deleting === message.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
