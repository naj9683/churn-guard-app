'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';

export default function CustomerDetailPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user && params.id) {
      fetchCustomer();
    }
  }, [isLoaded, user, params.id]);

  async function fetchCustomer() {
    try {
      const res = await fetch(`/api/customers/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setData(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function getEventIcon(eventName: string) {
    const icons: any = {
      page_view: '🌐',
      feature_used: '⚡',
      subscription_created: '💳',
      subscription_cancelled: '❌',
      login: '🔑',
      signup: '✨',
      payment_failed: '💳',
      support_ticket: '🎫',
      email_opened: '📧',
      high_risk_detected: '🔥'
    };
    return icons[eventName] || '📊';
  }

  if (!isLoaded || loading) {
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

  if (!data || !data.customer) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex',
        marginLeft: '260px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{textAlign: 'center'}}>
          <h2 style={{color: '#0f172a', marginBottom: '8px'}}>Customer not found</h2>
          <Link href="/customers" style={{color: '#6366f1'}}>← Back to Customers</Link>
        </div>
      </div>
    );
  }

  const { customer, events, stats } = data;
  const lastActive = events?.[0]?.timestamp 
    ? new Date(events[0].timestamp).toLocaleString() 
    : 'Never';

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
        <div style={{marginBottom: '32px'}}>
          <Link href="/customers" style={{
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '16px'
          }}>
            ← Back to Customers
          </Link>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <h1 style={{
                margin: '0 0 4px 0',
                fontSize: '28px',
                fontWeight: '700',
                color: '#0f172a'
              }}>
                {customer.email}
              </h1>
              <p style={{
                margin: 0,
                color: '#64748b',
                fontSize: '14px'
              }}>
                ID: {customer.externalId}
              </p>
            </div>
            
            <span style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: customer.riskScore >= 70 ? '#fef2f2' : customer.riskScore >= 40 ? '#fffbeb' : '#f0fdf4',
              color: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Risk: {customer.riskScore}%
            </span>
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
            { label: 'MRR', value: `$${customer.mrr || 0}`, color: '#10b981' },
            { label: 'Total Events', value: stats?.totalEvents || 0, color: '#6366f1' },
            { label: 'Days Since Joined', value: stats?.daysSinceJoined || 0, color: '#3b82f6' },
            { label: 'Last Active', value: lastActive === 'Never' ? 'Never' : 'Recently', color: '#f59e0b' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>{stat.label}</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: stat.color
              }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Activity Timeline */}
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
          }}>
            Website Activity
            <span style={{
              float: 'right',
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '400'
            }}>
              Last active: {lastActive}
            </span>
          </h3>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {!events || events.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#64748b'
              }}>
                No activity recorded yet
              </div>
            ) : (
              events.map((event: any, idx: number) => (
                <div key={event.id} style={{
                  display: 'flex',
                  gap: '12px',
                  paddingBottom: idx < events.length - 1 ? '16px' : '0',
                  borderBottom: idx < events.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    {getEventIcon(event.event)}
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0f172a',
                      textTransform: 'capitalize'
                    }}>
                      {event.event?.replace(/_/g, ' ')}
                    </div>
                    {event.metadata && (
                      <div style={{
                        fontSize: '12px',
                        color: '#64748b',
                        marginTop: '2px'
                      }}>
                        {JSON.stringify(event.metadata)}
                      </div>
                    )}
                    <div style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginTop: '4px'
                    }}>
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
