'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isWelcome?: boolean;
}

const WELCOME: Message = {
  role: 'assistant',
  content: "Hi! I'm the ChurnGuard assistant. Ask me anything about features, pricing, or how ChurnGuard can help reduce your SaaS churn. 👋",
  isWelcome: true,
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestEmail, setSuggestEmail] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading || userCount >= 10) return;

    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    setUserCount(c => c + 1);

    try {
      const apiMessages = next
        .filter(m => !m.isWelcome)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Sorry, something went wrong.' }]);
      if (data.suggestEmail) setSuggestEmail(true);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  async function submitEmail() {
    const email = emailInput.trim();
    if (!email || !email.includes('@')) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ captureEmail: true, email, question: lastUserMsg?.content }),
    });
    setEmailSent(true);
    setSuggestEmail(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '56px', height: '56px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          boxShadow: '0 4px 24px rgba(99,102,241,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '92px', right: '24px', zIndex: 9998,
          width: '340px', height: '480px',
          background: '#0f172a', borderRadius: '16px',
          border: '1px solid #334155',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          fontFamily: 'Inter,-apple-system,BlinkMacSystemFont,sans-serif',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px',
            }}>🛡</div>
            <div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px', lineHeight: '1.2' }}>ChurnGuard AI</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px' }}>Ask me anything</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px' }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '9px 12px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#1e293b',
                  color: '#e2e8f0', fontSize: '13px', lineHeight: '1.5',
                  border: m.role === 'assistant' ? '1px solid #334155' : 'none',
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
                  background: '#1e293b', border: '1px solid #334155',
                  display: 'flex', gap: '4px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {suggestEmail && !emailSent && (
              <div style={{
                background: '#1e293b', border: '1px solid #6366f1', borderRadius: '12px', padding: '12px',
                fontSize: '12px', color: '#cbd5e1',
              }}>
                <div style={{ marginBottom: '8px', fontWeight: '600', color: '#a5b4fc' }}>Want a detailed answer from our team?</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submitEmail()}
                    placeholder="your@email.com"
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: '8px', border: '1px solid #334155',
                      background: '#0f172a', color: '#e2e8f0', fontSize: '12px', outline: 'none',
                    }}
                  />
                  <button onClick={submitEmail} style={{
                    padding: '7px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '12px', fontWeight: '600',
                  }}>Send</button>
                </div>
              </div>
            )}

            {emailSent && (
              <div style={{
                background: '#1e293b', border: '1px solid #4ade80', borderRadius: '12px', padding: '10px 12px',
                fontSize: '12px', color: '#4ade80', textAlign: 'center',
              }}>
                ✓ Got it! We'll be in touch soon.
              </div>
            )}

            {userCount >= 10 && (
              <div style={{
                background: '#1e293b', border: '1px solid #f59e0b', borderRadius: '12px', padding: '10px 12px',
                fontSize: '12px', color: '#fbbf24', textAlign: 'center',
              }}>
                You've reached the chat limit. <a href="/book" style={{ color: '#a5b4fc', textDecoration: 'underline' }}>Book a call</a> for more help.
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #1e293b', display: 'flex', gap: '8px', background: '#0f172a' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={userCount >= 10 ? 'Chat limit reached' : 'Ask about pricing, features…'}
              disabled={userCount >= 10 || loading}
              style={{
                flex: 1, padding: '9px 12px', borderRadius: '10px',
                border: '1px solid #334155', background: '#1e293b',
                color: '#e2e8f0', fontSize: '13px', outline: 'none',
                opacity: userCount >= 10 ? 0.5 : 1,
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading || userCount >= 10}
              style={{
                padding: '9px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '16px',
                opacity: !input.trim() || loading || userCount >= 10 ? 0.5 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              ↑
            </button>
          </div>

          {/* Footer */}
          <div style={{
            padding: '6px', textAlign: 'center', fontSize: '10px', color: '#475569',
            borderTop: '1px solid #1e293b', background: '#0f172a',
          }}>
            Powered by <span style={{ color: '#6366f1', fontWeight: '600' }}>Claude</span>
          </div>

          <style>{`
            @keyframes bounce {
              0%, 60%, 100% { transform: translateY(0); }
              30% { transform: translateY(-6px); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
