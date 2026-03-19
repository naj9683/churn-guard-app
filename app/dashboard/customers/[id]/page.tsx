'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import RiskAnalysisModal, { type RiskAnalysisData } from '@/app/components/RiskAnalysisModal';

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  success: { bg: '#f0fdf4', color: '#15803d', label: 'Success' },
  failed:  { bg: '#fef2f2', color: '#dc2626', label: 'Failed'  },
  skipped: { bg: '#f3f4f6', color: '#6b7280', label: 'Skipped' },
};

const SEQ_LABELS: Record<string, { label: string; color: string }> = {
  dunning:        { label: 'Dunning',         color: '#ef4444' },
  risk_retention: { label: 'Risk Retention',  color: '#f97316' },
  welcome:        { label: 'Welcome',         color: '#6366f1' },
};

const STEP_LABELS: Record<string, string[]> = {
  dunning:        ['Email sent', 'SMS (day 3)', 'CSM intervention (day 7)'],
  risk_retention: ['AI email sent', 'Slack alert (48 h)', 'Mark critical (day 7)'],
  welcome:        ['Welcome email', 'Connect integration (day 3)', 'Risk score guide (day 7)'],
};

function getEventIcon(name: string) {
  const map: Record<string, string> = {
    page_view: '🌐', feature_used: '⚡', subscription_created: '💳',
    subscription_cancelled: '❌', login: '🔑', signup: '✨',
    payment_failed: '💳', payment_succeeded: '✅', support_ticket: '🎫',
    email_opened: '📧', high_risk_detected: '🔥',
  };
  return map[name] ?? '📊';
}

