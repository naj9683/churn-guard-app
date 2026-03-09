'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WidgetDemoPage() {
  const [showWidget, setShowWidget] = useState(false);

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', padding: '2rem'}}>
      <Link href="/widget-install" style={{color: '#64748b'}}>← Back</Link>
      <h1 style={{color: '#1e293b', marginTop: '2rem'}}>Widget Demo</h1>
      <button 
        onClick={() => setShowWidget(!showWidget)}
        style={{
          padding: '1rem 2rem',
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        {showWidget ? 'Hide Widget' : 'Show Widget'}
      </button>

      {showWidget && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '300px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          zIndex: 999999
        }}>
          <h3 style={{margin: '0 0 12px 0'}}>We miss you!</h3>
          <p style={{margin: '0 0 20px 0'}}>Here's 20% off to help you get back on track!</p>
          <button 
            onClick={() => alert('Claimed!')}
            style={{
              padding: '12px 20px',
              background: 'white',
              color: '#6366f1',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Claim Offer
          </button>
        </div>
      )}
    </div>
  );
}
