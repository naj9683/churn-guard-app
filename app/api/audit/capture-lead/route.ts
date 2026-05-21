import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/resend';
import { email1, daysUntilNextEmail } from '@/lib/email/audit-sequence';

export async function POST(request: NextRequest) {
  let body: {
    email?: string;
    stripeConnected?: boolean;
    csvUploaded?: boolean;
    monthlyChurnRate?: number;
    revenueAtRisk?: number;
    annualizedLoss?: number;
    totalMrr?: number;
    industryPercentile?: number;
    atRiskCustomers?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, stripeConnected, csvUploaded, monthlyChurnRate, revenueAtRisk, annualizedLoss, totalMrr, industryPercentile, atRiskCustomers } = body;

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
  }

  const safeResult = {
    monthlyChurnRate:   monthlyChurnRate   ?? 0,
    revenueAtRisk:      revenueAtRisk      ?? 0,
    annualizedLoss:     annualizedLoss     ?? 0,
    totalMrr:           totalMrr           ?? 0,
    industryPercentile: industryPercentile ?? 50,
    atRiskCustomers:    atRiskCustomers    ?? [],
  };

  const daysToNext = daysUntilNextEmail(1) ?? 3;
  const nextEmailAt = new Date(Date.now() + daysToNext * 24 * 60 * 60 * 1000);

  try {
    await prisma.auditLead.create({
      data: {
        email,
        stripeConnected: stripeConnected ?? false,
        csvUploaded:     csvUploaded     ?? false,
        monthlyChurnRate:   safeResult.monthlyChurnRate,
        revenueAtRisk:      safeResult.revenueAtRisk,
        annualizedLoss:     safeResult.annualizedLoss,
        totalMrr:           safeResult.totalMrr,
        industryPercentile: safeResult.industryPercentile,
        atRiskCustomers:    JSON.parse(JSON.stringify(safeResult.atRiskCustomers)),
        emailStep:   1,
        nextEmailAt,
      },
    });
  } catch (dbErr) {
    console.error('[capture-lead] DB write failed:', dbErr);
    // Don't return an error — let the user through regardless
  }

  // Send welcome email (non-blocking)
  const e1 = email1({ id: 'pending', email, ...safeResult });
  sendEmail(email, e1.subject, e1.html).catch(e =>
    console.error('[capture-lead] email1 failed:', e)
  );

  return NextResponse.json({ ok: true });
}
