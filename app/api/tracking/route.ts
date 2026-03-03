import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { playbookType, customerId } = await req.json();

    const user = await prisma.user.findFirst({
      where: { /* clerk mapping */ },
      include: { playbooks: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const playbook = user.playbooks.find(p => p.type === playbookType && p.active);
    
    if (!playbook) {
      return NextResponse.json({ error: 'Playbook not active' }, { status: 400 });
    }

    // Execute playbook action
    const event = await prisma.playbookEvent.create({
      data: {
        userId: user.id,
        playbookType,
        customerId,
        status: 'action_sent',
        message: `${playbookType} executed`
      }
    });

    // TODO: Send actual email/Slack here

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Trigger error:', error);
    return NextResponse.json({ error: 'Failed to trigger' }, { status: 500 });
  }
}