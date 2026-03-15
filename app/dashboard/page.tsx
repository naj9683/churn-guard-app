'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Admin user IDs - your user ID
const ADMIN_USER_IDS = ['user_3AP7xokH0oin2NoqgK37ER9Y4su'];

export default function Dashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  const isAdmin = user && ADMIN_USER_IDS.includes(user.id);

  useEffect(() => {
    if (user) {
      checkOnboarding();
    }
  }, [user]);

  async function checkOnboarding() {
    try {
      const res = await fetch('/api/onboarding/status');
      if (res.ok) {
        const data = await res.json();
        
        // If onboarding not complete, redirect to onboarding
        if (!data.onboardingComplete) {
          console.log('Onboarding not complete, redirecting...');
          router.push('/onboarding');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
    } finally {
      setCheckingOnboarding(false);
      fetchDashboardData();
    }
  }

  async function fetchDashboardData() {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (checkingOnboarding || loading) {
    return <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  }

  // Calculate Revenue at Risk
  const calculateRaR = () => {
    if (!dashboardData?.customers) return { atRisk: 0, total: 0, percentage: 0, highRiskCount: 0 };

    let totalMRR = 0;
    let atRiskMRR = 0;
    let highRiskCount = 0;

    dashboardData.customers.forEach((customer: any) => {
      const mrr = customer.mrr || 0;
      const riskScore = customer.riskScore || 0;
      totalMRR += mrr;

      if (riskScore >= 70) {
        atRiskMRR += mrr * (riskScore / 100);
        highRiskCount++;
      }
    });

    return {
      atRisk: Math.round(atRiskMRR),
      total: totalMRR,
      percentage: totalMRR > 0 ? Math.round((atRiskMRR / totalMRR) * 100) : 0,
      highRiskCount
    };
  };

  const rar = calculateRaR();

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      <Sidebar />
      <div style={{marginLeft: '250px', flex: 1, padding: '2rem'}}>
        <h1>Dashboard</h1>
        
        {/* Stats Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem'}}>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
            <h3 style={{margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.875rem'}}>Total Customers</h3>
            <p style={{margin: '0', fontSize: '2rem', fontWeight: '700'}}>{dashboardData?.totalCustomers || 0}</p>
          </div>
          
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
            <h3 style={{margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.875rem'}}>At Risk</h3>
            <p style={{margin: '0', fontSize: '2rem', fontWeight: '700', color: '#ef4444'}}>{dashboardData?.atRisk || 0}</p>
          </div>
          
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
            <h3 style={{margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.875rem'}}>Active Playbooks</h3>
            <p style={{margin: '0', fontSize: '2rem', fontWeight: '700', color: '#10b981'}}>{dashboardData?.activePlaybooks || 0}</p>
          </div>
          
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
            <h3 style={{margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.875rem'}}>MRR Saved</h3>
            <p style={{margin: '0', fontSize: '2rem', fontWeight: '700', color: '#6366f1'}}>${dashboardData?.totalSaved || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{marginTop: '2rem', display: 'flex', gap: '1rem'}}>
          <Link href="/customers" style={{padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: '0.5rem'}}>
            View Customers
          </Link>
          <Link href="/playbooks" style={{padding: '0.75rem 1.5rem', background: '#1e293b', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', border: '1px solid #334155'}}>
            Manage Playbooks
          </Link>
        </div>
      </div>
    </div>
  );
}
