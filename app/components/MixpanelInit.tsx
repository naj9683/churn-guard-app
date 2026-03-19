'use client';

import { useEffect } from 'react';
import { initMixpanel } from '@/lib/mixpanel';

/** Bootstraps the Mixpanel SDK once on mount. Rendered in root layout. */
export default function MixpanelInit() {
  useEffect(() => {
    initMixpanel();
  }, []);
  return null;
}
