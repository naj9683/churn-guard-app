import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Audit email sequence disabled — leads are captured via HubSpot, no emails sent
  return NextResponse.json({ success: true, sent: 0, skipped: 0, failed: 0, disabled: true });
}
