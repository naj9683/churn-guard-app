'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [slackStatus, setSlackStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      checkSlackStatus();
    }
  }, [isLoaded, user]);

  async function checkSlackStatus() {
    try {
      const response = await fetch('/api/slack/configure');
      if (response.ok) {
        const data = await response.json();
        setSlackStatus(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      <header style={{background: '#1e293b', borderBottom: '1px solid #334155', padding: '1.5rem 2rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={{margin: 0}}>Settings</h1>
          <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none'}}>← Back to Dashboard</Link>
        </div>
      </header>

      <main style={{maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <h3 style={{margin: '0 0 1rem 0'}}>Slack Integration</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: slackStatus?.configured ? '#10b981' : '#64748b'
              }}></div>
              <span>{slackStatus?.configured ? 'Connected' : 'Not Connected'}</span>
            </div>
            {slackStatus?.configured && (
              <p style={{color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem'}}>
                Alerts will be sent to your Slack channel
              </p>
            )}
          </div>

          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <h3 style={{margin: '0 0 1rem 0'}}>Billing</h3>
            <p style={{color: '#94a3b8', marginBottom: '1rem'}}>Manage your subscription and billing details.</p>
            <Link href="/pricing" style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#8b5cf6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem'
            }}>
              View Plans
            </Link>
          </div>

          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
            <h3 style={{margin: '0 0 1rem 0'}}>Account</h3>
            <p style={{color: '#94a3b8'}}>Signed in as: {user?.emailAddresses[0]?.emailAddress}</p>
          </div>

        </div>
      </main>
    </div>
  );
}