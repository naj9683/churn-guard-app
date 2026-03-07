'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [playbooks, setPlaybooks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ totalCustomers: 0, atRisk: 0, monthlyRevenue: 0, activePlaybooks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData();
    }
  }, [isLoaded, user]);

  async function fetchDashboardData() {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setPlaybooks(data.playbooks || []);
        setCustomers(data.customers || []);
        setStats(data.stats || { totalCustomers: 0, atRisk: 0, monthlyRevenue: 0, activePlaybooks: 0 });
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function runPlaybook(id: string) {
    try {
      const response = await fetch('/api/playbooks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbookId: id })
      });
      if (response.ok) {
        alert('Playbook executed successfully!');
      }
    } catch (error) {
      alert('Failed to run playbook');
    }
  }

  if (!isLoaded || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      {/* Sidebar */}
      <aside style={{width: '250px', background: '#1e293b', borderRight: '1px solid #334155', padding: '1.5rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem', marginBottom: '2rem'}}>
          <div style={{width: '32px', height: '32px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🛡️</div>
          ChurnGuard
        </div>
        
        <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <Link href="/dashboard" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#334155', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>📊</span> Dashboard
          </Link>
          <Link href="/customers" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>👥</span> Customers
          </Link>
          <Link href="/playbooks" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>⚡</span> Playbooks
          </Link>
          <Link href="/analytics" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>📈</span> Analytics
          </Link>
          <Link href="/settings" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>⚙️</span> Settings
          </Link>
        </nav>

        <div style={{marginTop: 'auto', paddingTop: '2rem'}}>
          <Link href="/admin" style={{padding: '0.75rem 1rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span>🔒</span> Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{flex: 1, padding: '2rem', overflow: 'auto'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1 style={{margin: 0, fontSize: '1.875rem'}}>Dashboard</h1>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span style={{color: '#94a3b8'}}>{user?.emailAddresses[0]?.emailAddress}</span>
            <Link href="/pricing" style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontSize: '0.875rem'}}>
              Upgrade
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem'}}>Total Customers</div>
            <div style={{fontSize: '2rem', fontWeight: '700'}}>{stats.totalCustomers}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem'}}>At Risk</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: stats.atRisk > 0 ? '#ef4444' : 'white'}}>{stats.atRisk}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem'}}>Monthly Revenue</div>
            <div style={{fontSize: '2rem', fontWeight: '700'}}>${stats.monthlyRevenue.toLocaleString()}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem'}}>Active Playbooks</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#10b981'}}>{stats.activePlaybooks}</div>
          </div>
        </div>

        {/* Playbooks Section */}
        <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', marginBottom: '2rem'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{margin: 0}}>Active Playbooks</h2>
            <Link href="/playbooks" style={{color: '#6366f1', textDecoration: 'none', fontSize: '0.875rem'}}>View All →</Link>
          </div>
          <div style={{padding: '1.5rem'}}>
            {playbooks.length === 0 ? (
              <div style={{color: '#64748b', textAlign: 'center', padding: '2rem'}}>
                No playbooks yet. <Link href="/playbooks" style={{color: '#6366f1'}}>Create one</Link>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {playbooks.map((playbook: any) => (
                  <div key={playbook.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#0f172a', borderRadius: '0.5rem'}}>
                    <div>
                      <div style={{fontWeight: '600'}}>{playbook.name}</div>
                      <div style={{color: '#64748b', fontSize: '0.875rem'}}>{playbook.trigger}</div>
                    </div>
                    <button 
                      onClick={() => runPlaybook(playbook.id)}
                      style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer'}}
                    >
                      Run
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Customers */}
        <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{margin: 0}}>Recent Customers</h2>
            <Link href="/customers" style={{color: '#6366f1', textDecoration: 'none', fontSize: '0.875rem'}}>View All →</Link>
          </div>
          <div style={{padding: '1.5rem'}}>
            {customers.length === 0 ? (
              <div style={{color: '#64748b', textAlign: 'center', padding: '2rem'}}>
                No customers yet. <Link href="/customers" style={{color: '#6366f1'}}>Add one</Link>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {customers.slice(0, 5).map((customer: any) => (
                  <div key={customer.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#0f172a', borderRadius: '0.5rem'}}>
                    <div>
                      <div style={{fontWeight: '600'}}>{customer.name || customer.email}</div>
                      <div style={{color: '#64748b', fontSize: '0.875rem'}}>{customer.email}</div>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      background: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}>
                      Risk: {customer.riskScore}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}