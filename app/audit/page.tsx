'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Layout from '@/app/components/Layout';

export default function AuditPage() {
  const { user, isLoaded } = useUser();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) fetchLogs();
  }, [isLoaded, user]);

  async function fetchLogs() {
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
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
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return '#10b981';
      case 'UPDATE': return '#f59e0b';
      case 'DELETE': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Layout 
      title="Audit Logs"
      subtitle="Track all changes and activities in your account"
    >
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <input 
            type="text" 
            placeholder="Search logs..."
            style={{
              flex: 1,
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <select style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            background: '#fff'
          }}>
            <option>All Actions</option>
            <option>Create</option>
            <option>Update</option>
            <option>Delete</option>
          </select>
          <select style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            background: '#fff'
          }}>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 24 hours</option>
          </select>
        </div>

        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid #e5e7eb'}}>
              <th style={{textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Timestamp</th>
              <th style={{textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>User</th>
              <th style={{textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Action</th>
              <th style={{textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Resource</th>
              <th style={{textAlign: 'left', padding: '12px', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600'}}>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{padding: '40px', textAlign: 'center', color: '#6b7280'}}>
                  <div style={{fontSize: '48px', marginBottom: '16px'}}>📋</div>
                  <div style={{fontSize: '16px', fontWeight: '500', marginBottom: '8px'}}>No audit logs yet</div>
                  <div>Activity will appear here when users make changes</div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                  <td style={{padding: '16px 12px', color: '#6b7280', fontSize: '14px'}}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td style={{padding: '16px 12px', color: '#111827', fontWeight: '500'}}>
                    {log.user?.email || 'System'}
                  </td>
                  <td style={{padding: '16px 12px'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: `${getActionColor(log.action)}15`,
                      color: getActionColor(log.action),
                      fontWeight: '600',
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{padding: '16px 12px', color: '#6b7280'}}>
                    {log.resourceType}
                  </td>
                  <td style={{padding: '16px 12px', color: '#6b7280', fontSize: '14px'}}>
                    {log.description}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
