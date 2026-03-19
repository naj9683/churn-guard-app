import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/sequences/logs?customerId=...
 * Returns sequence enrollment history + step logs for a customer,
 * including SMS sent/failed status from the dunning sequence step 1.
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const customerId = req.nextUrl.searchParams.get('customerId');

  const where = customerId
    ? { userId: user.id, customerId }
    : { userId: user.id };

  const enrollments = await prisma.sequenceEnrollment.findMany({
    where,
    orderBy: { startedAt: 'desc' },
    take: 100,
    include: {
      logs: { orderBy: { executedAt: 'asc' } },
      customer: { select: { email: true, name: true } },
    },
  });

  // Build a flat log view annotated with SMS status
  const flatLogs = enrollments.flatMap(e =>
    e.logs.map(log => ({
      enrollmentId: e.id,
      sequenceType: e.sequenceType,
      customer: e.customer,
      step: log.step,
      action: log.action,
      status: log.status,
      message: log.message,
      executedAt: log.executedAt,
      isSmsStep: e.sequenceType === 'dunning' && log.step === 1,
    }))
  );

  const smsSummary = {
    sent: flatLogs.filter(l => l.isSmsStep && l.status === 'success').length,
    failed: flatLogs.filter(l => l.isSmsStep && l.status === 'failed').length,
    skipped: flatLogs.filter(l => l.isSmsStep && l.status === 'skipped').length,
  };

  return NextResponse.json({ enrollments, logs: flatLogs, smsSummary });
}
