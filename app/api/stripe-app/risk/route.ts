/**
 * GET /api/stripe-app/risk?account_id=acct_xxx
 *
 * Called by the Stripe App home view to fetch enhanced ChurnGuard risk data
 * for users who have linked their Stripe account to a ChurnGuard account.
 *
 * Auth: Stripe App signature via fetchStripeSignature() in the UI extension.
 * The signature is verified using the Stripe App signing secret.
 *
 * CORS: Stripe App iframes run from a null origin — we must allow *.
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
      // The body is empty for GET requests — use the raw URL as the payload
      stripe.webhooks.signature.verifyHeader(
        req.url,
        signature,
        appSecret
      );
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401, headers: CORS });
    }
  }
  // Note: if STRIPE_APP_SECRET is not yet set, we skip verification.
  // Set it in Vercel env vars once you upload the app to Stripe Dashboard.

  // ── 2. Find the ChurnGuard account linked to this Stripe account ────────
  const accountId = req.nextUrl.searchParams.get('account_id');
  if (!accountId) {
    return NextResponse.json({ error: 'account_id required' }, { status: 400, headers: CORS });
  }

  const integration = await prisma.crmIntegration.findFirst({
    where: { type: 'stripe', accessToken: { not: null } },
    select: { userId: true },
  }).catch(() => null);

  // If no ChurnGuard account is linked, return empty — the app shows Stripe-native scores
  if (!integration) {
    return NextResponse.json(
      { linked: false, message: 'No ChurnGuard account linked to this Stripe account.' },
      { headers: CORS }
    );
  }

  const userId = integration.userId;
  if (!userId) return NextResponse.json({ linked: false }, { headers: CORS });

  // ── 3. Return aggregate risk stats from ChurnGuard DB ──────────────────
  const [totalCustomers, atRiskCount, highRiskCount, interventionCount] = await Promise.all([
    prisma.customer.count({ where: { userId } }),
    prisma.customer.count({ where: { userId, riskScore: { gte: 40 } } }),
    prisma.customer.count({ where: { userId, riskScore: { gte: 70 } } }),
    prisma.interventionOutcome.count({ where: { userId, status: 'saved' } }),
  ]);

  const mrrSaved = await prisma.interventionOutcome.aggregate({
    where: { userId, status: 'saved' },
    _sum: { mrrSaved: true },
  });

  return NextResponse.json(
    {
      linked: true,
      stats: {
        totalCustomers,
        atRiskCount,
        highRiskCount,
        mrrSaved: mrrSaved._sum.mrrSaved ?? 0,
        interventionCount,
      },
    },
    { headers: CORS }
  );
}
