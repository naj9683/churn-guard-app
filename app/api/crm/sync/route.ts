import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { crmType, apiKey } = await request.json();

    if (!crmType || !['salesforce', 'hubspot'].includes(crmType)) {
      return NextResponse.json({ error: 'Invalid CRM type' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { crmType, crmApiKey: apiKey },
    });

    return NextResponse.json({ success: true, connected: true });
  } catch (error) {
    console.error('CRM sync error:', error);
    return NextResponse.json({ error: 'Failed to sync CRM' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { crmType: true, crmApiKey: true },
    });

    const customers = await prisma.customer.findMany({
      where: { userId, riskScore: { gte: 70 } },
      select: { id: true, email: true, name: true, crmId: true, riskScore: true },
    });

    return NextResponse.json({
      connected: !!user?.crmType && !!user?.crmApiKey,
      crmType: user?.crmType,
      customersToSync: customers.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get CRM status' }, { status: 500 });
  }
}