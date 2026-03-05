import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { event, customerEmail, metadata } = body;

    if (!event || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create customer (only using fields that exist)
    let customer = await prisma.customer.findFirst({
      where: {
        userId,
        email: customerEmail,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          userId,
          email: customerEmail,
          name: metadata?.name || customerEmail.split('@')[0],
          riskScore: 0,
          mrr: metadata?.mrr || 0,
          arr: (metadata?.mrr || 0) * 12,
        },
      });
    }

    // Create activity log (model name is 'activity' not 'userActivity')
    await prisma.activity.create({
      data: {
        userId,
        type: event,
        customerId: customer.id,
        metadata: metadata || {},
      },
    });

    // Update customer risk score if provided
    if (metadata?.riskScore !== undefined) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { riskScore: metadata.riskScore },
      });
    }

    return NextResponse.json({
      success: true,
      customerId: customer.id,
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}