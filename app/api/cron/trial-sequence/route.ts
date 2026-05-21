import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/resend';
import {
  TRIAL_KEYS,
  TRIAL_SCHEDULE_DAYS,
  TRIAL_DEFAULTS,
  renderTemplate,
  type TrialKey,
} from '@/lib/email/trial-sequence';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://churnguardapp.com';

// Load DB template override or fall back to code default
async function getTemplate(key: TrialKey) {
  const dbTpl = await prisma.emailTemplate.findUnique({ where: { key } });
  const defaults = TRIAL_DEFAULTS[key];
  return {
    subject: dbTpl?.subject ?? defaults.subject,
    bodyHtml: dbTpl?.bodyHtml ?? defaults.bodyHtml,
  };
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader  = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  // Find users due for their next trial email
  const users = await prisma.user.findMany({
    where: {
      trialEmailStep: { lt: TRIAL_KEYS.length },
      nextTrialEmailAt: { not: null, lte: now },
    },
    orderBy: { nextTrialEmailAt: 'asc' },
    take: 100,
    select: {
      id: true, email: true, name: true, company: true,
      createdAt: true, trialEmailStep: true,
    },
  });

  let sent = 0, skipped = 0, failed = 0;

  for (const user of users) {
    const step    = user.trialEmailStep;
    const stepKey = TRIAL_KEYS[step];
    if (!stepKey) {
      await prisma.user.update({ where: { id: user.id }, data: { nextTrialEmailAt: null } });
      skipped++;
      continue;
    }

    const firstName = user.name?.split(' ')[0] || user.email.split('@')[0];

    // Build per-step variables
    let vars: Record<string, string> = {
      firstName,
      appUrl: APP_URL,
    };

    if (stepKey === 'trial_day_10') {
      // Pull real revenue at risk if Stripe connected, else use benchmark
      const stripeInt = await prisma.crmIntegration.findUnique({
        where: { userId_type: { userId: user.id, type: 'stripe' } },
        select: { enabled: true, accessToken: true },
      });
      const stripeConnected = !!(stripeInt?.enabled && stripeInt.accessToken);

      let revenueAtRisk = 0;
      if (stripeConnected) {
        const agg = await prisma.customer.aggregate({
          where: { userId: user.id, riskScore: { gte: 70 } },
          _sum: { mrr: true },
        });
        revenueAtRisk = agg._sum?.mrr ?? 0;
        // Fall back to benchmark if no customers yet
        if (revenueAtRisk === 0) revenueAtRisk = 2400;
      } else {
        revenueAtRisk = 2400; // industry benchmark
      }

      vars = {
        ...vars,
        revenueAtRisk:     revenueAtRisk.toLocaleString(),
        annualizedLoss:    (revenueAtRisk * 12).toLocaleString(),
        recoveryEstimate:  Math.round(revenueAtRisk * 0.35).toLocaleString(),
        stripeStatus:      stripeConnected
          ? 'based on your connected Stripe account,'
          : 'based on industry benchmarks for SaaS companies at your stage,',
      };
    }

    if (stepKey === 'trial_day_13') {
      const [customerCount, playbookCount, riskAgg] = await Promise.all([
        prisma.customer.count({ where: { userId: user.id } }),
        prisma.playbook.count({ where: { userId: user.id, isActive: true } }),
        prisma.customer.aggregate({ where: { userId: user.id }, _avg: { riskScore: true } }),
      ]);
      vars = {
        ...vars,
        customers: customerCount.toLocaleString(),
        playbooks: playbookCount.toString(),
        avgRisk:   Math.round(riskAgg._avg?.riskScore ?? 0).toString(),
      };
    }

    // Load template and render
    const tpl     = await getTemplate(stepKey);
    const subject = renderTemplate(tpl.subject, vars);
    const html    = renderTemplate(tpl.bodyHtml, vars);

    const result = await sendEmail(user.email, subject, html, user.id);

    if (result.success) {
      const nextStep    = step + 1;
      const nextKey     = TRIAL_KEYS[nextStep] as TrialKey | undefined;
      const nextDays    = nextKey ? TRIAL_SCHEDULE_DAYS[nextKey] : null;
      const nextEmailAt = nextDays !== null
        ? new Date(user.createdAt.getTime() + nextDays * 86_400_000)
        : null;

      await prisma.user.update({
        where: { id: user.id },
        data: { trialEmailStep: nextStep, nextTrialEmailAt: nextEmailAt },
      });
      sent++;
    } else {
      console.error(`[trial-sequence] failed step=${step} user=${user.email}`);
      failed++;
    }
  }

  console.log(`[trial-sequence] sent=${sent} skipped=${skipped} failed=${failed}`);
  return NextResponse.json({ success: true, sent, skipped, failed });
}
