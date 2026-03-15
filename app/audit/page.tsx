'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

const LOG_TYPES: Record<string, { label: string; color: string; icon: string }> = {
  'contacted': { label: 'Contacted', color: '#3b82f6', icon: '📞' },
  'task_created': { label: 'Task Created', color: '#10b981', icon: '✅' },
  'intervention_created': { label: 'Intervention', color: '#f59e0b', icon: '🎯' },
  'customer_updated': { label: 'Customer Updated', color: '#8b5cf6', icon: '✏️' },
  'risk_changed': { label: 'Risk Changed', color: '#ef4444', icon: '⚠️' },
  'default': { label: 'Activity', color: '#6b7280', icon: '📝' }
};

export default function AuditLogsPage() {
  const { user, isLoaded } = useUser();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isLoaded && user) {
      fetchLogs();
    }
  }, [isLoaded, user, filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/audit?limit=100' 
        : `/api/audit?limit=100&type=${filter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLogStyle = (type: string) => {
    return LOG_TYPES[type] || LOG_TYPES['default'];
  };

  if (!isLoaded || loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading audit logs...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          📊 Audit Logs
        </h1>
        <p style={{ color: '#6b7280' }}>
          Track all activities and changes for compliance
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <label style={{ marginRight: '1rem', fontWeight: '500' }}>Filter by type:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            fontSize: '0.9rem'
          }}
        >
          <option value="all">All Activities</option>
          <option value="contacted">Contacted</option>
          <option value="task_created">Task Created</option>
          <option value="intervention_created">Intervention Created</option>
          <option value="customer_updated">Customer Updated</option>
          <option value="risk_changed">Risk Changed</option>
        </select>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Type</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Description</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Customer</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log: any) => {
                const style = getLogStyle(log.type);
                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        background: style.color + '20',
                        color: style.color
                      }}>
                        {style.icon} {style.label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#374151' }}>{log.description}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500', color: '#111827' }}>{log.customerName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{log.customerEmail}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {log.formattedDate}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Showing {logs.length} activities • Logs are retained for compliance purposes
        </p>
      </div>
    </div>
  );
}
