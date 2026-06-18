'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ChecklistStatus {
  stripe: boolean;
  customers: boolean;
  playbook: boolean;
  alert: boolean;
}

const STEPS = [
  {
    key: 'stripe' as const,
    label: 'Connect Stripe',
    description: 'Import your customers and live revenue data',
    href: '/integrations',
  },
  {
    key: 'customers' as const,
    label: 'Import Customers',
    description: 'Add your first customer to start tracking churn risk',
    href: '/customers',
  },
  {
    key: 'playbook' as const,
    label: 'Activate a Playbook',
    description: 'Turn on automated retention for at-risk customers',
    href: '/playbooks',
  },
  {
    key: 'alert' as const,
    label: 'Trigger Your First Alert',
    description: 'Set up a rule so AI notifies you when churn risk is high',
    href: '/dashboard/automation/rules',
  },
];

const DISMISS_KEY = 'churnguard_checklist_dismissed';

export default function OnboardingChecklist() {
  const [status, setStatus] = useState<ChecklistStatus | null>(null);
  const [dismissed, setDismissed] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem(DISMISS_KEY) === '1' : false
  );

  useEffect(() => {
    fetch('/api/onboarding/checklist')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStatus(data); });
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  }

  if (dismissed || !status) return null;
  const allDone = status.stripe && status.customers && status.playbook && status.alert;
  if (allDone) return null;

  const completedCount = STEPS.filter(s => status[s.key]).length;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0,
          }}>
            🚀
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>
              Get started with ChurnGuard
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
              {completedCount} of {STEPS.length} steps completed
            </p>
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9ca3af', padding: '4px', borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
          onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(completedCount / STEPS.length) * 100}%`,
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          borderRadius: '4px',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {STEPS.map(step => {
          const done = status[step.key];
          return (
            <Link
              key={step.key}
              href={done ? '#' : step.href}
              onClick={done ? (e) => e.preventDefault() : undefined}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '12px 14px',
                background: done ? '#f0fdf4' : '#f9fafb',
                border: `1px solid ${done ? '#bbf7d0' : '#e5e7eb'}`,
                borderRadius: '8px',
                textDecoration: 'none',
                cursor: done ? 'default' : 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                if (!done) {
                  e.currentTarget.style.borderColor = '#a5b4fc';
                  e.currentTarget.style.background = '#f5f3ff';
                }
              }}
              onMouseLeave={e => {
                if (!done) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = '#f9fafb';
                }
              }}
            >
              {/* Circle check */}
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                background: done ? '#22c55e' : '#fff',
                border: `2px solid ${done ? '#22c55e' : '#d1d5db'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px', fontWeight: '600',
                  color: done ? '#15803d' : '#111827',
                  textDecoration: done ? 'line-through' : 'none',
                  marginBottom: '2px',
                }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '12px', color: done ? '#86efac' : '#6b7280', lineHeight: '1.4' }}>
                  {step.description}
                </div>
                {!done && (
                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#6366f1', fontWeight: '500' }}>
                    Set up →
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
