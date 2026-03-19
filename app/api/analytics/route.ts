import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const now = new Date();

    // All customers
    const customers = await prisma.customer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    // Risk segments
    const highRisk = customers.filter(c => c.riskScore >= 70);
    const mediumRisk = customers.filter(c => c.riskScore >= 40 && c.riskScore < 70);
    const lowRisk = customers.filter(c => c.riskScore < 40);

    // MRR totals
    const totalMRR = customers.reduce((sum, c) => sum + (c.mrr || 0), 0);
    const atRiskMRR = highRisk.reduce((sum, c) => sum + (c.mrr || 0), 0);

    // Interventions for real MRR saved + success rate
    const interventions = await prisma.interventionOutcome.findMany({
      where: { userId: user.id },
      include: {
        customer: { select: { id: true, name: true, email: true, externalId: true, mrr: true } }
      },
      orderBy: { startedAt: 'desc' }
    });

    const successfulInterventions = interventions.filter(i =>
      i.status === 'saved' || i.status === 'success'
    );
    const failedInterventions = interventions.filter(i =>
      i.status === 'churned' || i.status === 'failed'
    );
    const totalMRRSaved = successfulInterventions.reduce((sum, i) => sum + (i.mrrSaved || 0), 0);
    const successRate = interventions.length > 0
      ? Math.round((successfulInterventions.length / interventions.length) * 100)
      : 0;

    // Monthly trend (real: group customers by creation month)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString('default', { month: 'short' });
      monthlyMap[key] = 0;
    }
    customers.forEach(c => {
      const d = new Date(c.createdAt);
      if (d >= sixMonthsAgo) {
        const key = d.toLocaleString('default', { month: 'short' });
        if (key in monthlyMap) monthlyMap[key]++;
      }
    });
    const monthlyTrend = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }));

    return NextResponse.json({
      fetchedAt: now.toISOString(),
      overview: {
        totalCustomers: customers.length,
        highRiskCount: highRisk.length,
        mediumRiskCount: mediumRisk.length,
        lowRiskCount: lowRisk.length,
        totalMRR,
        atRiskMRR,
        mrrSaved: totalMRRSaved,
        successRate,
        totalInterventions: interventions.length,
        successfulInterventions: successfulInterventions.length,
        failedInterventions: failedInterventions.length,
        churnRate: customers.length
          ? ((highRisk.length / customers.length) * 100).toFixed(1)
          : 0
      },
      // Drill-down data for modals
      drilldown: {
        allCustomers: customers.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          externalId: c.externalId,
          riskScore: c.riskScore,
          mrr: c.mrr,
          plan: c.plan,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt
        })),
        highRiskCustomers: highRisk
          .sort((a, b) => (b.mrr || 0) - (a.mrr || 0))
          .map(c => ({
            id: c.id,
            name: c.name,
            email: c.email,
            externalId: c.externalId,
            riskScore: c.riskScore,
            mrr: c.mrr,
            plan: c.plan
          })),
        successfulInterventions: successfulInterventions.map(i => ({
          id: i.id,
          customerName: i.customer?.name || i.customer?.email || i.customer?.externalId || 'Unknown',
          customerEmail: i.customer?.email || '',
          mrrSaved: i.mrrSaved || 0,
          mrrAtRisk: i.mrrAtRisk || 0,
          interventionType: i.interventionType,
          completedAt: i.completedAt || i.startedAt
        })),
        interventionOutcomes: interventions.slice(0, 50).map(i => ({
          id: i.id,
          customerName: i.customer?.name || i.customer?.email || i.customer?.externalId || 'Unknown',
          status: i.status,
          interventionType: i.interventionType,
          mrrAtRisk: i.mrrAtRisk || 0,
          mrrSaved: i.mrrSaved || 0,
          startedAt: i.startedAt,
          completedAt: i.completedAt
        }))
      },
      monthlyTrend,
      // Keep recentActivity for existing table
      recentActivity: customers.slice(0, 10).map(c => ({
        id: c.id,
        externalId: c.externalId,
        name: c.name,
        email: c.email,
        riskScore: c.riskScore,
        mrr: c.mrr,
        plan: c.plan,
        lastActivity: c.updatedAt
      }))
    });

  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
