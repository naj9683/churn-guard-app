import React, { useCallback, useEffect, useState } from 'react';
import Stripe from 'stripe';
import {
  Badge,
  BodyText,
  Box,
  Button,
  Divider,
  Heading,
  Inline,
  Link,
  Spinner,
  Banner,
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

export default function CustomerDetailView({ userContext, environment }: ExtensionContextValue) {
  const customerId = environment?.objectContext?.id ?? '';
  const accountId = userContext?.account?.id ?? '';
  const apiBase = environment?.constants?.API_BASE ?? `${APP_URL}/api/stripe-app`;

  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [subStatus, setSubStatus] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [mrr, setMrr] = useState(0);
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

      // Use the most recent active or past_due subscription
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
      setMrr(result.mrr);

      const lastSuccess = charges.data.find(c => c.status === 'succeeded');
      if (lastSuccess) {
        setDaysSince(Math.floor((Date.now() / 1000 - lastSuccess.created) / 86400));
      }

      // Fetch ChurnGuard enhanced score (non-blocking)
      try {
        const sig = await fetchStripeSignature();
        await fetch(`${apiBase}/customer?account_id=${accountId}&customer_id=${customerId}`, {
          headers: { 'stripe-signature': sig },
        });
        // Future: overlay AI-powered ChurnGuard score when user has linked account
      } catch {
        // Backend unavailable — Stripe-native score shown
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

  const signupUrl = new URLSearchParams({
    stripe_account_id: accountId,
    customer_id: customerId,
    source: 'stripe_app_customer',
  });

  if (!customerId) {
    return (
      <Box css={{ padding: 'medium' }}>
        <BodyText>No customer selected.</BodyText>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box css={{ padding: 'large', stack: 'y', gap: 'medium', alignX: 'center' }}>
        <Spinner />
        <BodyText>Calculating churn risk…</BodyText>
      </Box>
    );
  }

  if (error) {
    return (
      <Box css={{ padding: 'medium', stack: 'y', gap: 'medium' }}>
        <Banner type="caution" title="Error" description={error} onDismiss={() => setError(null)} />
        <Button onPress={load}>Retry</Button>
      </Box>
    );
  }

  if (!risk) return null;

  return (
    <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>

      {/* Header */}
      <Box css={{ stack: 'x', gap: 'medium', alignY: 'center' }}>
        <Heading size="medium">ChurnGuard Risk</Heading>
        <Badge type={riskBadgeType(risk.level)}>
          {risk.score}/100 — {risk.level === 'high' ? 'High Risk' : risk.level === 'medium' ? 'Medium Risk' : 'Low Risk'}
        </Badge>
      </Box>

      {/* At-a-glance stats */}
      <Box css={{ stack: 'x', gap: 'small' }}>
        {subStatus && (
          <Box css={{ stack: 'y', gap: 'xsmall', padding: 'small', backgroundColor: 'container', borderRadius: 'medium', width: '1/3' }}>
            <BodyText>Subscription</BodyText>
            <Badge type={subscriptionBadgeType(subStatus, cancelAtPeriodEnd)}>
              {subscriptionLabel(subStatus, cancelAtPeriodEnd)}
            </Badge>
          </Box>
        )}
        <Box css={{ stack: 'y', gap: 'xsmall', padding: 'small', backgroundColor: 'container', borderRadius: 'medium', width: '1/3' }}>
          <BodyText>MRR</BodyText>
          <Heading size="small">
            ${mrr.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
          </Heading>
        </Box>
        <Box css={{ stack: 'y', gap: 'xsmall', padding: 'small', backgroundColor: 'container', borderRadius: 'medium', width: '1/3' }}>
          <BodyText>Last Payment</BodyText>
          <Heading size="small">
            {daysSince !== null ? `${daysSince}d ago` : '—'}
          </Heading>
        </Box>
      </Box>

      {/* Risk factors */}
      {risk.factors.length > 0 && (
        <>
          <Divider />
          <Box css={{ stack: 'y', gap: 'xsmall' }}>
            <BodyText>Risk Factors</BodyText>
            {risk.factors.map((factor, i) => (
              <Box
                key={i}
                css={{
                  stack: 'x',
                  gap: 'small',
                  padding: 'xsmall',
                  backgroundColor: 'container',
                  borderRadius: 'small',
                  alignY: 'center',
                }}
              >
                <Badge type={risk.level === 'high' ? 'negative' : risk.level === 'medium' ? 'warning' : 'positive'}>
                  {i + 1}
                </Badge>
                <BodyText>{factor}</BodyText>
              </Box>
            ))}
          </Box>
        </>
      )}

      <Divider />

      {/* CTA */}
      <Box css={{ stack: 'y', gap: 'small' }}>
        <BodyText>
          Prevent {customerName} from churning — ChurnGuard sends automated retention
          emails and SMS the moment risk signals appear.
        </BodyText>
        <Inline>
          <Button
            type="primary"
            href={`${APP_URL}/signup?${signupUrl}`}
          >
            Prevent Churn — Start Free Trial
          </Button>
        </Inline>
        <Inline>
          <Link href={`${APP_URL}/pricing?source=stripe_app`}>
            See all ChurnGuard plans →
          </Link>
        </Inline>
      </Box>
    </Box>
  );
}
