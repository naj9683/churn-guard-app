'use client';

import Link from 'next/link';

export function SignOutButton() {
  return (
    <Link href="/signout" style={{
      padding: '0.75rem 1rem', 
      borderRadius: '0.5rem', 
      color: '#94a3b8', 
      textDecoration: 'none', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem',
      marginTop: 'auto',
      borderTop: '1px solid #334155',
      paddingTop: '1rem'
    }}>
      <span>🚪</span> Sign Out
    </Link>
  );
}
