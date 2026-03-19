import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const check = await requireAdmin();
  if ('error' in check) return check.error;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'activity';

  if (type === 'alerts') {
    const logs = await prisma.alertLog.findMany({
      orderBy: { sentAt: 'desc' }, take: 50,
      select: { id: true, type: true, message: true, sentAt: true, userId: true, customerId: true }
    });
    return NextResponse.json({ logs });
  }

  if (type === 'activity') {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' }, take: 50,
      select: { id: true, type: true, description: true, createdAt: true, userId: true, customerId: true }
    });
    return NextResponse.json({ logs });
  }

  if (type === 'webhooks') {
    const webhooks = await prisma.webhook.findMany({
      where: { lastStatus: { not: null } },
      orderBy: { lastTestedAt: 'desc' }, take: 50,
      select: { id: true, url: true, label: true, lastStatus: true, lastTestedAt: true, active: true }
    });
    return NextResponse.json({ logs: webhooks });
  }

  return NextResponse.json({ error: 'invalid type' }, { status: 400 });
}
