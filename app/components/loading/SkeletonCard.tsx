'use client';

export default function SkeletonCard() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      border: '1px solid #e2e8f0',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }}>
      <div style={{
        height: '16px',
        background: '#e2e8f0',
        borderRadius: '4px',
        width: '60%',
        marginBottom: '1rem'
      }} />
      <div style={{
        height: '32px',
        background: '#e2e8f0',
        borderRadius: '4px',
        width: '40%'
      }} />
    </div>
  );
}
