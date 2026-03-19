import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const webhook = await prisma.webhook.findFirst({ where: { id: params.id, userId: user.id } });
    if (!webhook) return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });

    const payload = {
      event: 'webhook.test',
      timestamp: new Date().toISOString(),
      data: { message: 'This is a test delivery from ChurnGuard' }
    };

    let status = 'ok';
    let statusCode = 0;
    try {
      const res = await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-ChurnGuard-Event': 'webhook.test', 'X-ChurnGuard-Secret': webhook.secret || '' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000)
      });
      statusCode = res.status;
      status = res.ok ? 'ok' : 'error';
    } catch {
      status = 'error';
    }

    await prisma.webhook.update({
      where: { id: params.id },
      data: { lastTestedAt: new Date(), lastStatus: status }
    });

    return NextResponse.json({ success: status === 'ok', status, statusCode });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
