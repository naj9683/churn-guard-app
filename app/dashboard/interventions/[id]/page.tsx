'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/components/Sidebar';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    active:  { bg: '#eef2ff', color: '#6366f1', label: 'Active — Awaiting Response' },
    saved:   { bg: '#f0fdf4', color: '#10b981', label: 'Recovered' },
    churned: { bg: '#fef2f2', color: '#ef4444', label: 'Churned' },
    pending: { bg: '#f3f4f6', color: '#6b7280', label: 'Pending' },
  };
  const s = map[status] ?? map.pending;
  return (
    <span style={{ padding: '6px 14px', borderRadius: '20px', background: s.bg, color: s.color, fontWeight: '600', fontSize: '13px' }}>
      {s.label}
    </span>
  );
}

function ChannelRow({ icon, label, detail, status, subtext }: {
  icon: string; label: string; detail: string; status: 'sent' | 'failed' | 'skipped' | 'not_used';
  subtext?: string;
}) {
  const statusStyle: Record<string, { color: string; bg: string; text: string }> = {
    sent:     { color: '#10b981', bg: '#f0fdf4', text: 'Sent' },
    failed:   { color: '#ef4444', bg: '#fef2f2', text: 'Failed' },
    skipped:  { color: '#f59e0b', bg: '#fffbeb', text: 'Skipped' },
    not_used: { color: '#9ca3af', bg: '#f9fafb', text: 'Not used' },
  };
  const s = statusStyle[status];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px', marginBottom: '10px' }}>
      <div style={{ fontSize: '24px', lineHeight: 1 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>{label}</span>
          <span style={{ padding: '2px 10px', borderRadius: '12px', background: s.bg, color: s.color, fontWeight: '600', fontSize: '12px' }}>{s.text}</span>
        </div>
        <div style={{ fontSize: '13px', color: '#374151' }}>{detail}</div>
        {subtext && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontStyle: 'italic' }}>{subtext}</div>}
      </div>
    </div>
  );
}

function TimelineItem({ event, timestamp, detail, isLast }: {
  event: string; timestamp: string; detail: string; isLast: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '3px' }} />
        {!isLast && <div style={{ width: '2px', flex: 1, background: '#e5e7eb', marginTop: '4px' }} />}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : '20px' }}>
        <div style={{ fontWeight: '600', fontSize: '13px', color: '#111827' }}>{event}</div>
        <div style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0' }}>
          {new Date(timestamp).toLocaleString()}
        </div>
        <div style={{ fontSize: '13px', color: '#374151' }}>{detail}</div>
      </div>
    </div>
  );
}

