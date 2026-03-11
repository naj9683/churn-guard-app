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

    // Validate required fields
    if (!data.customerId) {
      return Response.json({ error: 'Missing customerId' }, { status: 400 });
    }

    // Get customer to verify ownership and get details
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
    
    // Create the intervention
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
    console.error('Error stack:', error.stack);
    
    return Response.json({ 
      success: false,
      error: 'Failed to create intervention',
      details: error.message,
      code: error.code || 'UNKNOWN'
    }, { status: 500 });
  }
}
