import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() { 
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has playbooks
    const existingCount = await prisma.playbook.count({
      where: { userId }
    });

    if (existingCount > 0) {
      return NextResponse.json({ message: 'Playbooks already exist' });
    }

    // Create 3 default playbooks
    const playbooks = await prisma.playbook.createMany({
      data: [
        {
          userId,
          name: 'Onboarding Rescue',
          description: 'Saves new users who have not engaged within 3 days',
          trigger: 'HIGH_RISK',
          actions: JSON.stringify({
            sendSlack: true,
            sendEmail: true,
            message: 'New user needs help with onboarding!'
          }),
          isActive: true,
        },
        {
          userId,
          name: 'Silent Quitter Detection',
          description: 'Detects and re-engages users showing churn signals',
          trigger: 'CRITICAL_RISK',
          actions: JSON.stringify({
            sendSlack: true,
            createTask: true,
            message: 'High-value customer at risk of churning!'
          }),
          isActive: true,
        },
        {
          userId,
          name: 'Payment Savior',
          description: 'Handles failed payments and billing issues automatically',
          trigger: 'HIGH_RISK',
          actions: JSON.stringify({
            sendSlack: true,
            sendEmail: true,
            escalation: true,
            message: 'Payment failed - immediate attention required!'
          }),
          isActive: true,
        }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      created: 3,
      message: 'Default playbooks created successfully'
    });
  } catch (error) {
    console.error('Seed playbooks error:', error);
    return NextResponse.json({ error: 'Failed to create playbooks' }, { status: 500 });
  }
}