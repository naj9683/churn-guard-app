import { NextResponse } from 'next/server';
import { runAllPlaybooks } from '@/lib/playbooks';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await runAllPlaybooks();
    return NextResponse.json({ success: true, message: 'Playbooks executed' });
  } catch (error) {
    console.error('Playbook execution error:', error);
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 });
  }
}