export default function CustomerDetailPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Phone editing
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState('');

  // SMS test
  const [testingSmS, setTestingSms] = useState(false);
  const [smsTestMsg, setSmsTestMsg] = useState('');

  // Risk analysis modal
  const [riskModal, setRiskModal] = useState<RiskAnalysisData | null>(null);
  const [analyzingRisk, setAnalyzingRisk] = useState(false);

  // Manual sequence trigger
  const [triggerSeqType, setTriggerSeqType] = useState<string>('dunning');
  const [triggeringSeq, setTriggeringSeq] = useState(false);
  const [seqTriggerMsg, setSeqTriggerMsg] = useState('');

  useEffect(() => {
    if (isLoaded && user && params.id) fetchCustomer();
  }, [isLoaded, user, params.id]);

  async function fetchCustomer() {
    setLoading(true);
    try {
      const res = await fetch(`/api/customers/${params.id}`);
      if (res.ok) {
        const d = await res.json();
        setData(d);
        setPhoneInput(d.customer?.phone ?? '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function savePhone() {
    setSavingPhone(true);
    setPhoneMsg('');
    try {
      const res = await fetch(`/api/customers/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneInput.trim() || null }),
      });
      if (res.ok) {
        setPhoneMsg('Saved');
        setEditingPhone(false);
        setData((prev: any) => ({ ...prev, customer: { ...prev.customer, phone: phoneInput.trim() || null } }));
      } else {
        setPhoneMsg('Failed to save');
      }
    } catch {
      setPhoneMsg('Failed to save');
    } finally {
      setSavingPhone(false);
      setTimeout(() => setPhoneMsg(''), 3000);
    }
  }

  async function triggerSequence() {
    setTriggeringSeq(true);
    setSeqTriggerMsg('');
    try {
      const res = await fetch('/api/sequences/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: params.id, sequenceType: triggerSeqType }),
      });
      const d = await res.json();
      if (res.ok) {
        setSeqTriggerMsg(`Enrolled + ran step 0. Result: ${d.runResult.succeeded} succeeded, ${d.runResult.failed} failed, ${d.runResult.skipped} skipped.`);
        fetchCustomer(); // refresh to show new enrollment
      } else {
        setSeqTriggerMsg(`Error: ${d.error}`);
      }
    } catch {
      setSeqTriggerMsg('Request failed');
    } finally {
      setTriggeringSeq(false);
      setTimeout(() => setSeqTriggerMsg(''), 8000);
    }
  }

  async function runRiskAnalysis() {
    if (!data?.customer) return;
    setAnalyzingRisk(true);
    try {
      const res = await fetch(`/api/risk/analyze/${params.id}`);
      const d = await res.json();
      if (res.ok) {
        setRiskModal({ ...d, name: data.customer.name ?? undefined });
        setData((prev: any) => ({
          ...prev,
          customer: { ...prev.customer, riskScore: d.churnProbability, riskReason: d.summary },
        }));
      } else {
        alert(d.error ?? 'Analysis failed');
      }
    } catch {
      alert('Network error');
    } finally {
      setAnalyzingRisk(false);
    }
  }

  async function sendTestSms() {
    const phone = data?.customer?.phone;
    if (!phone) { setSmsTestMsg('No phone number saved'); return; }
    setTestingSms(true);
    setSmsTestMsg('');
    try {
      const res = await fetch('/api/test/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phone, message: `ChurnGuard SMS test for ${data.customer.email}` }),
      });
      const d = await res.json();
      setSmsTestMsg(res.ok ? `Sent! SID: ${d.messageSid}` : `Error: ${d.detail ?? d.error}`);
    } catch {
      setSmsTestMsg('Request failed');
    } finally {
      setTestingSms(false);
      setTimeout(() => setSmsTestMsg(''), 6000);
    }
  }

  if (!isLoaded || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '260px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data?.customer) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', marginLeft: '260px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#0f172a', marginBottom: '8px' }}>Customer not found</h2>
          <Link href="/customers" style={{ color: '#6366f1' }}>← Back to Customers</Link>
        </div>
      </div>
    );
  }

  const { customer, events = [], sequenceEnrollments = [], stats } = data;
  const lastActive = events[0]?.timestamp
    ? new Date(Number(events[0].timestamp)).toLocaleString()
    : 'Never';

  const riskColor = customer.riskScore >= 70 ? '#ef4444' : customer.riskScore >= 40 ? '#f59e0b' : '#10b981';
  const riskBg   = customer.riskScore >= 70 ? '#fef2f2' : customer.riskScore >= 40 ? '#fffbeb' : '#f0fdf4';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter,-apple-system,BlinkMacSystemFont,sans-serif', display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '260px', flex: 1, padding: '32px', maxWidth: '1100px' }}>

        {/* Back + header */}
        <div style={{ marginBottom: '28px' }}>
          <Link href="/customers" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            ← Back to Customers
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: '700', color: '#0f172a' }}>
                {customer.name ?? customer.email}
              </h1>
              {customer.name && <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{customer.email}</p>}
              <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '13px' }}>ID: {customer.externalId}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {customer.csmStatus === 'critical_call_required' && (
                <span style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
                  Critical — Call Required
                </span>
              )}
              <span style={{ padding: '8px 16px', borderRadius: '8px', background: riskBg, color: riskColor, fontWeight: '600', fontSize: '14px' }}>
                Risk: {customer.riskScore}
              </span>
              <button
                onClick={runRiskAnalysis}
                disabled={analyzingRisk}
                style={{
                  padding: '8px 16px', background: analyzingRisk ? '#f3f4f6' : '#f0f0ff',
                  color: analyzingRisk ? '#9ca3af' : '#6366f1',
                  border: '1px solid #e0d9ff', borderRadius: '8px', fontSize: '14px',
                  fontWeight: '600', cursor: analyzingRisk ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {analyzingRisk ? 'Analyzing...' : 'Analyze Risk'}
              </button>
            </div>
          </div>
          {customer.riskReason && (
            <div style={{ marginTop: '10px', padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '13px', color: '#92400e' }}>
              {customer.riskReason}
            </div>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'MRR',         value: `$${customer.mrr ?? 0}`,          color: '#10b981' },
            { label: 'Plan',        value: customer.plan ?? '—',              color: '#6366f1' },
            { label: 'Events',      value: stats?.totalEvents ?? 0,           color: '#3b82f6' },
            { label: 'Days Active', value: stats?.daysSinceJoined ?? 0,       color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Phone number card */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editingPhone ? '14px' : '0' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>Phone Number</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Used for SMS notifications in the dunning sequence (day 3 step).
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {!editingPhone && (
                <>
                  <span style={{ fontSize: '15px', color: customer.phone ? '#0f172a' : '#94a3b8', fontWeight: customer.phone ? '500' : '400' }}>
                    {customer.phone ?? 'Not set'}
                  </span>
                  <button
                    onClick={() => { setEditingPhone(true); setPhoneInput(customer.phone ?? ''); }}
                    style={{ padding: '7px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '13px', cursor: 'pointer', color: '#374151' }}
                  >
                    {customer.phone ? 'Edit' : 'Add phone'}
                  </button>
                  {customer.phone && (
                    <button
                      onClick={sendTestSms}
                      disabled={testingSmS}
                      style={{ padding: '7px 14px', background: testingSmS ? '#9ca3af' : '#6366f1', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '13px', cursor: testingSmS ? 'not-allowed' : 'pointer' }}
                    >
                      {testingSmS ? 'Sending…' : 'Send Test SMS'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {editingPhone && (
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  placeholder="+14155552671"
                  autoFocus
                  style={{ flex: 1, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
                <button
                  onClick={savePhone}
                  disabled={savingPhone}
                  style={{ padding: '9px 18px', background: savingPhone ? '#9ca3af' : '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: savingPhone ? 'not-allowed' : 'pointer', fontWeight: '500' }}
                >
                  {savingPhone ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditingPhone(false); setPhoneInput(customer.phone ?? ''); }}
                  style={{ padding: '9px 16px', background: '#f3f4f6', color: '#374151', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>E.164 format required (e.g. +14155552671)</div>
            </div>
          )}

          {(phoneMsg || smsTestMsg) && (
            <div style={{ marginTop: '10px', padding: '8px 12px', background: (phoneMsg === 'Failed to save' || smsTestMsg.startsWith('Error') || smsTestMsg === 'No phone number saved' || smsTestMsg === 'Request failed') ? '#fef2f2' : '#f0fdf4', color: (phoneMsg === 'Failed to save' || smsTestMsg.startsWith('Error') || smsTestMsg === 'No phone number saved' || smsTestMsg === 'Request failed') ? '#dc2626' : '#15803d', borderRadius: '7px', fontSize: '13px' }}>
              {phoneMsg || smsTestMsg}
            </div>
          )}
        </div>

        {/* Manual sequence trigger (end-to-end test) */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Run Automation Sequence</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
            Manually enroll this customer in a sequence and execute step 0 immediately. Useful for testing SMS and email delivery end-to-end.
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={triggerSeqType}
              onChange={e => setTriggerSeqType(e.target.value)}
              style={{ padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: '#fff', color: '#0f172a', cursor: 'pointer' }}
            >
              <option value="dunning">Dunning (payment failed → email → SMS → CSM)</option>
              <option value="risk_retention">Risk Retention (AI email → Slack → mark critical)</option>
              <option value="welcome">Welcome (day 1 email → integration prompt → guide)</option>
            </select>
            <button
              onClick={triggerSequence}
              disabled={triggeringSeq}
              style={{ padding: '9px 20px', background: triggeringSeq ? '#9ca3af' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: triggeringSeq ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
            >
              {triggeringSeq ? 'Running…' : 'Run Sequence Now'}
            </button>
          </div>
          {seqTriggerMsg && (
            <div style={{ marginTop: '10px', padding: '9px 13px', background: seqTriggerMsg.startsWith('Error') || seqTriggerMsg === 'Request failed' ? '#fef2f2' : '#f0fdf4', color: seqTriggerMsg.startsWith('Error') || seqTriggerMsg === 'Request failed' ? '#dc2626' : '#15803d', borderRadius: '7px', fontSize: '13px' }}>
              {seqTriggerMsg}
            </div>
          )}
        </div>

        {/* Sequence enrollments + SMS logs */}
        {sequenceEnrollments.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>Automation Sequences</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {sequenceEnrollments.map((e: any) => {
                const seq = SEQ_LABELS[e.sequenceType] ?? { label: e.sequenceType, color: '#6366f1' };
                const stepLabels = STEP_LABELS[e.sequenceType] ?? [];
                return (
                  <div key={e.id} style={{ border: '1px solid #f1f5f9', borderRadius: '10px', padding: '16px' }}>
                    {/* Sequence header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ padding: '3px 9px', background: seq.color + '15', color: seq.color, borderRadius: '5px', fontSize: '12px', fontWeight: '600' }}>
                          {seq.label}
                        </span>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                          Started {new Date(e.startedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span style={{
                        padding: '3px 9px', borderRadius: '5px', fontSize: '12px', fontWeight: '600',
                        background: e.status === 'completed' ? '#f0fdf4' : e.status === 'cancelled' ? '#f3f4f6' : '#eff6ff',
                        color:      e.status === 'completed' ? '#15803d' : e.status === 'cancelled' ? '#9ca3af'  : '#2563eb',
                      }}>
                        {e.status === 'active' ? `Step ${e.currentStep + 1}/${stepLabels.length}` : e.status}
                      </span>
                    </div>

                    {/* Step log rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {e.logs.map((log: any) => {
                        const s = STATUS_COLORS[log.status] ?? STATUS_COLORS.skipped;
                        const isSms = e.sequenceType === 'dunning' && log.step === 1;
                        return (
                          <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 10px', background: '#f8fafc', borderRadius: '7px' }}>
                            <span style={{ padding: '2px 7px', background: s.bg, color: s.color, borderRadius: '4px', fontSize: '11px', fontWeight: '600', flexShrink: 0, marginTop: '1px' }}>
                              {s.label}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <strong>{stepLabels[log.step] ?? `Step ${log.step}`}</strong>
                                {isSms && (
                                  <span style={{ padding: '1px 6px', background: '#f0fdf4', color: '#15803d', borderRadius: '4px', fontSize: '11px', border: '1px solid #bbf7d0' }}>
                                    SMS
                                  </span>
                                )}
                              </div>
                              {log.message && (
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', wordBreak: 'break-word' }}>{log.message}</div>
                              )}
                            </div>
                            <div style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0 }}>
                              {new Date(log.executedAt).toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                      {e.logs.length === 0 && (
                        <div style={{ fontSize: '13px', color: '#94a3b8', padding: '4px 0' }}>
                          Waiting for first step to run (next cron tick)…
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Risk Analysis Modal */}
        {riskModal && (
          <RiskAnalysisModal
            data={riskModal}
            onClose={() => setRiskModal(null)}
            onCreateIntervention={(id) => {
              setRiskModal(null);
              window.location.href = `/dashboard/interventions?customerId=${id}`;
            }}
          />
        )}

        {/* Activity timeline */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
            Activity Timeline
            <span style={{ float: 'right', fontSize: '12px', color: '#64748b', fontWeight: '400' }}>Last: {lastActive}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>No activity recorded yet</div>
            ) : (
              events.map((event: any, idx: number) => (
                <div key={event.id} style={{ display: 'flex', gap: '12px', paddingBottom: idx < events.length - 1 ? '14px' : '0', borderBottom: idx < events.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
                    {getEventIcon(event.event)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a', textTransform: 'capitalize' }}>
                      {event.event?.replace(/_/g, ' ')}
                    </div>
                    {event.metadata && (
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {JSON.stringify(event.metadata)}
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '3px' }}>
                      {new Date(Number(event.timestamp)).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
