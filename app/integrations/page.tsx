'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import Layout from '@/app/components/Layout';

type Status = {
  hubspot: boolean;
  salesforce: boolean;
  slack: boolean;
  stripe: boolean;
  crmType: string | null;
};

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

function IntegrationCard({
  icon, name, desc, connected, accentColor, onConnect, onDisconnect,
  comingSoon, active, loading, children,
}: {
  icon: string; name: string; desc: string; connected: boolean; accentColor: string;
  onConnect?: () => void; onDisconnect?: () => void;
  comingSoon?: boolean; active?: boolean; loading?: boolean; children?: React.ReactNode;
}) {
  return (
    <div style={{ border: `1px solid ${connected ? accentColor + '40' : '#e5e7eb'}`, borderRadius: '10px', padding: '20px', background: connected ? accentColor + '05' : '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', background: accentColor + '15', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
            {icon}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {name}
              {connected && <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 7px', background: '#dcfce7', color: '#15803d', borderRadius: '20px' }}>Connected</span>}
              {active && <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 7px', background: '#dcfce7', color: '#15803d', borderRadius: '20px' }}>Active</span>}
              {comingSoon && <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 7px', background: '#f3f4f6', color: '#9ca3af', borderRadius: '20px' }}>Coming Soon</span>}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{desc}</div>
          </div>
        </div>
        {!comingSoon && !active && (
          connected ? (
            <button
              onClick={onDisconnect}
              disabled={loading}
              style={{ padding: '8px 16px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '7px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', flexShrink: 0, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Disconnecting…' : 'Disconnect'}
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={loading}
              style={{ padding: '8px 16px', background: loading ? '#9ca3af' : accentColor, color: '#fff', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', flexShrink: 0 }}
            >
              {loading ? 'Connecting…' : 'Connect'}
            </button>
          )
        )}
      </div>
      {children && <div style={{ marginTop: '16px' }}>{children}</div>}
    </div>
  );
}

// Inline modal for Slack webhook URL entry
function SlackModal({ onSave, onCancel, saving, error }: {
  onSave: (url: string) => void; onCancel: () => void; saving: boolean; error: string;
}) {
  const [url, setUrl] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', width: '480px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: '600', color: '#111827' }}>Connect Slack</h3>
        <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
          Create an incoming webhook in your Slack workspace and paste the URL below. ChurnGuard will use it to send risk alerts to your channel.
        </p>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Slack Webhook URL
        </label>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/..."
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', boxSizing: 'border-box', marginBottom: '8px' }}
          autoFocus
        />
        <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
          Get your webhook URL at{' '}
          <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>
            api.slack.com/apps
          </a>{' '}
          → Your App → Incoming Webhooks → Add New Webhook.
        </div>
        {error && <div style={{ marginBottom: '12px', padding: '8px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '7px', fontSize: '13px' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '9px 18px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={() => onSave(url)}
            disabled={saving || !url.trim()}
            style={{ padding: '9px 18px', background: saving || !url.trim() ? '#9ca3af' : '#4a154b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: saving || !url.trim() ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : 'Connect Slack'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Stripe info panel shown when clicking Connect
function StripeInfoPanel({ onClose }: { onClose: () => void }) {
  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhooks/stripe`
    : 'https://churnguardapp.com/api/webhooks/stripe';
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div style={{ marginTop: '14px', padding: '16px', background: '#f5f3ff', border: '1px solid #e0d9ff', borderRadius: '10px' }}>
      <div style={{ fontSize: '14px', fontWeight: '600', color: '#4f46e5', marginBottom: '8px' }}>How to connect Stripe</div>
      <ol style={{ margin: '0 0 12px', padding: '0 0 0 18px', fontSize: '13px', color: '#374151', lineHeight: '1.8' }}>
        <li>Go to your <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>Stripe Dashboard → Webhooks</a></li>
        <li>Click "Add endpoint" and paste this URL:</li>
      </ol>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
        <code style={{ flex: 1, padding: '8px 12px', background: '#fff', border: '1px solid #e0d9ff', borderRadius: '6px', fontSize: '12px', color: '#374151', wordBreak: 'break-all' }}>
          {webhookUrl}
        </code>
        <button onClick={copy} style={{ padding: '8px 12px', background: copied ? '#dcfce7' : '#6366f1', color: copied ? '#15803d' : '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
        Select events: <code style={{ background: '#fff', padding: '1px 5px', borderRadius: '3px', fontSize: '11px' }}>customer.subscription.deleted</code> <code style={{ background: '#fff', padding: '1px 5px', borderRadius: '3px', fontSize: '11px' }}>invoice.payment_failed</code>
      </div>
      <button onClick={onClose} style={{ fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Dismiss</button>
    </div>
  );
}

// ─── CRM Sync Panel ───────────────────────────────────────────────────────────

function CrmSyncPanel({
  crm, syncInfo, syncResult, syncing, onSync,
}: {
  crm: string;
  syncInfo?: { lastSyncAt: string | null; syncStatus: string; lastError: string | null };
  syncResult: { pulled: number; pushed: number; created: number; updated: number; errors: string[] } | null;
  syncing: boolean;
  onSync: () => void;
}) {
  const [creatingProps, setCreatingProps] = useState(false);
  const [propsResult, setPropsResult] = useState<{ created: string[]; errors: string[] } | null>(null);

  async function createProperties() {
    setCreatingProps(true);
    setPropsResult(null);
    try {
      const res = await fetch(`/api/integrations/${crm}/properties`, { method: 'POST' });
      const d = await res.json();
      setPropsResult({ created: d.created ?? [], errors: d.errors ?? [] });
    } catch (e: any) {
      setPropsResult({ created: [], errors: [e.message] });
    } finally {
      setCreatingProps(false);
    }
  }

  const hasPropertyError = syncResult?.errors.some(e => e.includes('Property setup') || e.includes('custom properties'));
  const statusColor = syncInfo?.syncStatus === 'synced' ? '#10b981'
    : syncInfo?.syncStatus === 'error' ? '#ef4444'
    : syncInfo?.syncStatus === 'partial' ? '#f59e0b'
    : '#9ca3af';

  return (
    <div style={{ padding: '14px 16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151', textTransform: 'capitalize' }}>
              {syncInfo?.syncStatus ?? 'never synced'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            {syncInfo?.lastSyncAt
              ? `Last sync: ${new Date(syncInfo.lastSyncAt).toLocaleString()}`
              : 'No sync yet — click "Sync Now" to start'}
          </div>
        </div>
        <button
          onClick={onSync}
          disabled={syncing}
          style={{
            padding: '8px 18px', background: syncing ? '#e5e7eb' : '#6366f1',
            color: syncing ? '#9ca3af' : '#fff', border: 'none', borderRadius: '7px',
            fontSize: '13px', fontWeight: '600', cursor: syncing ? 'not-allowed' : 'pointer',
            flexShrink: 0, fontFamily: 'inherit',
          }}
        >
          {syncing ? 'Syncing…' : 'Sync Now'}
        </button>
      </div>

      {syncInfo?.lastError && (
        <div style={{ marginTop: '10px', padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', color: '#dc2626' }}>
          Last error: {syncInfo.lastError}
        </div>
      )}

      {syncResult && (
        <div style={{ marginTop: '12px', padding: '12px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '7px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Sync completed</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { label: 'Pulled', value: syncResult.pulled, color: '#6366f1' },
              { label: 'Created', value: syncResult.created, color: '#10b981' },
              { label: 'Updated', value: syncResult.updated, color: '#3b82f6' },
              { label: 'Pushed', value: syncResult.pushed, color: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {syncResult.errors.length > 0 && (
            <div style={{ marginTop: '10px', padding: '8px 12px', background: '#fef2f2', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#dc2626', marginBottom: '4px' }}>
                {syncResult.errors.length} error{syncResult.errors.length > 1 ? 's' : ''}:
              </div>
              {syncResult.errors.slice(0, 3).map((e, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#dc2626', fontFamily: 'monospace' }}>{e}</div>
              ))}
              {syncResult.errors.length > 3 && (
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>…and {syncResult.errors.length - 3} more</div>
              )}
              {hasPropertyError && crm === 'hubspot' && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #fecaca' }}>
                  <div style={{ fontSize: '12px', color: '#7f1d1d', marginBottom: '8px' }}>
                    ChurnGuard needs 4 custom contact properties in HubSpot to push risk scores. Click to auto-create them:
                  </div>
                  <button
                    onClick={createProperties}
                    disabled={creatingProps}
                    style={{ padding: '7px 16px', background: creatingProps ? '#e5e7eb' : '#dc2626', color: creatingProps ? '#9ca3af' : '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: creatingProps ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                  >
                    {creatingProps ? 'Creating…' : 'Create HubSpot Properties'}
                  </button>
                </div>
              )}
            </div>
          )}
          {propsResult && (
            <div style={{ marginTop: '8px', padding: '8px 12px', background: propsResult.errors.length === 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${propsResult.errors.length === 0 ? '#bbf7d0' : '#fecaca'}`, borderRadius: '6px' }}>
              {propsResult.created.length > 0 && (
                <div style={{ fontSize: '12px', color: '#15803d', marginBottom: '4px' }}>
                  ✅ Properties ready: {propsResult.created.join(', ')}. Run Sync Now again.
                </div>
              )}
              {propsResult.errors.length > 0 && propsResult.errors.map((e, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#dc2626', fontFamily: 'monospace' }}>{e}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '11px', color: '#9ca3af', lineHeight: '1.5' }}>
        Pull: {crm === 'hubspot' ? 'HubSpot contacts → ChurnGuard customers' : 'Salesforce contacts → ChurnGuard customers'}<br />
        Push: ChurnGuard risk scores → {crm === 'hubspot' ? 'HubSpot contact properties (churnguard_risk_score, churnguard_health_score, churnguard_risk_reason)' : 'Salesforce contact Description field (+ custom fields if created)'}
      </div>
    </div>
  );
}

function IntegrationsPageInner() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const urlConnected = searchParams.get('connected');
  const { user } = useUser();

  const [status, setStatus] = useState<Status>({ hubspot: false, salesforce: false, slack: false, stripe: false, crmType: null });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});
  const [showSlackModal, setShowSlackModal] = useState(false);
  const [slackSaving, setSlackSaving] = useState(false);
  const [slackError, setSlackError] = useState('');
  const [showStripeInfo, setShowStripeInfo] = useState(false);
  const [syncResult, setSyncResult] = useState<Record<string, { pulled: number; pushed: number; created: number; updated: number; errors: string[]; lastSyncAt?: string } | null>>({});
  const [syncInfo, setSyncInfo] = useState<Record<string, { lastSyncAt: string | null; syncStatus: string; lastError: string | null; reconnectRequired?: boolean }>>({});

  useEffect(() => {
    loadStatus();
    loadSyncInfo();
  }, []);

  async function loadStatus() {
    setLoading(true);
    try {
      const res = await fetch('/api/integrations/status');
      if (res.ok) {
        const d = await res.json();
        setStatus({
          hubspot: d.type === 'hubspot' && d.connected,
          salesforce: d.type === 'salesforce' && d.connected,
          slack: !!d.slackConnected,
          stripe: !!d.stripeConnected,
          crmType: d.type ?? null,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  function setBusyFor(key: string, val: boolean) { setBusy(b => ({ ...b, [key]: val })); }
  function setErrorFor(key: string, msg: string) { setError(e => ({ ...e, [key]: msg })); }

  async function loadSyncInfo() {
    const [hs, sf] = await Promise.all([
      fetch('/api/integrations/hubspot/sync').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/integrations/salesforce/sync').then(r => r.ok ? r.json() : null).catch(() => null),
    ]);
    setSyncInfo({
      hubspot:    { lastSyncAt: hs?.lastSyncAt ?? null,    syncStatus: hs?.syncStatus ?? 'disconnected', lastError: hs?.lastError ?? null, reconnectRequired: hs?.reconnectRequired ?? false },
      salesforce: { lastSyncAt: sf?.lastSyncAt ?? null, syncStatus: sf?.syncStatus ?? 'disconnected', lastError: sf?.lastError ?? null, reconnectRequired: sf?.reconnectRequired ?? false },
    });
  }

  async function syncNow(crm: 'hubspot' | 'salesforce') {
    setBusyFor(`sync_${crm}`, true);
    setErrorFor(crm, '');
    setSyncResult(r => ({ ...r, [crm]: null }));
    try {
      const res = await fetch(`/api/integrations/${crm}/sync`, { method: 'POST' });
      const d = await res.json();
      if (!res.ok) {
        if (d.reconnectRequired) {
          setSyncInfo(s => ({ ...s, [crm]: { ...s[crm], reconnectRequired: true, lastError: d.error } }));
        }
        throw new Error(d.error ?? 'Sync failed');
      }
      setSyncResult(r => ({ ...r, [crm]: d }));
      loadSyncInfo();
    } catch (e: any) {
      setErrorFor(crm, e.message);
    } finally {
      setBusyFor(`sync_${crm}`, false);
    }
  }

  // ── HubSpot ────────────────────────────────────────────────────────────────
  function connectHubSpot() {
    if (!user?.id) { setErrorFor('hubspot', 'Not signed in — please refresh and try again.'); return; }
    window.location.href = `/api/integrations/hubspot/auth?uid=${encodeURIComponent(user.id)}`;
  }

  async function disconnectHubSpot() {
    if (!confirm('Disconnect HubSpot? Data already synced will remain in ChurnGuard.')) return;
    setBusyFor('hubspot', true);
    const res = await fetch('/api/integrations/disconnect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'hubspot' }) });
    if (res.ok) setStatus(s => ({ ...s, hubspot: false, crmType: s.crmType === 'hubspot' ? null : s.crmType }));
    else setErrorFor('hubspot', 'Failed to disconnect.');
    setBusyFor('hubspot', false);
  }

  // ── Salesforce ─────────────────────────────────────────────────────────────
  function connectSalesforce() {
    if (!user?.id) { setErrorFor('salesforce', 'Not signed in — please refresh and try again.'); return; }
    window.location.href = `/api/integrations/salesforce/auth?uid=${encodeURIComponent(user.id)}`;
  }

  async function disconnectSalesforce() {
    if (!confirm('Disconnect Salesforce? Data already synced will remain in ChurnGuard.')) return;
    setBusyFor('salesforce', true);
    const res = await fetch('/api/integrations/disconnect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'salesforce' }) });
    if (res.ok) setStatus(s => ({ ...s, salesforce: false, crmType: s.crmType === 'salesforce' ? null : s.crmType }));
    else setErrorFor('salesforce', 'Failed to disconnect.');
    setBusyFor('salesforce', false);
  }

  // ── Slack ──────────────────────────────────────────────────────────────────
  async function saveSlackWebhook(url: string) {
    setSlackSaving(true);
    setSlackError('');
    const res = await fetch('/api/integrations/slack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl: url }),
    });
    const d = await res.json();
    if (res.ok) {
      setStatus(s => ({ ...s, slack: true }));
      setShowSlackModal(false);
    } else {
      setSlackError(d.error || 'Failed to save webhook URL.');
    }
    setSlackSaving(false);
  }

  async function disconnectSlack() {
    if (!confirm('Disconnect Slack? You will stop receiving Slack alerts.')) return;
    setBusyFor('slack', true);
    const res = await fetch('/api/integrations/slack', { method: 'DELETE' });
    if (res.ok) setStatus(s => ({ ...s, slack: false }));
    else setErrorFor('slack', 'Failed to disconnect.');
    setBusyFor('slack', false);
  }

  if (loading) return <Layout title="Integrations"><div style={{ color: '#9ca3af' }}>Loading…</div></Layout>;

  return (
    <Layout title="Integrations" subtitle="Connect ChurnGuard to your existing tools">
      <div style={{ maxWidth: '720px' }}>
        {urlError && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', fontSize: '13px', color: '#dc2626' }}>
            <strong>Connection failed:</strong> {decodeURIComponent(urlError)}
          </div>
        )}
        {urlConnected && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '13px', color: '#15803d' }}>
            <strong>Connected!</strong> {urlConnected} was successfully connected.
          </div>
        )}
        {showSlackModal && (
          <SlackModal
            onSave={saveSlackWebhook}
            onCancel={() => { setShowSlackModal(false); setSlackError(''); }}
            saving={slackSaving}
            error={slackError}
          />
        )}

        {/* CRM */}
        <Section title="CRM" subtitle="Sync customers and interventions with your CRM">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <IntegrationCard
              icon="🍊" name="HubSpot"
              desc="Sync contacts, deals, and risk scores bidirectionally with HubSpot CRM"
              connected={status.hubspot} accentColor="#ff7a59"
              loading={busy.hubspot}
              onConnect={connectHubSpot}
              onDisconnect={disconnectHubSpot}
            >
              {syncInfo.hubspot?.reconnectRequired && (
                <div style={{ padding: '10px 14px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '7px', fontSize: '13px', color: '#c2410c', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <span>⚠️ Your HubSpot authorization has expired.</span>
                  <button onClick={connectHubSpot} style={{ padding: '6px 14px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                    Reconnect
                  </button>
                </div>
              )}
              {!status.hubspot && (
                <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '7px', fontSize: '12px', color: '#92400e', marginBottom: '4px', lineHeight: '1.6' }}>
                  <strong>Setup required in HubSpot:</strong> Go to{' '}
                  <a href="https://app.hubspot.com/developer" target="_blank" rel="noreferrer" style={{ color: '#b45309' }}>app.hubspot.com/developer</a>
                  {' '}→ Your App → Auth → add this redirect URL:<br />
                  <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', display: 'inline-block', marginTop: '4px', wordBreak: 'break-all' }}>
                    https://churnguardapp.com/api/integrations/hubspot/callback
                  </code>
                </div>
              )}
              {error.hubspot && <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '7px', fontSize: '13px', marginBottom: '10px' }}>{error.hubspot}</div>}
              {status.hubspot && (
                <CrmSyncPanel
                  crm="hubspot"
                  syncInfo={syncInfo.hubspot}
                  syncResult={syncResult.hubspot ?? null}
                  syncing={!!busy.sync_hubspot}
                  onSync={() => syncNow('hubspot')}
                />
              )}
            </IntegrationCard>

            <IntegrationCard
              icon="☁️" name="Salesforce"
              desc="Push churn risk scores to Salesforce and pull customer health data"
              connected={status.salesforce} accentColor="#0070d2"
              loading={busy.salesforce}
              onConnect={connectSalesforce}
              onDisconnect={disconnectSalesforce}
            >
              {syncInfo.salesforce?.reconnectRequired && (
                <div style={{ padding: '10px 14px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '7px', fontSize: '13px', color: '#c2410c', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <span>⚠️ Your Salesforce authorization has expired.</span>
                  <button onClick={connectSalesforce} style={{ padding: '6px 14px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                    Reconnect
                  </button>
                </div>
              )}
              {!status.salesforce && (
                <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '7px', fontSize: '12px', color: '#1e40af', marginBottom: '4px', lineHeight: '1.6' }}>
                  <strong>Setup required in Salesforce:</strong> In your Connected App settings, add this callback URL:<br />
                  <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', display: 'inline-block', marginTop: '4px', wordBreak: 'break-all' }}>
                    https://churnguardapp.com/api/integrations/salesforce/callback
                  </code>
                </div>
              )}
              {error.salesforce && <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '7px', fontSize: '13px', marginBottom: '10px' }}>{error.salesforce}</div>}
              {status.salesforce && (
                <CrmSyncPanel
                  crm="salesforce"
                  syncInfo={syncInfo.salesforce}
                  syncResult={syncResult.salesforce ?? null}
                  syncing={!!busy.sync_salesforce}
                  onSync={() => syncNow('salesforce')}
                />
              )}
            </IntegrationCard>
          </div>
        </Section>

        {/* Payments */}
        <Section title="Payments" subtitle="Pull subscription and MRR data from your billing provider">
          <IntegrationCard
            icon="💳" name="Stripe"
            desc="Automatically import customers, MRR, and subscription cancellation events via webhook"
            connected={status.stripe} accentColor="#6772e5"
            onConnect={() => setShowStripeInfo(v => !v)}
            onDisconnect={() => setShowStripeInfo(v => !v)}
          >
            {showStripeInfo && <StripeInfoPanel onClose={() => setShowStripeInfo(false)} />}
          </IntegrationCard>
        </Section>

        {/* Messaging */}
        <Section title="Messaging & Alerts" subtitle="Send notifications to your team communication tools">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <IntegrationCard
              icon="💬" name="Slack"
              desc="Get real-time risk alerts and intervention summaries in your Slack channels"
              connected={status.slack} accentColor="#4a154b"
              loading={busy.slack}
              onConnect={() => { setShowSlackModal(true); setSlackError(''); }}
              onDisconnect={disconnectSlack}
            >
              {error.slack && <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '7px', fontSize: '13px' }}>{error.slack}</div>}
            </IntegrationCard>

            <IntegrationCard
              icon="📧" name="SendGrid"
              desc="Route ChurnGuard emails through your SendGrid account for custom domains"
              connected={false} accentColor="#1a82e2" comingSoon
            />
          </div>
        </Section>

        {/* Analytics */}
        <Section title="Analytics & Data" subtitle="Export and enrich your churn data with other platforms">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <IntegrationCard
              icon="📊" name="Segment"
              desc="Receive customer events from Segment to power ChurnGuard risk scoring"
              connected={false} accentColor="#52bd95" active
            />
            <IntegrationCard
              icon="🔬" name="Mixpanel"
              desc="Import product usage events to improve churn prediction accuracy"
              connected={false} accentColor="#7856ff" active
            />
          </div>
        </Section>

        <div style={{ padding: '16px 20px', background: '#f5f3ff', border: '1px solid #e0d9ff', borderRadius: '10px', fontSize: '13px', color: '#6b7280' }}>
          <strong style={{ color: '#4f46e5' }}>Need a custom integration?</strong> Use our{' '}
          <a href="/settings/webhooks" style={{ color: '#6366f1' }}>webhooks</a> to push ChurnGuard events to any endpoint, or the{' '}
          <a href="/settings/api-keys" style={{ color: '#6366f1' }}>API</a> to pull data into your own systems.
        </div>
      </div>
    </Layout>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<Layout title="Integrations"><div style={{ color: '#9ca3af' }}>Loading…</div></Layout>}>
      <IntegrationsPageInner />
    </Suspense>
  );
}
