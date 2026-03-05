import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customerId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { crmType: true, crmApiKey: true },
    });

    if (!user?.crmType) {
      return NextResponse.json({ error: 'CRM not configured' }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({
      where: { id: customerId, userId },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'CRM sync ready',
      healthScore: customer.healthScore,
      riskScore: customer.riskScore,
    });
  } catch (error) {
    console.error('CRM update error:', error);
    return NextResponse.json({ error: 'Failed to update CRM' }, { status: 500 });
  }
}