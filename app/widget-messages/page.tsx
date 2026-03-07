'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function WidgetMessagesPage() {
  const { user, isLoaded } = useUser();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMessage, setNewMessage] = useState({
    title: 'We miss you!',
    content: 'You haven\'t been active lately. Here\'s a special offer to help you get back on track.',
    trigger: 'high_risk',
    isActive: true
  });

  useEffect(() => {
    if (isLoaded && user) fetchMessages();
  }, [isLoaded, user]);

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

  async function createMessage(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/widget/messages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      
      if (res.ok) {
        setShowForm(false);
        fetchMessages();
      } else {
        alert('Failed to create message');
      }
    } catch (error) {
      alert('Error creating message');
    }
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      await fetch(`/api/widget/messages/${id}/toggle`, {
        method: 'POST',
        body: JSON.stringify({ isActive: !current })
      });
      fetchMessages();
    } catch (error) {
      alert('Failed to update');
    }
  }

  if (!isLoaded || loading) return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      <aside style={{width: '250px', background: '#1e293b', borderRight: '1px solid #334155', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem', marginBottom: '2rem'}}>
          <div style={{width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
          ChurnGuard
        </div>
        <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1}}>
          <Link href="/dashboard" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>📊</span> Dashboard
          </Link>
          <Link href="/customers" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>👥</span> Customers
          </Link>
          <Link href="/playbooks" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>⚡</span> Playbooks
          </Link>
          <Link href="/widget-messages" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#334155', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>💬</span> Widget Messages
          </Link>
          <Link href="/settings" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>⚙️</span> Settings
          </Link>
          <Link href="/signout" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '1rem'}}>
            <span>🚪</span> Sign Out
          </Link>
        </nav>
      </aside>

      <main style={{flex: 1, padding: '2rem', marginLeft: '250px'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1 style={{margin: 0, fontSize: '1.875rem'}}>Widget Messages</h1>
          <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none'}}>← Back to Dashboard</Link>
        </header>

        <div style={{marginBottom: '2rem'}}>
          <button onClick={() => setShowForm(!showForm)} style={{padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem'}}>
            {showForm ? 'Cancel' : '+ Create Message'}
          </button>
        </div>

        {showForm && (
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155', marginBottom: '2rem'}}>
            <h3 style={{margin: '0 0 1rem 0'}}>Create Widget Message</h3>
            <form onSubmit={createMessage} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8'}}>Title</label>
                <input type="text" value={newMessage.title} onChange={(e) => setNewMessage({...newMessage, title: e.target.value})} style={{width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8'}}>Content</label>
                <textarea value={newMessage.content} onChange={(e) => setNewMessage({...newMessage, content: e.target.value})} rows={3} style={{width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8'}}>Trigger</label>
                <select value={newMessage.trigger} onChange={(e) => setNewMessage({...newMessage, trigger: e.target.value})} style={{width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}}>
                  <option value="high_risk">High Risk (Score 70+)</option>
                  <option value="risk_score">Risk Score Based</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <button type="submit" style={{padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer'}}>
                Create Message
              </button>
            </form>
          </div>
        )}

        {messages.length === 0 ? (
          <div style={{background: '#1e293b', padding: '3rem', borderRadius: '0.75rem', border: '1px solid #334155', textAlign: 'center'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>💬</div>
            <h3 style={{margin: '0 0 0.5rem 0'}}>No widget messages</h3>
            <p style={{color: '#64748b', margin: '0'}}>Create a message to show to at-risk customers</p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {messages.map((msg: any) => (
              <div key={msg.id} style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <h3 style={{margin: '0 0 0.5rem 0'}}>{msg.title}</h3>
                    <p style={{margin: '0', color: '#64748b', fontSize: '0.875rem'}}>Trigger: {msg.trigger} • {msg.isActive ? '🟢 Active' : '🔴 Inactive'}</p>
                    <p style={{margin: '0.5rem 0 0 0', color: '#94a3b8'}}>{msg.content}</p>
                  </div>
                  <button onClick={() => toggleActive(msg.id, msg.isActive)} style={{padding: '0.5rem 1rem', background: msg.isActive ? '#ef4444' : '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer'}}>
                    {msg.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
