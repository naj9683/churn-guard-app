'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{label}</div>
        {hint && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{hint}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: checked ? '#6366f1' : '#e5e7eb', cursor: 'pointer', position: 'relative', flexShrink: 0 }}
      >
        <span style={{ position: 'absolute', top: '2px', left: checked ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>{title}</h2>
      {children}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [cfg, setCfg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => { setCfg(d); setLoading(false); });
  }, []);

  function set(key: string, val: any) { setCfg((c: any) => ({ ...c, [key]: val })); }

  async function save() {
    setSaving(true); setMsg('');
    const res = await fetch('/api/admin/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg)
    });
    setMsg(res.ok ? 'Settings saved.' : 'Failed to save.');
    setSaving(false);
  }

  const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: '7px', border: '1px solid #e5e7eb', fontSize: '14px', width: '100px' };

  return (
    <AdminShell title="System Settings" subtitle="Global configuration for the ChurnGuard platform" loading={loading}>
      {cfg && (
        <>
          <Section title="Risk Thresholds">
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Default Risk Alert Threshold: <strong style={{ color: '#6366f1' }}>{cfg.defaultRiskThreshold}%</strong>
                </label>
                <input type="range" min={0} max={100} value={cfg.defaultRiskThreshold}
                  onChange={e => set('defaultRiskThreshold', Number(e.target.value))}
                  style={{ width: '240px', accentColor: '#6366f1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  High Risk Threshold: <strong style={{ color: '#ef4444' }}>{cfg.highRiskThreshold}%</strong>
                </label>
                <input type="range" min={0} max={100} value={cfg.highRiskThreshold}
                  onChange={e => set('highRiskThreshold', Number(e.target.value))}
                  style={{ width: '240px', accentColor: '#ef4444' }} />
              </div>
            </div>
          </Section>

          <Section title="Feature Flags">
            <Toggle label="Email Notifications" hint="Allow users to receive email alerts" checked={cfg.emailNotificationsEnabled} onChange={v => set('emailNotificationsEnabled', v)} />
            <Toggle label="Slack Notifications" hint="Allow Slack webhook integrations" checked={cfg.slackNotificationsEnabled} onChange={v => set('slackNotificationsEnabled', v)} />
            <Toggle label="Widgets" hint="Enable in-app widget messages" checked={cfg.widgetsEnabled} onChange={v => set('widgetsEnabled', v)} />
            <Toggle label="New Signups" hint="Allow new users to register" checked={cfg.allowNewSignups} onChange={v => set('allowNewSignups', v)} />
            <Toggle label="Debug Mode" hint="Enable verbose server-side logging" checked={cfg.debugMode} onChange={v => set('debugMode', v)} />
          </Section>

          <Section title="Limits">
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Max Customers / User</label>
                <input type="number" value={cfg.maxCustomersPerUser} onChange={e => set('maxCustomersPerUser', Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>API Rate Limit (req/hr)</label>
                <input type="number" value={cfg.apiRateLimit} onChange={e => set('apiRateLimit', Number(e.target.value))} style={inputStyle} />
              </div>
            </div>
          </Section>

          <div style={{ padding: '16px 20px', background: cfg.maintenanceMode ? '#fef2f2' : '#f9fafb', border: `1px solid ${cfg.maintenanceMode ? '#fecaca' : '#e5e7eb'}`, borderRadius: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: cfg.maintenanceMode ? '#ef4444' : '#111827' }}>
                {cfg.maintenanceMode ? '🚧 Maintenance Mode ACTIVE' : 'Maintenance Mode'}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>When on, all users see a maintenance message. Only admin can access.</div>
            </div>
            <button
              onClick={() => set('maintenanceMode', !cfg.maintenanceMode)}
              style={{ padding: '8px 16px', background: cfg.maintenanceMode ? '#ef4444' : '#f3f4f6', color: cfg.maintenanceMode ? '#fff' : '#374151', border: 'none', borderRadius: '7px', fontWeight: '500', fontSize: '13px', cursor: 'pointer' }}
            >
              {cfg.maintenanceMode ? 'Disable' : 'Enable Maintenance'}
            </button>
          </div>

          {msg && <div style={{ marginBottom: '16px', padding: '10px 14px', background: msg === 'Settings saved.' ? '#f0fdf4' : '#fef2f2', color: msg === 'Settings saved.' ? '#15803d' : '#ef4444', borderRadius: '8px', fontSize: '14px' }}>{msg}</div>}

          <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: saving ? '#9ca3af' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </>
      )}
    </AdminShell>
  );
}
