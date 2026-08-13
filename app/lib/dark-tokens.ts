// Dark-theme design tokens for public marketing pages.
// Use these instead of the light-theme design-tokens.ts on public dark pages.
// All values are Tailwind class strings unless noted.

// ── Section layouts ───────────────────────────────────────────────────────────
export const D_SECTION      = 'py-24 lg:py-32 px-4 sm:px-6 lg:px-8';
export const D_SECTION_ALT  = 'py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-slate-800/40';
export const D_CONTAINER    = 'max-w-7xl mx-auto';
export const D_CONTAINER_SM = 'max-w-5xl mx-auto';
export const D_CONTAINER_XS = 'max-w-3xl mx-auto';

// ── Cards ─────────────────────────────────────────────────────────────────────
export const D_CARD       = 'bg-slate-800/60 border border-slate-700/60 rounded-2xl';
export const D_CARD_DARK  = 'bg-slate-900/60 border border-slate-700/60 rounded-2xl';
export const D_CARD_HOVER = 'hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 transition-all duration-200';

// ── Text ─────────────────────────────────────────────────────────────────────
export const D_TEXT    = 'text-white';
export const D_MUTED   = 'text-slate-400';
export const D_FAINT   = 'text-slate-500';
export const D_DIMMER  = 'text-slate-600';

// ── Borders ───────────────────────────────────────────────────────────────────
export const D_BORDER     = 'border-slate-800/60';
export const D_BORDER_MED = 'border-slate-700/60';

// ── Headings ──────────────────────────────────────────────────────────────────
export const D_H2 = 'text-3xl md:text-4xl font-bold text-white';
export const D_H3 = 'font-semibold text-white';

// ── Buttons (full Tailwind class strings) ─────────────────────────────────────
export const dkBtnPrimary = [
  'inline-flex items-center gap-2',
  'bg-indigo-600 hover:bg-indigo-500 text-white',
  'px-7 py-3.5 rounded-xl font-semibold text-[15px]',
  'transition-all duration-200',
  'hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/25',
].join(' ');

export const dkBtnOutline = [
  'inline-flex items-center gap-2',
  'bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white',
  'px-7 py-3.5 rounded-xl font-semibold text-[15px]',
  'transition-all duration-200',
].join(' ');

export const dkBtnSm = [
  'bg-indigo-600 hover:bg-indigo-500 text-white',
  'px-4 py-2 rounded-lg text-sm font-medium',
  'transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20',
].join(' ');

// ── Raw color values (for inline styles / SVG / non-Tailwind contexts) ────────
export const DK_ACCENT   = '#6366f1'; // indigo-500
export const DK_PAGE_BG  = '#020617'; // slate-950
export const DK_BORDER   = 'rgba(30,41,59,0.6)'; // slate-800/60
export const DK_SUCCESS  = '#22c55e'; // green-400
export const DK_DANGER   = '#ef4444'; // red-400
export const DK_WARN     = '#f59e0b'; // amber-400
