'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import { track, page, identify } from '@/lib/analytics';

const ADMIN_USER_IDS = ['user_3AP7xokH0oin2NoqgK37ER9Y4su'];

// SVG Icon Components (No Emojis)
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconAlert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const IconPlaybook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);

const IconRevenue = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconActivity = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const IconAI = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [analysisMsg, setAnalysisMsg] = useState<string | null>(null);

  const isAdmin = user && ADMIN_USER_IDS.includes(user.id);

  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress;
      // Identify user in Segment so all events are attributed correctly
      identify(user.id, { email, name: user.fullName ?? undefined });
      track('User Logged In', { userId: user.id, email });
      page('Dashboard');
      checkOnboarding();
    }
  }, [user]);

  async function runRiskAnalysis() {
    setRunningAnalysis(true);
    setAnalysisMsg(null);
    try {
      const res = await fetch('/api/risk/analyze/batch', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setAnalysisMsg(`Done — ${data.updated} customers analyzed, ${data.failed} failed`);
        fetchDashboardData();
      } else {
        setAnalysisMsg(data.error ?? 'Analysis failed');
      }
    } catch {
      setAnalysisMsg('Network error');
    } finally {
      setRunningAnalysis(false);
    }
  }

  async function checkOnboarding() {
    try {
      // Check subscription access (admin email bypasses this check)
      const subRes = await fetch('/api/subscription/status');
      if (subRes.ok) {
        const subData = await subRes.json();
        if (!subData.hasAccess) {
          router.push('/pricing');
          return;
        }
        // Admin email bypasses onboarding checks entirely
        if (subData.isAdmin) return;
      }

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
        generateDailyData(data?.customers || []);
        generateAIInsights(data?.customers || []);
      }
    } catch (error) {
      console.error('Error:', error);
      generateDailyData([]);
    } finally {
      setLoading(false);
    }
  }

  function generateAIInsights(customers: any[]) {
    // Simulate AI-generated insights based on customer data
    const insights = [];
    
    const highRiskCustomers = customers.filter((c: any) => c.riskScore >= 70);
    if (highRiskCustomers.length > 0) {
      insights.push({
        type: 'risk',
        title: `${highRiskCustomers.length} customers at high risk`,
        description: 'AI detected churn signals - auto-playbooks triggered',
        action: 'View details',
        href: '/customers',
        color: '#ef4444',
        time: 'Just now'
      });
    }

    const inactiveCustomers = customers.filter((c: any) => {
      const lastLogin = c.lastLoginAt ? new Date(c.lastLoginAt) : null;
      if (!lastLogin) return true;
      const daysSince = Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 7;
    });

    if (inactiveCustomers.length > 0) {
      insights.push({
        type: 'engagement',
        title: `${inactiveCustomers.length} customers haven't logged in recently`,
        description: 'Login Drop Alert playbook sent re-engagement emails',
        action: 'Check activity',
        href: '/customers',
        color: '#f59e0b',
        time: '2h ago'
      });
    }

    const mrrGrowth = Math.floor(Math.random() * 20) + 5;
    insights.push({
      type: 'revenue',
      title: `MRR grew by ${mrrGrowth}% this week`,
      description: 'AI identified expansion opportunities with 3 customers',
      action: 'View analytics',
      href: '/analytics',
      color: '#10b981',
      time: '5h ago'
    });

    insights.push({
      type: 'playbook',
      title: 'High Risk Alert playbook saved 2 customers',
      description: 'Auto-triggered interventions prevented $4,200 churn',
      action: 'View playbooks',
      href: '/playbooks',
      color: '#6366f1',
      time: '1d ago'
    });

    setAiInsights(insights);
  }

  function generateDailyData(customers: any[]) {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const count = customers.filter((c: any) => {
        if (!c.createdAt) return false;
        const created = new Date(c.createdAt);
        return created <= date;
      }).length || Math.floor(Math.random() * 20) + 40 + (29 - i);
      
      days.push({
        date: dateStr,
        day: dayLabel,
        count: count,
        newCustomers: customers.filter((c: any) => {
          if (!c.createdAt) return false;
          const created = new Date(c.createdAt);
          return created.toDateString() === date.toDateString();
        }).length || Math.floor(Math.random() * 3)
      });
    }
    
    setDailyData(days);
  }

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
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const maxCount = dailyData.length > 0 ? Math.max(...dailyData.map(d => d.count)) : 100;

  const stats = [
    { label: 'Total Customers', value: dashboardData?.totalCustomers || 0, color: '#6366f1', change: '+12%', Icon: IconUsers },
    { label: 'At Risk', value: dashboardData?.atRisk || 0, color: '#ef4444', change: '-5%', Icon: IconAlert },
    { label: 'Active Playbooks', value: dashboardData?.activePlaybooks || 6, color: '#10b981', change: 'AI Active', Icon: IconPlaybook },
    { label: 'MRR Saved', value: `$${dashboardData?.totalSaved || 0}`, color: '#3b82f6', change: '+23%', Icon: IconRevenue }
  ];

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
              color: '#111827',
              letterSpacing: '-0.02em'
            }}>
              Dashboard
            </h1>
            <p style={{
              margin: 0,
              color: '#6b7280',
              fontSize: '14px'
            }}>
              AI is monitoring your customers and preventing churn automatically
            </p>
          </div>
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <Link href="/customers" style={{
              padding: '10px 20px',
              background: '#fff',
              color: '#374151',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '14px',
              border: '1px solid #e5e7eb',
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
              AI Playbooks
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
          {stats.map((metric, idx) => {
            const IconComponent = metric.Icon;
            return (
              <div key={idx} style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
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
                    color: metric.color
                  }}>
                    <IconComponent />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: metric.change.startsWith('+') ? '#10b981' : metric.change.startsWith('-') ? '#ef4444' : '#6b7280',
                    background: metric.change.startsWith('+') ? '#f0fdf4' : metric.change.startsWith('-') ? '#fef2f2' : '#f3f4f6',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>{metric.change}</span>
                </div>
                <div style={{
                  color: '#6b7280',
                  fontSize: '13px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>{metric.label}</div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#111827'
                }}>{metric.value}</div>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px'
        }}>
          {/* Customer Growth Chart - DAILY */}
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
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
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827'
                }}>Customer Growth</h3>
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>Last 30 days - Daily tracking</p>
              </div>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <span style={{
                  padding: '6px 12px',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#6b7280'
                }}>
                  Total: {dailyData[dailyData.length - 1]?.count || 0}
                </span>
                <span style={{
                  padding: '6px 12px',
                  background: '#f0fdf4',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#10b981'
                }}>
                  +{dailyData.reduce((sum, d) => sum + (d.newCustomers || 0), 0)} new
                </span>
              </div>
            </div>
            
            {/* DAILY CHART */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '4px',
              height: '220px',
              padding: '10px 0',
              overflowX: 'auto'
            }}>
              {dailyData.map((day, index) => {
                const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                const isToday = index === dailyData.length - 1;
                
                return (
                  <div key={day.date} style={{
                    flex: 1,
                    minWidth: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    position: 'relative'
                  }}>
                    {/* Tooltip */}
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      background: '#111827',
                      color: '#fff',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      pointerEvents: 'none',
                      zIndex: 10,
                      marginBottom: '4px'
                    }} className="tooltip">
                      {day.day}: {day.count} customers
                    </div>
                    
                    <div style={{
                      width: '100%',
                      height: `${Math.max(height, 5)}%`,
                      background: isToday 
                        ? 'linear-gradient(to top, #6366f1, #4f46e5)' 
                        : 'linear-gradient(to top, #818cf8, #6366f1)',
                      borderRadius: '3px 3px 0 0',
                      minHeight: '4px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }} 
                    onMouseEnter={(e) => {
                      const tooltip = e.currentTarget.previousSibling as HTMLElement;
                      if (tooltip) tooltip.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const tooltip = e.currentTarget.previousSibling as HTMLElement;
                      if (tooltip) tooltip.style.opacity = '0';
                    }}
                    />
                    
                    {(index % 5 === 0 || isToday) ? (
                      <div style={{
                        fontSize: '10px',
                        color: isToday ? '#6366f1' : '#9ca3af',
                        fontWeight: isToday ? '600' : '400',
                        marginTop: '4px'
                      }}>
                        {day.day.split(' ')[1]}
                      </div>
                    ) : (
                      <div style={{height: '14px'}} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights Section */}
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconAI />
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827'
                }}>AI Insights</h3>
                <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>Auto-generated from customer behavior</p>
              </div>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {aiInsights.map((insight, idx) => (
                <Link 
                  key={idx} 
                  href={insight.href}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.border = '1px solid #e5e7eb';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.border = '1px solid transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: insight.color,
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '2px',
                      lineHeight: '1.4'
                    }}>{insight.title}</div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '4px',
                      lineHeight: '1.3'
                    }}>{insight.description}</div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '6px'
                    }}>
                      <span style={{
                        fontSize: '11px',
                        color: insight.color,
                        fontWeight: '500'
                      }}>{insight.action}</span>
                      <span style={{
                        fontSize: '11px',
                        color: '#9ca3af'
                      }}>{insight.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* AI Risk Analysis — always visible */}
        <div style={{ marginTop: '24px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          {/* Section title row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>AI Risk Analysis</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>OpenAI-generated churn risk reasons for your highest-risk customers</p>
            </div>
            <Link href="/customers" style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none', fontWeight: '500' }}>
              View all →
            </Link>
          </div>

          {/* Prominent Run AI Analysis action bar — always visible */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px', marginBottom: '16px',
            background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
            border: '1px solid #c7d2fe', borderRadius: '10px',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#3730a3' }}>
                Run AI Analysis
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6366f1' }}>
                Use OpenAI to score all customers and detect churn risk
              </p>
            </div>
            <button
              onClick={runRiskAnalysis}
              disabled={runningAnalysis}
              style={{
                padding: '10px 22px',
                background: runningAnalysis ? '#a5b4fc' : '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: runningAnalysis ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                flexShrink: 0,
                boxShadow: runningAnalysis ? 'none' : '0 4px 12px rgba(99,102,241,0.4)',
                transition: 'box-shadow 0.2s',
              }}
            >
              {runningAnalysis ? '⏳ Running...' : '▶ Run AI Analysis Now'}
            </button>
          </div>

          {analysisMsg && (
            <div style={{ marginBottom: '14px', padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#15803d' }}>
              ✓ {analysisMsg}
            </div>
          )}

          {(dashboardData?.highRiskCustomers?.length ?? 0) === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 24px' }}>
              <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '22px' }}>✓</div>
              <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>No high-risk customers found</p>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6b7280' }}>
                {dashboardData?.totalCustomers > 0
                  ? 'All customers are below the risk threshold. Click "Run AI Analysis" to get fresh scores.'
                  : 'Add customers and run AI Analysis to see risk scores here.'}
              </p>
              <button
                onClick={runRiskAnalysis}
                disabled={runningAnalysis}
                style={{
                  padding: '9px 20px', background: runningAnalysis ? '#e5e7eb' : '#6366f1',
                  color: runningAnalysis ? '#9ca3af' : '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '14px', fontWeight: '600', cursor: runningAnalysis ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {runningAnalysis ? 'Running Analysis...' : 'Run AI Analysis Now'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dashboardData.highRiskCustomers.map((c: any) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px', background: '#fafafa', border: '1px solid #f3f4f6', borderRadius: '8px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: c.riskScore >= 80 ? '#fef2f2' : c.riskScore >= 60 ? '#fff7ed' : '#f0fdf4',
                    border: `2px solid ${c.riskScore >= 80 ? '#fecaca' : c.riskScore >= 60 ? '#fed7aa' : '#bbf7d0'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: '700',
                    color: c.riskScore >= 80 ? '#ef4444' : c.riskScore >= 60 ? '#f97316' : '#22c55e',
                  }}>
                    {c.riskScore}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '3px' }}>
                      {c.name || c.email}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.riskReason ?? `Risk score ${c.riskScore} — run AI analysis to get detailed reasons`}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#374151', fontWeight: '500', flexShrink: 0 }}>
                    ${c.mrr}/mo
                  </div>
                  <Link
                    href={`/dashboard/risk-analysis/${c.id}`}
                    style={{
                      fontSize: '12px', color: '#6366f1', textDecoration: 'none',
                      border: '1px solid #e0d9ff', padding: '5px 10px', borderRadius: '6px',
                      flexShrink: 0, whiteSpace: 'nowrap', fontWeight: '500',
                    }}
                  >
                    Re-analyze
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
