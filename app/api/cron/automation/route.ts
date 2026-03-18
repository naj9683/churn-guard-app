import { NextRequest, NextResponse } from 'next/server';
import { runAutomationEngine } from '@/lib/automation-engine';

/**
 * GET /api/cron/automation
 * Runs the automation trigger engine for all users, every hour.
 * Checks risk_threshold and feature_abandonment rules.
 * payment_failed is also checked here using the Event table (no Stripe API call needed).
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runAutomationEngine({
    triggerTypes: ['risk_threshold', 'payment_failed', 'feature_abandonment'],
  });

  console.log(`[automation-cron] rules=${result.rulesEvaluated} fired=${result.fired} skipped=${result.skipped} failed=${result.failed}`);

  return NextResponse.json({ success: true, ...result });
}
