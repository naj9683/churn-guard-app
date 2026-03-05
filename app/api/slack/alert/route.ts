import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface AlertData {
  customerId: string;
  alertType: 'high_risk' | 'critical_risk' | 'payment_failed' | 'churned';
  riskScore?: number;
  mrr?: number;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: AlertData = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { slackWebhookUrl: true, email: true },
    });

    if (!user?.slackWebhookUrl) {
      return NextResponse.json({ error: 'Slack not configured' }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, userId },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const emoji = {
      high_risk: '⚠️',
      critical_risk: '🚨',
      payment_failed: '💳',
      churned: '💔',
    }[data.alertType];

    const mrr = data.mrr || customer.mrr || 0;
    const arr = mrr * 12;

    const slackMessage = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${emoji} ChurnGuard Alert: ${data.alertType.replace('_', ' ').toUpperCase()}`,
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Customer:*\n${customer.name || customer.email}`,
            },
            {
              type: 'mrkdwn',
              text: `*Risk Score:*\n${data.riskScore || customer.riskScore}/100`,
            },
            {
              type: 'mrkdwn',
              text: `*Monthly Revenue:*\n$${mrr.toLocaleString()}`,
            },
            {
              type: 'mrkdwn',
              text: `*Annual Revenue:*\n$${arr.toLocaleString()}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: data.message || `Customer ${customer.email} has triggered a ${data.alertType} alert.`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View in Dashboard',
              },
              url: `https://churn-guard-app.vercel.app/dashboard/customers/${customer.id}`,
              style: 'primary',
            },
          ],
        },
      ],
    };

    const response = await fetch(user.slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage),
    });

    const success = response.ok;

    await prisma.slackAlert.create({
      data: {
        userId,
        customerId: data.customerId,
        alertType: data.alertType,
        mrrAtRisk: mrr,
        messageSent: success,
        errorMessage: success ? null : await response.text(),
      },
    });

    if (!success) {
      return NextResponse.json({ error: 'Failed to send Slack alert' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Alert sent' });
  } catch (error) {
    console.error('Slack alert error:', error);
    return NextResponse.json({ error: 'Failed to send alert' }, { status: 500 });
  }
}