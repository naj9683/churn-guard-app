import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // Find customer - try ID first
    let customer = await prisma.customer.findUnique({
      where: { id: id }
    });

    // If not found, try externalId
    if (!customer) {
      customer = await prisma.customer.findFirst({
        where: { externalId: id }
      });
    }

    // If still not found, check all customers
    if (!customer) {
      return NextResponse.json({ 
        error: "Customer not found", 
        searched: id,
        userId: user.id
      }, { status: 404 });
    }

    // Get events
    const events = await prisma.event.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({
      customer: {
        id: customer.id,
        externalId: customer.externalId,
        email: customer.email,
        name: customer.name,
        riskScore: customer.riskScore,
        mrr: customer.mrr,
        arr: customer.arr,
        plan: customer.plan,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
      },
      events: events || [],
      stats: {
        totalEvents: events?.length || 0
      }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      error: "Server error", 
      message: error?.message || "Unknown error",
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}
