'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchStats();
    }
  }, [isLoaded, user]);

  async function fetchStats() {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
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
          <h1 style={{margin: 0}}>Analytics</h1>
          <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none'}}>← Back to Dashboard</Link>
        </div>
      </header>

      <main style={{maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem'}}>Total Customers</div>
            <div style={{fontSize: '2rem', fontWeight: '700'}}>{stats?.totalCustomers || 0}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem'}}>At Risk</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: stats?.atRisk > 0 ? '#ef4444' : 'white'}}>{stats?.atRisk || 0}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem'}}>Monthly Revenue</div>
            <div style={{fontSize: '2rem', fontWeight: '700'}}>${stats?.monthlyRevenue?.toLocaleString() || 0}</div>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <div style={{color: '#94a3b8', fontSize: '0.875rem'}}>Active Playbooks</div>
            <div style={{fontSize: '2rem', fontWeight: '700', color: '#10b981'}}>{stats?.activePlaybooks || 0}</div>
          </div>
        </div>

        <div style={{background: '#1e293b', padding: '2rem', borderRadius: '0.75rem', border: '1px solid #334155', textAlign: 'center', color: '#64748b'}}>
          <p>Detailed analytics charts coming soon.</p>
          <p>Track churn trends and revenue impact over time.</p>
        </div>
      </main>
    </div>
  );
}