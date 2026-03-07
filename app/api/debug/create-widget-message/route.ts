import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const message = await prisma.widgetMessage.create({
      data: {
        userId: user.id,
        title: "We miss you!",
        content: "You have been inactive. Here's a special 20% discount to come back!",
        trigger: "high_risk",
        isActive: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Widget message created!",
      data: message 
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
