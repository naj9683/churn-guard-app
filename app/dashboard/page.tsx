'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';

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
    if (user) checkOnboarding();
  }, [user]);

  async function checkOnboarding() {
    try {
      const res = await fetch('/api/onboarding/status');
      if (res.ok) {
        const data = await res.json();
        if (!data.onboardingComplete) {
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

  if (checkingOnboarding || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(99, 102, 241, 0.1)',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)',
      display: 'flex',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <Sidebar />
      
      <div style={{
        marginLeft: '280px',
        flex: 1,
        padding: '32px',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{marginBottom: '32px'}}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '-0.02em'
          }}>
            Dashboard
          </h1>
          <p style={{
            margin: 0,
            color: '#64748b',
            fontSize: '14px'
          }}>
            Monitor your churn prevention metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Customers', value: dashboardData?.totalCustomers || 0, color: '#6366f1', icon: '👥' },
            { label: 'At Risk', value: dashboardData?.atRisk || 0, color: '#ef4444', icon: '🔥' },
            { label: 'Active Playbooks', value: dashboardData?.activePlaybooks || 0, color: '#10b981', icon: '⚡' },
            { label: 'MRR Saved', value: `$${dashboardData?.totalSaved || 0}`, color: '#3b82f6', icon: '💰' }
          ].map((metric, idx) => (
            <div key={idx} style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: `${metric.color}15`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                fontSize: '18px'
              }}>{metric.icon}</div>
              <div style={{
                color: '#64748b',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '4px'
              }}>{metric.label}</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: metric.color
              }}>{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff'
          }}>Quick Actions</h3>
          <div style={{display: 'flex', gap: '12px'}}>
            <Link href="/customers" style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              View Customers
            </Link>
            <Link href="/playbooks" style={{
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '14px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              Manage Playbooks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
