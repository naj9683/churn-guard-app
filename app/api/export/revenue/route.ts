import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const customers = await prisma.customer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    let totalMRR = 0;
    let totalARR = 0;
    let atRiskMRR = 0;
    let savedMRR = 0;
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;
    const atRiskCustomers = [];

    for (const c of customers) {
      totalMRR += c.mrr || 0;
      totalARR += c.arr || 0;
      
      if (c.riskScore >= 70) {
        atRiskMRR += c.mrr || 0;
        highRiskCount++;
        atRiskCustomers.push({
          id: c.id,
          name: c.name,
          email: c.email,
          mrr: c.mrr,
          riskScore: c.riskScore
        });
      } else if (c.riskScore >= 40) {
        mediumRiskCount++;
      } else {
        lowRiskCount++;
      }
    }

    const outcomes = await prisma.interventionOutcome.findMany({
      where: { userId: user.id, status: 'success' }
    });
    
    savedMRR = outcomes.reduce((sum, o) => sum + (o.revenueSaved || 0), 0);

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      summary: {
        totalCustomers: customers.length,
        totalMRR,
        totalARR,
        atRiskMRR,
        savedMRR,
        riskDistribution: { high: highRiskCount, medium: mediumRiskCount, low: lowRiskCount }
      },
      atRiskCustomers: atRiskCustomers.sort((a, b) => b.riskScore - a.riskScore)
    });
  } catch (error) {
    console.error("Revenue report error:", error);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
