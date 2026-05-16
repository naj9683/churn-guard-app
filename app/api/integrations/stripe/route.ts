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