export default function InterventionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/interventions/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Failed to load intervention'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '260px' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '260px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', color: '#ef4444', marginBottom: '12px' }}>{error || 'Intervention not found'}</div>
          <button onClick={() => router.back()} style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Go Back</button>
        </div>
      </div>
    );
  }

  const { intervention, executionLog } = data;
  const customer = intervention.customer;
  const log = executionLog;
  const typeLabel = (intervention.interventionType ?? '').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

  // Build channel list
  const emailLog = log?.channels?.email;
  const smsLog = log?.channels?.sms;
  const slackLog = log?.channels?.slack;

  // Build timeline — merge log timeline with DB timestamps
  const timeline: Array<{ event: string; timestamp: string; detail: string }> = [];
  if (log?.timeline?.length) {
    timeline.push(...log.timeline);
  } else {
    timeline.push({ event: 'Intervention created', timestamp: intervention.startedAt, detail: `Type: ${typeLabel}` });
  }
  if (intervention.completedAt && !timeline.find(t => t.event === 'Recovered' || t.event === 'Timed out')) {
    timeline.push({
      event: intervention.status === 'saved' ? 'Recovered' : 'Closed',
      timestamp: intervention.completedAt,
      detail: intervention.status === 'saved' ? `MRR saved: $${intervention.mrrSaved}` : 'No response received',
    });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', flex: 1, padding: '32px', maxWidth: '900px' }}>
        {/* Back link */}
        <Link href="/dashboard/interventions" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6366f1', textDecoration: 'none', fontSize: '14px', marginBottom: '24px' }}>
          ← Back to Interventions
        </Link>

        {/* Header */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '700', color: '#111827' }}>
                {customer?.name || customer?.email || 'Unknown Customer'}
              </h1>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                {customer?.email} {customer?.mrr ? `· $${customer.mrr}/mo` : ''} {customer?.plan ? `· ${customer.plan}` : ''}
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', background: '#eef2ff', color: '#6366f1', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                  {typeLabel}
                </span>
                <StatusBadge status={intervention.status} />
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '13px', color: '#6b7280' }}>
              <div>Created {new Date(intervention.startedAt).toLocaleString()}</div>
              {intervention.completedAt && <div>Completed {new Date(intervention.completedAt).toLocaleString()}</div>}
              <div style={{ marginTop: '8px', fontWeight: '600', fontSize: '14px', color: intervention.status === 'saved' ? '#10b981' : intervention.status === 'churned' ? '#ef4444' : '#6b7280' }}>
                {intervention.status === 'saved' ? `+$${intervention.mrrSaved} saved` : intervention.status === 'churned' ? `-$${intervention.mrrLost} lost` : `$${intervention.mrrAtRisk} at risk`}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Channels */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>Channels Used</h2>

            {log?.legacyNotes ? (
              <div style={{ fontSize: '13px', color: '#6b7280', padding: '12px', background: '#f9fafb', borderRadius: '6px' }}>{log.legacyNotes}</div>
            ) : emailLog ? (
              <>
                <ChannelRow
                  icon="✉️"
                  label="Email"
                  detail={emailLog.status === 'sent' ? `Sent to ${emailLog.to}` : `Failed: ${emailLog.error ?? 'unknown error'}`}
                  status={emailLog.status}
                  subtext={emailLog.status === 'sent' ? `Subject: "${emailLog.subject}"` : undefined}
                />
                {smsLog ? (
                  <ChannelRow
                    icon="💬"
                    label="SMS"
                    detail={smsLog.status === 'sent' ? `Sent to ${smsLog.to}` : smsLog.reason ?? 'Not sent'}
                    status={smsLog.status}
                    subtext={smsLog.body}
                  />
                ) : (
                  <ChannelRow icon="💬" label="SMS" detail="Not applicable for this intervention type" status="not_used" />
                )}
                {slackLog ? (
                  <ChannelRow
                    icon="💼"
                    label="Slack"
                    detail={slackLog.status === 'sent' ? 'Alert posted to team channel' : slackLog.reason ?? 'Not sent'}
                    status={slackLog.status}
                  />
                ) : (
                  <ChannelRow icon="💼" label="Slack" detail="Not applicable for this intervention type" status="not_used" />
                )}
              </>
            ) : (
              <div style={{ fontSize: '13px', color: '#9ca3af', padding: '12px' }}>No execution log available (intervention may have been created manually)</div>
            )}
          </div>

          {/* Timeline */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>Timeline</h2>
            {timeline.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>No timeline data available</div>
            ) : (
              timeline.map((item, i) => (
                <TimelineItem key={i} event={item.event} timestamp={item.timestamp} detail={item.detail} isLast={i === timeline.length - 1} />
              ))
            )}
          </div>
        </div>

        {/* Email Content */}
        {log?.emailContent && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>Email Sent</h2>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
              Subject: <strong style={{ color: '#111827' }}>{log.emailContent.subject}</strong>
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', background: '#fafafa', maxHeight: '300px', overflowY: 'auto' }}
              dangerouslySetInnerHTML={{ __html: log.emailContent.html }}
            />
          </div>
        )}

        {/* Results */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#111827' }}>Results</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              {
                label: 'MRR at Risk',
                value: `$${intervention.mrrAtRisk}`,
                color: '#f59e0b',
              },
              {
                label: 'MRR Saved',
                value: intervention.mrrSaved ? `$${intervention.mrrSaved}` : '—',
                color: '#10b981',
              },
              {
                label: 'MRR Lost',
                value: intervention.mrrLost ? `$${intervention.mrrLost}` : '—',
                color: '#ef4444',
              },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{label}</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color }}>{value}</div>
              </div>
            ))}
          </div>
          {log?.resolvedBy && (
            <div style={{ marginTop: '16px', padding: '12px 16px', background: intervention.status === 'saved' ? '#f0fdf4' : '#fef2f2', borderRadius: '8px', fontSize: '13px', color: intervention.status === 'saved' ? '#15803d' : '#b91c1c' }}>
              {log.resolvedBy === 'payment_received' ? '✓ Auto-resolved: customer payment received' : '✗ Auto-closed: no customer response after 7 days'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
