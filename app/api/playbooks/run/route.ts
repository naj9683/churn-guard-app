import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { playbookId } = await request.json();

    // FIX: Use clerkId lookup like your other routes
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        customers: true,
        playbooks: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const playbook = user.playbooks.find(p => p.id === playbookId);
    if (!playbook) {
      return NextResponse.json({ error: 'Playbook not found' }, { status: 404 });
    }

    const results = [];
    const actions = playbook.actions as any;

    // Filter by risk score (field that exists)
    let targetCustomers = user.customers;
    if (playbook.trigger === 'HIGH_RISK') {
      targetCustomers = user.customers.filter(c => c.riskScore >= 70);
    } else if (playbook.trigger === 'CRITICAL_RISK') {
      targetCustomers = user.customers.filter(c => c.riskScore >= 90);
    }

    // Execute actions
    for (const customer of targetCustomers) {
      if (actions?.sendSlack && user.slackWebhookUrl) {
        try {
          await fetch(user.slackWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `🎯 ${playbook.name}: ${customer.email} (Risk: ${customer.riskScore})`,
            }),
          });
          results.push({ customer: customer.email, action: 'slack', status: 'sent' });
        } catch (e) {
          results.push({ customer: customer.email, action: 'slack', status: 'failed' });
        }
      }

      if (actions?.sendEmail) {
        console.log(`Would send email to ${customer.email}`);
        results.push({ customer: customer.email, action: 'email', status: 'queued' });
      }
    }

    await prisma.playbook.update({
      where: { id: playbookId },
      data: { lastRun: new Date() },
    });

    return NextResponse.json({
      success: true,
      processed: targetCustomers.length,
      results,
    });
  } catch (error) {
    console.error('Run playbook error:', error);
    return NextResponse.json({ error: 'Failed to run playbook' }, { status: 500 });
  }
}
