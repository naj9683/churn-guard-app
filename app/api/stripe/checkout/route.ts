import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// CORS headers for widget
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

    // Find user by API key (in production, use proper API key validation)
    const user = await prisma.user.findFirst({
      where: {
        widgetEnabled: true,
      },
      include: {
        widgetMessages: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Widget not enabled' },
        { status: 403, headers: corsHeaders }
      );
    }

    // Find customer
    const customer = await prisma.customer.findFirst({
      where: {
        userId: user.id,
        email: customerEmail,
      },
    });

    // Get messages for this customer
    const messages = user.widgetMessages.filter(msg => {
      // Check if message should show to this customer
      if (msg.trigger === 'risk_score' && customer) {
        return (customer.riskScore || 0) >= 70;
      }
      if (msg.trigger === 'payment_failed') {
        // Would check payment status
        return true;
      }
      return msg.trigger === 'manual';
    }).slice(0, 3); // Max 3 messages

    // Track impression
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
        config: {
          position: 'bottom-right',
          primaryColor: '#8b5cf6',
        },
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

export async function POST(request: Request) {
  try {
    const { apiKey, messageId, action } = await request.json();

    if (!apiKey || !messageId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Track click
    if (action === 'click') {
      await prisma.widgetMessage.update({
        where: { id: messageId },
        data: { clicks: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track action' },
      { status: 500, headers: corsHeaders }
    );
  }
