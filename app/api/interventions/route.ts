import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    const data = await req.json();
    
    // Create intervention record
    const intervention = await prisma.interventionOutcome.create({
      data: {
        userId: user.id,
        customerId: data.customerId,
        playbookId: data.playbookId,
        interventionType: data.interventionType,
        triggerEvent: data.triggerEvent,
        mrrAtRisk: data.mrrAtRisk,
        customerSegment: data.customerSegment,
        riskScoreAtStart: data.riskScoreAtStart,
        daysSinceLogin: data.daysSinceLogin,
        plan: data.plan,
        status: 'pending'
      }
    });

    return Response.json(intervention);
  } catch (error) {
    console.error('Create Intervention Error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Update intervention outcome (when customer responds)
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    const { interventionId, status, mrrSaved, mrrLost, notes } = await req.json();
    
    const updateData: any = {
      status,
      notes,
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

    // Update pattern statistics for AI learning
    await updatePatternStats(user.id, intervention);

    return Response.json(intervention);
  } catch (error) {
    console.error('Update Intervention Error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function updatePatternStats(userId: string, intervention: any) {
  try {
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
      await prisma.recommendationPattern.update({
        where: { id: pattern.id },
        data: {
          timesAttempted: { increment: 1 },
          timesSuccessful: intervention.successful ? { increment: 1 } : undefined,
          avgMrrSaved: intervention.successful 
            ? Math.round((pattern.avgMrrSaved * pattern.timesSuccessful + intervention.mrrSaved) / (pattern.timesSuccessful + 1))
            : undefined,
          successRate: (pattern.timesSuccessful + (intervention.successful ? 1 : 0)) / (pattern.timesAttempted + 1),
          lastUsed: new Date()
        }
      });
    } else {
      // Create new pattern
      await prisma.recommendationPattern.create({
        data: {
          userId,
          customerSegment: intervention.customerSegment || 'unknown',
          riskRangeMin: Math.floor(intervention.riskScoreAtStart / 10) * 10,
          riskRangeMax: Math.ceil(intervention.riskScoreAtStart / 10) * 10,
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
