/**
 * GET /api/stripe-app/customer?account_id=acct_xxx&customer_id=cus_xxx
 *
 * Called by the Stripe App customer detail view to fetch ChurnGuard-enhanced
 * risk data for a specific customer (AI risk reason, intervention history).
 *
 * Falls back gracefully if the user has not linked a ChurnGuard account.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest) {
  // ── 1. Verify Stripe App signature ─────────────────────────────────────
  const signature = req.headers.get('stripe-signature');
  const appSecret = process.env.STRIPE_APP_SECRET;

  if (appSecret && signature) {
    try {
      stripe.webhooks.signature.verifyHeader(req.url, signature, appSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401, headers: CORS });
    }
  }

  const { searchParams } = req.nextUrl;
  const accountId = searchParams.get('account_id');
  const stripeCustomerId = searchParams.get('customer_id');

  if (!accountId || !stripeCustomerId) {
    return NextResponse.json(
      { error: 'account_id and customer_id are required' },
      { status: 400, headers: CORS }
    );
  }

  // ── 2. Find ChurnGuard customer record by Stripe external ID ───────────
  const customer = await prisma.customer.findFirst({
    where: { externalId: stripeCustomerId },
    select: {
      id: true,
      riskScore: true,
      riskReason: true,
      mrr: true,
      healthScore: true,
      lastLoginAt: true,
      interventions: {
        orderBy: { startedAt: 'desc' },
        take: 3,
        select: {
          interventionType: true,
          status: true,
          mrrSaved: true,
          startedAt: true,
        },
      },
    },
  }).catch(() => null);

  if (!customer) {
    return NextResponse.json(
      {
        linked: false,
        message: 'Customer not found in ChurnGuard. Sign up to enable AI risk scoring.',
      },
      { headers: CORS }
    );
  }

  return NextResponse.json(
    {
      linked: true,
      riskScore: customer.riskScore,
      riskReason: customer.riskReason,
      mrr: customer.mrr,
      healthScore: customer.healthScore,
      lastLoginAt: customer.lastLoginAt,
      recentInterventions: customer.interventions,
    },
    { headers: CORS }
  );
}
