import React, { useCallback, useEffect, useState } from 'react';
import Stripe from 'stripe';
import {
  Badge,
  Banner,
  Box,
  Button,
  Divider,
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
  const apiBase = (environment?.constants as Record<string, string> | undefined)?.API_BASE
    ?? `${APP_URL}/api/stripe-app`;
  const isTestMode = environment?.mode === 'test';

  const atRisk = rows.filter(r => r.riskScore >= 40);
  const highRisk = rows.filter(r => r.riskScore >= 70);
  const revenueAtRisk = atRisk.reduce((sum, r) => sum + r.mrr, 0);
  const displayRows = showingAll ? rows : rows.slice(0, 8);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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

      const chargesByCustomer: Record<string, Stripe.Charge[]> = {};
      for (const charge of chargesRes.data) {
        const cid = typeof charge.customer === 'string'
          ? charge.customer
          : charge.customer?.id;
        if (!cid) continue;
        (chargesByCustomer[cid] ??= []).push(charge);
      }

      const built: CustomerRow[] = [];
      for (const sub of subscriptionsRes.data) {
        const customer =
          typeof sub.customer === 'object' &&
          sub.customer &&
          !('deleted' in sub.customer)
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
          subscriptionStatus: sub.status,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          daysSinceLastPayment: daysSince,
          mrr: risk.mrr,
        });
      }

      built.sort((a, b) => b.riskScore - a.riskScore);
      setRows(built);

      try {
        const sig = await fetchStripeSignature();
        await fetch(`${apiBase}/risk?account_id=${accountId}`, {
          headers: { 'stripe-signature': sig },
        });
      } catch {
        // Backend unavailable — Stripe-native scores are shown
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

  if (loading) {
    return (
      <Box css={{ stack: 'y', gap: 'medium', padding: 'large', alignX: 'center' }}>
        <Spinner />
        <Box css={{ font: 'body' }}>Analyzing churn risk across your customers…</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>
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

  if (rows.length === 0) {
    return (
      <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>
        {isTestMode && (
          <Banner
            type="caution"
            title="Test mode"
            description="Showing test data. Switch to live mode to see real customer risk."
          />
        )}
        <Box css={{
          stack: 'y',
          gap: 'medium',
          padding: 'large',
          backgroundColor: 'container',
          borderRadius: 'medium',
        }}>
          <Box css={{ font: 'heading' }}>ChurnGuard</Box>
          <Box css={{ font: 'body' }}>
            Connect your Stripe account to see churn risk scores for all your subscribers — automatically.
          </Box>
          <Box css={{ font: 'body' }}>
            ChurnGuard detects at-risk customers the moment payment signals appear and sends
            targeted retention messages before they cancel.
          </Box>
          <Inline>
            <Button type="primary" href={signupUrl()} target="_blank">
              Start Free Trial
            </Button>
          </Inline>
          <Inline>
            <Link href={`${APP_URL}/pricing?source=stripe_app`} external>
              See all plans →
            </Link>
          </Inline>
        </Box>
      </Box>
    );
  }

  return (
    <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>
      {isTestMode && (
        <Banner
          type="caution"
          title="Test mode"
          description="Showing test data. Switch to live mode to see real customer risk."
        />
      )}
      <Banner
        type="default"
        title="Auto-recover at-risk customers"
        description="ChurnGuard automatically sends personalized email and SMS when churn signals appear — no manual work required."
        actions={
          <Button type="primary" href={signupUrl()} target="_blank">
            Start Free Trial
          </Button>
        }
      />
      <Divider />
      <Box css={{ stack: 'x', gap: 'medium' }}>
        <Box css={{
          stack: 'y',
          gap: 'xsmall',
          padding: 'medium',
          backgroundColor: 'container',
          borderRadius: 'medium',
          width: '1/3',
        }}>
          <Box css={{ font: 'caption' }}>At Risk</Box>
          <Box css={{ font: 'title' }}>{atRisk.length}</Box>
          <Box css={{ font: 'caption' }}>score ≥ 40</Box>
        </Box>
        <Box css={{
          stack: 'y',
          gap: 'xsmall',
          padding: 'medium',
          backgroundColor: 'container',
          borderRadius: 'medium',
          width: '1/3',
        }}>
          <Box css={{ font: 'caption' }}>High Risk</Box>
          <Box css={{ font: 'title' }}>{highRisk.length}</Box>
          <Box css={{ font: 'caption' }}>need action now</Box>
        </Box>
        <Box css={{
          stack: 'y',
          gap: 'xsmall',
          padding: 'medium',
          backgroundColor: 'container',
          borderRadius: 'medium',
          width: '1/3',
        }}>
          <Box css={{ font: 'caption' }}>MRR at Risk</Box>
          <Box css={{ font: 'title' }}>
            ${revenueAtRisk.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </Box>
          <Box css={{ font: 'caption' }}>monthly</Box>
        </Box>
      </Box>
      <Divider />
      <Box css={{ stack: 'x', gap: 'small', alignY: 'center' }}>
        <Box css={{ font: 'subheading' }}>Customer Risk Monitor</Box>
        <Badge type="neutral">{rows.length} subscriptions</Badge>
      </Box>
      <Box css={{ stack: 'y', gap: 'xsmall' }}>
        <Box css={{ stack: 'x', gap: 'small', paddingX: 'small' }}>
          <Box css={{ width: '1/3', font: 'caption' }}>Customer</Box>
          <Box css={{ width: '1/6', font: 'caption' }}>Risk</Box>
          <Box css={{ width: '1/6', font: 'caption' }}>Status</Box>
          <Box css={{ width: '1/6', font: 'caption' }}>Last Payment</Box>
          <Box css={{ width: '1/6', font: 'caption' }}>MRR</Box>
        </Box>
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
            <Box css={{ width: '1/3', stack: 'y', gap: 'xxsmall' }}>
              <Link href={signupUrl(row.id)} target="_blank">
                <Box css={{ font: 'bodyEmphasized' }}>{row.name}</Box>
              </Link>
              <Box css={{ font: 'caption' }}>{row.email}</Box>
            </Box>
            <Box css={{ width: '1/6' }}>
              <Badge type={riskBadgeType(row.riskLevel)}>
                {row.riskScore}{' '}
                {row.riskLevel === 'high' ? 'High' : row.riskLevel === 'medium' ? 'Med' : 'Low'}
              </Badge>
            </Box>
            <Box css={{ width: '1/6' }}>
              <Badge type={subscriptionBadgeType(row.subscriptionStatus, row.cancelAtPeriodEnd)}>
                {subscriptionLabel(row.subscriptionStatus, row.cancelAtPeriodEnd)}
              </Badge>
            </Box>
            <Box css={{ width: '1/6', font: 'body' }}>
              {row.daysSinceLastPayment !== null ? `${row.daysSinceLastPayment}d ago` : '—'}
            </Box>
            <Box css={{ width: '1/6', font: 'body' }}>
              ${row.mrr.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
            </Box>
          </Box>
        ))}
        {rows.length > 8 && (
          <Box css={{ alignX: 'center', paddingY: 'small' }}>
            <Button type="secondary" onPress={() => setShowingAll(v => !v)}>
              {showingAll ? 'Show less' : `Show all ${rows.length} customers`}
            </Button>
          </Box>
        )}
      </Box>
      <Divider />
      <Inline>
        <Link href={`${APP_URL}/pricing?source=stripe_app`} external>
          View full AI-powered dashboard →
        </Link>
      </Inline>
    </Box>
  );
}
