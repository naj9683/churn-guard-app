/**
 * ChurnGuard Analytics
 *
 * Two event paths:
 *  1. Server-side: POST /api/events/segment → updates Customer fields in DB,
 *     then forwards to Segment HTTP API (requires SEGMENT_WRITE_KEY env var).
 *  2. Browser-side: window.analytics (Segment Analytics.js SDK) sends events
 *     directly to Segment. Initialized by <SegmentScript> in layout.tsx.
 *
 * Race-condition handling:
 *  React runs child effects before parent effects, so page-level track() calls
 *  can fire before SegmentScript's useEffect initializes window.analytics.
 *  We buffer those calls and flush them as soon as the SDK stub is ready.
 */

type QueuedCall = { type: 'identify' | 'track' | 'page'; args: any[] };
const _queue: QueuedCall[] = [];
let _flushScheduled = false;

function flushQueue() {
  const win = window as any;
  if (!win.analytics) {
    // SDK not ready yet — retry shortly
    if (!_flushScheduled) {
      _flushScheduled = true;
      setTimeout(() => {
        _flushScheduled = false;
        flushQueue();
      }, 200);
    }
    return;
  }
  while (_queue.length > 0) {
    const call = _queue.shift()!;
    if (call.type === 'identify') win.analytics.identify(...call.args);
    else if (call.type === 'track')  win.analytics.track(...call.args);
    else if (call.type === 'page')   win.analytics.page(...call.args);
  }
}

function sdkCall(type: QueuedCall['type'], args: any[]) {
  if (typeof window === 'undefined') return;
  const win = window as any;
  if (win.analytics) {
    // SDK stub is ready — call directly (it queues internally until CDN script loads)
    if (type === 'identify') win.analytics.identify(...args);
    else if (type === 'track')  win.analytics.track(...args);
    else if (type === 'page')   win.analytics.page(...args);
  } else {
    // Stub not yet created — buffer and retry
    _queue.push({ type, args });
    flushQueue();
  }
}

function postEvent(event: string, properties: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  fetch('/api/events/segment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, properties }),
  }).catch(() => {});
}

/** Identify the current user in Segment. Call once after sign-in. */
export function identify(userId: string, traits: Record<string, unknown> = {}) {
  sdkCall('identify', [userId, traits]);
}

/** Track a named event with optional properties */
export function track(event: string, properties: Record<string, unknown> = {}) {
  postEvent(event, properties);
  sdkCall('track', [event, properties]);
}

/** Track a page view */
export function page(pageName: string, properties: Record<string, unknown> = {}) {
  postEvent(`${pageName} Viewed`, { ...properties, page: pageName });
  sdkCall('page', [pageName, properties]);
}
