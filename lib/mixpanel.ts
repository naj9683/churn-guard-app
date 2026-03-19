/**
 * ChurnGuard Mixpanel Integration
 *
 * Uses the mixpanel-browser npm package (not CDN) so initialization is
 * synchronous and events are never silently dropped.
 *
 * Segment → behavioral automation (sequences, playbook triggers)
 * Mixpanel → product analytics dashboards (funnels, retention, power users)
 */

import mixpanel from 'mixpanel-browser';

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '';
let _initialized = false;

export function initMixpanel() {
  if (typeof window === 'undefined') return; // SSR guard
  if (_initialized) return;
  if (!TOKEN) {
    console.warn('[Mixpanel] NEXT_PUBLIC_MIXPANEL_TOKEN not set — tracking disabled');
    return;
  }

  mixpanel.init(TOKEN, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: false, // we fire page views manually
    persistence: 'localStorage',
  });

  _initialized = true;
  console.log('[Mixpanel] Initialized with token', TOKEN.slice(0, 8) + '…');
}

function safe(fn: () => void) {
  if (typeof window === 'undefined' || !_initialized) return;
  try { fn(); } catch (e) { console.error('[Mixpanel] error', e); }
}

/** Identify the current user — call once after sign-in */
export function mpIdentify(userId: string, traits: Record<string, unknown> = {}) {
  safe(() => {
    mixpanel.identify(userId);
    if (Object.keys(traits).length > 0) {
      mixpanel.people.set({
        $email: traits.email,
        $name: traits.name,
        ...traits,
      });
    }
    console.log('[Mixpanel] identify:', userId, traits);
  });
}

/** Register super-properties sent with every subsequent event */
export function mpRegister(properties: Record<string, unknown>) {
  safe(() => mixpanel.register(properties));
}

/** Track a named event */
export function mpTrack(event: string, properties: Record<string, unknown> = {}) {
  safe(() => {
    mixpanel.track(event, { ...properties, source: 'churnguard_web' });
    console.log('[Mixpanel] track:', event, properties);
  });
}

/** Track a page view */
export function mpPage(pageName: string, properties: Record<string, unknown> = {}) {
  mpTrack('Page Viewed', { page: pageName, ...properties });
}

// ─── Typed event helpers ───────────────────────────────────────────────────────

export const MP = {
  // Funnel
  firstDashboardView:       () => mpTrack('First Dashboard View'),
  firstCustomerAdded:       (mrr: number, plan: string) => mpTrack('First Customer Added', { mrr, plan }),
  firstInterventionCreated: () => mpTrack('First Intervention Created'),
  userSignedUp:             (traits: Record<string, unknown>) => mpTrack('User Signed Up', traits),

  // Feature adoption
  riskScoreViewed:          (customerId: string, riskScore: number) => mpTrack('Risk Score Viewed', { customerId, riskScore }),
  riskAnalysisRun:          (customersAnalyzed: number) => mpTrack('Risk Analysis Run', { customersAnalyzed }),
  interventionCreated:      (type: string, customerId: string) => mpTrack('Intervention Created', { type, customerId }),
  playbookUsed:             (playbookName: string, trigger: string) => mpTrack('Playbook Used', { playbookName, trigger }),
  emailSent:                (campaignType: string) => mpTrack('Email Sent', { campaignType }),
  sequenceTriggered:        (sequenceType: string) => mpTrack('Sequence Triggered', { sequenceType }),

  // Retention cohort anchors
  dashboardVisit:           (visitCount: number) => mpTrack('Dashboard Visit', { visitCount }),

  // Power user signals
  analyticsViewed:          () => mpTrack('Analytics Viewed'),
  playbookCreated:          (trigger: string) => mpTrack('Playbook Created', { trigger }),
  integrationConnected:     (provider: string) => mpTrack('Integration Connected', { provider }),
  exportDownloaded:         (format: string) => mpTrack('Export Downloaded', { format }),
  customerSearched:         () => mpTrack('Customer Searched'),
};
