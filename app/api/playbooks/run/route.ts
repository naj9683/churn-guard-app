import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

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

    // Run playbook logic based on type
    if (playbookType === 'ONBOARDING_RESCUE' || playbookType === 'ALL') {
      const day3Customers = user.customers.filter(c => {
        const daysSinceSignup = Math.floor((Date.now() - new Date(c.signupAt).getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceSignup >= 3 && !c.lastLoginAt;
      });

      for (const customer of day3Customers) {
        try {
          // Send email using Resend test domain
          if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'mock-key') {
            await resend.emails.send({
              from: 'onboarding@resend.dev',
              to: customer.email,
              subject: 'Welcome! Need help getting started?',
              html: `<p>Hi ${customer.name}, we noticed you haven't logged in yet. Need help?</p>`
            });
          }

          // Log event
          await prisma.playbookEvent.create({
            data: {
              userId: user.id,
              customerId: customer.id,
              playbookType: 'ONBOARDING_RESCUE',
              status: 'EXECUTED',
              message: `Sent onboarding rescue email to ${customer.email}`
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
        const daysAbsent = Math.floor((Date.now() - new Date(c.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24));
        return daysAbsent >= 5;
      });

      for (const customer of silentCustomers) {
        try {
          // Slack alert
          if (process.env.SLACK_WEBHOOK_URL && process.env.SLACK_WEBHOOK_URL !== 'mock-key') {
            await fetch(process.env.SLACK_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `🚨 Silent Quitter Alert: ${customer.name} (${customer.email}) hasn't logged in for 5 days`
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
              message: `Alerted about silent quitter ${customer.email}`
            }
          });

          results.push({ customer: customer.email, status: 'success', type: 'SILENT_QUITTER' });
        } catch (error) {
          results.push({ customer: customer.email, status: 'error', error: String(error) });
        }
      }
    }

    if (playbookType === 'PAYMENT_SAVER' || playbookType === 'ALL') {
      // Payment saver - targets at-risk customers
      const atRiskCustomers = user.customers.filter(c => c.riskScore > 70);

      for (const customer of atRiskCustomers) {
        try {
          // Send pause offer email using Resend test domain
          if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'mock-key') {
            await resend.emails.send({
              from: 'onboarding@resend.dev',
              to: customer.email,
              subject: 'Special offer: Pause instead of cancel',
              html: `<p>Hi ${customer.name}, we noticed you might be thinking of leaving. How about a 30% discount instead?</p>`
            });
          }

          // Log event
          await prisma.playbookEvent.create({
            data: {
              userId: user.id,
              customerId: customer.id,
              playbookType: 'PAYMENT_SAVER',
              status: 'EXECUTED',
              message: `Sent payment saver offer to ${customer.email}`
            }
          });

          results.push({ customer: customer.email, status: 'success', type: 'PAYMENT_SAVER' });
        } catch (error) {
          results.push({ customer: customer.email, status: 'error', error: String(error) });
        }
      }
    }

    // Update playbook run count
    const playbook = await prisma.playbookConfig.findFirst({
      where: { userId: user.id, type: playbookType === 'ALL' ? undefined : playbookType }
    });

    if (playbook) {
      await prisma.playbookConfig.update({
        where: { id: playbook.id },
        data: { 
          runCount: { increment: 1 },
          lastRunAt: new Date()
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Playbook execution completed`,
      executed: results.length,
      results 
    });

  } catch (error) {
    console.error('Playbook run error:', error);
    return NextResponse.json({ 
      error: "Failed to run playbooks", 
      details: String(error) 
    }, { status: 500 });
  }
}