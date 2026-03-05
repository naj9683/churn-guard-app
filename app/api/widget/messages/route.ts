import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    const customerEmail = searchParams.get('email');

    if (!apiKey || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing apiKey or email' },
        { status: 400, headers: corsHeaders }
      );
    }

    const user = await prisma.user.findFirst({
      where: { widgetEnabled: true },
      include: {
        widgetMessages: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Widget not enabled' },
        { status: 403, headers: corsHeaders }
      );
    }

    const customer = await prisma.customer.findFirst({
      where: { userId: user.id, email: customerEmail },
    });

    const messages = user.widgetMessages.filter(msg => {
      if (msg.trigger === 'risk_score' && customer) {
        return (customer.riskScore || 0) >= 70;
      }
      return msg.trigger === 'manual';
    }).slice(0, 3);

    for (const msg of messages) {
      await prisma.widgetMessage.update({
        where: { id: msg.id },
        data: { impressions: { increment: 1 } },
      });
    }

    return NextResponse.json(
      {
        messages: messages.map(m => ({
          id: m.id,
          title: m.title,
          content: m.content,
          type: m.type,
        })),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Widget messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500, headers: corsHeaders }
    );
  }
}