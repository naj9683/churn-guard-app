import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();
    
    if (!data.customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({
      where: {
        id: data.customerId,
        userId: user.id
      }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const intervention = await prisma.interventionOutcome.create({
      data: {
        userId: user.id,
        customerId: data.customerId,
        interventionType: data.interventionType || 'discount_offer',
        mrrAtRisk: data.mrrAtRisk || customer.mrr || 0,
        riskScoreAtStart: data.riskScoreAtStart || customer.riskScore || 50,
        customerSegment: data.customerSegment || customer.plan || 'unknown',
        plan: data.plan || customer.plan || 'unknown',
        daysSinceLogin: data.daysSinceLogin || 0,
        status: 'pending'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Intervention started',
      intervention 
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message
    }, { status: 500 });
  }
}