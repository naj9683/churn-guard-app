'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string | null;
  email: string;
  riskScore: number;
  mrr: number;
  arr: number;
  createdAt: string;
}

interface PlaybookConfig {
  id: string;
  name: string;
  trigger: string;
  isActive: boolean;
  actions: any;
  lastRun: string | null;
  description: string | null;
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
          pb.id === playbookId ? { ...pb, isActive: !currentStatus } : pb
        ));
      }
    } catch (error) {
      console.error('Error toggling playbook:', error);
      alert('Failed to toggle playbook');
    }
  }

  async function runPlaybook(playbookId: string) {
    setRunningPlaybook(playbookId);
    try {
      const response = await fetch('/api/playbooks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbookId })
      });

      if (response.ok) {
        alert('Playbook executed successfully!');
        fetchDashboardData();
      } else {
        alert('Failed to run playbook');
      }
    } catch (error) {
      console.error('Error running playbook:', error);
      alert('Error running playbook');
    } finally {
      setRunningPlaybook(null);
    }
  }

  if (!isLoaded || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #334155',
            borderTop: '4px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading dashboard...</p>
        </div>
        <style jsx>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui' }}>
      {/* Header */}
      <header style={{
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '1.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: '700' }}>ChurnGuard</h1>
            <p style={{ margin: '0.25rem 0 0', color: '#94a3b8' }}>Customer Retention Automation</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/activity" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Activity Log →
            </Link>
            <Link href="/integrations" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Integration Guide →
            </Link>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600'
            }}>
              {user?.firstName?.[0] || 'U'}
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Sidebar */}
        <aside style={{
          width: '256px',
          background: '#1e293b',
          minHeight: 'calc(100vh - 80px)',
          padding: '1.5rem 0',
          borderRight: '1px solid #334155'
        }}>
          <nav>
            <Link href="/dashboard" style={{
              display: 'block',
              padding: '0.75rem 1.5rem',
              background: '#334155',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              margin: '0 1rem 0.5rem'
            }}>
              Overview
            </Link>
            <Link href="/customers" style={{
              display: 'block',
              padding: '0.75rem 1.5rem',
              color: '#94a3b8',
              textDecoration: 'none',
              margin: '0 1rem 0.5rem'
            }}>
              Customers
            </Link>
            <Link href="/playbooks" style={{
              display: 'block',
              padding: '0.75rem 1.5rem',
              color: '#94a3b8',
              textDecoration: 'none',
              margin: '0 1rem 0.5rem'
            }}>
              Playbooks
            </Link>
            <Link href="/analytics" style={{
              display: 'block',
              padding: '0.75rem 1.5rem',
              color: '#94a3b8',
              textDecoration: 'none',
              margin: '0 1rem 0.5rem'
            }}>
              Analytics
            </Link>
            <Link href="/settings" style={{
              display: 'block',
              padding: '0.75rem 1.5rem',
              color: '#94a3b8',
              textDecoration: 'none',
              margin: '0 1rem 0.5rem'
            }}>
              Settings
            </Link>
          </nav>

          <div style={{
            margin: '2rem 1rem',
            padding: '1.5rem',
            background: '#334155',
            borderRadius: '0.75rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              Free Plan
            </div>
            <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', marginBottom: '0.5rem' }}>
              <div style={{ height: '100%', width: '60%', background: '#8b5cf6', borderRadius: '4px' }}></div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              60/100 customers
            </div>
          </div>

          <button style={{
            width: 'calc(100% - 2rem)',
            margin: '0 1rem',
            padding: '0.75rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            Sign Out
          </button>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Customers</div>
              <div style={{ fontSize: '2.25rem', fontWeight: '700' }}>{stats?.totalCustomers || 0}</div>
            </div>
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>At Risk</div>
              <div style={{ fontSize: '2.25rem', fontWeight: '700', color: (stats?.atRisk || 0) > 0 ? '#ef4444' : 'white' }}>
                {stats?.atRisk || 0}
              </div>
            </div>
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Playbooks</div>
              <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#10b981' }}>
                {playbooks.filter(p => p.isActive).length}
              </div>
            </div>
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>MRR</div>
              <div style={{ fontSize: '2.25rem', fontWeight: '700' }}>
                ${stats?.monthlyRevenue?.toLocaleString() || 0}
              </div>
            </div>
          </div>

          {/* Playbooks Section */}
          <div style={{ background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Active Playbooks</h2>
                <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Automated retention campaigns</p>
              </div>
              <button
                onClick={() => playbooks.forEach(pb => runPlaybook(pb.id))}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Run All Now
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {playbooks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No playbooks configured. <Link href="/playbooks" style={{ color: '#8b5cf6' }}>Create your first playbook</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {playbooks.map((playbook) => (
                    <div key={playbook.id} style={{
                      padding: '1rem',
                      background: '#0f172a',
                      borderRadius: '0.5rem',
                      border: '1px solid #334155',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          {playbook.name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                          {playbook.description || `Trigger: ${playbook.trigger}`} | Last run: {playbook.lastRun ? new Date(playbook.lastRun).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => togglePlaybook(playbook.id, playbook.isActive)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: playbook.isActive ? '#10b981' : '#64748b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          {playbook.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                        <button
                          onClick={() => runPlaybook(playbook.id)}
                          disabled={runningPlaybook === playbook.id}
                          style={{
                            padding: '0.25rem 0.75rem',
                                    background: runningPlaybook === playbook.id ? '#475569' : '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: runningPlaybook === playbook.id ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem'
          }}
        >
          {runningPlaybook === playbook.id ? 'Running...' : 'Run'}
        </button>
      </div>
    </div>
  ))}
</div>
              )}
            </div>
          </div>

          {/* Customers Section */}
          <div style={{ background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Customers</h2>
              <span style={{ color: '#64748b' }}>{customers.length} total</span>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {customers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  No customers yet. Add customers via API or Prisma Studio.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #334155' }}>Customer</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #334155' }}>Risk Score</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #334155' }}>MRR</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #334155' }}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} style={{ borderBottom: '1px solid #334155' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: '600' }}>{customer.name || customer.email}</div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{customer.email}</div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            background: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
                            color: 'white'
                          }}>
                            {customer.riskScore}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>${customer.mrr.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem', color: '#64748b' }}>
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}