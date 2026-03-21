import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VIP_MRR_THRESHOLD = 500;
const RAR_ALERT_THRESHOLD = 5000;

async function sendSlack(webhookUrl: string, text: string) {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
}

/**
 * GET /api/alerts/monitor
 * Runs hourly. Sends Slack alerts for:
 * - Revenue at Risk exceeding $5,000
 * - VIP customers (MRR > $500) at high risk (score ≥ 70)
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      include: { customers: true },
    });

    let alertsSent = 0;

    for (const user of users) {
      if (!user.slackWebhookUrl) continue;

      let totalMRR = 0;
      let atRiskMRR = 0;
      const vipAtRisk: typeof user.customers = [];

      for (const customer of user.customers) {
        const mrr = customer.mrr || 0;
        const riskScore = customer.riskScore || 0;
        totalMRR += mrr;

        if (riskScore >= 70) {
          atRiskMRR += mrr * (riskScore / 100);
          if (mrr >= VIP_MRR_THRESHOLD) {
            vipAtRisk.push(customer);
          }
        }
      }

      if (atRiskMRR >= RAR_ALERT_THRESHOLD) {
        await sendSlack(
          user.slackWebhookUrl,
          `🚨 *Revenue at Risk Alert*: $${Math.round(atRiskMRR).toLocaleString()} of your MRR is at risk (total MRR: $${Math.round(totalMRR).toLocaleString()}). Check your ChurnGuard dashboard.`
        );
        alertsSent++;
      }

      for (const vip of vipAtRisk) {
        await sendSlack(
          user.slackWebhookUrl,
          `⚠️ *VIP Customer Alert*: ${vip.name || vip.email} (MRR: $${vip.mrr}) has a risk score of ${vip.riskScore}. Immediate attention recommended.`
        );
        alertsSent++;
      }
    }

    console.log(`[alerts-monitor] alertsSent=${alertsSent}`);
    return NextResponse.json({ success: true, alertsSent });
  } catch (error) {
    console.error('Monitor error:', error);
    return NextResponse.json({ error: 'Monitoring failed' }, { status: 500 });
  }
}
