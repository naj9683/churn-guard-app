'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/app/admin/components/AdminShell';

type Booking = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  date: string;
  timeSlot: string;
  notes: string | null;
  status: string;
  createdAt: string;
};

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  confirmed: { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
  cancelled: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  completed: { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => { fetchBookings(); }, []);

  async function fetchBookings() {
    setLoading(true);
    const res = await fetch('/api/admin/bookings').catch(() => null);
    if (res?.ok) setBookings((await res.json()).bookings ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => null);
    if (res?.ok) {
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b));
    }
    setUpdating(null);
  }

  const counts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const upcoming = bookings.filter(b => {
    const d = new Date(b.date);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return d >= today && b.status === 'confirmed';
  }).length;

  return (
    <AdminShell title="Bookings" subtitle="Demo call appointments booked via /book" loading={loading}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Total', value: counts.all, color: '#6366f1', bg: '#f5f3ff' },
          { label: 'Upcoming', value: upcoming, color: '#d97706', bg: '#fffbeb' },
          { label: 'Completed', value: counts.completed, color: '#0369a1', bg: '#f0f9ff' },
          { label: 'Cancelled', value: counts.cancelled, color: '#dc2626', bg: '#fef2f2' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}20`, borderRadius: '10px', padding: '16px 18px' }}>
            <div style={{ fontSize: '26px', fontWeight: '700', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(['all', 'confirmed', 'completed', 'cancelled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: filter === f ? '#6366f1' : '#e5e7eb',
              background: filter === f ? '#6366f1' : '#fff',
              color: filter === f ? '#fff' : '#6b7280',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {' '}
            <span style={{ opacity: 0.8 }}>({counts[f]})</span>
          </button>
        ))}
        <button
          onClick={fetchBookings}
          style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: '20px', border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
          {filter === 'all' ? 'No bookings yet. Share your /book page to get started.' : `No ${filter} bookings.`}
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['Name', 'Email / Company', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const sc = STATUS_COLORS[b.status] ?? STATUS_COLORS.confirmed;
                const isPast = new Date(b.date) < new Date(new Date().setHours(0, 0, 0, 0));
                return (
                  <tr key={b.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none', background: isPast && b.status === 'confirmed' ? '#fffbeb' : 'transparent' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{b.name}</div>
                      {b.notes && (
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.notes}>
                          {b.notes}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontSize: '13px', color: '#374151' }}>
                        <a href={`mailto:${b.email}`} style={{ color: '#6366f1', textDecoration: 'none' }}>{b.email}</a>
                      </div>
                      {b.company && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{b.company}</div>}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#374151', whiteSpace: 'nowrap' }}>
                      {formatDate(b.date)}
                      {isPast && b.status === 'confirmed' && (
                        <div style={{ fontSize: '11px', color: '#d97706', marginTop: '2px' }}>past due</div>
                      )}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: '13px', color: '#374151', whiteSpace: 'nowrap', fontWeight: '500' }}>
                      {b.timeSlot} EST
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      {updating === b.id ? (
                        <div style={{ width: '16px', height: '16px', border: '2px solid #e5e7eb', borderTop: '2px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {b.status !== 'completed' && (
                            <button
                              onClick={() => updateStatus(b.id, 'completed')}
                              style={{ padding: '4px 10px', fontSize: '12px', border: '1px solid #bae6fd', background: '#f0f9ff', color: '#0369a1', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500' }}
                            >
                              Complete
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => updateStatus(b.id, 'cancelled')}
                              style={{ padding: '4px 10px', fontSize: '12px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500' }}
                            >
                              Cancel
                            </button>
                          )}
                          {b.status === 'cancelled' && (
                            <button
                              onClick={() => updateStatus(b.id, 'confirmed')}
                              style={{ padding: '4px 10px', fontSize: '12px', border: '1px solid #bbf7d0', background: '#dcfce7', color: '#15803d', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500' }}
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '16px', fontSize: '13px', color: '#9ca3af' }}>
        Booking page: <a href="/book" target="_blank" rel="noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>churnguardapp.com/book</a>
      </div>
    </AdminShell>
  );
}
