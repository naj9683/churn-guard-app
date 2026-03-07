import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      select: { slackWebhookUrl: true, email: true }
    });

    if (!user?.slackWebhookUrl) {
      return NextResponse.json({ error: "Slack webhook not configured" }, { status: 400 });
    }

    const testMessage = {
      text: "🧪 ChurnGuard Test Alert",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Test Alert from ChurnGuard*\n\nThis is a test notification to verify your Slack integration is working correctly.\n\n• User: ${user.email}\n• Time: ${new Date().toLocaleString()}`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Open Dashboard"
              },
              url: "https://churn-guard-app.vercel.app/dashboard",
              style: "primary"
            }
          ]
        }
      ]
    };

    const response = await fetch(user.slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMessage)
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Test message sent" });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ error: `Slack error: ${errorText}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Error sending test:", error);
    return NextResponse.json({ error: "Failed to send test" }, { status: 500 });
  }
}
