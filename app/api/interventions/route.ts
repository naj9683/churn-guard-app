import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await req.json();
    
    if (!data.customerId) {
      return Response.json({ error: 'Missing customerId' }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({
      where: {
        id: data.customerId,
        userId: user.id
      }
    });

    if (!customer) {
      return Response.json({ error: 'Customer not found' }, { status: 404 });
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

    return Response.json({ 
      success: true, 
      message: 'Intervention started',
      intervention 
    });

  } catch (error: any) {
    console.error('Intervention error:', error);
    return Response.json({ 
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
