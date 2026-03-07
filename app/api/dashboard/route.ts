import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by clerkId
    const user = await prisma.user.findFirst({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all customers for this user
    const customers = await prisma.customer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get active playbooks
    const playbooks = await prisma.playbook.findMany({
      where: { userId: user.id, isActive: true },
      take: 5
    });

    // Calculate stats
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

    const activePlaybooks = await prisma.playbook.count({
      where: { userId: user.id, isActive: true }
    });

    return NextResponse.json({
      customers,
      playbooks,
      stats: {
        totalCustomers,
        atRisk,
        monthlyRevenue: monthlyRevenue._sum?.mrr || 0,
        activePlaybooks
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
