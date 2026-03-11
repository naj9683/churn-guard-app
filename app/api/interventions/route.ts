import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('STEP 1: Getting auth...');
    const { userId } = await auth();
    console.log('STEP 1: userId =', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'No userId from auth' }, { status: 401 });
    }

    console.log('STEP 2: Finding user...');
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    console.log('STEP 2: user =', user);
    
    if (!user) {
      return NextResponse.json({ error: 'User not in database' }, { status: 404 });
    }

    console.log('STEP 3: Parsing request...');
    const data = await request.json();
    console.log('STEP 3: data =', data);

    console.log('STEP 4: Finding customer...');
    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, userId: user.id }
    });
    console.log('STEP 4: customer =', customer);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    console.log('STEP 5: Creating intervention...');
    const intervention = await prisma.interventionOutcome.create({
      data: {
        userId: user.id,
        customerId: data.customerId,
        interventionType: data.interventionType || 'discount_offer',
        mrrAtRisk: data.mrrAtRisk || 0,
        riskScoreAtStart: data.riskScoreAtStart || 50,
        customerSegment: data.customerSegment || 'unknown',
        plan: data.plan || 'unknown',
        daysSinceLogin: data.daysSinceLogin || 0,
        status: 'pending'
      }
    });
    console.log('STEP 5: SUCCESS!', intervention.id);

    return NextResponse.json({ success: true, intervention });

  } catch (error: any) {
    console.error('ERROR at step:', error.message);
    console.error('Full error:', error);
    return NextResponse.json({ 
      error: 'Failed', 
      message: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
