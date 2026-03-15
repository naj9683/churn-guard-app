'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';
import Link from 'next/link';

export default function EmailCampaignsPage() {
  const { user, isLoaded } = useUser();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Campaigns', value: campaigns.length, color: '#6366f1' },
            { label: 'Active', value: campaigns.filter((c: any) => c.status === 'active').length, color: '#10b981' },
            { label: 'Drafts', value: campaigns.filter((c: any) => c.status === 'draft').length, color: '#f59e0b' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#6b7280',
                fontSize: '13px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>{stat.label}</div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: stat.color
              }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#111827'
        }}>All Campaigns</h3>

        {campaigns.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: '#6b7280',
            background: '#f9fafb',
            borderRadius: '10px',
            border: '2px dashed #e5e7eb'
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>📧</div>
            <div style={{fontSize: '16px', fontWeight: '500', marginBottom: '8px'}}>No campaigns yet</div>
            <div>Create your first email campaign to get started</div>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {campaigns.map((campaign) => (
              <div key={campaign.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '10px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{flex: 1}}>
                  <h4 style={{
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827'
                  }}>{campaign.name}</h4>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {campaign.subject || 'No subject'}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: campaign.status === 'active' ? '#f0fdf4' : campaign.status === 'draft' ? '#fffbeb' : '#f3f4f6',
                    color: campaign.status === 'active' ? '#10b981' : campaign.status === 'draft' ? '#f59e0b' : '#6b7280',
                    fontWeight: '600',
                    fontSize: '13px',
                    textTransform: 'capitalize'
                  }}>
                    {campaign.status}
                  </span>
                  <Link href={`/email-campaigns/${campaign.id}`} style={{
                    padding: '8px 16px',
                    background: '#fff',
                    color: '#374151',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    border: '1px solid #e5e7eb'
                  }}>
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
