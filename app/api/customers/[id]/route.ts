import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    console.log("Auth userId:", userId);
    
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    console.log("Found user:", user?.id);
    
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id } = params;
    console.log("Looking for customer ID:", id);

    // Try to find by ID only
    let customer = await prisma.customer.findFirst({
      where: { id: id }
    });
    
    console.log("Found by ID:", customer?.id);

    if (!customer) {
      customer = await prisma.customer.findFirst({
        where: { externalId: id }
      });
      console.log("Found by externalId:", customer?.id);
    }

    // If found with wrong userId, fix it
    if (customer && user && customer.userId !== user.id) {
      console.log("Updating customer userId from", customer.userId, "to", user.id);
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { userId: user.id }
      });
    }

    if (!customer) {
      console.log("Customer not found for ID:", id);
      return NextResponse.json({ error: "Customer not found", searchedId: id }, { status: 404 });
    }

    const events = await prisma.event.findMany({
      where: { customerId: customer.id },
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    return NextResponse.json({
      customer: {
        id: customer.id,
        externalId: customer.externalId,
        email: customer.email,
        name: customer.name,
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
        totalEvents: events.length,
        daysSinceJoined: Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      }
    });

  } catch (error) {
    console.error("Customer details error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
