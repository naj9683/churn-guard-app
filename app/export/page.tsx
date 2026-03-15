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
        <div style={{marginBottom: '32px'}}>
          <h1 style={{
            margin: '0 0 4px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#0f172a',
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
            { type: 'customers', title: 'Customers', desc: 'All customer data including risk scores' },
            { type: 'interventions', title: 'Interventions', desc: 'History of all playbook interventions' },
            { type: 'analytics', title: 'Analytics', desc: 'Monthly trends and metrics data' },
            { type: 'revenue', title: 'Revenue Impact', desc: 'MRR and revenue saved reports' }
          ].map((item) => (
            <div key={item.type} style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a'}}>{item.title}</h3>
              <p style={{margin: '0 0 20px 0', fontSize: '14px', color: '#64748b'}}>{item.desc}</p>
              <button
                onClick={() => handleExport(item.type)}
                disabled={exporting}
                style={{
                  padding: '10px 20px',
                  background: exporting ? '#e2e8f0' : '#6366f1',
                  color: exporting ? '#64748b' : '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: exporting ? 'not-allowed' : 'pointer',
                  width: '100%'
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
