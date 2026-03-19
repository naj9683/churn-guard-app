'use client';

import Link from 'next/link';

export default function LoginButton() {
  return (
    <Link
      href="/auth/login"
      style={{
        padding: '0.5rem 1rem',
        background: 'transparent',
        color: '#94a3b8',
        border: '1px solid #334155',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        textDecoration: 'none',
        fontFamily: 'inherit',
      }}
    >
      Login
    </Link>
  );
}
