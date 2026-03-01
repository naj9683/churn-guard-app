import { prisma } from './prisma';
import { sendEmail, emailTemplates } from './email';

export async function runOnboardingRescue() {
  console.log('🔍 Running Onboarding Rescue Playbook...');
  
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        lte: threeDaysAgo,
        gte: new Date(threeDaysAgo.getTime() - 24 * 60 * 60 * 1000),
      },
      status: 'ACTIVE',
      events: {
        none: {
          type: 'ONBOARDING_STEP_COMPLETED',
        },
      },
      playbookRuns: {
        none: {
          playbookType: 'ONBOARDING_RESCUE',
        },
      },
    },
  });

  console.log(`Found ${users.length} users stuck at Day 3`);

  for (const user of users) {
    const template = emailTemplates.onboardingRescue();
    const sent = await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });

    await prisma.playbookRun.create({
      data: {
        userId: user.id,
        playbookType: 'ONBOARDING_RESCUE',
        status: sent ? 'COMPLETED' : 'FAILED',
        emailSent: sent,
      },
    });

    console.log(`✅ Onboarding rescue ${sent ? 'sent' : 'failed'} to ${user.email}`);
  }
}

export async function runSilentQuitter() {
  console.log('🔍 Running Silent Quitter Playbook...');
  
  const fortyFiveDaysAgo = new Date();
  fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
  
  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        lte: fortyFiveDaysAgo,
      },
      status: 'ACTIVE',
      lastActiveAt: {
        lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      playbookRuns: {
        none: {
          playbookType: 'SILENT_QUITTER',
        },
      },
    },
  });

  console.log(`Found ${users.length} silent quitters`);

  for (const user of users) {
    const template = emailTemplates.silentQuitter();
    const sent = await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });

    await prisma.playbookRun.create({
      data: {
        userId: user.id,
        playbookType: 'SILENT_QUITTER',
        status: sent ? 'COMPLETED' : 'FAILED',
        emailSent: sent,
      },
    });

    console.log(`✅ Silent quitter email ${sent ? 'sent' : 'failed'} to ${user.email}`);
  }
}

export async function runPaymentSaver(userId: string) {
  console.log('💳 Running Payment Saver Playbook for user:', userId);
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return;

  const existingRun = await prisma.playbookRun.findFirst({
    where: {
      userId,
      playbookType: 'PAYMENT_SAVER',
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  if (existingRun) {
    console.log('Payment saver already sent recently');
    return;
  }

  const template = emailTemplates.paymentSaver();
  const sent = await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });

  await prisma.playbookRun.updateMany({
    where: {
      userId,
      playbookType: 'PAYMENT_SAVER',
      status: 'PENDING',
    },
    data: {
      status: sent ? 'COMPLETED' : 'FAILED',
      emailSent: sent,
      completedAt: new Date(),
    },
  });

  console.log(`✅ Payment saver email ${sent ? 'sent' : 'failed'} to ${user.email}`);
}

export async function runAllPlaybooks() {
  await runOnboardingRescue();
  await runSilentQuitter();
}