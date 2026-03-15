'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';

export default function ExportPage() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type: string) => {
    setExporting(true);
    try {
      const res = await fetch(`/api/export?type=${type}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `churnguard-${type}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

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
        <div style={{marginBottom: '32px'}}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '-0.02em'
          }}>
            Export
          </h1>
          <p style={{
            margin: 0,
            color: '#64748b',
            fontSize: '14px'
          }}>
            Download your data for analysis
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px'
        }}>
          {[
            { type: 'customers', label: 'Customers', desc: 'All customer data including risk scores', icon: '👥' },
            { type: 'interventions', label: 'Interventions', desc: 'History of all playbook interventions', icon: '🎯' },
            { type: 'analytics', label: 'Analytics', desc: 'Monthly trends and metrics data', icon: '📊' },
            { type: 'revenue', label: 'Revenue Impact', desc: 'MRR and revenue saved reports', icon: '💰' }
          ].map((item) => (
            <div key={item.type} style={{
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(99, 102, 241, 0.15)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                fontSize: '20px'
              }}>{item.icon}</div>
              <h3 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#fff'}}>{item.label}</h3>
              <p style={{margin: '0 0 20px 0', fontSize: '14px', color: '#64748b'}}>{item.desc}</p>
              <button
                onClick={() => handleExport(item.type)}
                disabled={exporting}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: exporting ? 'not-allowed' : 'pointer',
                  opacity: exporting ? 0.7 : 1
                }}
              >
                {exporting ? 'Exporting...' : 'Download CSV'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
