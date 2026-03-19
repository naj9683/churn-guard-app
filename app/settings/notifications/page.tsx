'use client';

import { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#111827' }}>{title}</h2>
        {subtitle && <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{label}</div>
        {hint && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{hint}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: checked ? '#6366f1' : '#e5e7eb', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
      >
        <span style={{ position: 'absolute', top: '2px', left: checked ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
      </button>
    </div>
  );
}

export default function NotificationsPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSlack, setNotifSlack] = useState(false);
  const [slackUrl, setSlackUrl] = useState('');
  const [alertFrequency, setAlertFrequency] = useState('immediate');
  const [riskThreshold, setRiskThreshold] = useState(70);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings/notifications').then(r => r.json()).then(d => {
      setNotifEmail(d.notifEmail !== undefined ? d.notifEmail : true);
      setNotifSlack(d.notifSlack || false);
      setSlackUrl(d.slackWebhookUrl || '');
      setAlertFrequency(d.alertFrequency || 'immediate');
      setRiskThreshold(d.alertRiskThreshold || 70);
    }).finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true); setMsg('');
    const res = await fetch('/api/settings/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notifEmail, notifSlack, slackWebhookUrl: slackUrl, alertFrequency, alertRiskThreshold: riskThreshold })
    });
    setMsg(res.ok ? 'Settings saved.' : 'Failed to save.');
    setSaving(false);
  }

  if (loading) return <Layout title="Notifications"><div style={{ color: '#9ca3af' }}>Loading…</div></Layout>;

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box' };

  return (
    <Layout title="Notification Settings" subtitle="Configure how and when you receive alerts">
      <div style={{ maxWidth: '640px' }}>
        <Section title="Email Notifications" subtitle="Alerts sent to your account email address">
          <Toggle label="Email notifications enabled" hint="Receive risk alerts and digest reports by email" checked={notifEmail} onChange={setNotifEmail} />
          <Toggle label="High-risk customer alerts" hint="Instant email when a customer crosses your risk threshold" checked={notifEmail} onChange={setNotifEmail} />
        </Section>

        <Section title="Slack Notifications" subtitle="Send alerts to a Slack channel via incoming webhook">
          <Toggle label="Slack notifications enabled" checked={notifSlack} onChange={setNotifSlack} />
          {notifSlack && (
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Slack Webhook URL
              </label>
              <input value={slackUrl} onChange={e => setSlackUrl(e.target.value)} placeholder="https://hooks.slack.com/services/..." style={inputStyle} />
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                Create an incoming webhook at <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>api.slack.com/apps</a>
              </div>
            </div>
          )}
        </Section>

        <Section title="Alert Rules" subtitle="Control when notifications are triggered">
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '10px' }}>Alert Frequency</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { value: 'immediate', label: 'Immediate', hint: 'Alert the moment it happens' },
                { value: 'hourly', label: 'Hourly Digest', hint: 'Batch alerts every hour' },
                { value: 'daily', label: 'Daily Digest', hint: 'One summary each morning' }
              ].map(opt => (
                <button key={opt.value} onClick={() => setAlertFrequency(opt.value)} style={{ flex: 1, minWidth: '140px', padding: '12px 14px', borderRadius: '8px', border: `2px solid ${alertFrequency === opt.value ? '#6366f1' : '#e5e7eb'}`, background: alertFrequency === opt.value ? '#f5f3ff' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: alertFrequency === opt.value ? '#6366f1' : '#111827' }}>{opt.label}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{opt.hint}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Risk Score Threshold: <span style={{ color: '#6366f1', fontWeight: '700' }}>{riskThreshold}%</span>
            </label>
            <input type="range" min={0} max={100} value={riskThreshold} onChange={e => setRiskThreshold(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
              <span>0% — Alert on all customers</span>
              <span>100% — Never alert</span>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
              Alert when a customer's churn risk exceeds <strong>{riskThreshold}%</strong>
            </div>
          </div>
        </Section>

        {msg && <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: msg.startsWith('Settings') ? '#f0fdf4' : '#fef2f2', color: msg.startsWith('Settings') ? '#15803d' : '#ef4444', fontSize: '14px' }}>{msg}</div>}

        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: saving ? '#9ca3af' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </Layout>
  );
}
