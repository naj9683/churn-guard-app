'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [revenue, setRevenue] = useState({ mrr: 0, totalRevenue: 0, customerCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      if (user.emailAddresses[0]?.emailAddress !== 'najwa.saadi1@hotmail.com') {
        setError('Access denied. Admin only.');
        setLoading(false);
        return;
      }
      fetchAdminData();
    }
  }, [isLoaded, user]);

  async function fetchAdminData() {
    try {
      const response = await fetch('/api/admin/data');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setRevenue(data.revenue || { mrr: 0, totalRevenue: 0, customerCount: 0 });
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

  if (error) {
    return (
      <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
        <div style={{fontSize: '1.5rem'}}>🔒 {error}</div>
        <Link href="/dashboard" style={{color: '#6366f1', textDecoration: 'none'}}>← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Back to Dashboard */}
      <div style={{padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155'}}>
        <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'}}>
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      <main style={{padding: '2rem'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <div>
            <h1 style={{margin: 0, fontSize: '1.875rem'}}>Admin Panel</h1>
            <p style={{margin: '0.5rem 0 0', color: '#64748b'}}>Manage your SaaS business</p>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span style={{color: '#94a3b8'}}>{user?.emailAddresses[0]?.emailAddress}</span>
          </div>
        </header>

        {/* Revenue Stats */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Monthly Recurring Revenue</div>
            <div style={{fontSize: '2.25rem', fontWeight: '700', color: '#10b981'}}>${revenue.mrr.toLocaleString()}</div>
          </div>

          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Total Users</div>
            <div style={{fontSize: '2.25rem', fontWeight: '700'}}>{users.length}</div>
          </div>

          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Paid Customers</div>
            <div style={{fontSize: '2.25rem', fontWeight: '700', color: '#8b5cf6'}}>{users.filter(u => u.stripeCustomerId).length}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem', marginBottom: '2rem'}}>
          <h2 style={{margin: '0 0 1rem 0'}}>Quick Actions</h2>
          <div style={{display: 'flex', gap: '1rem'}}>
            <a href="https://dashboard.stripe.com" target="_blank" style={{
              padding: '0.75rem 1.5rem',
              background: '#8b5cf6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600'
            }}>
              Stripe Dashboard →
            </a>
            <a href="https://dashboard.clerk.com" target="_blank" style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600'
            }}>
              Clerk Users →
            </a>
            <a href="https://vercel.com/dashboard" target="_blank" style={{
              padding: '0.75rem 1.5rem',
              background: '#1e293b',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: '1px solid #334155'
            }}>
              Vercel Dashboard →
            </a>
          </div>
        </div>

        {/* Recent Users */}
        <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', marginBottom: '2rem'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #334155'}}>
            <h2 style={{margin: 0}}>Recent Users</h2>
          </div>
          <div style={{padding: '1.5rem'}}>
            {users.length === 0 ? (
              <div style={{color: '#64748b', textAlign: 'center', padding: '2rem'}}>
                No users yet.
              </div>
            ) : (
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{textAlign: 'left', color: '#94a3b8', fontSize: '0.875rem'}}>
                    <th style={{padding: '0.75rem', borderBottom: '1px solid #334155'}}>Email</th>
                    <th style={{padding: '0.75rem', borderBottom: '1px solid #334155'}}>Joined</th>
                    <th style={{padding: '0.75rem', borderBottom: '1px solid #334155'}}>Status</th>
                    <th style={{padding: '0.75rem', borderBottom: '1px solid #334155'}}>MRR</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} style={{borderBottom: '1px solid #334155'}}>
                      <td style={{padding: '0.75rem'}}>{u.email}</td>
                      <td style={{padding: '0.75rem', color: '#64748b'}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{padding: '0.75rem'}}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          background: u.stripeCustomerId ? '#10b981' : '#64748b',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem'
                        }}>
                          {u.stripeCustomerId ? 'Paid' : 'Free'}
                        </span>
                      </td>
                      <td style={{padding: '0.75rem'}}>${u.mrr || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* System Status */}
        <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', padding: '1.5rem'}}>
          <h2 style={{margin: '0 0 1rem 0'}}>System Status</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%'}}></div>
              <span>Database: Connected</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%'}}></div>
              <span>Stripe: Connected</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%'}}></div>
              <span>Slack: Connected</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%'}}></div>
              <span>Auth: Connected</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
