import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, customerId, event, metadata, timestamp } = body;

    console.log("Track request:", { apiKey, customerId, event });

    if (!apiKey || !customerId || !event) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find user by API key
    const user = await prisma.user.findFirst({
      where: { apiKey: apiKey }
    });

    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { userId: user.id, externalId: customerId }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          userId: user.id,
          externalId: customerId,
          email: metadata?.email || `${customerId}@unknown.com`,
          name: metadata?.name || customerId,
          mrr: metadata?.mrr || 0,
          riskScore: 50
        }
      });
    }

    // Create event
    await prisma.event.create({
      data: {
        customerId: customer.id,
        event: event,
        metadata: metadata || {},
        timestamp: timestamp || Date.now()
      }
    });

    // Update risk score based on event type
    let riskChange = 0;
    if (event === 'payment_failed') riskChange = 20;
    else if (event === 'no_login_7_days') riskChange = 15;
    else if (event === 'downgrade_attempt') riskChange = 30;
    else if (event === 'login') riskChange = -5;

    const newRiskScore = Math.max(0, Math.min(100, customer.riskScore + riskChange));

    await prisma.customer.update({
      where: { id: customer.id },
      data: { riskScore: newRiskScore, updatedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      customerId: customerId,
      riskScore: newRiskScore
    });

  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
