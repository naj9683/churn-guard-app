import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const intervention = await prisma.interventionOutcome.findFirst({
      where: { id: params.id, userId: user.id },
      include: {
        customer: {
          select: { name: true, email: true, mrr: true, riskScore: true, plan: true, phone: true },
        },
      },
    });

    if (!intervention) {
      return NextResponse.json({ error: 'Intervention not found' }, { status: 404 });
    }

    // Parse structured execution log from notes field
    let executionLog: any = null;
    if (intervention.notes) {
      try {
        executionLog = JSON.parse(intervention.notes);
      } catch {
        // Legacy text notes — wrap for display
        executionLog = { legacyNotes: intervention.notes };
      }
    }

    return NextResponse.json({ intervention, executionLog });
  } catch (error: any) {
    console.error('Intervention GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
