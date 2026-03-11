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
      message: 'Intervention started successfully',
      intervention 
    });

  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Failed to create intervention'
    }, { status: 500 });
  }
}

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
    console.error('PATCH Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update intervention'
    }, { status: 500 });
  }
}

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
    console.error('Pattern update error:', error);
  }
}
