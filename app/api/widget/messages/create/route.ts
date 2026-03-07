import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { title, content, trigger, isActive } = body;

    const message = await prisma.widgetMessage.create({
      data: {
        userId: user.id,
        title: title || "We miss you!",
        content: content || "Here's a special offer to help you get back on track.",
        trigger: trigger || "high_risk",
        isActive: isActive !== false
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
