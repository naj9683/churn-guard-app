import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const webhookUrl = searchParams.get('webhookUrl');

    if (!webhookUrl) {
      return NextResponse.json({ error: 'Missing webhookUrl' }, { status: 400 });
    }

    if (!webhookUrl.startsWith('https://hooks.slack.com/')) {
      return NextResponse.json({ error: 'Invalid Slack webhook URL' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { slackWebhookUrl: webhookUrl },
    });

    try {
      const testResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '✅ ChurnGuard Slack integration activated!',
        }),
      });

      if (!testResponse.ok) {
        return NextResponse.json({ error: 'Webhook test failed' }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Failed to test webhook' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Slack configured successfully' });
  } catch (error) {
    console.error('Slack config error:', error);
    return NextResponse.json({ error: 'Failed to configure Slack' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const webhookUrl = body.webhookUrl;

    if (!webhookUrl?.startsWith('https://hooks.slack.com/')) {
      return NextResponse.json({ error: 'Invalid Slack webhook URL' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { slackWebhookUrl: webhookUrl },
    });

    try {
      const testResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '✅ ChurnGuard Slack integration activated!',
        }),
      });

      if (!testResponse.ok) {
        return NextResponse.json({ error: 'Webhook test failed' }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Failed to test webhook' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Slack configured successfully' });
  } catch (error) {
    console.error('Slack config error:', error);
    return NextResponse.json({ error: 'Failed to configure Slack' }, { status: 500 });
  }
}