'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';

interface Customer {
  id: string;
  name: string | null;
  email: string;
  riskScore: number;
  mrr: number;
  arr: number;
  createdAt: string;
}

export default function CustomersPage() {
  const { user, isLoaded } = useUser();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) fetchCustomers();
  }, [isLoaded, user]);

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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
              Customers
            </h1>
            <p style={{
              margin: 0,
              color: '#64748b',
              fontSize: '14px'
            }}>
              Manage your customer base and risk profiles
            </p>
          </div>
          <Link href="/dashboard/customers/new" style={{
            padding: '10px 20px',
            background: '#6366f1',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            + Add Customer
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Total Customers</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#0f172a'
            }}>{customers.length}</div>
          </div>
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>High Risk</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ef4444'
            }}>{customers.filter(c => c.riskScore >= 70).length}</div>
          </div>
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>Total MRR</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#10b981'
            }}>${customers.reduce((sum, c) => sum + (c.mrr || 0), 0).toLocaleString()}</div>
          </div>
        </div>

        {/* Table */}
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
          }}>All Customers</h3>

          {customers.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
              No customers found. Add your first customer to get started.
            </div>
          ) : (
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '1px solid #e2e8f0'}}>
                  <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Name</th>
                  <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Email</th>
                  <th style={{textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Risk Score</th>
                  <th style={{textAlign: 'right', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>MRR</th>
                  <th style={{textAlign: 'right', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding: '16px 12px', color: '#0f172a', fontWeight: '500'}}>
                      {customer.name || 'Unknown'}
                    </td>
                    <td style={{padding: '16px 12px', color: '#64748b'}}>{customer.email}</td>
                    <td style={{padding: '16px 12px', textAlign: 'center'}}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: customer.riskScore >= 70 ? '#fef2f2' : customer.riskScore >= 40 ? '#fffbeb' : '#f0fdf4',
                        color: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
                        fontWeight: '600',
                        fontSize: '13px'
                      }}>
                        {customer.riskScore}
                      </span>
                    </td>
                    <td style={{padding: '16px 12px', textAlign: 'right', color: '#0f172a', fontWeight: '500'}}>
                      ${customer.mrr || 0}
                    </td>
                    <td style={{padding: '16px 12px', textAlign: 'right'}}>
                      <Link href={`/customers/${customer.id}`} style={{
                        padding: '6px 12px',
                        background: '#f8fafc',
                        color: '#6366f1',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        border: '1px solid #e2e8f0'
                      }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
