import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const results = [];

    // Get all users with their data
    const users = await prisma.user.findMany({
      include: {
        playbooks: true,
        customers: true,
      },
    });

    for (const user of users) {
      const activePlaybooks = user.playbooks?.filter(p => p.isActive) || [];
      
      if (activePlaybooks.length === 0) continue;

      for (const playbook of activePlaybooks) {
        let customersToProcess = [];
        
        const actions = playbook.actions as any;

        // Simple trigger logic based on risk score (fields that actually exist)
        if (playbook.trigger === 'HIGH_RISK') {
          customersToProcess = user.customers.filter(c => c.riskScore >= 70);
        } else if (playbook.trigger === 'CRITICAL_RISK') {
          customersToProcess = user.customers.filter(c => c.riskScore >= 90);
        } else {
          // Default: process all customers
          customersToProcess = user.customers;
        }

        if (customersToProcess.length === 0) continue;

        // Execute actions
        for (const customer of customersToProcess) {
          // Send Slack notification if configured
          if (actions?.sendSlack && user.slackWebhookUrl) {
            try {
              await fetch(user.slackWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: `🚨 ${playbook.name}: ${customer.email} (Risk: ${customer.riskScore})`,
                }),
              });
            } catch (e) {
              console.error('Slack notification failed:', e);
            }
          }

          // Send email via Resend if configured
          if (actions?.sendEmail) {
            // Email sending logic here
            console.log(`Would send email to ${customer.email}`);
          }
        }

        results.push({
          playbook: playbook.name,
          customersProcessed: customersToProcess.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      details: results,
    });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json(
      { error: 'Failed to run playbooks' },
      { status: 500 }
    );
  }
}