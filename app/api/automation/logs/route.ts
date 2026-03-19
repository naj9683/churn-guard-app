import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/automation/logs?limit=50&ruleId=...
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { searchParams } = req.nextUrl;
  const limit = Math.min(Number(searchParams.get('limit') ?? '50'), 200);
  const ruleId = searchParams.get('ruleId') ?? undefined;

  const logs = await prisma.automationLog.findMany({
    where: {
      userId: user.id,
      ...(ruleId ? { ruleId } : {}),
    },
    orderBy: { executedAt: 'desc' },
    take: limit,
    include: {
      rule: { select: { name: true, triggerType: true, actionType: true } },
    },
  });

  return NextResponse.json({ logs });
}
