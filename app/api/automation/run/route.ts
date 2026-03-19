import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { runAutomationEngine } from '@/lib/automation-engine';

// POST /api/automation/run — manually trigger automation engine for current user
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { triggerTypes, customerId } = body as {
    triggerTypes?: string[];
    customerId?: string;
  };

  try {
    const result = await runAutomationEngine({
      userId: user.id,
      triggerTypes,
      customerId,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Engine error' }, { status: 500 });
  }
}
