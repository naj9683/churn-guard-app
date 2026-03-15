'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';

interface Customer {
  id: string;
  name: string | null;
  email: string;
  riskScore: number;
  mrr: number;
  arr: number;
  createdAt: string;
}

export default function CustomersPage() {
  const { user, isLoaded } = useUser();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchCustomers();
    }
  }, [isLoaded, user]);

  async function fetchCustomers() {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
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
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      <Sidebar />
      <header style={{background: '#1e293b', borderBottom: '1px solid #334155', padding: '1.5rem 2rem', marginLeft: '250px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={{margin: 0}}>Customers</h1>
          <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none'}}>← Back to Dashboard</Link>
        </div>
      </header>

      <main style={{maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem', marginLeft: '250px'}}>
        <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
          {customers.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <p>No customers yet.</p>
              <p>Add customers via the API.</p>
            </div>
          ) : (
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid #334155'}}>
                  <th style={{padding: '1rem'}}>Customer</th>
                  <th style={{padding: '1rem'}}>Risk Score</th>
                  <th style={{padding: '1rem'}}>MRR</th>
                  <th style={{padding: '1rem'}}>Created</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} style={{borderBottom: '1px solid #334155'}}>
                    <td style={{padding: '1rem'}}>
                      <div style={{fontWeight: '600'}}>{customer.name || customer.email}</div>
                      <div style={{color: '#64748b', fontSize: '0.875rem'}}>{customer.email}</div>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        background: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
                        color: 'white'
                      }}>
                        {customer.riskScore}
                      </span>
                    </td>
                    <td style={{padding: '1rem'}}>${customer.mrr.toLocaleString()}</td>
                    <td style={{padding: '1rem', color: '#64748b'}}>{new Date(customer.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}