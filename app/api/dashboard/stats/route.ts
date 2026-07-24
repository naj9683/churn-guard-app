import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      select: {
        id: true, createdAt: true,
        trialEmailStep: true, nextTrialEmailAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalCustomers = await prisma.customer.count({
      where: { userId: user.id }
    });

    const atRisk = await prisma.customer.count({
      where: { userId: user.id, riskScore: { gte: 50 } }
    });

    const monthlyRevenue = await prisma.customer.aggregate({
      where: { userId: user.id },
      _sum: { mrr: true }
    });

    const engagementRisk = await prisma.customer.aggregate({
      where: { userId: user.id, riskScore: { gte: 50 } },
      _sum: { mrr: true },
    });

    const stripeIntegration = await prisma.crmIntegration.findUnique({
      where: { userId_type: { userId: user.id, type: 'stripe' } },
      select: { enabled: true, accessToken: true },
    });
    const stripeConnected = !!(stripeIntegration?.enabled && stripeIntegration.accessToken);

    const activePlaybooks = await prisma.playbook.count({
      where: { userId: user.id, isActive: true }
    });

    const savedInterventions = await prisma.interventionOutcome.count({
      where: { userId: user.id, status: 'saved' }
    });

    // Customers with score >= 50 that have widget data — these will always have engagement
    // data because scoring above 50 requires engagement signals (billing alone caps at 40).
    const highRiskCustomers = await prisma.customer.findMany({
      where: { userId: user.id, riskScore: { gte: 50 } },
      orderBy: { riskScore: 'desc' },
      take: 5,
      select: { id: true, email: true, name: true, riskScore: true, riskReason: true, mrr: true, lastLoginAt: true },
    });

    // Customers without widget data that have billing signals (show in separate UI group)
    const missingDataCustomers = await prisma.customer.findMany({
      where: { userId: user.id, lastLoginAt: null, riskScore: { gt: 0 } },
      orderBy: { riskScore: 'desc' },
      take: 5,
      select: { id: true, email: true, name: true, riskScore: true, riskReason: true, mrr: true, lastLoginAt: true },
    });

    // Count for dashboard banner: how many customers have no widget data at all
    const engagementDataMissingCount = await prisma.customer.count({
      where: { userId: user.id, lastLoginAt: null },
    });

    if (user.nextTrialEmailAt === null && user.trialEmailStep === 0) {
      const ageMs = Date.now() - user.createdAt.getTime();
      if (ageMs < 30 * 24 * 60 * 60 * 1000) {
        prisma.user.update({
          where: { id: user.id },
          data: { nextTrialEmailAt: user.createdAt },
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      totalCustomers,
      atRisk,
      monthlyRevenue: monthlyRevenue._sum?.mrr || 0,
      activePlaybooks,
      savedInterventions,
      highRiskCustomers,
      missingDataCustomers,
      engagementDataMissingCount,
      engagementRiskMrr: engagementRisk._sum?.mrr || 0,
      stripeConnected,
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
