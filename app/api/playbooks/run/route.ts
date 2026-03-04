import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { emailTemplates } from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY || 'mock-key');

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { playbookType } = body;

    // Get user - try by ID first, then by test email
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { customers: true }
    });

    if (!user) {
      user = await prisma.user.findFirst({
        where: { email: 'test@example.com' },
        include: { customers: true }
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const results = [];
    const now = new Date();

    // Run playbook logic based on type
    if (playbookType === 'ONBOARDING_RESCUE' || playbookType === 'ALL') {
      const day3Customers = user.customers.filter(c => {
        const daysSinceSignup = Math.floor((now.getTime() - new Date(c.signupAt).getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceSignup >= 3 && (!c.lastLoginAt || daysSinceSignup <= 5);
      });

      for (const customer of day3Customers) {
        try {
          // Send professional HTML email
          if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'mock-key') {
            const template = emailTemplates.onboardingRescue(customer.name || 'there');
            await resend.emails.send({
              from: 'onboarding@resend.dev',
              to: customer.email,
              subject: template.subject,
              html: template.html
            });
          }

          // Log event
          await prisma.playbookEvent.create({
            data: {
              userId: user.id,
              customerId: customer.id,
              playbookType: 'ONBOARDING_RESCUE',
              status: 'EXECUTED',
              message: `Sent professional onboarding email to ${customer.email}`
            }
          });

          results.push({ customer: customer.email, status: 'success', type: 'ONBOARDING_RESCUE' });
        } catch (error) {
          results.push({ customer: customer.email, status: 'error', error: String(error) });
        }
      }
    }

    if (playbookType === 'SILENT_QUITTER' || playbookType === 'ALL') {
      const silentCustomers = user.customers.filter(c => {
        if (!c.lastLoginAt) return false;
        const daysAbsent = Math.floor((now.getTime() - new Date(c.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24));
        return daysAbsent >= 5;
      });

      for (const customer of silentCustomers) {
        try {
          const daysAbsent = Math.floor((now.getTime() - new Date(customer.lastLoginAt!).getTime()) / (1000 * 60 * 60 * 24));
          
          // Send professional HTML email
          if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'mock-key') {
            const template = emailTemplates.silentQuitter(customer.name || 'there', daysAbsent);
            await resend.emails.send({
              from: 'onboarding@resend.dev',
              to: customer.email,
              subject: template.subject,
              html: template.html
            });
          }

          // Slack alert
          if (process.env.SLACK_WEBHOOK_URL && process.env.SLACK_WEBHOOK_URL !== 'mock-key') {
            await fetch(process.env.SLACK_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `🚨 Silent Quitter Alert: ${customer.name} (${customer.email}) hasn't logged in for ${daysAbsent} days`,
                blocks: [
                  {
                    type: "section",
                    text: {
                      type: "mrkdwn",
                      text: `*🚨 Silent Quitter Detected*\n• Customer: ${customer.name}\n• Email: ${customer.email}\n• Days Absent: ${daysAbsent}\n• Risk Score: ${customer.riskScore}\n• MRR: $${customer.mrr}`
                    }
                  }
                ]
              })
            });
          }

          // Log event
          await prisma.playbookEvent.create({
            data: {
              userId: user.id,
              customerId: customer.id,
              playbookType: 'SILENT_QUITTER',
              status: 'EXECUTED',
              message: `Sent we-miss-you email to ${customer.email} (${daysAbsent} days absent)`
            }
          });

          results.push({ customer: customer.email, status: 'success', type: 'SILENT_QUITTER' });
        } catch (error) {
          results.push({ customer: customer.email, status: 'error', error: String(error) });
        }
      }
    }

    if (playbookType === 'PAYMENT_SAVER' || playbookType === 'ALL') {
      // Payment saver - targets at-risk customers OR failed payments
      const atRiskCustomers = user.customers.filter(c => c.riskScore > 70 || c.status === 'payment_failed');

      for (const customer of atRiskCustomers) {
        try {
          // Send professional HTML email
          if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'mock-key') {
            const template = emailTemplates.paymentSaver(customer.name || 'there');
            await resend.emails.send({
              from: 'onboarding@resend.dev',
              to: customer.email,
              subject: template.subject,
              html: template.html
            });
          }

          // Slack alert
          if (process.env.SLACK_WEBHOOK_URL && process.env.SLACK_WEBHOOK_URL !== 'mock-key') {
            await fetch(process.env.SLACK_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `💳 Payment Saver Activated: ${customer.name} (${customer.email}) - Risk Score: ${customer.riskScore}`,
                blocks: [
                  {
                    type: "section",
                    text: {
                      type: "mrkdwn",
                      text: `*💳 Payment Saver Campaign*\n• Customer: ${customer.name}\n• Email: ${customer.email}\n• Risk Score: ${customer.riskScore}/100\n• Status: ${customer.status}\n• MRR: $${customer.mrr}\n• Action: 30% discount offer sent`
                    }
                  }
                ]
              })
            });
          }

          // Log event
          await prisma.playbookEvent.create({
            data: {
              userId: user.id,
              customerId: customer.id,
              playbookType: 'PAYMENT_SAVER',
              status: 'EXECUTED',
              message: `Sent payment saver offer (30% off) to ${customer.email}`
            }
          });

          results.push({ customer: customer.email, status: 'success', type: 'PAYMENT_SAVER' });
        } catch (error) {
          results.push({ customer: customer.email, status: 'error', error: String(error) });
        }
      }
    }

    // Update playbook run count for each playbook type
    if (playbookType !== 'ALL') {
      const playbook = await prisma.playbookConfig.findFirst({
        where: { userId: user.id, type: playbookType }
      });

      if (playbook) {
        await prisma.playbookConfig.update({
          where: { id: playbook.id },
          data: { 
            runCount: { increment: 1 },
            lastRunAt: now
          }
        });
      }
    } else {
      // Update all playbooks if ALL was run
      await prisma.playbookConfig.updateMany({
        where: { userId: user.id },
        data: { 
          runCount: { increment: 1 },
          lastRunAt: now
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Playbook execution completed`,
      executed: results.length,
      results,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('Playbook run error:', error);
    return NextResponse.json({ 
      error: "Failed to run playbooks", 
      details: String(error) 
    }, { status: 500 });
  }
}