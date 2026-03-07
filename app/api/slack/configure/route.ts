import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      select: { slackWebhookUrl: true }
    });

    return NextResponse.json({
      configured: !!user?.slackWebhookUrl,
      webhookUrl: user?.slackWebhookUrl || null
    });
  } catch (error) {
    console.error("Error fetching Slack config:", error);
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { webhookUrl } = body;

    const user = await prisma.user.findFirst({
      where: { clerkId: userId }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.user.update({
      where: { id: user.id },
      data: { slackWebhookUrl: webhookUrl }
    });

    return NextResponse.json({
      success: true,
      configured: !!webhookUrl,
      webhookUrl: webhookUrl
    });
  } catch (error) {
    console.error("Error saving Slack config:", error);
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}
