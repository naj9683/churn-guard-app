'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Layout from '@/app/components/Layout';

const TIMEZONES = ['UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Singapore', 'Asia/Dubai', 'Australia/Sydney'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <h2 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{hint}</div>}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', outline: 'none' };

export default function GeneralSettingsPage() {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/settings/general');
      if (res.ok) {
        const d = await res.json();
        setName(d.name || '');
        setCompany(d.company || '');
        setTimezone(d.timezone || 'UTC');
      }
    }
    if (isLoaded) load();
  }, [isLoaded]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg('');
    const res = await fetch('/api/settings/general', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, timezone })
    });
    setMsg(res.ok ? 'Saved successfully.' : 'Failed to save.');
    setSaving(false);
  }

  return (
    <Layout title="General Settings" subtitle="Manage your account and company information">
      <div style={{ maxWidth: '640px' }}>
        <Section title="Profile">
          <form onSubmit={save}>
            <Field label="Display Name" hint="Your name as shown in the app and emails.">
              <input value={name} onChange={e => setName(e.target.value)} placeholder={user?.firstName || 'Your name'} style={inputStyle} />
            </Field>
            <Field label="Email Address" hint="Managed by your Clerk account. Change it in your profile.">
              <input value={user?.emailAddresses[0]?.emailAddress || ''} disabled style={{ ...inputStyle, background: '#f9fafb', color: '#6b7280' }} />
            </Field>
            <Field label="Company Name">
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Inc." style={inputStyle} />
            </Field>
            <Field label="Timezone">
              <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ ...inputStyle }}>
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </Field>
            {msg && <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: msg.startsWith('Saved') ? '#f0fdf4' : '#fef2f2', color: msg.startsWith('Saved') ? '#15803d' : '#ef4444', fontSize: '14px' }}>{msg}</div>}
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: saving ? '#9ca3af' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </Section>

        <Section title="Password">
          <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
            Password management is handled by Clerk. Click below to update your password securely.
          </p>
          <a href="https://accounts.clerk.dev" target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '10px 20px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>
            Manage Password →
          </a>
        </Section>

        <Section title="Danger Zone">
          <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>Permanently delete your account and all associated data. This cannot be undone.</p>
          <button style={{ padding: '10px 20px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}
            onClick={() => alert('Please contact support to delete your account.')}>
            Delete Account
          </button>
        </Section>
      </div>
    </Layout>
  );
}
