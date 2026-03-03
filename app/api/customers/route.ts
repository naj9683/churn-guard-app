import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, name, company, riskScore, mrr } = body;

    const customer = await prisma.customer.create({
      data: {
        email,
        name,
        company,
        riskScore: parseInt(riskScore) || 0,
        mrr: parseFloat(mrr) || 0,
        lastActive: new Date(),
        status: 'active',
        playbook: riskScore > 70 ? 'ONBOARDING_RESCUE' : 'NONE',
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}