import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/resend';
import { getEmailForStep, daysUntilNextEmail } from '@/lib/email/audit-sequence';

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  // Find leads due for their next email
  const dueleads = await prisma.auditLead.findMany({
    where: {
      unsubscribed: false,
      emailStep: { lt: 4 },
      nextEmailAt: { lte: now },
    },
    orderBy: { nextEmailAt: 'asc' },
    take: 100,
  });

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const lead of dueleads) {
    // Stop sequence if the lead has signed up for ChurnGuard
    const converted = await prisma.user.findFirst({ where: { email: lead.email } });
    if (converted) {
      await prisma.auditLead.update({
        where: { id: lead.id },
        data: { unsubscribed: true },
      });
      skipped++;
      continue;
    }

    const nextStep = lead.emailStep + 1;
    const template = getEmailForStep(nextStep, {
      id: lead.id,
      email: lead.email,
      monthlyChurnRate: lead.monthlyChurnRate,
      revenueAtRisk: lead.revenueAtRisk,
      annualizedLoss: lead.annualizedLoss,
      totalMrr: lead.totalMrr,
      industryPercentile: lead.industryPercentile,
    });

    if (!template) {
      // Sequence complete — clear nextEmailAt
      await prisma.auditLead.update({
        where: { id: lead.id },
        data: { emailStep: 4, nextEmailAt: null },
      });
      skipped++;
      continue;
    }

    const result = await sendEmail(lead.email, template.subject, template.html);

    if (result.success) {
      const daysToNext = daysUntilNextEmail(nextStep);
      await prisma.auditLead.update({
        where: { id: lead.id },
        data: {
          emailStep: nextStep,
          nextEmailAt: daysToNext
            ? new Date(Date.now() + daysToNext * 24 * 60 * 60 * 1000)
            : null,
        },
      });
      sent++;
    } else {
      console.error(`[audit-sequence] Failed to send email${nextStep} to ${lead.email}`);
      failed++;
    }
  }

  console.log(`[audit-sequence] sent=${sent} skipped=${skipped} failed=${failed}`);
  return NextResponse.json({ success: true, sent, skipped, failed });
}
