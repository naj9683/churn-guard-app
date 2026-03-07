'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function EmailCampaignsPage() {
  const { user, isLoaded } = useUser();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isLoaded && user) fetchCustomers();
  }, [isLoaded, user]);

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function sendEmail(customer: any) {
    setStatus(`Sending to ${customer.email}...`);
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: customer.email,
          template: 'retention',
          metadata: { offerLink: 'https://churn-guard-app.vercel.app/pricing' }
        })
      });
      
      if (res.ok) {
        setStatus(`✅ Sent to ${customer.email}!`);
      } else {
        const err = await res.json();
        setStatus(`❌ Failed: ${err.error}`);
      }
    } catch (error) {
      setStatus('❌ Error');
    }
  }

  if (!isLoaded || loading) return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;

  const highRisk = customers.filter((c: any) => c.riskScore >= 70 && c.email);

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      <aside style={{width: '250px', background: '#1e293b', borderRight: '1px solid #334155', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem', marginBottom: '2rem'}}>
          <div style={{width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
          ChurnGuard
        </div>
        <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <Link href="/dashboard" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>📊 Dashboard</Link>
          <Link href="/customers" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>👥 Customers</Link>
          <Link href="/playbooks" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>⚡ Playbooks</Link>
          <Link href="/widget-messages" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>💬 Widget</Link>
          <Link href="/email-campaigns" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#334155', color: 'white', textDecoration: 'none'}}>📧 Email Campaigns</Link>
        </nav>
      </aside>

      <main style={{flex: 1, padding: '2rem', marginLeft: '250px'}}>
        <h1 style={{margin: '0 0 2rem 0'}}>📧 Email Campaigns</h1>
        
        {status && (
          <div style={{background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem'}}>
            {status}
          </div>
        )}

        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem'}}>
          <h3>Send Retention Emails</h3>
          <p>High-risk customers (70+): {highRisk.length}</p>
        </div>

        <h3>Customers with Emails</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {customers.filter((c: any) => c.email).map((customer: any) => (
            <div key={customer.id} style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <h4>{customer.externalId}</h4>
                <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>{customer.email}</p>
                <p style={{color: customer.riskScore >= 70 ? '#ef4444' : '#10b981', fontSize: '0.875rem'}}>
                  Risk: {customer.riskScore}
                </p>
              </div>
              <button 
                onClick={() => sendEmail(customer)}
                style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer'}}
              >
                Send Retention Email
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
