import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET handler - list all interventions
export async function GET() {
  try {
    const interventions = await prisma.interventionOutcome.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    return NextResponse.json({ 
      interventions,
      count: interventions.length
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch interventions' }, { status: 500 });
  }
}

// POST handler - create new intervention
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
    
    if (!data.customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
    }
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

    return NextResponse.json({ 
      success: true, 
      message: 'Intervention started successfully',
      intervention 
    });
  } catch (error: any) {
    console.error('ERROR:', error.message);
    return NextResponse.json({ 
      error: 'Failed', 
      message: error.message,
      code: error.code 
    }, { status: 500 });
  }
}

// PATCH handler - update intervention status
export async function PATCH(request: Request) {
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
    
    const body = await request.json();
    const { interventionId, status, mrrSaved, mrrLost, notes } = body;
    
    if (!interventionId) {
      return NextResponse.json({ error: 'Missing interventionId' }, { status: 400 });
    }
    
    const updateData: any = {
      status,
      notes: notes || '',
      completedAt: new Date()
    };
    
    if (status === 'saved') {
      updateData.mrrSaved = mrrSaved || 0;
      updateData.successful = true;
    } else if (status === 'churned') {
      updateData.mrrLost = mrrLost || 0;
      updateData.churnedAt = new Date();
      updateData.successful = false;
    }
    
    const intervention = await prisma.interventionOutcome.update({
      where: { id: interventionId, userId: user.id },
      data: updateData
    });
    
    await updatePatternStats(user.id, intervention);
    
    return NextResponse.json({ success: true, intervention });
    
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: error.message
    }, { status: 500 });
  }
}

// Helper function to update pattern statistics
async function updatePatternStats(userId: string, intervention: any) {
  try {
    if (!intervention.customerSegment || !intervention.interventionType) {
      return;
    }
    
    const pattern = await prisma.recommendationPattern.findFirst({
      where: {
        userId,
        customerSegment: intervention.customerSegment,
        recommendedAction: intervention.interventionType,
        riskRangeMin: { lte: intervention.riskScoreAtStart },
        riskRangeMax: { gte: intervention.riskScoreAtStart }
      }
    });
    
    if (pattern) {
      const newAttempts = pattern.timesAttempted + 1;
      const newSuccessful = pattern.timesSuccessful + (intervention.successful ? 1 : 0);
      
      await prisma.recommendationPattern.update({
        where: { id: pattern.id },
        data: {
          timesAttempted: newAttempts,
          timesSuccessful: newSuccessful,
          successRate: newSuccessful / newAttempts,
          lastUsed: new Date()
        }
      });
    } else if (intervention.successful !== null) {
      await prisma.recommendationPattern.create({
        data: {
          userId,
          customerSegment: intervention.customerSegment || 'unknown',
          riskRangeMin: Math.floor((intervention.riskScoreAtStart || 50) / 10) * 10,
          riskRangeMax: Math.ceil((intervention.riskScoreAtStart || 50) / 10) * 10,
          plan: intervention.plan,
          recommendedAction: intervention.interventionType,
          timesAttempted: 1,
          timesSuccessful: intervention.successful ? 1 : 0,
          avgMrrSaved: intervention.mrrSaved || 0,
          successRate: intervention.successful ? 1 : 0
        }
      });
    }
  } catch (error) {
    console.error('Pattern error:', error);
  }
}