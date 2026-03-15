'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Sidebar from '@/app/components/Sidebar';

const LOG_TYPES: Record<string, { label: string; color: string; icon: string }> = {
  'contacted': { label: 'Contacted', color: '#3b82f6', icon: '📞' },
  'task_created': { label: 'Task Created', color: '#10b981', icon: '✅' },
  'intervention_created': { label: 'Intervention', color: '#f59e0b', icon: '🎯' },
  'customer_updated': { label: 'Customer Updated', color: '#8b5cf6', icon: '✏️' },
  'risk_changed': { label: 'Risk Changed', color: '#ef4444', icon: '⚠️' },
  'default': { label: 'Activity', color: '#94a3b8', icon: '📝' }
};

export default function AuditLogsPage() {
  const { user, isLoaded } = useUser();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });

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
        calculateStats(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (logs: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    setStats({
      total: logs.length,
      today: logs.filter(l => new Date(l.createdAt) >= today).length,
      thisWeek: logs.filter(l => new Date(l.createdAt) >= weekAgo).length
    });
  };

  const getLogStyle = (type: string) => {
    return LOG_TYPES[type] || LOG_TYPES['default'];
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Customer', 'Customer Email'];
    const rows = logs.map((log: any) => [
      new Date(log.createdAt).toLocaleString(),
      log.type,
      log.description,
      log.customerName,
      log.customerEmail
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!isLoaded || loading) {
    return (
      <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex'}}>
        <Sidebar />
        <div style={{marginLeft: '250px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          Loading audit logs...
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      <Sidebar />
      
      <div style={{marginLeft: '250px', flex: 1, padding: '2rem'}}>
        {/* Header */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <div>
            <h1 style={{margin: '0 0 0.5rem 0', fontSize: '1.875rem', fontWeight: '700'}}>📊 Audit Logs</h1>
            <p style={{margin: '0', color: '#94a3b8'}}>Track all activities and changes for compliance</p>
          </div>
          <button 
            onClick={exportCSV}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            📥 Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
            <h3 style={{margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.875rem'}}>Total Activities</h3>
            <p style={{margin: '0', fontSize: '2rem', fontWeight: '700'}}>{stats.total}</p>
          </div>

          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
            <h3 style={{margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.875rem'}}>Today</h3>
            <p style={{margin: '0', fontSize: '2rem', fontWeight: '700', color: '#10b981'}}>{stats.today}</p>
          </div>

          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
            <h3 style={{margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.875rem'}}>This Week</h3>
            <p style={{margin: '0', fontSize: '2rem', fontWeight: '700', color: '#6366f1'}}>{stats.thisWeek}</p>
          </div>
        </div>

        {/* Filter */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <label style={{color: '#94a3b8', fontSize: '0.875rem'}}>Filter by type:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #334155',
                background: '#0f172a',
                color: 'white',
                fontSize: '0.875rem',
                cursor: 'pointer'
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
        </div>

        {/* Logs Table */}
        <div style={{background: '#1e293b', borderRadius: '0.75rem', overflow: 'hidden'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #334155'}}>
                <th style={{padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600'}}>Type</th>
                <th style={{padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600'}}>Description</th>
                <th style={{padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600'}}>Customer</th>
                <th style={{padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600'}}>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{padding: '3rem', textAlign: 'center', color: '#94a3b8'}}>
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log: any, index: number) => {
                  const style = getLogStyle(log.type);
                  const isLast = index === logs.length - 1;
                  return (
                    <tr key={log.id} style={{borderBottom: isLast ? 'none' : '1px solid #334155'}}>
                      <td style={{padding: '1rem 1.5rem'}}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.375rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          background: style.color + '20',
                          color: style.color,
                          border: `1px solid ${style.color}40`
                        }}>
                          {style.icon} {style.label}
                        </span>
                      </td>
                      <td style={{padding: '1rem 1.5rem', color: '#e2e8f0', fontSize: '0.875rem'}}>{log.description}</td>
                      <td style={{padding: '1rem 1.5rem'}}>
                        <div style={{fontWeight: '500', color: '#e2e8f0', fontSize: '0.875rem'}}>{log.customerName}</div>
                        <div style={{fontSize: '0.75rem', color: '#64748b'}}>{log.customerEmail}</div>
                      </td>
                      <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#94a3b8'}}>
                        {log.formattedDate}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div style={{marginTop: '1.5rem', padding: '1rem', color: '#64748b', fontSize: '0.875rem'}}>
          Showing {logs.length} activities • Logs are retained for compliance purposes
        </div>
      </div>
    </div>
  );
}
