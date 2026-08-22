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
  type RiskResult,
} from '../utils/riskScoring';

const stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient(),
  apiVersion: '2023-10-16',
});

const APP_URL = 'https://churnguardapp.com';

function fmtMrr(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}

export default function CustomerDetailView({ userContext, environment }: ExtensionContextValue) {
  const customerId = environment?.objectContext?.id ?? '';
  const accountId = userContext?.account?.id ?? '';
  const apiBase = (environment?.constants as Record<string, string> | undefined)?.API_BASE
    ?? `${APP_URL}/api/stripe-app`;

  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [subStatus, setSubStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    setError(null);
    try {
      const [customer, subscriptions, charges] = await Promise.all([
        stripe.customers.retrieve(customerId),
        stripe.subscriptions.list({
          customer: customerId,
          limit: 10,
          expand: ['data.items.data.price'],
        }),
        stripe.charges.list({ customer: customerId, limit: 30 }),
      ]);

      if (!customer || 'deleted' in customer) {
        setError('Customer not found or has been deleted.');
        return;
      }

      setCustomerName(customer.name ?? customer.email ?? customerId);

      const activeSub =
        subscriptions.data.find(s => s.status === 'active') ??
        subscriptions.data.find(s => s.status === 'past_due') ??
        subscriptions.data[0] ??
        null;

      if (activeSub) {
        setSubStatus(activeSub.status);
        setCancelAtPeriodEnd(activeSub.cancel_at_period_end);
      }

      const result = calculateRisk(activeSub ?? null, charges.data);
      setRisk(result);

      const lastSuccess = charges.data.find(c => c.status === 'succeeded');
      if (lastSuccess) {
        setDaysSince(Math.floor((Date.now() / 1000 - lastSuccess.created) / 86400));
      }

      // Fetch enhanced ChurnGuard data in background — non-blocking
      try {
        const sig = await fetchStripeSignature();
        await fetch(
          `${apiBase}/customer?account_id=${accountId}&customer_id=${customerId}`,
          { headers: { 'stripe-signature': sig } }
        );
      } catch {
        // Backend unavailable — Stripe-native scores shown
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load customer data');
    } finally {
      setLoading(false);
    }
  }, [customerId, accountId, apiBase]);

  useEffect(() => {
    load();
  }, [load]);

  const signupParams = new URLSearchParams({
    stripe_account_id: accountId,
    customer_id: customerId,
    source: 'stripe_app_customer',
  });
  const signupUrl = `${APP_URL}/signup?${signupParams}`;

  if (!customerId) {
    return (
      <Box css={{ padding: 'medium' }}>
        <Box css={{ font: 'body' }}>No customer selected.</Box>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box css={{ padding: 'large', stack: 'y', gap: 'medium', alignX: 'center' }}>
        <Spinner />
        <Box css={{ font: 'body' }}>Calculating churn risk…</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box css={{ padding: 'medium', stack: 'y', gap: 'medium' }}>
        <Banner
          type="caution"
          title="Could not load customer data"
          description="Stripe returned an error. Check that ChurnGuard has the required permissions, then retry."
        />
        <Button onPress={load}>Retry</Button>
      </Box>
    );
  }

  if (!risk) return null;

  return (
    <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>

      {/* Header row */}
      <Box css={{ stack: 'x', gap: 'medium', alignY: 'center' }}>
        <Box css={{ font: 'heading' }}>ChurnGuard Risk</Box>
        <Badge type={riskBadgeType(risk.level)}>
          {risk.score}/100 — {risk.level === 'high' ? 'High' : risk.level === 'medium' ? 'Medium' : 'Low'} Risk
        </Badge>
      </Box>

      {/* Stats row */}
      <Box css={{ stack: 'x', gap: 'small' }}>
        {subStatus && (
          <Box css={{
            stack: 'y', gap: 'xsmall', padding: 'small',
            backgroundColor: 'container', borderRadius: 'medium', width: '1/3',
          }}>
            <Box css={{ font: 'caption' }}>Subscription</Box>
            <Badge type={subscriptionBadgeType(subStatus, cancelAtPeriodEnd)}>
              {subscriptionLabel(subStatus, cancelAtPeriodEnd)}
            </Badge>
          </Box>
        )}

        <Box css={{
          stack: 'y', gap: 'xsmall', padding: 'small',
          backgroundColor: 'container', borderRadius: 'medium', width: '1/3',
        }}>
          <Box css={{ font: 'caption' }}>MRR</Box>
          <Box css={{ font: 'bodyEmphasized' }}>
            {fmtMrr(risk.mrr)}
          </Box>
        </Box>

        <Box css={{
          stack: 'y', gap: 'xsmall', padding: 'small',
          backgroundColor: 'container', borderRadius: 'medium', width: '1/3',
        }}>
          <Box css={{ font: 'caption' }}>Last Payment</Box>
          <Box css={{ font: 'bodyEmphasized' }}>
            {daysSince !== null ? `${daysSince}d ago` : '—'}
          </Box>
        </Box>
      </Box>

      {/* Risk factors */}
      {risk.factors.length > 0 && (
        <>
          <Divider />
          <Box css={{ stack: 'y', gap: 'xsmall' }}>
            <Box css={{ font: 'subheading' }}>Risk Factors</Box>
            {risk.factors.map((factor, i) => (
              <Box
                key={i}
                css={{
                  stack: 'x', gap: 'small', padding: 'xsmall',
                  backgroundColor: 'container', borderRadius: 'small', alignY: 'center',
                }}
              >
                <Badge type={risk.level === 'high' ? 'negative' : risk.level === 'medium' ? 'warning' : 'positive'}>
                  {i + 1}
                </Badge>
                <Box css={{ font: 'body', width: 'fill' }}>{factor}</Box>
              </Box>
            ))}
          </Box>
        </>
      )}

      <Divider />

      {/* CTA */}
      <Box css={{ stack: 'y', gap: 'small' }}>
        <Box css={{ font: 'body' }}>
          Prevent {customerName.split(' ')[0]} from churning — ChurnGuard sends automated retention
          messages the moment risk signals appear.
        </Box>
        <Inline>
          <Button type="primary" href={signupUrl} target="_blank">
            Prevent Churn — Start Free Trial
          </Button>
        </Inline>
        <Inline>
          <Link href={`${APP_URL}/pricing?source=stripe_app`} external>
            See all ChurnGuard plans →
          </Link>
        </Inline>
      </Box>
    </Box>
  );
}
