'use client';

import { useState } from 'react';

interface LoadingButtonProps {
  children: React.ReactNode;
  onClick: () => Promise<void>;
  style?: React.CSSProperties;
}

export default function LoadingButton({ children, onClick, style }: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      style={{
        padding: '0.75rem 1.5rem',
        background: isLoading ? '#94a3b8' : '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        ...style
      }}
    >
      {isLoading && (
        <span style={{
          width: '16px',
          height: '16px',
          border: '2px solid white',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {children}
    </button>
  );
}
