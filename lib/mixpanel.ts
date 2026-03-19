/**
 * ChurnGuard Mixpanel Integration
 *
 * Mixpanel is used for product analytics dashboards:
 *  - Conversion funnels (Signup → Dashboard → Customer Added → Intervention)
 *  - Feature adoption tracking
 *  - D1/D7/D30 retention cohorts
 *  - Power user identification
 *
 * Segment handles behavioral automation triggers.
 * Mixpanel handles analytical insight dashboards.
 */

let _initialized = false;

function getMixpanel() {
  if (typeof window === 'undefined') return null;
  return (window as any).mixpanel ?? null;
}

export function initMixpanel() {
  if (typeof window === 'undefined') return;
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) {
    console.warn('[Mixpanel] NEXT_PUBLIC_MIXPANEL_TOKEN not set — tracking disabled');
    return;
  }
  if (_initialized) return;

  const win = window as any;

  // Mixpanel snippet — sets up stub queue before SDK loads
  (function (c, a) {
    if (!a.__SV) {
      let b: any;
      window.addEventListener &&
        window.addEventListener('error', function () {}, true);
      let d: any = a;
      const e = function (f: any) {
        return function () {
          d.push([f].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      d._i = [];
      d.init = function (f: any, g: any, h: any) {
        const m = function (n: any, o: any) {
          const p = o.split('.');
          p.length === 2 && ((n = n[p[0]]), (o = p[1]));
          n[o] = function () {
            n.push([o].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        let q = d;
        h !== void 0 ? ((d[h] = []), (q = d[h])) : d._i.push([f, g, h]);
        q.__SV = 1.2;
        q.people = q.people || {};
        'disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove'
          .split(' ')
          .forEach(function (r) {
            m(q, r);
          });
        d._i.push([f, g, h]);
      };
      d.__SV = 1.2;
      b = c.createElement('script');
      b.type = 'text/javascript';
      b.async = true;
      b.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
      b.onload = () => console.log('[Mixpanel] SDK loaded');
      b.onerror = () => console.error('[Mixpanel] Failed to load SDK');
      const i = c.getElementsByTagName('script')[0];
      i.parentNode!.insertBefore(b, i);
    }
  })(document, (win.mixpanel = win.mixpanel || []));

  win.mixpanel.init(token, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: false, // we fire page views manually
    persistence: 'localStorage',
    ignore_dnt: false,
  });

  _initialized = true;
  console.log(`[Mixpanel] Initialized with token ${token.slice(0, 8)}…`);
}

/** Identify the current user. Call once after sign-in. */
export function mpIdentify(userId: string, traits: Record<string, unknown> = {}) {
  const mp = getMixpanel();
  if (!mp) return;
  mp.identify(userId);
  if (Object.keys(traits).length > 0) {
    mp.people.set({
      $email: traits.email,
      $name: traits.name,
      ...traits,
    });
  }
}

/** Track a named event */
export function mpTrack(event: string, properties: Record<string, unknown> = {}) {
  const mp = getMixpanel();
  if (!mp) return;
  mp.track(event, {
    ...properties,
    source: 'churnguard_web',
    timestamp: new Date().toISOString(),
  });
}

/** Register super-properties that are sent with every event */
export function mpRegister(properties: Record<string, unknown>) {
  const mp = getMixpanel();
  if (!mp) return;
  mp.register(properties);
}

/** Track a page view */
export function mpPage(pageName: string, properties: Record<string, unknown> = {}) {
  mpTrack('Page Viewed', { page: pageName, ...properties });
}

// ─── Funnel events ────────────────────────────────────────────────────────────

export const MP = {
  // Acquisition / activation funnel
  userSignedUp:           (traits: Record<string, unknown>) => mpTrack('User Signed Up', traits),
  firstDashboardView:     () => mpTrack('First Dashboard View'),
  firstCustomerAdded:     (mrr: number, plan: string) => mpTrack('First Customer Added', { mrr, plan }),
  firstInterventionCreated: () => mpTrack('First Intervention Created'),

  // Feature adoption
  riskScoreViewed:        (customerId: string, riskScore: number) =>
                            mpTrack('Risk Score Viewed', { customerId, riskScore }),
  riskAnalysisRun:        (customersAnalyzed: number) =>
                            mpTrack('Risk Analysis Run', { customersAnalyzed }),
  interventionCreated:    (type: string, customerId: string) =>
                            mpTrack('Intervention Created', { type, customerId }),
  playbookUsed:           (playbookName: string, trigger: string) =>
                            mpTrack('Playbook Used', { playbookName, trigger }),
  emailSent:              (campaignType: string) =>
                            mpTrack('Email Sent', { campaignType }),
  sequenceTriggered:      (sequenceType: string) =>
                            mpTrack('Sequence Triggered', { sequenceType }),

  // Retention cohort anchors (fire once per session for D1/D7/D30 computation)
  dashboardVisit:         (visitCount: number) =>
                            mpTrack('Dashboard Visit', { visitCount }),

  // Power user signals
  customerSearched:       () => mpTrack('Customer Searched'),
  analyticsViewed:        () => mpTrack('Analytics Viewed'),
  playbookCreated:        (trigger: string) => mpTrack('Playbook Created', { trigger }),
  integrationConnected:   (provider: string) => mpTrack('Integration Connected', { provider }),
  exportDownloaded:       (format: string) => mpTrack('Export Downloaded', { format }),
};
