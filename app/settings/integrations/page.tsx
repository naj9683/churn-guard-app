'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function IntegrationsPage() {
  const { user } = useUser();
  const [crmStatus, setCrmStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  async function connectHubSpot() {
    try {
      const res = await fetch('/api/integrations/hubspot/auth');
      if (res.ok) {
        const { authUrl } = await res.json();
        // Open in popup so user can check the box
        window.open(authUrl, 'hubspotAuth', 'width=800,height=600,scrollbars=yes');
      }
    } catch (error) {
      alert('Failed to start HubSpot connection');
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', color: 'white', background: '#0f172a', minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>CRM Integrations</h1>
        
        {/* HubSpot Card */}
        <div style={{
          background: '#1e293b',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginTop: '2rem',
          border: crmStatus?.type === 'hubspot' ? '2px solid #ff7a59' : '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '48px', height: '48px', background: '#ff7a59', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              🍊
            </div>
            <div>
              <h2 style={{ margin: 0 }}>HubSpot</h2>
              <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
                {crmStatus?.type === 'hubspot' ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>
          
          <button
            onClick={connectHubSpot}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#ff7a59',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {crmStatus?.type === 'hubspot' ? 'Reconnect HubSpot' : 'Connect HubSpot'}
          </button>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Opens in popup window so you can check the permission box
          </p>
        </div>
      </div>
    </div>
  );
}
