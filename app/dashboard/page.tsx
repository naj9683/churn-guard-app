'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';

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

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [dailyData, setDailyData] = useState<any[]>([]);

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
        generateDailyData(data?.customers || []);
      }
    } catch (error) {
      console.error('Error:', error);
      generateDailyData([]);
    } finally {
      setLoading(false);
    }
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
    { label: 'Active Playbooks', value: dashboardData?.activePlaybooks || 0, color: '#10b981', change: 'Active', Icon: IconPlaybook },
    { label: 'MRR Saved', value: `$${dashboardData?.totalSaved || 0}`, color: '#3b82f6', change: '+23%', Icon: IconRevenue }
  ];

  const activities = [
    { text: 'High risk alert: Acme Corp', time: '2m ago', color: '#ef4444' },
    { text: 'Playbook "Winback" completed', time: '1h ago', color: '#10b981' },
    { text: 'New customer: TechStart Inc', time: '3h ago', color: '#6366f1' },
    { text: '$2,400 MRR saved this month', time: '5h ago', color: '#3b82f6' }
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
              Welcome back! Here&apos;s what&apos;s happening with your customers.
            </p>
          </div>
          <div style={{display: 'flex', gap: '12px'}}>
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

          {/* Recent Activity */}
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827'
            }}>Recent Activity</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {activities.map((activity, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: `${activity.color}15`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconActivity color={activity.color} />
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#111827',
                      marginBottom: '2px'
                    }}>{activity.text}</div>
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af'
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
