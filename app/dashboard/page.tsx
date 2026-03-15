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
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '260px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
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
      background: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex'
    }}>
      <Sidebar />
      
      <div style={{
        marginLeft: '260px',
        flex: 1,
        padding: '32px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 4px 0',
              fontSize: '28px',
              fontWeight: '700',
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              Dashboard
            </h1>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: '14px'
            }}>
              Welcome back! Here's what's happening with your customers.
            </p>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
            <Link href="/customers" style={{
              padding: '10px 20px',
              background: '#fff',
              color: '#0f172a',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '14px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              View Customers
            </Link>
            <Link href="/playbooks" style={{
              padding: '10px 20px',
              background: '#6366f1',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              Manage Playbooks
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Customers', value: dashboardData?.totalCustomers || 0, color: '#6366f1', icon: '👥', change: '+12%' },
            { label: 'At Risk', value: dashboardData?.atRisk || 0, color: '#ef4444', icon: '🔥', change: '-5%' },
            { label: 'Active Playbooks', value: dashboardData?.activePlaybooks || 0, color: '#10b981', icon: '⚡', change: 'Active' },
            { label: 'MRR Saved', value: `$${dashboardData?.totalSaved || 0}`, color: '#3b82f6', icon: '💰', change: '+23%' }
          ].map((metric, idx) => (
            <div key={idx} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: `${metric.color}15`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>{metric.icon}</div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: metric.change.startsWith('+') ? '#10b981' : metric.change.startsWith('-') ? '#ef4444' : '#64748b',
                  background: metric.change.startsWith('+') ? '#10b98115' : metric.change.startsWith('-') ? '#ef444415' : '#f1f5f9',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>{metric.change}</span>
              </div>
              <div style={{
                color: '#64748b',
                fontSize: '13px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>{metric.label}</div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#0f172a'
              }}>{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px'
        }}>
          {/* Chart Placeholder */}
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#0f172a'
              }}>Customer Growth</h3>
              <select style={{
                padding: '6px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#64748b',
                background: '#fff'
              }}>
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
            <div style={{
              height: '300px',
              background: '#f8fafc',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              border: '2px dashed #e2e8f0'
            }}>
              📊 Chart Integration Coming Soon
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#0f172a'
            }}>Recent Activity</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {[
                { icon: '🔥', text: 'High risk alert: Acme Corp', time: '2m ago', color: '#ef4444' },
                { icon: '✅', text: 'Playbook "Winback" completed', time: '1h ago', color: '#10b981' },
                { icon: '👤', text: 'New customer: TechStart Inc', time: '3h ago', color: '#6366f1' },
                { icon: '💰', text: '$2,400 MRR saved this month', time: '5h ago', color: '#3b82f6' }
              ].map((activity, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: `${activity.color}15`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>{activity.icon}</div>
                  <div style={{flex: 1}}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0f172a',
                      marginBottom: '2px'
                    }}>{activity.text}</div>
                    <div style={{
                      fontSize: '12px',
                      color: '#94a3b8'
                    }}>{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
