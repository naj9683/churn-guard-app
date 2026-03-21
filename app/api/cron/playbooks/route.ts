import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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
            try {
              const subject = actions.emailSubject || `Action Required: ${playbook.name}`;
              const html = actions.emailBody
                ? actions.emailBody
                    .replace(/{{name}}/g, customer.name || customer.email)
                    .replace(/{{riskScore}}/g, String(customer.riskScore ?? 0))
                    .replace(/{{email}}/g, customer.email)
                : `<p>Hi ${customer.name || 'there'},</p>
                   <p>Your account has been flagged by <strong>${playbook.name}</strong> (risk score: ${customer.riskScore ?? 0}).</p>
                   <p>Please log in to review your account status.</p>`;
              await sendEmail({ to: customer.email, subject, html });
            } catch (e) {
              console.error(`Playbook email failed for ${customer.email}:`, e);
            }
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