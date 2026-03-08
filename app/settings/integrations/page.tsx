'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function IntegrationsPage() {
  const { user } = useUser();
  const [crmStatus, setCrmStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchCrmStatus();
  }, []);

  async function fetchCrmStatus() {
    try {
      const res = await fetch('/api/integrations/status');
      if (res.ok) {
        const data = await res.json();
        setCrmStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch CRM status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function connectSalesforce() {
    try {
      const res = await fetch('/api/integrations/salesforce/auth');
      if (res.ok) {
        const { authUrl } = await res.json();
        window.location.href = authUrl;
      }
    } catch (error) {
      alert('Failed to start Salesforce connection');
    }
  }

  async function connectHubSpot() {
    try {
      const res = await fetch('/api/integrations/hubspot/auth');
      if (res.ok) {
        const { authUrl } = await res.json();
        window.location.href = authUrl;
      }
    } catch (error) {
      alert('Failed to start HubSpot connection');
    }
  }

  async function syncNow() {
    setSyncing(true);
    try {
      const res = await fetch('/api/crm-sync/sync-all', { method: 'POST' });
      if (res.ok) {
        alert('Sync completed successfully!');
        fetchCrmStatus();
      } else {
        alert('Sync failed');
      }
    } catch (error) {
      alert('Sync failed');
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', color: 'white', background: '#0f172a', minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/settings" style={{ color: '#94a3b8', textDecoration: 'none' }}>← Back to Settings</Link>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>CRM Integrations</h1>
        <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>
          Sync customer risk scores bi-directionally with your CRM. Your CS team will see churn data directly in Salesforce or HubSpot.
        </p>

        {/* Connection Status */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          
          {/* Salesforce Card */}
          <div style={{
            background: '#1e293b',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: crmStatus?.type === 'salesforce' ? '2px solid #6366f1' : '1px solid #334155'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: '#00A1E0', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                ☁️
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>Salesforce</h3>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
                  {crmStatus?.type === 'salesforce' && crmStatus?.connected 
                    ? `Connected • Last sync: ${crmStatus.lastSyncAt ? new Date(crmStatus.lastSyncAt).toLocaleString() : 'Never'}` 
                    : 'Not connected'}
                </p>
              </div>
              {crmStatus?.type === 'salesforce' && crmStatus?.connected ? (
                <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>✓ Active</span>
              ) : (
                <button
                  onClick={connectSalesforce}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Connect
                </button>
              )}
            </div>

            {crmStatus?.type === 'salesforce' && crmStatus?.connected && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={syncNow}
                    disabled={syncing}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      color: 'white',
                      border: '1px solid #334155',
                      borderRadius: '0.5rem',
                      cursor: syncing ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {syncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                  <button
                    onClick={() => window.open('https://login.salesforce.com', '_blank')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      color: '#94a3b8',
                      border: '1px solid #334155',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Open Salesforce
                  </button>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                  <p style={{ margin: '0 0 0.5rem 0' }}><strong>Synced Fields:</strong></p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ background: '#0f172a', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Risk Score</span>
                    <span style={{ background: '#0f172a', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Revenue at Risk</span>
                    <span style={{ background: '#0f172a', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>Health Status</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* HubSpot Card */}
          <div style={{
            background: '#1e293b',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: crmStatus?.type === 'hubspot' ? '2px solid #ff7a59' : '1px solid #334155'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: '#ff7a59', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                🟠
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>HubSpot</h3>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
                  {crmStatus?.type === 'hubspot' && crmStatus?.connected 
                    ? `Connected • Last sync: ${crmStatus.lastSyncAt ? new Date(crmStatus.lastSyncAt).toLocaleString() : 'Never'}` 
                    : 'Not connected'}
                </p>
              </div>
              {crmStatus?.type === 'hubspot' && crmStatus?.connected ? (
                <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: '600' }}>✓ Active</span>
              ) : (
                <button
                  onClick={connectHubSpot}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#ff7a59',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Connect
                </button>
              )}
            </div>

            {crmStatus?.type === 'hubspot' && crmStatus?.connected && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={syncNow}
                    disabled={syncing}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      color: 'white',
                      border: '1px solid #334155',
                      borderRadius: '0.5rem',
                      cursor: syncing ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {syncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                  <button
                    onClick={() => window.open('https://app.hubspot.com', '_blank')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      color: '#94a3b8',
                      border: '1px solid #334155',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Open HubSpot
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* How it Works */}
        <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#1e293b', borderRadius: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>How Bi-Directional Sync Works</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Push: ChurnGuard → CRM</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
                  Risk scores, revenue at risk, and health status appear as custom fields on Account/Company pages.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Read: CRM → ChurnGuard</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
                  Pull contract renewal dates, opportunity stages, and support tickets to improve risk predictions.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Action in CRM</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
                  CS teams see risk alerts in their existing workflow. Click through to ChurnGuard for detailed playbooks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
