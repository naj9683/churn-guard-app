import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { emailTemplates } from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY || 'mock-key');

// This runs automatically every hour via Vercel Cron
export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = [];
    const now = new Date();

    // Get all users with their customers and playbooks
    const users = await prisma.user.findMany({
      include: {
        customers: true,
        playbooks: true
      }
    });

    console.log(`[Cron] Checking ${users.length} users for automated playbooks`);

    for (const user of users) {
      const activePlaybooks = user.playbooks?.filter(p => p.isActive) || [];      
      if (activePlaybooks.length === 0) continue;

      for (const playbook of activePlaybooks) {
        try {
          let customersToProcess: any[] = [];

          // ONBOARDING RESCUE: Day 3, no activity
          if (playbook.type === 'ONBOARDING_RESCUE') {
            customersToProcess = user.customers.filter(c => {
              const daysSinceSignup = Math.floor((now.getTime() - new Date(c.signupAt).getTime()) / (1000 * 60 * 60 * 24));
              const hasLoggedIn = c.lastLoginAt && new Date(c.lastLoginAt).getTime() > new Date(c.signupAt).getTime();
              return daysSinceSignup === 3 && !hasLoggedIn && c.status !== 'churned';
            });
          }

          // SILENT QUITTER: 5+ days absent
          else if (playbook.type === 'SILENT_QUITTER') {
            customersToProcess = user.customers.filter(c => {
              if (!c.lastLoginAt) return false;
              const daysAbsent = Math.floor((now.getTime() - new Date(c.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24));
              return daysAbsent >= 5 && c.status === 'active';
            });
          }

          // PAYMENT SAVER: Failed payment or high risk
          else if (playbook.type === 'PAYMENT_SAVER') {
            customersToProcess = user.customers.filter(c => {
              return c.status === 'payment_failed' || (c.riskScore > 70 && c.status === 'active');
            });
          }

          // Process each customer
          for (const customer of customersToProcess) {
            try {
              // Send appropriate email
              if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'mock-key') {
                let template;
                
                if (playbook.type === 'ONBOARDING_RESCUE') {
                  template = emailTemplates.onboardingRescue(customer.name || 'there');
                } else if (playbook.type === 'SILENT_QUITTER') {
                  const daysAbsent = Math.floor((now.getTime() - new Date(customer.lastLoginAt!).getTime()) / (1000 * 60 * 60 * 24));
                  template = emailTemplates.silentQuitter(customer.name || 'there', daysAbsent);
                } else {
                  template = emailTemplates.paymentSaver(customer.name || 'there');
                }

                await resend.emails.send({
                  from: 'onboarding@resend.dev',
                  to: customer.email,
                  subject: template.subject,
                  html: template.html
                });
              }

              // Send Slack alert for Silent Quitter and Payment Saver
              if ((playbook.type === 'SILENT_QUITTER' || playbook.type === 'PAYMENT_SAVER') && 
                  process.env.SLACK_WEBHOOK_URL && process.env.SLACK_WEBHOOK_URL !== 'mock-key') {
                await fetch(process.env.SLACK_WEBHOOK_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    text: `🤖 Automated ${playbook.type}: ${customer.name} (${customer.email})`
                  })
                });
              }

              // Log the event
              await prisma.playbookEvent.create({
                data: {
                  userId: user.id,
                  customerId: customer.id,
                  playbookType: playbook.type,
                  status: 'EXECUTED',
                  message: `Auto-sent ${playbook.type} email to ${customer.email}`
                }
              });

              results.push({
                user: user.email,
                customer: customer.email,
                playbook: playbook.type,
                status: 'success',
                time: now.toISOString()
              });

            } catch (error) {
              console.error(`[Cron] Failed to process ${customer.email}:`, error);
              results.push({
                user: user.email,
                customer: customer.email,
                playbook: playbook.type,
                status: 'error',
                error: String(error)
              });
            }
          }

          // Update playbook stats
          if (customersToProcess.length > 0) {
            await prisma.playbookConfig.update({
              where: { id: playbook.id },
              data: {
                runCount: { increment: customersToProcess.length },
                lastRunAt: now
              }
            });
          }

        } catch (error) {
          console.error(`[Cron] Playbook ${playbook.type} failed for user ${user.email}:`, error);
        }
      }
    }

    console.log(`[Cron] Completed. Processed ${results.length} actions`);

    return NextResponse.json({
      success: true,
      message: "Automated playbook execution completed",
      executed: results.length,
      timestamp: now.toISOString(),
      results
    });

  } catch (error) {
    console.error("[Cron] Fatal error:", error);
    return NextResponse.json({
      error: "Cron job failed",
      details: String(error)
    }, { status: 500 });
  }
}