import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = searchParams.get('apiKey');
    const customerId = searchParams.get('customerId');

    if (!apiKey || !customerId) {
      return NextResponse.json({ error: "Missing apiKey or customerId" }, { status: 400 });
    }

    // Find user by API key
    const user = await prisma.user.findFirst({
      where: { apiKey: apiKey },
      include: { widgetMessages: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Find customer
    const customer = await prisma.customer.findFirst({
      where: { userId: user.id, externalId: customerId }
    });

    // If no customer found, or widget not enabled, return empty
    if (!customer || !user.widgetEnabled) {
      return NextResponse.json({ messages: [] });
    }

    // Get active messages for this user's widget
    const messages = await prisma.widgetMessage.findMany({
      where: {
        userId: user.id,
        isActive: true
      }
    });

    // Filter messages based on customer conditions
    const relevantMessages = messages.filter(msg => {
      const trigger = msg.trigger;
      
      // Manual messages show to everyone
      if (trigger === 'manual') return true;
      
      // Risk score based
      if (trigger === 'risk_score' && customer.riskScore >= 70) return true;
      
      // High risk customers
      if (trigger === 'high_risk' && customer.riskScore >= 70) return true;
      
      return false;
    });

    return NextResponse.json({
      customerRisk: customer.riskScore,
      messages: relevantMessages.map(msg => ({
        id: msg.id,
        title: msg.title,
        content: msg.content,
        cta: 'Claim Offer'
      }))
    });

  } catch (error) {
    console.error("Widget messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
