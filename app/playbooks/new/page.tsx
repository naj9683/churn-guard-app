'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';

export default function NewPlaybookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'risk_score',
    triggerValue: '70',
    actionType: 'email',
    isActive: true
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/playbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/playbooks');
      } else {
        alert('Failed to create playbook');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating playbook');
    } finally {
      setLoading(false);
    }
  }

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
        {/* Header */}
        <div style={{marginBottom: '32px'}}>
          <Link href="/playbooks" style={{
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '16px'
          }}>
            ← Back to Playbooks
          </Link>
          <h1 style={{
            margin: '0 0 4px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            Create Playbook
          </h1>
          <p style={{
            margin: 0,
            color: '#64748b',
            fontSize: '14px'
          }}>
            Set up an automated workflow to prevent churn
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '600px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            
            {/* Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Playbook Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., High Risk Winback"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What does this playbook do?"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Trigger */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Trigger Condition
              </label>
              <div style={{display: 'flex', gap: '12px'}}>
                <select
                  value={formData.triggerType}
                  onChange={(e) => setFormData({...formData, triggerType: e.target.value})}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#fff'
                  }}
                >
                  <option value="risk_score">Risk Score ≥</option>
                  <option value="days_since_login">Days Since Login ≥</option>
                  <option value="mrr_drop">MRR Drop % ≥</option>
                </select>
                <input
                  type="number"
                  value={formData.triggerValue}
                  onChange={(e) => setFormData({...formData, triggerValue: e.target.value})}
                  style={{
                    width: '100px',
                    padding: '10px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Action */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Action
              </label>
              <select
                value={formData.actionType}
                onChange={(e) => setFormData({...formData, actionType: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#fff'
                }}
              >
                <option value="email">Send Email</option>
                <option value="slack">Send Slack Alert</option>
                <option value="webhook">Trigger Webhook</option>
                <option value="task">Create Task</option>
              </select>
            </div>

            {/* Active */}
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                style={{width: '18px', height: '18px', accentColor: '#6366f1'}}
              />
              <label htmlFor="isActive" style={{fontSize: '14px', color: '#374151', cursor: 'pointer'}}>
                Activate immediately
              </label>
            </div>

            {/* Buttons */}
            <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
              <button
                type="button"
                onClick={() => router.push('/playbooks')}
                style={{
                  padding: '10px 20px',
                  background: '#fff',
                  color: '#374151',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  background: loading ? '#c7d2fe' : '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading || !formData.name ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
              >
                {loading ? 'Creating...' : 'Create Playbook'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
