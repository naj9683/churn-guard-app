import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get all customers
    const customers = await prisma.customer.findMany({
      where: { userId: user.id }
    });

    // Calculate segments
    const highRisk = customers.filter(c => c.riskScore >= 70);
    const mediumRisk = customers.filter(c => c.riskScore >= 40 && c.riskScore < 70);
    const lowRisk = customers.filter(c => c.riskScore < 40);
    
    // Calculate metrics
    const totalMRR = customers.reduce((sum, c) => sum + (c.mrr || 0), 0);
    const atRiskMRR = highRisk.reduce((sum, c) => sum + (c.mrr || 0), 0);
    
    // Trends (mock data for now - would need historical data)
    const riskDistribution = [
      { name: 'High Risk (70+)', count: highRisk.length, color: '#ef4444', percentage: customers.length ? Math.round((highRisk.length / customers.length) * 100) : 0 },
      { name: 'Medium Risk (40-69)', count: mediumRisk.length, color: '#f59e0b', percentage: customers.length ? Math.round((mediumRisk.length / customers.length) * 100) : 0 },
      { name: 'Low Risk (0-39)', count: lowRisk.length, color: '#10b981', percentage: customers.length ? Math.round((lowRisk.length / customers.length) * 100) : 0 }
    ];

    // Monthly trend (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyTrend = months.map((month, idx) => ({
      month,
      newCustomers: Math.floor(Math.random() * 20) + 5,
      churned: Math.floor(Math.random() * 5) + 1
    }));

    return NextResponse.json({
      overview: {
        totalCustomers: customers.length,
        highRiskCount: highRisk.length,
        mediumRiskCount: mediumRisk.length,
        lowRiskCount: lowRisk.length,
        totalMRR,
        atRiskMRR,
        churnRate: customers.length ? ((highRisk.length / customers.length) * 100).toFixed(1) : 0
      },
      riskDistribution,
      monthlyTrend,
      recentActivity: customers.slice(0, 10).map(c => ({
        id: c.id,
        externalId: c.externalId,
        riskScore: c.riskScore,
        mrr: c.mrr,
        lastActivity: c.updatedAt
      }))
    });

  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
