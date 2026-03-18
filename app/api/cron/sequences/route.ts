import { NextRequest, NextResponse } from 'next/server';
import { runSequences } from '@/lib/sequences';

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runSequences();

  console.log(
    `[sequences-cron] processed=${result.processed} succeeded=${result.succeeded} ` +
    `failed=${result.failed} skipped=${result.skipped} completed=${result.completed}`
  );

  return NextResponse.json({ success: true, ...result });
}
