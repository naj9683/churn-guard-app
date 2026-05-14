import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminUser = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!adminUser || adminUser.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
        healthScore: true,
        lastLoginAt: true,
        loginCountThisMonth: true,
        featuresUsed: true,
        riskReason: true,
        csmStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ customers });
  } catch (err) {
    console.error('calc-audit error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
