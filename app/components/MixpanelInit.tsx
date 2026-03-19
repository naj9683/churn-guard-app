'use client';

import { useEffect } from 'react';
import { initMixpanel, mpTrack } from '@/lib/mixpanel';

/** Boots the Mixpanel SDK once per browser session. Rendered in root layout. */
export default function MixpanelInit() {
  useEffect(() => {
    initMixpanel();
    // Fire a session-start event so Mixpanel Live View shows something immediately
    mpTrack('Session Started', { url: window.location.pathname });
  }, []);
  return null;
}
