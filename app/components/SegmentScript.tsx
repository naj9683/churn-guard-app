'use client';

import { useEffect } from 'react';

const WRITE_KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

/**
 * Initializes the Segment Analytics.js stub and loads the SDK.
 * Must be rendered in the layout so it runs on every page.
 *
 * Why a client component instead of an inline <Script> in layout.tsx:
 *  - The inline IIFE snippet had a syntax error (}()}(); vs }}();)
 *    that silently prevented window.analytics from being created.
 *  - This approach uses TypeScript-safe code with no IIFE risk.
 *  - useLayoutEffect/useEffect runs before React paint, so the stub is
 *    ready before any child track() calls from page components.
 */
export default function SegmentScript() {
  useEffect(() => {
    if (!WRITE_KEY) {
      console.warn('[ChurnGuard Analytics] NEXT_PUBLIC_SEGMENT_WRITE_KEY is not set — Segment browser tracking disabled.');
      return;
    }

    const win = window as any;

    // If already initialised (e.g. hot-reload), skip
    if (win.analytics?.initialized || win.analytics?.invoked) {
      console.log('[ChurnGuard Analytics] Segment already initialised.');
      return;
    }

    // Build the standard Analytics.js stub so track/page/identify
    // calls made before the CDN script loads are queued correctly.
    const analytics: any = win.analytics = win.analytics || [];

    analytics.invoked = true;
    analytics.methods = [
      'trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview',
      'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug',
      'page', 'screen', 'once', 'off', 'on', 'addSourceMiddleware',
      'addIntegrationMiddleware', 'setAnonymousId', 'addDestinationMiddleware',
      'register',
    ];

    analytics.factory = function (method: string) {
      return function () {
        if (win.analytics.initialized) {
          return win.analytics[method].apply(win.analytics, arguments);
        }
        const args: any[] = Array.prototype.slice.call(arguments);
        if (['track', 'screen', 'alias', 'group', 'page', 'identify'].includes(method)) {
          const canonical = document.querySelector("link[rel='canonical']");
          args.push({
            __t: 'bpc',
            c: canonical?.getAttribute('href') ?? undefined,
            p: location.pathname,
            u: location.href,
            s: location.search,
            t: document.title,
            r: document.referrer,
          });
        }
        args.unshift(method);
        analytics.push(args);
        return analytics;
      };
    };

    for (const method of analytics.methods) {
      analytics[method] = analytics.factory(method);
    }

    analytics.load = function (key: string, options?: object) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-global-segment-analytics-key', 'analytics');
      script.src = `https://cdn.segment.com/analytics.js/v1/${key}/analytics.min.js`;
      script.onload = () => console.log('[ChurnGuard Analytics] Segment SDK loaded successfully.');
      script.onerror = () => console.error('[ChurnGuard Analytics] Failed to load Segment SDK — check write key and network.');
      const first = document.getElementsByTagName('script')[0];
      first.parentNode!.insertBefore(script, first);
      analytics._loadOptions = options;
    };

    analytics._writeKey = WRITE_KEY;
    analytics.SNIPPET_VERSION = '5.2.1';

    // Load SDK and fire initial page view
    analytics.load(WRITE_KEY);
    analytics.page();

    console.log(`[ChurnGuard Analytics] Segment initialised with key ${WRITE_KEY.slice(0, 8)}…`);
  }, []);

  return null;
}
