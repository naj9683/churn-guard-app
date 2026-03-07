import Link from 'next/link';

export default function BackToDashboard() {
  return (
    <div style={{ 
      padding: '1rem 2rem', 
      background: '#1e293b', 
      borderBottom: '1px solid #334155',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Link 
        href="/dashboard" 
        style={{ 
          color: '#94a3b8', 
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem'
        }}
      >
        <span>←</span> Back to Dashboard
      </Link>
    </div>
  );
}
