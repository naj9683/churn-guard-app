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

    const user = await prisma.user.findFirst({ where: { apiKey: apiKey } });
    if (!user) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    const customer = await prisma.customer.findFirst({
      where: { userId: user.id, externalId: customerId }
    });

    if (!customer) return NextResponse.json({ messages: [] });

    const messages = await prisma.widgetMessage.findMany({
      where: { userId: user.id, isActive: true }
    });

    const relevant = messages.filter(msg => {
      if (msg.trigger === 'manual') return true;
      if (msg.trigger === 'high_risk' && customer.riskScore >= 70) return true;
      return false;
    });

    return NextResponse.json({
      customerRisk: customer.riskScore,
      messages: relevant.map(msg => ({
        id: msg.id,
        title: msg.title,
        content: msg.content,
        cta: 'Claim Offer'
      }))
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
