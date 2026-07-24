import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET — check whether a Stripe API key is stored for this user
export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId }, select: { id: true } });
  if (!user) return NextResponse.json({ connected: false });

  const integration = await prisma.crmIntegration.findUnique({
    where: { userId_type: { userId: user.id, type: 'stripe' } },
    select: { enabled: true, accessToken: true, syncStatus: true, lastSyncAt: true },
  });

  return NextResponse.json({
    connected: !!(integration?.enabled && integration.accessToken),
    keyPrefix: integration?.accessToken ? integration.accessToken.slice(0, 8) + '…' : null,
    syncStatus: integration?.syncStatus ?? 'disconnected',
    lastSyncAt: integration?.lastSyncAt ?? null,
  });
}

// POST — save a Stripe secret key
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId }, select: { id: true } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { apiKey } = await req.json().catch(() => ({}));
  if (!apiKey || typeof apiKey !== 'string') {
    return NextResponse.json({ error: 'apiKey is required' }, { status: 400 });
  }
  if (!apiKey.startsWith('sk_live_') && !apiKey.startsWith('sk_test_')) {
    return NextResponse.json({ error: 'Must be a Stripe secret key (sk_live_ or sk_test_)' }, { status: 400 });
  }

  // Validate key by making a lightweight Stripe API call
  const testRes = await fetch('https://api.stripe.com/v1/balance', {
    headers: { Authorization: `Bearer ${apiKey}` },
  }).catch(() => null);

  if (!testRes?.ok) {
    return NextResponse.json({ error: 'Invalid Stripe key — could not authenticate with Stripe' }, { status: 422 });
  }

  await prisma.crmIntegration.upsert({
    where: { userId_type: { userId: user.id, type: 'stripe' } },
    create: {
      userId: user.id,
      type: 'stripe',
      accessToken: apiKey,
      enabled: true,
      syncStatus: 'connected',
    },
    update: {
      accessToken: apiKey,
      enabled: true,
      syncStatus: 'connected',
      lastError: null,
      updatedAt: new Date(),
    },
  });

  // Auto-register the ChurnGuard webhook endpoint on the merchant's Stripe account.
  // Capture the signing secret from Stripe's response — it is only returned at creation
  // time and cannot be retrieved later. Store it so the webhook handler can verify events
  // from this account. If the endpoint already exists (400), the previously stored secret
  // remains valid and is not overwritten.
  try {
    const webhookEvents = [
      'customer.subscription.deleted',
      'customer.subscription.updated',
      'invoice.payment_failed',
      'invoice.payment_succeeded',
      'checkout.session.completed',
    ];
    const reqBody = new URLSearchParams({ url: 'https://churnguardapp.com/api/webhooks/stripe' });
    webhookEvents.forEach((e, i) => reqBody.append(`enabled_events[${i}]`, e));

    const webhookRes = await fetch('https://api.stripe.com/v1/webhook_endpoints', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: reqBody.toString(),
    });

    if (webhookRes.ok) {
      const data: { secret?: string } = await webhookRes.json().catch(() => ({}));
      if (data.secret) {
        await prisma.crmIntegration.update({
          where: { userId_type: { userId: user.id, type: 'stripe' } },
          data: { webhookSecret: data.secret },
        });
      }
    }
  } catch {
    // Non-fatal — key was saved; webhook secret will be null until backfill is run
  }

  return NextResponse.json({ connected: true, keyPrefix: apiKey.slice(0, 8) + '…' });
}

// DELETE — remove the stored Stripe key
export async function DELETE() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId }, select: { id: true } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await prisma.crmIntegration.deleteMany({
    where: { userId: user.id, type: 'stripe' },
  });

  return NextResponse.json({ connected: false });
}
