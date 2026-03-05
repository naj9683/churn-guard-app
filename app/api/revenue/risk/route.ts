import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all customers with risk scores
    const customers = await prisma.customer.findMany({
      where: { userId },
      select: {
        id: true,
        email: true,
        name: true,
        mrr: true,
        arr: true,
        riskScore: true,
        healthScore: true,
        plan: true,
        crmId: true,
      },
    });

    // Calculate Revenue Metrics
    const totalMrr = customers.reduce((sum, c) => sum + (c.mrr || 0), 0);
    const totalArr = customers.reduce((sum, c) => sum + (c.arr || 0), 0);
    
    // High risk = score >= 70
    const highRiskCustomers = customers.filter(c => (c.riskScore || 0) >= 70);
    const atRiskMrr = highRiskCustomers.reduce((sum, c) => sum + (c.mrr || 0), 0);
    const atRiskArr = highRiskCustomers.reduce((sum, c) => sum + (c.arr || 0), 0);
    
    // Critical risk = score >= 90
    const criticalRiskCustomers = customers.filter(c => (c.riskScore || 0) >= 90);
    const criticalMrr = criticalRiskCustomers.reduce((sum, c) => sum + (c.mrr || 0), 0);
    
    // High value = MRR >= $500
    const highValueCount = customers.filter(c => (c.mrr || 0) >= 500).length;
    
    // Update or create revenue metrics
    await prisma.revenueMetrics.upsert({
      where: { userId },
      update: {
        totalMrr,
        totalArr,
        atRiskMrr,
        atRiskArr,
        highValueCount,
        updatedAt: new Date(),
      },
      create: {
        userId,
        totalMrr,
        totalArr,
        atRiskMrr,
        atRiskArr,
        highValueCount,
      },
    });

    // Calculate risk breakdown by plan
    const riskByPlan = customers.reduce((acc, customer) => {
      const plan = customer.plan || 'unknown';
      if (!acc[plan]) {
        acc[plan] = { count: 0, mrr: 0, atRiskMrr: 0 };
      }
      acc[plan].count++;
      acc[plan].mrr += customer.mrr || 0;
      if ((customer.riskScore || 0) >= 70) {
        acc[plan].atRiskMrr += customer.mrr || 0;
      }
      return acc;
    }, {} as Record<string, { count: number; mrr: number; atRiskMrr: number }>);

    return NextResponse.json({
      summary: {
        totalMrr,
        totalArr,
        atRiskMrr,
        atRiskArr,
        criticalMrr,
        highValueCount,
        totalCustomers: customers.length,
        atRiskCustomers: highRiskCustomers.length,
        criticalCustomers: criticalRiskCustomers.length,
        riskPercentage: totalMrr > 0 ? Math.round((atRiskMrr / totalMrr) * 100) : 0,
      },
      customers: highRiskCustomers.map(c => ({
        id: c.id,
        email: c.email,
        name: c.name,
        mrr: c.mrr,
        riskScore: c.riskScore,
        healthScore: c.healthScore,
        plan: c.plan,
      })),
      riskByPlan,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revenue risk API error:', error);
    return NextResponse.json({ error: 'Failed to calculate revenue risk' }, { status: 500 });
  }
}