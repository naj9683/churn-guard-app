import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id } = params;

    // Find customer by ID (internal UUID) or externalId
    const customer = await prisma.customer.findFirst({
      where: { 
        userId: user.id,
        OR: [
          { id: id },
          { externalId: id }
        ]
      }
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Get customer events
    const events = await prisma.event.findMany({
      where: { customerId: customer.id },
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    // Calculate stats
    const totalEvents = await prisma.event.count({
      where: { customerId: customer.id }
    });

    return NextResponse.json({
      customer: {
        id: customer.id,
        externalId: customer.externalId,
        email: customer.email,
        riskScore: customer.riskScore,
        mrr: customer.mrr,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
      },
      events: events.map(e => ({
        id: e.id,
        event: e.event,
        metadata: e.metadata,
        timestamp: e.timestamp
      })),
      stats: {
        totalEvents,
        daysSinceJoined: Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      }
    });

  } catch (error) {
    console.error("Customer details error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
