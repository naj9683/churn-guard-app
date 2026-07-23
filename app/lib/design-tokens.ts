import type React from 'react';

export const ACCENT        = '#6d28d9';
export const ACCENT_BG     = '#ede9fe';
export const ACCENT_BORDER = 'rgba(109,40,217,0.2)';
export const BORDER        = 'rgba(0,0,0,0.08)';
export const BORDER_MED    = 'rgba(0,0,0,0.13)';
export const TEXT          = '#111827';
export const MUTED         = '#6b7280';
export const FAINT         = '#9ca3af';
export const WHITE         = '#ffffff';
export const PAGE_BG       = '#f9fafb';
export const SUCCESS       = '#059669';
export const SUCCESS_BG    = '#ecfdf5';
export const SUCCESS_BORD  = 'rgba(5,150,105,0.2)';
export const DANGER        = '#dc2626';
export const DANGER_BG     = '#fef2f2';
export const DANGER_BORD   = 'rgba(220,38,38,0.2)';
export const WARN          = '#d97706';
export const WARN_BG       = '#fffbeb';
export const WARN_BORD     = 'rgba(217,119,6,0.2)';
export const FONT          = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const btnPrimary: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 500,
  color: WHITE,
  textDecoration: 'none',
  padding: '11px 26px',
  borderRadius: '6px',
  background: ACCENT,
  transition: 'opacity 150ms',
  cursor: 'pointer',
  border: 'none',
};

export const btnOutline: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 500,
  color: TEXT,
  textDecoration: 'none',
  padding: '10px 26px',
  borderRadius: '6px',
  background: WHITE,
  border: `1px solid ${BORDER_MED}`,
  transition: 'border-color 150ms',
  cursor: 'pointer',
};
