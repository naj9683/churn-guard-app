'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Admin user IDs - your user ID
const ADMIN_USER_IDS = ['user_3AP7xokH0oin2NoqgK37ER9Y4su'];

export default function Dashboard() {
  const pathname = usePathname();
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const isAdmin = user && ADMIN_USER_IDS.includes(user.id);
  
  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

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
      
      // RaR = MRR × (risk_score / 100) for high-risk customers (70+)
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
  const annualRisk = rar.atRisk * 12;
  
  // Calculate average risk score
  const avgRiskScore = dashboardData?.customers?.length 
    ? Math.round(dashboardData.customers.reduce((sum: number, c: any) => sum + (c.riskScore || 0), 0) / dashboardData.customers.length)
    : 0;
  
  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/customers', label: 'Customers', icon: '👥' },
    { href: '/playbooks', label: 'Playbooks', icon: '⚡' },
    { href: '/widget-messages', label: 'Widget', icon: '💬' },
    { href: '/email-campaigns', label: 'Email Campaigns', icon: '📧' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
    { href: '/dashboard/revenue-impact', label: 'Revenue Impact', icon: '💰' },
    { href: '/dashboard/next-best-action', label: 'AI Actions', icon: '🤖' },
    { href: '/integrations', label: 'Integrations', icon: '🔌', adminOnly: true },
    { href: '/admin', label: 'Admin Panel', icon: '🔐', adminOnly: true },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: 'white', alignItems: 'center', justifyContent: 'center' }}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px', 
        background: '#1e293b', 
        borderRight: '1px solid #334155', 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        position: 'fixed', 
        left: 0, 
        top: 0
      }}>
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          fontWeight: '700', 
          fontSize: '1.25rem', 
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '32px', 
            height: '32px', 
            background: '#6366f1', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>🛡️</div>
          ChurnGuard
        </div>
        
        <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1}}>
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link 
                key={item.href}
                href={item.href} 
                style={{
                  padding: '0.75rem 1rem', 
                  borderRadius: '0.5rem', 
                  color: isActive ? 'white' : '#94a3b8', 
                  textDecoration: 'none',
                  background: isActive ? '#334155' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s'
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div style={{marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #334155'}}>
          <Link 
            href="/signout" 
            style={{
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem', 
              color: '#94a3b8', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <span>🚪</span>
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '250px', flex: 1, padding: '2rem', background: '#0f172a', minHeight: '100vh' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Welcome to your ChurnGuard dashboard!</p>
        
        {/* EXISTING CARDS - Now with REAL DATA */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Total Customers */}
          <div style={{ 
            background: '#1e293b', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            border: '1px solid #334155',
            borderTop: '4px solid #6366f1'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Total Customers</h3>
            <p style={{ color: '#6366f1', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {dashboardData?.customers?.length || 0}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {rar.highRiskCount} at high risk
            </p>
          </div>

          {/* Churn Rate */}
          <div style={{ 
            background: '#1e293b', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            border: '1px solid #334155',
            borderTop: '4px solid #ef4444'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📉</div>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Churn Risk Rate</h3>
            <p style={{ color: '#ef4444', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {rar.percentage}%
            </p>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              of MRR at risk
            </p>
          </div>

          {/* Active Playbooks */}
          <div style={{ 
            background: '#1e293b', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            border: '1px solid #334155',
            borderTop: '4px solid #10b981'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Active Playbooks</h3>
            <p style={{ color: '#10b981', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {dashboardData?.playbooks?.filter((p: any) => p.isActive).length || 0}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {dashboardData?.playbooks?.length || 0} total configured
            </p>
          </div>

          {/* Avg Risk Score */}
          <div style={{ 
            background: '#1e293b', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            border: '1px solid #334155',
            borderTop: '4px solid #f59e0b'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Avg Risk Score</h3>
            <p style={{ color: '#f59e0b', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {avgRiskScore}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              out of 100 max
            </p>
          </div>
        </div>

        {/* REVENUE AT RISK (RaR) DASHBOARD - NEW SECTION */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
          padding: '2rem', 
          borderRadius: '1rem', 
          border: '1px solid #334155',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💰</span>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>Revenue at Risk (RaR)</h2>
            <span style={{ 
              background: '#ef4444', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px', 
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              CFO Dashboard
            </span>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Total MRR */}
            <div style={{ 
              background: '#0f172a', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              border: '1px solid #334155',
              textAlign: 'center'
            }}>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>TOTAL MRR</div>
              <div style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}>
                ${rar.total.toLocaleString()}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>/month</div>
            </div>
            
            {/* Revenue at Risk */}
            <div style={{ 
              background: '#0f172a', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              border: '2px solid #ef4444',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '-10px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                background: '#ef4444', 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                fontSize: '0.75rem',
                borderRadius: '9999px',
                fontWeight: '600'
              }}>
                {rar.percentage}% AT RISK
              </div>
              <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.5rem', marginTop: '0.5rem', fontWeight: '600' }}>
                🔥 REVENUE AT RISK
              </div>
              <div style={{ color: '#ef4444', fontSize: '2rem', fontWeight: '700' }}>
                ${rar.atRisk.toLocaleString()}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>/month</div>
            </div>
            
            {/* Annual Risk */}
            <div style={{ 
              background: '#0f172a', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              border: '1px solid #f59e0b',
              textAlign: 'center'
            }}>
              <div style={{ color: '#f59e0b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>⚠️ ANNUAL RISK</div>
              <div style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: '700' }}>
                ${annualRisk.toLocaleString()}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>potential ARR loss</div>
            </div>
            
            {/* Protected Revenue */}
            <div style={{ 
              background: '#0f172a', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              border: '1px solid #10b981',
              textAlign: 'center'
            }}>
              <div style={{ color: '#10b981', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>🛡️ PROTECTED</div>
              <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: '700' }}>
                ${(rar.total - rar.atRisk).toLocaleString()}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {100 - rar.percentage}% safe
              </div>
            </div>
          </div>
          
          {/* Risk Visual Bar */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Risk Distribution</span>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                {rar.highRiskCount} accounts at high risk
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '12px', 
              background: '#334155', 
              borderRadius: '6px',
              overflow: 'hidden',
              display: 'flex'
            }}>
              <div style={{ 
                width: `${rar.percentage}%`, 
                background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                transition: 'width 0.5s ease'
              }} />
              <div style={{ 
                width: `${100 - rar.percentage}%`, 
                background: 'linear-gradient(90deg, #10b981, #059669)',
                transition: 'width 0.5s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: '500' }}>
                🔥 At Risk ({rar.percentage}%)
              </span>
              <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '500' }}>
                🛡️ Protected ({100 - rar.percentage}%)
              </span>
            </div>
          </div>

          {/* Insight Text */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: '0.5rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <p style={{ color: '#fca5a5', margin: 0, fontSize: '0.875rem' }}>
              <strong>💡 CFO Insight:</strong> You have ${rar.atRisk.toLocaleString()}/month at risk of churning. 
              That's ${annualRisk.toLocaleString()} in potential ARR loss. 
              Activate playbooks to protect this revenue.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          background: '#1e293b', 
          padding: '1.5rem', 
          borderRadius: '0.75rem', 
          border: '1px solid #334155'
        }}>
          <h3 style={{ color: 'white', margin: '0 0 1rem 0' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/playbooks" style={{
              padding: '0.75rem 1.5rem',
              background: '#6366f1',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500'
            }}>
              ⚡ Manage Playbooks
            </Link>
            <Link href="/customers" style={{
              padding: '0.75rem 1.5rem',
              background: '#334155',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500'
            }}>
              👥 View All Customers
            </Link>
            <Link href="/analytics" style={{
              padding: '0.75rem 1.5rem',
              background: '#334155',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500'
            }}>
              📈 Detailed Analytics
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
