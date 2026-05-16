import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by clerkId (matching your pattern)
    const user = await prisma.user.findFirst({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get stats only (no customer list)
    const totalCustomers = await prisma.customer.count({
      where: { userId: user.id }
    });

    const atRisk = await prisma.customer.count({
      where: { userId: user.id, riskScore: { gte: 70 } }
    });

    const monthlyRevenue = await prisma.customer.aggregate({
      where: { userId: user.id },
      _sum: { mrr: true }
    });

    // Engagement-based revenue at risk: MRR of customers with riskScore >= 70
    const engagementRisk = await prisma.customer.aggregate({
      where: { userId: user.id, riskScore: { gte: 70 } },
      _sum: { mrr: true },
    });

    // Check if user has a Stripe key stored for live Revenue at Risk
    const stripeIntegration = await prisma.crmIntegration.findUnique({
      where: { userId_type: { userId: user.id, type: 'stripe' } },
      select: { enabled: true, accessToken: true },
    });
    const stripeConnected = !!(stripeIntegration?.enabled && stripeIntegration.accessToken);

    const activePlaybooks = await prisma.playbook.count({
      where: { userId: user.id, isActive: true }
    });

    // Get intervention stats
    const savedInterventions = await prisma.interventionOutcome.count({
      where: { userId: user.id, status: 'saved' }
    });

    // Top high-risk customers with AI-generated risk reasons for dashboard display
    const highRiskCustomers = await prisma.customer.findMany({
      where: { userId: user.id, riskScore: { gte: 60 } },
      orderBy: { riskScore: 'desc' },
      take: 5,
      select: { id: true, email: true, name: true, riskScore: true, riskReason: true, mrr: true },
    });

    return NextResponse.json({
      totalCustomers,
      atRisk,
      monthlyRevenue: monthlyRevenue._sum?.mrr || 0,
      activePlaybooks,
      savedInterventions,
      highRiskCustomers,
      // Engagement-based revenue at risk (riskScore >= 70)
      engagementRiskMrr: engagementRisk._sum?.mrr || 0,
      // Whether user has connected their Stripe account for live Revenue at Risk
      stripeConnected,
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
