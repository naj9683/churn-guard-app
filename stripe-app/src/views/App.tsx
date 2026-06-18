import React, { useEffect, useState, useCallback } from 'react';
import Stripe from 'stripe';
import {
  Badge,
  Banner,
  BodyText,
  Box,
  Button,
  Divider,
  Heading,
  Inline,
  Link,
  Spinner,
} from '@stripe/ui-extension-sdk/ui';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';
import { createHttpClient, STRIPE_API_KEY } from '@stripe/ui-extension-sdk/http_client';
import { fetchStripeSignature } from '@stripe/ui-extension-sdk/utils';
import {
  calculateRisk,
  riskBadgeType,
  subscriptionBadgeType,
  subscriptionLabel,
} from '../utils/riskScoring';

// Stripe API client — authenticates as the installed account via STRIPE_API_KEY
const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2023-10-16',
});

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: string[];
  subscriptionStatus: string;
  cancelAtPeriodEnd: boolean;
  daysSinceLastPayment: number | null;
  mrr: number;
}

const APP_URL = 'https://churnguardapp.com';

export default function App({ userContext, environment }: ExtensionContextValue) {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showingAll, setShowingAll] = useState(false);

  const accountId = userContext?.account?.id ?? '';
  const apiBase = environment?.constants?.API_BASE ?? `${APP_URL}/api/stripe-app`;
  const isTestMode = environment?.mode === 'test';

  const atRisk = rows.filter(r => r.riskScore >= 40);
  const highRisk = rows.filter(r => r.riskScore >= 70);
  const revenueAtRisk = atRisk.reduce((sum, r) => sum + r.mrr, 0);
  const displayRows = showingAll ? rows : rows.slice(0, 8);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch all subscriptions with customer + latest invoice expanded
      const [subscriptionsRes, chargesRes] = await Promise.all([
        stripe.subscriptions.list({
          limit: 100,
          expand: [
            'data.customer',
            'data.latest_invoice.payment_intent',
            'data.items.data.price',
          ],
        }),
        stripe.charges.list({ limit: 100 }),
      ]);

      // Index charges by customer ID
      const chargesByCustomer: Record<string, Stripe.Charge[]> = {};
      for (const charge of chargesRes.data) {
        const cid = typeof charge.customer === 'string' ? charge.customer : charge.customer?.id;
        if (!cid) continue;
        (chargesByCustomer[cid] ??= []).push(charge);
      }

      // Build customer rows
      const built: CustomerRow[] = [];
      for (const sub of subscriptionsRes.data) {
        const customer = typeof sub.customer === 'object' && sub.customer && !('deleted' in sub.customer)
          ? (sub.customer as Stripe.Customer)
          : null;
        if (!customer) continue;

        const customerCharges = chargesByCustomer[customer.id] ?? [];
        const risk = calculateRisk(sub, customerCharges);

        const lastSuccess = customerCharges.find(c => c.status === 'succeeded');
        const daysSince = lastSuccess
          ? Math.floor((Date.now() / 1000 - lastSuccess.created) / 86400)
          : null;

        built.push({
          id: customer.id,
          name: customer.name ?? customer.email ?? 'Unknown',
          email: customer.email ?? '',
          riskScore: risk.score,
          riskLevel: risk.level,
          riskFactors: risk.factors,
          subscriptionStatus: sub.status,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          daysSinceLastPayment: daysSince,
          mrr: risk.mrr,
        });
      }

      built.sort((a, b) => b.riskScore - a.riskScore);
      setRows(built);

      // 2. Optionally fetch enhanced scores from ChurnGuard backend (non-blocking)
      try {
        const sig = await fetchStripeSignature();
        await fetch(`${apiBase}/risk?account_id=${accountId}`, {
          method: 'GET',
          headers: { 'stripe-signature': sig },
        });
        // Future: merge ChurnGuard AI scores into rows
      } catch {
        // Backend unavailable — Stripe-native scores are shown instead
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load risk data');
    } finally {
      setLoading(false);
    }
  }, [accountId, apiBase]);

  useEffect(() => {
    load();
  }, [load]);

  const signupUrl = (customerId?: string) => {
    const params = new URLSearchParams({
      stripe_account_id: accountId,
      source: 'stripe_app',
      ...(customerId ? { customer_id: customerId } : {}),
    });
    return `${APP_URL}/signup?${params}`;
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box css={{ stack: 'y', gap: 'medium', padding: 'large', alignX: 'center' }}>
        <Spinner />
        <BodyText>Analyzing churn risk across your customers…</BodyText>
      </Box>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Box css={{ padding: 'medium', stack: 'y', gap: 'medium' }}>
        <Banner
          type="caution"
          title="Failed to load risk data"
          description={error}
          onDismiss={() => setError(null)}
        />
        <Button onPress={load}>Retry</Button>
      </Box>
    );
  }

  // ── Main view ────────────────────────────────────────────────────────────
  return (
    <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>

      {/* Test mode notice */}
      {isTestMode && (
        <Banner
          type="caution"
          title="Test mode"
          description="Showing test data. Switch to live mode to see real customer risk."
        />
      )}

      {/* Upgrade CTA banner */}
      <Box css={{
        stack: 'x',
        gap: 'medium',
        padding: 'medium',
        borderRadius: 'medium',
        alignY: 'center',
      }}>
        <Box css={{ stack: 'y', gap: 'xsmall', width: '3/4' }}>
          <Heading size="small">Auto-recover at-risk customers</Heading>
          <BodyText>
            ChurnGuard sends personalized email and SMS retention campaigns automatically
            the moment a churn signal appears — no manual work required.
          </BodyText>
        </Box>
        <Box css={{ width: '1/4' }}>
          <Button
            type="primary"
            href={signupUrl()}
          >
            Start Free Trial
          </Button>
        </Box>
      </Box>

      <Divider />

      {/* Summary stats */}
      <Box css={{ stack: 'x', gap: 'medium' }}>
        <Box css={{
          stack: 'y',
          gap: 'xsmall',
          padding: 'medium',
          backgroundColor: 'container',
          borderRadius: 'medium',
          width: '1/3',
        }}>
          <BodyText>At Risk</BodyText>
          <Heading size="xlarge">{atRisk.length}</Heading>
          <BodyText>customers (score ≥ 40)</BodyText>
        </Box>

        <Box css={{
          stack: 'y',
          gap: 'xsmall',
          padding: 'medium',
          backgroundColor: 'container',
          borderRadius: 'medium',
          width: '1/3',
        }}>
          <BodyText>High Risk</BodyText>
          <Heading size="xlarge">{highRisk.length}</Heading>
          <BodyText>need immediate action</BodyText>
        </Box>

        <Box css={{
          stack: 'y',
          gap: 'xsmall',
          padding: 'medium',
          backgroundColor: 'container',
          borderRadius: 'medium',
          width: '1/3',
        }}>
          <BodyText>MRR at Risk</BodyText>
          <Heading size="xlarge">
            ${revenueAtRisk.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </Heading>
          <BodyText>monthly recurring revenue</BodyText>
        </Box>
      </Box>

      <Divider />

      {/* Customer list header */}
      <Box css={{ stack: 'x', gap: 'small', alignY: 'center' }}>
        <Heading size="small">Customer Risk Monitor</Heading>
        <Badge type="neutral">{rows.length} subscriptions</Badge>
      </Box>

      {rows.length === 0 ? (
        <Box css={{ padding: 'large', alignX: 'center' }}>
          <BodyText>No active subscriptions found in this account.</BodyText>
        </Box>
      ) : (
        <Box css={{ stack: 'y', gap: 'xsmall' }}>

          {/* Column headers */}
          <Box css={{ stack: 'x', gap: 'small', paddingX: 'small' }}>
            <Box css={{ width: '1/3' }}><BodyText>Customer</BodyText></Box>
            <Box css={{ width: '1/6' }}><BodyText>Risk</BodyText></Box>
            <Box css={{ width: '1/6' }}><BodyText>Status</BodyText></Box>
            <Box css={{ width: '1/6' }}><BodyText>Last Payment</BodyText></Box>
            <Box css={{ width: '1/6' }}><BodyText>MRR</BodyText></Box>
          </Box>

          {/* Rows */}
          {displayRows.map(row => (
            <Box
              key={row.id}
              css={{
                stack: 'x',
                gap: 'small',
                padding: 'small',
                backgroundColor: 'container',
                borderRadius: 'medium',
                alignY: 'center',
              }}
            >
              {/* Name / email */}
              <Box css={{ width: '1/3', stack: 'y', gap: 'none' }}>
                <Link href={signupUrl(row.id)}>
                  <BodyText>{row.name}</BodyText>
                </Link>
                <BodyText>{row.email}</BodyText>
              </Box>

              {/* Risk badge */}
              <Box css={{ width: '1/6' }}>
                <Badge type={riskBadgeType(row.riskLevel)}>
                  {row.riskScore} {row.riskLevel === 'high' ? 'High' : row.riskLevel === 'medium' ? 'Med' : 'Low'}
                </Badge>
              </Box>

              {/* Subscription status */}
              <Box css={{ width: '1/6' }}>
                <Badge type={subscriptionBadgeType(row.subscriptionStatus, row.cancelAtPeriodEnd)}>
                  {subscriptionLabel(row.subscriptionStatus, row.cancelAtPeriodEnd)}
                </Badge>
              </Box>

              {/* Days since last payment */}
              <Box css={{ width: '1/6' }}>
                <BodyText>
                  {row.daysSinceLastPayment !== null ? `${row.daysSinceLastPayment}d ago` : '—'}
                </BodyText>
              </Box>

              {/* MRR */}
              <Box css={{ width: '1/6' }}>
                <BodyText>
                  ${row.mrr.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
                </BodyText>
              </Box>
            </Box>
          ))}

          {/* Show more / less toggle */}
          {rows.length > 8 && (
            <Box css={{ alignX: 'center', paddingY: 'small' }}>
              <Button
                type="secondary"
                onPress={() => setShowingAll(v => !v)}
              >
                {showingAll ? 'Show less' : `Show all ${rows.length} customers`}
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Divider />

      <Inline>
        <Link href={`${APP_URL}/pricing?source=stripe_app`}>
          View full AI-powered dashboard →
        </Link>
      </Inline>
    </Box>
  );
}
