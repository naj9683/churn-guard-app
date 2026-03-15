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
        <div style={{marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{
              margin: '0 0 8px 0',
              fontSize: '28px',
              fontWeight: '700',
              color: '#fff',
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
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            + Add Customer
          </Link>
        </div>

        {/* Stats Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px'}}>Total Customers</div>
            <div style={{fontSize: '24px', fontWeight: '700', color: '#6366f1'}}>{customers.length}</div>
          </div>
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px'}}>High Risk</div>
            <div style={{fontSize: '24px', fontWeight: '700', color: '#ef4444'}}>
              {customers.filter(c => c.riskScore >= 70).length}
            </div>
          </div>
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px'}}>Total MRR</div>
            <div style={{fontSize: '24px', fontWeight: '700', color: '#10b981'}}>
              ${customers.reduce((sum, c) => sum + (c.mrr || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff'
          }}>All Customers</h3>

          {customers.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
              No customers found. Add your first customer to get started.
            </div>
          ) : (
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                  <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase'}}>Name</th>
                  <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase'}}>Email</th>
                  <th style={{textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase'}}>Risk Score</th>
                  <th style={{textAlign: 'right', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase'}}>MRR</th>
                  <th style={{textAlign: 'right', padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} style={{borderBottom: '1px solid rgba(255, 255, 255, 0.05)'}}>
                    <td style={{padding: '12px', color: '#fff', fontWeight: '500'}}>
                      {customer.name || 'Unknown'}
                    </td>
                    <td style={{padding: '12px', color: '#94a3b8'}}>{customer.email}</td>
                    <td style={{padding: '12px', textAlign: 'center'}}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: customer.riskScore >= 70 ? '#ef444420' : customer.riskScore >= 40 ? '#f59e0b20' : '#10b98120',
                        color: customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981',
                        fontWeight: '600',
                        fontSize: '13px'
                      }}>
                        {customer.riskScore}
                      </span>
                    </td>
                    <td style={{padding: '12px', textAlign: 'right', color: '#fff', fontWeight: '500'}}>
                      ${customer.mrr || 0}
                    </td>
                    <td style={{padding: '12px', textAlign: 'right'}}>
                      <Link href={`/customers/${customer.id}`} style={{
                        padding: '6px 12px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#6366f1',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500'
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
