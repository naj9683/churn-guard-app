'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Sidebar from '@/app/components/Sidebar';

export default function ExportPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      fetchRevenueReport();
    }
  }, [isLoaded, user]);

  const fetchRevenueReport = async () => {
    try {
      setLoadingRevenue(true);
      setError('');
      const res = await fetch('/api/export/revenue');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setRevenueData(data);
    } catch (error) {
      console.error('Failed to fetch revenue report:', error);
      setError('Failed to load revenue data');
    } finally {
      setLoadingRevenue(false);
    }
  };

  const exportCustomersCSV = async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/api/export/customers');
      
      if (!res.ok) {
        throw new Error(`Export failed: ${res.status}`);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export customers');
    } finally {
      setLoading(false);
    }
  };

  const exportRevenueReport = async () => {
    if (!revenueData) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Generate CSV content
      const lines = [
        ['ChurnGuard Revenue Report'],
        ['Generated:', new Date(revenueData.generatedAt).toLocaleString()],
        [''],
        ['SUMMARY'],
        ['Total Customers', revenueData.summary.totalCustomers],
        ['Total MRR', `$${revenueData.summary.totalMRR.toLocaleString()}`],
        ['Total ARR', `$${revenueData.summary.totalARR.toLocaleString()}`],
        ['MRR at Risk', `$${revenueData.summary.atRiskMRR.toLocaleString()}`],
        ['MRR Saved', `$${revenueData.summary.savedMRR.toLocaleString()}`],
        [''],
        ['RISK DISTRIBUTION'],
        ['High Risk', revenueData.summary.riskDistribution.high],
        ['Medium Risk', revenueData.summary.riskDistribution.medium],
        ['Low Risk', revenueData.summary.riskDistribution.low],
        [''],
        ['AT RISK CUSTOMERS'],
        ['Name', 'Email', 'MRR', 'Risk Score']
      ];

      revenueData.atRiskCustomers.forEach((c: any) => {
        lines.push([
          c.name || 'Unknown',
          c.email,
          `$${c.mrr || 0}`,
          `${c.riskScore || 0}%`
        ]);
      });

      // Convert to CSV
      const csvContent = lines.map(row => 
        row.map(cell => {
          const str = String(cell);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      ).join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Revenue export failed:', error);
      setError('Failed to export revenue report');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex'}}>
        <Sidebar />
        <div style={{marginLeft: '250px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', display: 'flex'}}>
      <Sidebar />
      
      <div style={{marginLeft: '250px', flex: 1, padding: '2rem'}}>
        {/* Header */}
        <div style={{marginBottom: '2rem'}}>
          <h1 style={{margin: '0 0 0.5rem 0', fontSize: '1.875rem', fontWeight: '700'}}>📥 Data Export</h1>
          <p style={{margin: '0', color: '#94a3b8'}}>Export your data for analysis and reporting</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#ef444420',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Export Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          {/* Customers Export */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
              <div style={{width: '48px', height: '48px', background: '#6366f1', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
                👥
              </div>
              <div>
                <h3 style={{margin: '0', fontSize: '1.125rem', fontWeight: '600'}}>Customers Export</h3>
                <p style={{margin: '0', color: '#94a3b8', fontSize: '0.875rem'}}>CSV format</p>
              </div>
            </div>
            <p style={{color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
              Export all customer data including MRR, ARR, risk scores, and contact information. Perfect for CRM imports.
            </p>
            <button 
              onClick={exportCustomersCSV}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                background: loading ? '#475569' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
            >
              {loading ? '⏳ Exporting...' : '📥 Download Customers CSV'}
            </button>
          </div>

          {/* Revenue Report */}
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
              <div style={{width: '48px', height: '48px', background: '#10b981', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
                💰
              </div>
              <div>
                <h3 style={{margin: '0', fontSize: '1.125rem', fontWeight: '600'}}>Revenue Report</h3>
                <p style={{margin: '0', color: '#94a3b8', fontSize: '0.875rem'}}>Executive summary</p>
              </div>
            </div>
            <p style={{color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
              Generate executive revenue reports with MRR, ARR, at-risk revenue, and high-risk customer list.
            </p>
            <button 
              onClick={exportRevenueReport}
              disabled={loading || loadingRevenue || !revenueData}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                background: loading || loadingRevenue || !revenueData ? '#475569' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading || loadingRevenue || !revenueData ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
            >
              {loadingRevenue ? '⏳ Loading...' : loading ? '⏳ Exporting...' : '📊 Download Revenue Report'}
            </button>
          </div>
        </div>

        {/* Revenue Preview */}
        {revenueData && (
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
            <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.125rem', fontWeight: '600'}}>Revenue Overview</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem'}}>
              <div style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem'}}>
                <p style={{margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Total MRR</p>
                <p style={{margin: '0', fontSize: '1.5rem', fontWeight: '700', color: '#6366f1'}}>
                  ${revenueData.summary.totalMRR.toLocaleString()}
                </p>
              </div>
              
              <div style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem'}}>
                <p style={{margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Total ARR</p>
                <p style={{margin: '0', fontSize: '1.5rem', fontWeight: '700', color: '#10b981'}}>
                  ${revenueData.summary.totalARR.toLocaleString()}
                </p>
              </div>
              
              <div style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem'}}>
                <p style={{margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>MRR at Risk</p>
                <p style={{margin: '0', fontSize: '1.5rem', fontWeight: '700', color: '#ef4444'}}>
                  ${revenueData.summary.atRiskMRR.toLocaleString()}
                </p>
              </div>
              
              <div style={{background: '#0f172a', padding: '1rem', borderRadius: '0.5rem'}}>
                <p style={{margin: '0 0 0.25rem 0', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>MRR Saved</p>
                <p style={{margin: '0', fontSize: '1.5rem', fontWeight: '700', color: '#10b981'}}>
                  ${revenueData.summary.savedMRR.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Risk Distribution */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
              <div style={{textAlign: 'center', padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #ef4444'}}>
                <p style={{margin: '0', fontSize: '1.75rem', fontWeight: '700', color: '#ef4444'}}>
                  {revenueData.summary.riskDistribution.high}
                </p>
                <p style={{margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.75rem'}}>High Risk</p>
              </div>
              
              <div style={{textAlign: 'center', padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b'}}>
                <p style={{margin: '0', fontSize: '1.75rem', fontWeight: '700', color: '#f59e0b'}}>
                  {revenueData.summary.riskDistribution.medium}
                </p>
                <p style={{margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.75rem'}}>Medium Risk</p>
              </div>
              
              <div style={{textAlign: 'center', padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', borderLeft: '4px solid #10b981'}}>
                <p style={{margin: '0', fontSize: '1.75rem', fontWeight: '700', color: '#10b981'}}>
                  {revenueData.summary.riskDistribution.low}
                </p>
                <p style={{margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.75rem'}}>Low Risk</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
