import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all users
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        email: true,
        createdAt: true,
        stripeCustomerId: true,
        mrr: true,
      },
    });

    // Get revenue metrics
    const revenueMetrics = await prisma.revenueMetrics.findMany();
    const totalMrr = revenueMetrics.reduce((sum, r) => sum + (r.totalMrr || 0), 0);

    // Get customer count
    const customerCount = await prisma.customer.count();

    return NextResponse.json({
      users,
      subscriptions: users.filter(u => u.stripeCustomerId),
      revenue: {
        mrr: totalMrr,
        customerCount,
        totalRevenue: totalMrr * 12, // Estimated ARR
      },
    });
  } catch (error) {
    console.error('Admin data error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
  }
}