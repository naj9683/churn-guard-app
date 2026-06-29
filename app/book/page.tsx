'use client';

import { useState } from 'react';
import Link from 'next/link';

const ALL_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// ── Dark theme tokens ──────────────────────────────────────────────────────────
const T = {
  bg:          '#0f172a',
  card:        '#1e293b',
  cardHover:   '#243044',
  border:      '#334155',
  borderAccent:'rgba(99,102,241,0.35)',
  text:        '#f1f5f9',
  textMuted:   '#94a3b8',
  textDim:     '#64748b',
  purple:      '#6366f1',
  purpleGrad:  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  purpleGlow:  '0 0 20px rgba(99,102,241,0.35)',
  input:       '#0f172a',
  disabled:    '#1e293b',
  disabledText:'#475569',
  error:       { bg: '#450a0a', text: '#f87171', border: '#7f1d1d' },
  success:     { bg: '#052e16', text: '#34d399', border: '#065f46' },
};

function formatDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function BookPage() {
  const [viewYear,     setViewYear]     = useState(() => new Date().getFullYear());
  const [viewMonth,    setViewMonth]    = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookedSlots,  setBookedSlots]  = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form,         setForm]         = useState({ name: '', email: '', company: '', notes: '' });
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');
  const [confirmed,    setConfirmed]    = useState<{ name: string; email: string; date: string; timeSlot: string } | null>(null);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today); maxDate.setDate(today.getDate() + 60);

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function toDateStr(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function isDayDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    return d < today || d > maxDate || d.getDay() === 0 || d.getDay() === 6;
  }

  async function handleDateClick(day: number) {
    if (isDayDisabled(day)) return;
    const ds = toDateStr(day);
    setSelectedDate(ds);
    setSelectedSlot(null);
    setError('');
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/bookings/availability?date=${ds}`);
      if (res.ok) setBookedSlots((await res.json()).bookedSlots ?? []);
    } catch {}
    setLoadingSlots(false);
  }

  function prevMonth() {
    if (viewYear === today.getFullYear() && viewMonth <= today.getMonth()) return;
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null); setSelectedSlot(null);
  }

  function nextMonth() {
    const nM = viewMonth === 11 ? 0 : viewMonth + 1;
    const nY = viewMonth === 11 ? viewYear + 1 : viewYear;
    if (nY > maxDate.getFullYear() || (nY === maxDate.getFullYear() && nM > maxDate.getMonth())) return;
    setViewMonth(nM);
    if (viewMonth === 11) setViewYear(y => y + 1);
    setSelectedDate(null); setSelectedSlot(null);
  }

  async function handleSubmit() {
    if (!selectedDate || !selectedSlot || !form.name.trim() || !form.email.trim()) return;
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    form.name.trim(),
          email:   form.email.trim(),
          company: form.company.trim() || null,
          notes:   form.notes.trim()   || null,
          date:    selectedDate,
          timeSlot: selectedSlot,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmed({ name: form.name.trim(), email: form.email.trim(), date: selectedDate, timeSlot: selectedSlot });
      } else {
        setError(data.error ?? 'Booking failed — please try again.');
        if (res.status === 409) {
          const r = await fetch(`/api/bookings/availability?date=${selectedDate}`).catch(() => null);
          if (r?.ok) setBookedSlots((await r.json()).bookedSlots ?? []);
          setSelectedSlot(null);
        }
      }
    } catch { setError('Network error — please try again.'); }
    setSubmitting(false);
  }

  // ── Shared CSS injected once ───────────────────────────────────────────────
  const globalCss = `
    @keyframes spin { to { transform: rotate(360deg) } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
    .bk-input::placeholder { color: ${T.textDim}; }
    .bk-input:focus { border-color: ${T.purple} !important; outline: none; }
    .bk-cal-day:not(:disabled):hover { background: rgba(99,102,241,0.15) !important; }
    .bk-slot:not(:disabled):hover { border-color: ${T.purple} !important; color: #a5b4fc !important; background: rgba(99,102,241,0.1) !important; }
    @media (max-width: 680px) { .bk-grid { grid-template-columns: 1fr !important; } }
  `;

  // ── Navbar (matches landing page) ─────────────────────────────────────────
  const Nav = () => (
    <header
      style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(51,65,85,0.6)' }}
    >
      <nav style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: T.text, fontWeight: '700', fontSize: '18px', letterSpacing: '-0.02em' }}>
          <div style={{ width: '32px', height: '32px', background: T.purpleGrad, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
            🛡️
          </div>
          ChurnGuard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/#pricing" style={{ color: T.textMuted, textDecoration: 'none', fontSize: '14px' }}>Pricing</Link>
          <Link href="/audit" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Audit</Link>
          <Link href="/auth/login" style={{ color: T.textMuted, textDecoration: 'none', fontSize: '14px', padding: '7px 16px', border: `1px solid ${T.border}`, borderRadius: '8px' }}>Login</Link>
          <Link href="/signup" style={{ background: T.purpleGrad, color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '8px 18px', borderRadius: '8px' }}>Get Started</Link>
        </div>
      </nav>
    </header>
  );

  // ── Success screen ─────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'system-ui,-apple-system,sans-serif', color: T.text }}>
        <style>{globalCss}</style>
        <Nav />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
          <div style={{ background: T.card, border: `1px solid ${T.borderAccent}`, borderRadius: '20px', padding: '52px 44px', maxWidth: '480px', width: '100%', textAlign: 'center', animation: 'fadeUp 0.3s ease', boxShadow: T.purpleGlow }}>
            <div style={{ width: '64px', height: '64px', background: T.success.bg, border: `1px solid ${T.success.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 24px', color: T.success.text }}>
              ✓
            </div>
            <h1 style={{ margin: '0 0 10px', fontSize: '26px', fontWeight: '700', color: T.text }}>You're booked!</h1>
            <p style={{ margin: '0 0 32px', color: T.textMuted, fontSize: '15px', lineHeight: '1.6' }}>
              Confirmation sent to <span style={{ color: T.text, fontWeight: '500' }}>{confirmed.email}</span>
            </p>
            <div style={{ background: '#0f172a', border: `1px solid ${T.border}`, borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '32px' }}>
              {[
                ['📅 Date',     formatDisplay(confirmed.date)],
                ['🕐 Time',     `${confirmed.timeSlot} EST`],
                ['⏱ Duration', '30 minutes'],
              ].map(([label, value], i, arr) => (
                <div key={label} style={{ display: 'flex', gap: '12px', ...(i < arr.length - 1 ? { marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${T.border}` } : {}) }}>
                  <span style={{ fontSize: '13px', color: T.textDim, minWidth: '90px', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: '13px', color: T.text, fontWeight: '500' }}>{value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setConfirmed(null); setSelectedDate(null); setSelectedSlot(null); setForm({ name: '', email: '', company: '', notes: '' }); }}
              style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              ← Book another time
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Calendar cells ─────────────────────────────────────────────────────────
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const canPrev = !(viewYear === today.getFullYear() && viewMonth <= today.getMonth());
  const nextDate = viewMonth === 11 ? new Date(viewYear + 1, 0, 1) : new Date(viewYear, viewMonth + 1, 1);
  const canNext = nextDate <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const phase = !selectedDate ? 'info' : !selectedSlot ? 'slots' : 'form';

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'system-ui,-apple-system,sans-serif', color: T.text }}>
      <style>{globalCss}</style>
      <Nav />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '56px 24px' }}>

        {/* Page title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', border: `1px solid rgba(99,102,241,0.3)`, color: '#a5b4fc', fontSize: '13px', fontWeight: '600', marginBottom: '18px' }}>
            📅 30-Minute Free Demo Call
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(2rem,4vw,2.6rem)', fontWeight: '800', color: T.text, letterSpacing: '-0.02em' }}>
            Book a{' '}
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Demo Call
            </span>
          </h1>
          <p style={{ margin: 0, fontSize: '16px', color: T.textMuted, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
            Walk through your churn metrics and build a custom retention playbook — free, no commitment.
          </p>
        </div>

        {/* 2-col grid */}
        <div className="bk-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

          {/* LEFT — Calendar */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '26px' }}>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <button onClick={prevMonth} disabled={!canPrev} style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: '8px', cursor: canPrev ? 'pointer' : 'not-allowed', fontSize: '17px', color: canPrev ? T.text : T.textDim, fontFamily: 'inherit' }}>‹</button>
              <span style={{ fontSize: '15px', fontWeight: '600', color: T.text }}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <button onClick={nextMonth} disabled={!canNext} style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: '8px', cursor: canNext ? 'pointer' : 'not-allowed', fontSize: '17px', color: canNext ? T.text : T.textDim, fontFamily: 'inherit' }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '6px' }}>
              {DAY_SHORT.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', color: T.textDim, padding: '3px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Date cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {cells.map((day, i) => {
                if (!day) return <div key={i} style={{ aspectRatio: '1' }} />;
                const disabled  = isDayDisabled(day);
                const isSelected = selectedDate === toDateStr(day);
                const isToday   = new Date(viewYear, viewMonth, day).toDateString() === today.toDateString();
                return (
                  <button
                    key={i}
                    className={!disabled && !isSelected ? 'bk-cal-day' : ''}
                    onClick={() => handleDateClick(day)}
                    disabled={disabled}
                    style={{
                      width: '100%', aspectRatio: '1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '8px',
                      border: isToday && !isSelected ? `2px solid ${T.purple}` : '1px solid transparent',
                      background: isSelected ? T.purpleGrad : 'transparent',
                      color: isSelected ? '#fff' : disabled ? T.textDim : T.text,
                      fontSize: '13px',
                      fontWeight: isSelected || isToday ? '600' : '400',
                      cursor: disabled ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                      boxShadow: isSelected ? T.purpleGlow : 'none',
                      transition: 'background 0.12s',
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <p style={{ margin: '16px 0 0', fontSize: '11px', color: T.textDim, textAlign: 'center', letterSpacing: '0.02em' }}>
              Mon–Fri · 9 AM – 5 PM Eastern Time
            </p>
          </div>

          {/* RIGHT — Info / Slots / Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Meeting info (no date selected) */}
            {phase === 'info' && (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '26px', animation: 'fadeUp 0.2s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.15)', border: `1px solid rgba(99,102,241,0.3)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                    📅
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: T.text }}>30-Min Demo Call</div>
                    <div style={{ fontSize: '13px', color: T.textMuted, marginTop: '2px' }}>Free · No commitment required</div>
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: T.textMuted, marginBottom: '14px' }}>What we'll cover:</div>
                {[
                  'Review your current churn & MRR metrics',
                  'Identify your highest-risk customer segments',
                  'Build a custom AI retention playbook',
                  'Full platform walkthrough',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '13px', color: '#cbd5e1', alignItems: 'flex-start' }}>
                    <span style={{ color: '#818cf8', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>✓</span>
                    {item}
                  </div>
                ))}

                <div style={{ marginTop: '22px', padding: '14px 16px', background: 'rgba(99,102,241,0.08)', border: `1px solid rgba(99,102,241,0.25)`, borderRadius: '10px', fontSize: '13px', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👈</span>
                  <span>Select a date on the calendar to see available times</span>
                </div>
              </div>
            )}

            {/* Time slots */}
            {phase === 'slots' && selectedDate && (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '26px', animation: 'fadeUp 0.2s ease' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '600', color: T.text }}>
                  {formatDisplay(selectedDate)}
                </h3>
                <p style={{ margin: '0 0 18px', fontSize: '13px', color: T.textMuted }}>Select a time (Eastern)</p>

                {loadingSlots ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: T.textMuted, fontSize: '13px', padding: '8px 0' }}>
                    <div style={{ width: '16px', height: '16px', border: `2px solid ${T.border}`, borderTop: `2px solid ${T.purple}`, borderRadius: '50%', animation: 'spin 0.9s linear infinite', flexShrink: 0 }} />
                    Checking availability…
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {ALL_SLOTS.map(slot => {
                      const booked = bookedSlots.includes(slot);
                      const sel    = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          className={!booked && !sel ? 'bk-slot' : ''}
                          onClick={() => !booked && setSelectedSlot(slot)}
                          disabled={booked}
                          style={{
                            padding: '10px',
                            border: `1px solid ${sel ? T.purple : booked ? '#1e293b' : T.border}`,
                            borderRadius: '9px',
                            background: sel ? T.purpleGrad : booked ? '#0f172a' : 'transparent',
                            color: sel ? '#fff' : booked ? T.textDim : T.textMuted,
                            fontSize: '13px', fontWeight: '500',
                            cursor: booked ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit',
                            textDecoration: booked ? 'line-through' : 'none',
                            boxShadow: sel ? T.purpleGlow : 'none',
                            transition: 'border-color 0.12s, color 0.12s, background 0.12s',
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}

                {!loadingSlots && bookedSlots.length === ALL_SLOTS.length && (
                  <p style={{ margin: '14px 0 0', fontSize: '13px', color: T.textMuted, textAlign: 'center' }}>
                    All slots are taken — please select another date.
                  </p>
                )}
              </div>
            )}

            {/* Booking form */}
            {phase === 'form' && selectedDate && selectedSlot && (
              <div style={{ background: T.card, border: `1px solid ${T.borderAccent}`, borderRadius: '16px', padding: '26px', animation: 'fadeUp 0.2s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: T.text }}>Your Details</h3>
                    <div style={{ fontSize: '12px', color: T.textMuted }}>
                      {formatDisplay(selectedDate)} · <span style={{ color: '#a5b4fc', fontWeight: '500' }}>{selectedSlot} EST</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSlot(null)}
                    style={{ fontSize: '12px', color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0', flexShrink: 0 }}
                  >
                    ← Change
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {([
                    { key: 'name',    label: 'Name',    type: 'text',  placeholder: 'Your full name',   required: true },
                    { key: 'email',   label: 'Email',   type: 'email', placeholder: 'you@company.com',  required: true },
                    { key: 'company', label: 'Company', type: 'text',  placeholder: 'Your company',     required: false },
                  ] as const).map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: T.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {f.label}{f.required && <span style={{ color: '#f87171', marginLeft: '3px' }}>*</span>}
                        {!f.required && <span style={{ color: T.textDim, fontWeight: '400', textTransform: 'none', marginLeft: '4px' }}>(optional)</span>}
                      </label>
                      <input
                        className="bk-input"
                        type={f.type}
                        value={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        autoFocus={f.key === 'name'}
                        style={{ width: '100%', padding: '10px 14px', background: T.input, border: `1px solid ${T.border}`, borderRadius: '9px', fontSize: '14px', color: T.text, boxSizing: 'border-box', fontFamily: 'inherit' }}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: T.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Biggest churn challenge <span style={{ color: T.textDim, fontWeight: '400', textTransform: 'none' }}>(optional)</span>
                    </label>
                    <textarea
                      className="bk-input"
                      value={form.notes}
                      onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                      placeholder="e.g. High trial-to-paid dropoff, payment failures..."
                      rows={3}
                      style={{ width: '100%', padding: '10px 14px', background: T.input, border: `1px solid ${T.border}`, borderRadius: '9px', fontSize: '14px', color: T.text, boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>

                  {error && (
                    <div style={{ padding: '11px 14px', background: T.error.bg, color: T.error.text, border: `1px solid ${T.error.border}`, borderRadius: '9px', fontSize: '13px' }}>
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !form.name.trim() || !form.email.trim()}
                    style={{
                      padding: '13px',
                      background: submitting || !form.name.trim() || !form.email.trim() ? '#334155' : T.purpleGrad,
                      color: submitting || !form.name.trim() || !form.email.trim() ? T.textDim : '#fff',
                      border: 'none', borderRadius: '10px',
                      fontSize: '15px', fontWeight: '700',
                      cursor: submitting || !form.name.trim() || !form.email.trim() ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      boxShadow: !submitting && form.name.trim() && form.email.trim() ? T.purpleGlow : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {submitting ? 'Confirming…' : 'Confirm Booking →'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
