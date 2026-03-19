import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Fetch all users with customers at risk
    const users = await prisma.user.findMany({
      include: {
        customers: {
          where: { riskScore: { gte: 50 } },
          orderBy: { riskScore: 'desc' },
          take: 10,
        },
      },
    });

    let digestsSent = 0;

    for (const user of users) {
      if (!user.slackWebhookUrl || user.customers.length === 0) continue;

      const atRiskMrr = user.customers.reduce((sum, c) => sum + (c.mrr || 0), 0);
      const highRisk = user.customers.filter(c => c.riskScore >= 70).length;

      const message = {
        text: `📊 *Monthly ChurnGuard Digest*\n\n` +
          `• ${user.customers.length} customers at risk\n` +
          `• ${highRisk} high-risk customers (score ≥70)\n` +
          `• $${atRiskMrr.toLocaleString()} MRR at risk\n\n` +
          `Review your dashboard to take action.`,
      };

      try {
        await fetch(user.slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message),
        });
        digestsSent++;
      } catch (err) {
        console.error(`Failed to send digest for user ${user.id}:`, err);
      }
    }

    return NextResponse.json({ success: true, digestsSent });
  } catch (error) {
    console.error("Digest generate error:", error);
    return NextResponse.json({ error: "Failed to generate digest" }, { status: 500 });
  }
}
