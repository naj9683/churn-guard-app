import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { computeRiskScore } from '@/lib/risk-formula';

/**
 * POST /api/admin/fix-crm-scores
 *
 * One-time fix for customers created by CRM sync with hardcoded healthScore=80.
 * Sets healthScore=null and recalculates riskScore from the formula so scores
 * reflect real data instead of the uniform 76 caused by the bad default.
 */
export async function POST() {
  const check = await requireAdmin();
  if ('error' in check) return check.error;

  // Find every customer whose only health signal was the bad CRM default
  const stuckCustomers = await prisma.customer.findMany({
    where: { healthScore: 80 },
    select: {
      id: true,
      email: true,
      riskScore: true,
      healthScore: true,
      lastLoginAt: true,
      loginCountThisMonth: true,
    },
  });

  if (stuckCustomers.length === 0) {
    return NextResponse.json({ fixed: 0, message: 'No customers with healthScore=80 found — already clean.' });
  }

  const updates: Array<{ id: string; email: string; oldScore: number; newScore: number }> = [];

  for (const customer of stuckCustomers) {
    // Recalculate with healthScore treated as null (unknown = no extra risk)
    const { score } = computeRiskScore({
      lastLoginAt: customer.lastLoginAt,
      loginCountThisMonth: customer.loginCountThisMonth,
      recentEvents: [],
    });

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        healthScore: null,
        riskScore: score,
      },
    });

    updates.push({ id: customer.id, email: customer.email, oldScore: customer.riskScore, newScore: score });
  }

  return NextResponse.json({
    fixed: updates.length,
    message: `Reset healthScore and recalculated riskScore for ${updates.length} customers.`,
    updates,
  });
}
