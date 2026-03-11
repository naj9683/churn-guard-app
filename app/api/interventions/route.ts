import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  console.log('=== POST /api/interventions ===');
  
  try {
    const { userId } = await auth();
    console.log('Auth userId:', userId);
    
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    
    console.log('Found user:', user);
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await req.json();
    console.log('Request data:', data);

    if (!data.customerId) {
      return Response.json({ error: 'Missing customerId' }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({
      where: {
        id: data.customerId,
        userId: user.id
      }
    });

    console.log('Found customer:', customer);

    if (!customer) {
      return Response.json({ error: 'Customer not found' }, { status: 404 });
    }

    console.log('Creating intervention...');
    
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

    console.log('Created intervention:', intervention.id);
    
    return Response.json({ 
      success: true, 
      message: 'Intervention started successfully',
      intervention 
    });

  } catch (error: any) {
    console.error('=== INTERVENTION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    return Response.json({ 
      success: false,
      error: 'Failed to create intervention',
      details: error.message,
      code: error.code || 'UNKNOWN'
    }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    console.log('PATCH /api/interventions - Starting...');
    
    const { userId } = await auth();
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    console.log('PATCH body:', body);
    
    const { interventionId, status, mrrSaved, mrrLost, notes } = body;
    
    if (!interventionId) {
      return Response.json({ error: 'Missing interventionId' }, { status: 400 });
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

    console.log('Intervention updated:', intervention.id);
    
    await updatePatternStats(user.id, intervention);
    
    return Response.json({ success: true, intervention });
    
  } catch (error: any) {
    console.error('Update Intervention Error:', error);
    return Response.json({ 
      error: 'Internal error',
      details: error.message 
    }, { status: 500 });
  }
}

async function updatePatternStats(userId: string, intervention: any) {
  try {
    if (!intervention.customerSegment || !intervention.interventionType) {
      console.log('Missing data for pattern update, skipping');
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
      const newSuccessRate = newSuccessful / newAttempts;
      
      await prisma.recommendationPattern.update({
        where: { id: pattern.id },
        data: {
          timesAttempted: newAttempts,
          timesSuccessful: newSuccessful,
          successRate: newSuccessRate,
          lastUsed: new Date()
        }
      });
      console.log('Pattern updated:', pattern.id);
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
      console.log('New pattern created');
    }
  } catch (error) {
    console.error('Pattern update error:', error);
  }
}
