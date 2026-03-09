'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface WidgetMessage {
  id: string;
  title: string;
  content: string;
  trigger: 'manual' | 'high_risk' | 'inactive';
  isActive: boolean;
  createdAt: string;
}

export default function WidgetMessagesPage() {
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    trigger: 'high_risk' as const,
    isActive: true
  });

  useEffect(() => {
    fetchMessages();
  }, []);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `/api/widget/messages/${editingId}`
        : '/api/widget/messages/create';
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ title: '', content: '', trigger: 'high_risk', isActive: true });
        setShowForm(false);
        setEditingId(null);
        fetchMessages();
      }
    } catch (error) {
      alert('Failed to save message');
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;
    
    try {
      const res = await fetch(`/api/widget/messages/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchMessages();
      }
    } catch (error) {
      alert('Failed to delete');
    }
  }

  function editMessage(msg: WidgetMessage) {
    setEditingId(msg.id);
    setFormData({
      title: msg.title,
      content: msg.content,
      trigger: msg.trigger as any,
      isActive: msg.isActive
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  }

  if (loading) {
    return <div style={{padding: '2rem', background: '#0f172a', color: 'white', minHeight: '100vh'}}>Loading...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Header */}
      <div style={{padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none'}}>← Back</Link>
          <h1 style={{margin: 0, fontSize: '1.25rem'}}>Widget Messages</h1>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.5rem 1rem',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : '+ New Message'}
        </button>
      </div>

      <main style={{padding: '2rem', maxWidth: '1000px', margin: '0 auto'}}>
        
        {/* Info Box */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <span style={{fontSize: '1.5rem'}}>💡</span>
          <div>
            <p style={{margin: 0, color: '#94a3b8'}}>
              Create messages that appear in the ChurnGuard widget when customers are at risk. 
              <Link href="/widget-install" style={{color: '#6366f1', marginLeft: '0.5rem'}}>View installation guide →</Link>
            </p>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div style={{
            background: '#1e293b',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid #334155'
          }}>
            <h2 style={{marginTop: 0, marginBottom: '1.5rem'}}>
              {editingId ? 'Edit Message' : 'Create New Message'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem'}}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., We miss you!"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem'}}>Message Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="e.g., You've been inactive for 7 days. Here's 20% off your next month to help you get back on track!"
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem'}}>Trigger</label>
                <select
                  value={formData.trigger}
                  onChange={(e) => setFormData({...formData, trigger: e.target.value as any})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="high_risk">High Risk (Score 70+)</option>
                  <option value="inactive">Inactive Users (7+ days)</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>

              <div style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  style={{width: '18px', height: '18px'}}
                />
                <label htmlFor="isActive" style={{color: '#94a3b8'}}>Active (show to customers)</label>
              </div>

              <div style={{display: 'flex', gap: '1rem'}}>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {editingId ? 'Update Message' : 'Create Message'}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: '', content: '', trigger: 'high_risk', isActive: true });
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'transparent',
                      color: '#94a3b8',
                      border: '1px solid #334155',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Messages List */}
        <div style={{display: 'grid', gap: '1rem'}}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: '#1e293b',
              borderRadius: '0.75rem',
              color: '#64748b'
            }}>
              <p>No widget messages yet.</p>
              <button 
                onClick={() => setShowForm(true)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Create your first message
              </button>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{
                  background: '#1e293b',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: msg.isActive ? '1px solid #334155' : '1px solid #ef4444',
                  opacity: msg.isActive ? 1 : 0.7
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
                  <div>
                    <h3 style={{margin: 0, marginBottom: '0.25rem'}}>{msg.title}</h3>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      background: msg.trigger === 'high_risk' ? '#ef4444' : msg.trigger === 'inactive' ? '#f59e0b' : '#6366f1',
                      color: 'white',
                      borderRadius: '9999px',
                      textTransform: 'uppercase'
                    }}>
                      {msg.trigger.replace('_', ' ')}
                    </span>
                    {!msg.isActive && (
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        background: '#64748b',
                        color: 'white',
                        borderRadius: '9999px',
                        marginLeft: '0.5rem'
                      }}>
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button
                      onClick={() => editMessage(msg)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: 'transparent',
                        color: '#94a3b8',
                        border: '1px solid #334155',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p style={{margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem'}}>{msg.content}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
