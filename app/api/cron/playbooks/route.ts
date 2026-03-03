import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email/resend';
import { sendSlackAlert, slackAlerts } from '@/lib/slack/webhook';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = {
    onboardingRescue: 0,
    silentQuitter: 0,
    paymentSaver: 0,
    errors: [] as string[]
  };

  try {
    const activePlaybooks = await prisma.playbookConfig.findMany({
      where: { active: true },
      include: { 
        user: {
          include: {
            customers: true,
            activities: {
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        }
      }
    });

    for (const playbook of activePlaybooks) {
      try {
        const triggerConfig = JSON.parse(playbook.triggerConfig);
        const actionConfig = JSON.parse(playbook.actionConfig);
        
        switch (playbook.type) {
          case 'ONBOARDING_RESCUE':
            results.onboardingRescue += await runOnboardingRescue(playbook, triggerConfig, actionConfig);
            break;
          case 'SILENT_QUITTER':
            results.silentQuitter += await runSilentQuitter(playbook, triggerConfig, actionConfig);
            break;
          case 'PAYMENT_SAVER':
            break;
        }

        await prisma.playbookConfig.update({
          where: { id: playbook.id },
          data: { 
            lastRunAt: new Date(),
            runCount: { increment: 1 }
          }
        });

      } catch (error) {
        results.errors.push(`${playbook.type}: ${error}`);
        console.error(`Playbook ${playbook.type} failed:`, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      executed: new Date().toISOString(),
      results 
    });

  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
  }
}

async function runOnboardingRescue(playbook: any, triggerConfig: any, actionConfig: any) {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - triggerConfig.days);

  const dayAfter = new Date(threeDaysAgo);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const atRiskCustomers = playbook.user.customers.filter((customer: any) => {
    const signupDate = new Date(customer.signupAt);
    const hasFeatureUsage = playbook.user.activities.some((a: any) => 
      a.type === 'feature_usage' && a.userId === customer.userId
    );
    
    return signupDate >= threeDaysAgo && 
           signupDate < dayAfter && 
           !hasFeatureUsage &&
           customer.status === 'active';
  });

  for (const customer of atRiskCustomers) {
    const event = await prisma.playbookEvent.create({
      data: {
        userId: playbook.userId,
        playbookType: 'ONBOARDING_RESCUE',
        status: 'triggered',
        customerId: customer.id,
        message: `Day 3 onboarding rescue triggered for ${customer.email}`
      }
    });

    // Send email
    const template = emailTemplates.onboardingRescue(customer.name || 'there');
    const emailResult = await sendEmail(customer.email, template.subject, template.html);
    
    // Send Slack alert if configured
    if (actionConfig.slackAlert !== false) {
      const alert = slackAlerts.onboardingRescue(customer);
      await sendSlackAlert(alert.channel, alert.message, alert.details);
    }

    if (emailResult.success) {
      await prisma.playbookEvent.update({
        where: { id: event.id },
        data: { status: 'action_sent', message: `Email sent to ${customer.email}` }
      });
    }
    
    console.log(`ONBOARDING RESCUE: ${customer.email} - Email ${emailResult.success ? 'sent' : 'failed'}`);
  }

  return atRiskCustomers.length;
}

async function runSilentQuitter(playbook: any, triggerConfig: any, actionConfig: any) {
  const absentDays = triggerConfig.absentDays || 5;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - absentDays);

  const atRiskCustomers = playbook.user.customers.filter((customer: any) => {
    if (!customer.lastLoginAt) return false;
    
    const lastLogin = new Date(customer.lastLoginAt);
    const daysSinceLogin = Math.floor((Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysSinceLogin >= absentDays && 
           customer.status === 'active';
  });

  for (const customer of atRiskCustomers) {
    const event = await prisma.playbookEvent.create({
      data: {
        userId: playbook.userId,
        playbookType: 'SILENT_QUITTER',
        status: 'triggered',
        customerId: customer.id,
        message: `Silent quitter detected: ${customer.email} absent for ${absentDays}+ days`
      }
    });

    // Send email
    const template = emailTemplates.silentQuitter(customer.name || 'there', absentDays);
    const emailResult = await sendEmail(customer.email, template.subject, template.html);
    
    // Send Slack alert if configured
    if (actionConfig.slackAlert !== false) {
      const alert = slackAlerts.silentQuitter(customer, absentDays);
      await sendSlackAlert(alert.channel, alert.message, alert.details);
    }

    if (emailResult.success) {
      await prisma.playbookEvent.update({
        where: { id: event.id },
        data: { status: 'action_sent', message: `Email + Slack sent for ${customer.email}` }
      });
    }
    
    console.log(`SILENT QUITTER: ${customer.email} - Email ${emailResult.success ? 'sent' : 'failed'}`);
  }

  return atRiskCustomers.length;
}