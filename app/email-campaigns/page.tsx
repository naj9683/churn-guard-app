'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';
import Link from 'next/link';

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  draft:     { bg: '#fffbeb', color: '#f59e0b', label: 'Draft' },
  scheduled: { bg: '#eff6ff', color: '#3b82f6', label: 'Scheduled' },
  sent:      { bg: '#f0fdf4', color: '#10b981', label: 'Sent' },
  failed:    { bg: '#fef2f2', color: '#ef4444', label: 'Failed' }
};

export default function EmailCampaignsPage() {
  const { user, isLoaded } = useUser();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) fetchCampaigns();
  }, [isLoaded, user]);

  async function fetchCampaigns() {
    try {
      const res = await fetch('/api/email-campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCampaign(id: string) {
    if (!confirm('Delete this campaign? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/email-campaigns/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
      } else {
        alert('Failed to delete campaign.');
      }
    } catch {
      alert('Failed to delete campaign.');
    } finally {
      setDeleting(null);
    }
  }

  if (!isLoaded || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '260px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Layout
      title="Email Campaigns"
      subtitle="Create and manage email campaigns for customer retention"
      actions={
        <Link href="/email-campaigns/new" style={{
          padding: '10px 20px',
          background: '#6366f1',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '500',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
        }}>
          + New Campaign
        </Link>
      }
    >
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total', value: campaigns.length, color: '#6366f1' },
            { label: 'Drafts', value: campaigns.filter(c => c.status === 'draft').length, color: '#f59e0b' },
            { label: 'Scheduled', value: campaigns.filter(c => c.status === 'scheduled').length, color: '#3b82f6' },
            { label: 'Sent', value: campaigns.filter(c => c.status === 'sent').length, color: '#10b981' }
          ].map((stat, idx) => (
            <div key={idx} style={{ padding: '20px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>All Campaigns</h3>

        {campaigns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280', background: '#f9fafb', borderRadius: '10px', border: '2px dashed #e5e7eb' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>No campaigns yet</div>
            <div>Create your first email campaign to get started</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {campaigns.map((campaign) => {
              const st = STATUS_STYLE[campaign.status] || STATUS_STYLE.draft;
              return (
                <div key={campaign.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#111827' }}>{campaign.name}</h4>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>{campaign.subject || 'No subject'}</div>
                    {campaign.scheduledAt && campaign.status === 'scheduled' && (
                      <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px' }}>
                        Scheduled: {new Date(campaign.scheduledAt).toLocaleString()}
                      </div>
                    )}
                    {campaign.sentAt && (
                      <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                        Sent: {new Date(campaign.sentAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '16px' }}>
                    <span style={{ padding: '5px 12px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {st.label}
                    </span>
                    <Link href={`/email-campaigns/${campaign.id}`} style={{ padding: '7px 14px', background: '#fff', color: '#374151', textDecoration: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', border: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>
                      {campaign.status === 'sent' ? 'View' : 'Edit'}
                    </Link>
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      disabled={deleting === campaign.id}
                      style={{ padding: '7px 14px', background: deleting === campaign.id ? '#f3f4f6' : '#fef2f2', color: deleting === campaign.id ? '#9ca3af' : '#ef4444', border: `1px solid ${deleting === campaign.id ? '#e5e7eb' : '#fecaca'}`, borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: deleting === campaign.id ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                      {deleting === campaign.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
