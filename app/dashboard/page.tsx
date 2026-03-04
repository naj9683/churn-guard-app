'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  email: string;
  status: string;
  riskScore: number;
  mrr: number;
  lastLoginAt: string | null;
  signupAt: string;
}

interface PlaybookConfig {
  id: string;
  type: string;
  active: boolean;
  runCount: number;
  lastRunAt: string | null;
}

interface Stats {
  totalCustomers: number;
  atRisk: number;
  activePlaybooks: number;
  monthlyRevenue: number;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [playbooks, setPlaybooks] = useState<PlaybookConfig[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningPlaybook, setRunningPlaybook] = useState<string | null>(null);

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
        setCustomers(data.customers || []);
        setPlaybooks(data.playbooks || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePlaybook(playbookId: string, currentStatus: boolean) {
    try {
      const response = await fetch('/api/playbooks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbookId, active: !currentStatus })
      });

      if (response.ok) {
        setPlaybooks(prev => prev.map(pb => 
          pb.id === playbookId ? { ...pb, active: !currentStatus } : pb
        ));
      }
    } catch (error) {
      console.error('Error toggling playbook:', error);
      alert('Failed to toggle playbook');
    }
  }

  async function runPlaybookNow(playbookType: string) {
    setRunningPlaybook(playbookType);
    try {
      const response = await fetch('/api/playbooks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbookType: playbookType === 'ALL' ? 'ALL' : playbookType })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`✅ ${result.message}\nExecuted: ${result.executed} actions`);
        fetchDashboardData(); // Refresh stats
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error running playbook:', error);
      alert('Failed to run playbook');
    } finally {
      setRunningPlaybook(null);
    }
  }

  if (!isLoaded || loading) {
    return (
      <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div>Loading ChurnGuard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div>Please sign in to access the dashboard</div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Header */}
      <div style={{borderBottom: '1px solid #1e293b', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1 style={{margin: 0, fontSize: '1.5rem', fontWeight: 'bold'}}>ChurnGuard</h1>
          <p style={{margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem'}}>Customer Retention Automation</p>
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <Link href="/activity" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem'}}>
            Activity Log →
          </Link>
          <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold'}}>
            {user.firstName?.[0] || user.emailAddresses[0].emailAddress[0].toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
        {/* Stats */}
        {stats && (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #334155'}}>
              <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Total Customers</div>
              <div style={{fontSize: '2rem', fontWeight: 'bold'}}>{stats.totalCustomers}</div>
            </div>
            <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #334155'}}>
              <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>At Risk</div>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ef4444'}}>{stats.atRisk}</div>
            </div>
            <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #334155'}}>
              <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>Active Playbooks</div>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#22c55e'}}>{stats.activePlaybooks}</div>
            </div>
            <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #334155'}}>
              <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>MRR</div>
              <div style={{fontSize: '2rem', fontWeight: 'bold'}}>${stats.monthlyRevenue.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Playbooks Section */}
        <div style={{background: '#1e293b', borderRadius: '0.5rem', border: '1px solid #334155', marginBottom: '2rem'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h2 style={{margin: 0, fontSize: '1.25rem'}}>Active Playbooks</h2>
              <p style={{margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem'}}>Automated retention campaigns</p>
            </div>
            <button
              onClick={() => runPlaybookNow('ALL')}
              disabled={runningPlaybook === 'ALL'}
              style={{
                background: runningPlaybook === 'ALL' ? '#475569' : '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: runningPlaybook === 'ALL' ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {runningPlaybook === 'ALL' ? 'Running...' : 'Run All Now'}
            </button>
          </div>
          
          <div style={{padding: '1.5rem'}}>
            {playbooks.length === 0 ? (
              <div style={{color: '#94a3b8', textAlign: 'center', padding: '2rem'}}>No playbooks configured</div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {playbooks.map((playbook) => (
                  <div key={playbook.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#0f172a', borderRadius: '0.375rem'}}>
                    <div>
                      <div style={{fontWeight: '600', marginBottom: '0.25rem'}}>
                        {playbook.type.replace(/_/g, ' ')}
                      </div>
                      <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>
                        Last run: {playbook.lastRunAt ? new Date(playbook.lastRunAt).toLocaleDateString() : 'Never'} | 
                        Runs: {playbook.runCount}
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                      <button
                        onClick={() => runPlaybookNow(playbook.type)}
                        disabled={runningPlaybook === playbook.type}
                        style={{
                          background: 'transparent',
                          border: '1px solid #3b82f6',
                          color: '#3b82f6',
                          padding: '0.375rem 0.75rem',
                          borderRadius: '0.25rem',
                          cursor: runningPlaybook === playbook.type ? 'not-allowed' : 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        {runningPlaybook === playbook.type ? '...' : 'Run Now'}
                      </button>
                      <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                        <input
                          type="checkbox"
                          checked={playbook.active}
                          onChange={() => togglePlaybook(playbook.id, playbook.active)}
                          style={{marginRight: '0.5rem'}}
                        />
                        <span style={{fontSize: '0.875rem'}}>{playbook.active ? 'Active' : 'Inactive'}</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Customers Table */}
        <div style={{background: '#1e293b', borderRadius: '0.5rem', border: '1px solid #334155'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #334155'}}>
            <h2 style={{margin: 0, fontSize: '1.25rem'}}>Customers</h2>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '1px solid #334155'}}>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontWeight: '500', fontSize: '0.875rem'}}>Customer</th>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontWeight: '500', fontSize: '0.875rem'}}>Status</th>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontWeight: '500', fontSize: '0.875rem'}}>Risk Score</th>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontWeight: '500', fontSize: '0.875rem'}}>MRR</th>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontWeight: '500', fontSize: '0.875rem'}}>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{padding: '2rem', textAlign: 'center', color: '#94a3b8'}}>
                      No customers yet. Add customers via API or Prisma Studio.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} style={{borderBottom: '1px solid #334155'}}>
                      <td style={{padding: '1rem'}}>
                        <div style={{fontWeight: '500'}}>{customer.name}</div>
                        <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>{customer.email}</div>
                      </td>
                      <td style={{padding: '1rem'}}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          background: customer.status === 'active' ? '#166534' : '#991b1b',
                          color: customer.status === 'active' ? '#86efac' : '#fca5a5'
                        }}>
                          {customer.status}
                        </span>
                      </td>
                      <td style={{padding: '1rem'}}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          background: customer.riskScore > 70 ? '#450a0a' : customer.riskScore > 40 ? '#713f12' : '#14532d',
                          color: customer.riskScore > 70 ? '#fca5a5' : customer.riskScore > 40 ? '#fde047' : '#86efac',
                          fontSize: '0.875rem'
                        }}>
                          {customer.riskScore}
                        </div>
                      </td>
                      <td style={{padding: '1rem'}}>${customer.mrr}</td>
                      <td style={{padding: '1rem', color: '#94a3b8', fontSize: '0.875rem'}}>
                        {customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleDateString() : 'Never'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
                  