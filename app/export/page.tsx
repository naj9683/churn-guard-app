'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';

const EXPORT_TYPES = [
  { type: 'customers',      title: 'Customers',       desc: 'All customer data including risk scores and MRR',     icon: '👥' },
  { type: 'interventions',  title: 'Interventions',   desc: 'History of all playbook interventions and outcomes',  icon: '🎯' },
  { type: 'analytics',      title: 'Analytics',       desc: 'Monthly trends, risk distribution and key metrics',   icon: '📊' },
  { type: 'revenue',        title: 'Revenue Impact',  desc: 'MRR breakdown and at-risk revenue by customer',       icon: '💰' },
];

type LoadingKey = `${string}-csv` | `${string}-pdf`;

async function generatePDF(type: string, title: string) {
  // Dynamic import to avoid SSR issues
  const { jsPDF } = await import('jspdf');
  const { autoTable } = await import('jspdf-autotable');

  const res = await fetch(`/api/export?type=${type}&format=json`);
  if (!res.ok) throw new Error('Failed to fetch data');
  const data: { headers: string[]; rows: any[][]; title: string; count: number } = await res.json();

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const dateShort = new Date().toISOString().split('T')[0];

  // ── Header band ──────────────────────────────────────────────────────────
  doc.setFillColor(99, 102, 241); // indigo-500
  doc.rect(0, 0, pageW, 22, 'F');

  // Logo text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ChurnGuard', 12, 13);

  // Report title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(data.title, pageW / 2, 13, { align: 'center' });

  // Date right-aligned
  doc.setFontSize(9);
  doc.text(`Generated ${today}`, pageW - 12, 13, { align: 'right' });

  // ── Subheader ─────────────────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`${data.count} record${data.count !== 1 ? 's' : ''} exported`, 12, 30);

  // ── Data table ────────────────────────────────────────────────────────────
  autoTable(doc, {
    head: [data.headers],
    body: data.rows,
    startY: 35,
    margin: { left: 12, right: 12 },
    styles: {
      fontSize: 8,
      cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
      textColor: [55, 65, 81],
      lineColor: [229, 231, 235],
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
    },
    didDrawPage: (hookData) => {
      const pageNum = (hookData.pageNumber as number);
      const totalPages = doc.getNumberOfPages();

      // Footer line
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.line(12, pageH - 10, pageW - 12, pageH - 10);

      // Footer text
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175);
      doc.text('ChurnGuard — Confidential', 12, pageH - 5);
      doc.text(`Page ${pageNum} of ${totalPages}`, pageW / 2, pageH - 5, { align: 'center' });
      doc.text(dateShort, pageW - 12, pageH - 5, { align: 'right' });
    },
  });

  doc.save(`churnguard-${type}-${dateShort}.pdf`);
}

export default function ExportPage() {
  const [loading, setLoading] = useState<LoadingKey | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleCSV(type: string) {
    const key: LoadingKey = `${type}-csv`;
    setLoading(key);
    setErrors(e => ({ ...e, [type]: '' }));
    try {
      const res = await fetch(`/api/export?type=${type}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `churnguard-${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setErrors(e => ({ ...e, [type]: 'CSV export failed. Try again.' }));
    } finally {
      setLoading(null);
    }
  }

  async function handlePDF(type: string, title: string) {
    const key: LoadingKey = `${type}-pdf`;
    setLoading(key);
    setErrors(e => ({ ...e, [type]: '' }));
    try {
      await generatePDF(type, title);
    } catch {
      setErrors(e => ({ ...e, [type]: 'PDF export failed. Try again.' }));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em' }}>
            Export
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Download your data as CSV or a formatted PDF report
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {EXPORT_TYPES.map((item) => {
            const csvLoading = loading === `${item.type}-csv`;
            const pdfLoading = loading === `${item.type}-pdf`;
            const busy = csvLoading || pdfLoading;

            return (
              <div key={item.type} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '600', color: '#0f172a' }}>{item.title}</h3>
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#64748b' }}>{item.desc}</p>

                {errors[item.type] && (
                  <div style={{ marginBottom: '12px', padding: '8px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '7px', fontSize: '13px' }}>
                    {errors[item.type]}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  {/* CSV button */}
                  <button
                    onClick={() => handleCSV(item.type)}
                    disabled={busy}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      background: busy ? '#f1f5f9' : '#6366f1',
                      color: busy ? '#94a3b8' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      fontSize: '14px',
                      cursor: busy ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    {csvLoading ? (
                      <>
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #94a3b8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        Exporting…
                      </>
                    ) : (
                      <><span style={{ fontSize: '15px' }}>⬇</span> CSV</>
                    )}
                  </button>

                  {/* PDF button */}
                  <button
                    onClick={() => handlePDF(item.type, item.title)}
                    disabled={busy}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      background: busy ? '#f1f5f9' : '#fff',
                      color: busy ? '#94a3b8' : '#6366f1',
                      border: `1.5px solid ${busy ? '#e2e8f0' : '#6366f1'}`,
                      borderRadius: '8px',
                      fontWeight: '500',
                      fontSize: '14px',
                      cursor: busy ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    {pdfLoading ? (
                      <>
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #94a3b8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        Generating…
                      </>
                    ) : (
                      <><span style={{ fontSize: '15px' }}>📄</span> PDF</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Format descriptions */}
        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '16px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>⬇ CSV Format</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Comma-separated values. Import into Excel, Google Sheets, or any data tool for custom analysis.</div>
          </div>
          <div style={{ padding: '16px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>📄 PDF Format</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Formatted report with header, data tables, and page numbers. Ready to share or present to stakeholders.</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
