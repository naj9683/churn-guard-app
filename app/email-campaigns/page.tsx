'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function EmailCampaignsPage() {
  const { user, isLoaded } = useUser();
  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    if (isLoaded && user) fetchCustomers();
  }, [isLoaded, user]);

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setAllCustomers(data.customers || []);
        setCustomers((data.customers || []).filter((c: any) => c.email));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addEmailToCustomer(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Adding email...');

    try {
      const res = await fetch('/api/customers/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer,
          email: emailInput
        })
      });

      if (res.ok) {
        setStatus(`✅ Email added to ${selectedCustomer}!`);
        setShowAddEmail(false);
        setEmailInput('');
        fetchCustomers();
      } else {
        const err = await res.json();
        setStatus(`❌ Failed: ${err.error}`);
      }
    } catch (error) {
      setStatus('❌ Error adding email');
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
        setStatus(`✅ Email sent to ${customer.email}!`);
      } else {
        const err = await res.json();
        setStatus(`❌ Failed: ${err.error}`);
      }
    } catch (error) {
      setStatus('❌ Error');
    }
  }

  if (!isLoaded || loading) return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;

  const highRisk = customers.filter((c: any) => c.riskScore >= 70);
  const customersWithoutEmail = allCustomers.filter((c: any) => !c.email);

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Back to Dashboard */}
      <div style={{padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155'}}>
        <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      <main style={{padding: '2rem'}}>
        <h1 style={{margin: '0 0 2rem 0'}}>📧 Email Campaigns</h1>

        {status && (
          <div style={{background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', borderLeft: '4px solid #6366f1'}}>
            {status}
          </div>
        )}

        {/* Add Email Section */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #334155'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showAddEmail ? '1rem' : '0'}}>
            <div>
              <h3 style={{margin: '0 0 0.5rem 0'}}>Add Email to Customer</h3>
              <p style={{margin: '0', color: '#94a3b8', fontSize: '0.875rem'}}>{customersWithoutEmail.length} customers without emails</p>
            </div>
            <button
              onClick={() => setShowAddEmail(!showAddEmail)}
              style={{padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer'}}
            >
              {showAddEmail ? 'Cancel' : '+ Add Email'}
            </button>
          </div>

          {showAddEmail && (
            <form onSubmit={addEmailToCustomer} style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #334155'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8'}}>Select Customer</label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    style={{width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}}
                    required
                  >
                    <option value="">-- Select Customer --</option>
                    {customersWithoutEmail.map((c: any) => (
                      <option key={c.id} value={c.externalId}>{c.externalId} (Risk: {c.riskScore})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8'}}>Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="customer@example.com"
                    style={{width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white'}}
                    required
                  />
                </div>
                <button
                  type="submit"
                  style={{padding: '0.75rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem'}}
                >
                  Add Email
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Stats */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem'}}>
          <h3 style={{margin: '0 0 0.5rem 0'}}>Send Retention Emails</h3>
          <p style={{margin: '0', color: '#94a3b8'}}>High-risk customers with emails (70+): {highRisk.length}</p>
        </div>

        {/* Customer List */}
        <h3 style={{margin: '0 0 1rem 0'}}>Customers with Emails ({customers.length})</h3>
        {customers.length === 0 ? (
          <div style={{background: '#1e293b', padding: '3rem', borderRadius: '0.75rem', textAlign: 'center', color: '#64748b'}}>
            <p>No customers with emails yet.</p>
            <p>Use the "Add Email" button above to add emails.</p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {customers.map((customer: any) => (
              <div key={customer.id} style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155'}}>
                <div>
                  <h4 style={{margin: '0 0 0.5rem 0'}}>{customer.externalId}</h4>
                  <p style={{margin: '0', color: '#94a3b8', fontSize: '0.875rem'}}>{customer.email}</p>
                  <p style={{margin: '0.5rem 0 0 0', color: customer.riskScore >= 70 ? '#ef4444' : '#10b981', fontSize: '0.875rem', fontWeight: '600'}}>
                    Risk Score: {customer.riskScore} {customer.riskScore >= 70 ? '🔥 High Risk' : '✅ Low Risk'}
                  </p>
                </div>
                <button
                  onClick={() => sendEmail(customer)}
                  style={{padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem'}}
                >
                  Send Retention Email
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
