'use client';

import { useState } from 'react';
import LoadingButton from './loading/LoadingButton';

interface ScheduleMeetingButtonProps {
  customerId: string;
  customerEmail: string;
  customerName: string;
  onScheduled?: () => void;
}

export default function ScheduleMeetingButton({ 
  customerId, 
  customerEmail, 
  customerName,
  onScheduled 
}: ScheduleMeetingButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [meetingType, setMeetingType] = useState('check_in');
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSchedule = async () => {
    if (!scheduledDate) {
      alert('Please select a date and time');
      return;
    }

    const response = await fetch('/api/calendar/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        meetingType,
        scheduledAt: scheduledDate,
        notes
      })
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Meeting scheduled! ${data.calendlyLink ? 'Calendly link: ' + data.calendlyLink : ''}`);
      setShowModal(false);
      onScheduled?.();
    } else {
      alert('Failed to schedule meeting');
    }
  };

  if (!showModal) {
    return (
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '0.5rem 1rem',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        📅 Schedule Meeting
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        width: '400px',
        maxWidth: '90%'
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Schedule Meeting with {customerName}</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Meeting Type
          </label>
          <select
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #d1d5db'
            }}
          >
            <option value="check_in">Check-in Call (15 min)</option>
            <option value="training">Training Session (30 min)</option>
            <option value="ceo_call">CEO Call (30 min)</option>
            <option value="demo">Product Demo (45 min)</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Date & Time
          </label>
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #d1d5db'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Meeting agenda..."
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #d1d5db',
              minHeight: '80px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowModal(false)}
            style={{
              padding: '0.5rem 1rem',
              background: '#e5e7eb',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <LoadingButton onClick={handleSchedule}>
            Schedule
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
