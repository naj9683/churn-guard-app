import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const check = await requireAdmin();
    if ('error' in check) return check.error;

    const targetUserId = req.nextUrl.searchParams.get('userId');

    if (!targetUserId) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          company: true,
          createdAt: true,
          _count: { select: { customers: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ users });
    }

    const customers = await prisma.customer.findMany({
      where: { userId: targetUserId },
      orderBy: { riskScore: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        mrr: true,
        arr: true,
        plan: true,
        riskScore: true,
        lastLoginAt: true,
        loginCountThisMonth: true,
        featuresUsed: true,
        riskReason: true,
        csmStatus: true,
        createdAt: true,
        updatedAt: true,
        events: {
          select: { event: true, timestamp: true },
          orderBy: { timestamp: 'desc' },
          take: 30,
        },
      },
    });

    return NextResponse.json({ customers });
  } catch (err) {
    console.error('calc-audit error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
