import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

async function resolveCustomer(id: string, internalUserId: string) {
  // Try primary id first, then externalId
  let customer = await prisma.customer.findFirst({ where: { id, userId: internalUserId } });
  if (!customer) {
    customer = await prisma.customer.findFirst({ where: { externalId: id, userId: internalUserId } });
  }
  return customer;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const customer = await resolveCustomer(params.id, user.id);
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    const [events, sequenceEnrollments] = await Promise.all([
      prisma.event.findMany({
        where: { customerId: customer.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.sequenceEnrollment.findMany({
        where: { customerId: customer.id },
        orderBy: { startedAt: 'desc' },
        include: {
          logs: {
            orderBy: { executedAt: 'desc' },
            take: 10,
          },
        },
      }),
    ]);

    return NextResponse.json({
      customer: {
        id: customer.id,
        externalId: customer.externalId,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        riskScore: customer.riskScore,
        riskReason: customer.riskReason,
        csmStatus: customer.csmStatus,
        mrr: customer.mrr,
        arr: customer.arr,
        plan: customer.plan,
        lastLoginAt: customer.lastLoginAt,
        loginCountThisMonth: customer.loginCountThisMonth,
        featuresUsed: customer.featuresUsed,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },
      events,
      sequenceEnrollments,
      stats: {
        totalEvents: events.length,
        daysSinceJoined: Math.floor(
          (Date.now() - new Date(customer.createdAt).getTime()) / 86_400_000
        ),
      },
    });
  } catch (error: any) {
    console.error('Customer GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const customer = await resolveCustomer(params.id, user.id);
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    const body = await req.json();

    // Whitelist editable fields
    const allowed: Record<string, unknown> = {};
    if ('phone' in body) allowed.phone = body.phone || null;
    if ('name' in body) allowed.name = body.name || null;
    if ('mrr' in body) allowed.mrr = Number(body.mrr) || 0;
    if ('plan' in body) allowed.plan = body.plan || null;

    const updated = await prisma.customer.update({
      where: { id: customer.id },
      data: allowed,
    });

    return NextResponse.json({ customer: { id: updated.id, phone: updated.phone, name: updated.name } });
  } catch (error: any) {
    console.error('Customer PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
