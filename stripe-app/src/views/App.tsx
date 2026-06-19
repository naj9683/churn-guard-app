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
import { createOAuthState, fetchStripeSignature } from '@stripe/ui-extension-sdk/utils';
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
  const [churnGuardLinked, setChurnGuardLinked] = useState(false);
  const [connectUrl, setConnectUrl] = useState('');

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

    // Build a secure ChurnGuard connect URL using Stripe's OAuth state mechanism.
    // createOAuthState() produces a short-lived state + challengeId pair that the
    // backend can verify originated from inside the Stripe Dashboard.
    try {
      const { state, challenge } = await createOAuthState();
      const p = new URLSearchParams({
        stripe_account_id: accountId,
        state,
        challenge,
        source: 'stripe_app',
      });
      setConnectUrl(`${APP_URL}/stripe-app/connect?${p}`);
    } catch {
      const p = new URLSearchParams({ stripe_account_id: accountId, source: 'stripe_app' });
      setConnectUrl(`${APP_URL}/signup?${p}`);
    }

    try {
      // Fetch Stripe data directly — STRIPE_API_KEY is the merchant's own key,
      // granted automatically when they installed this app.
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

      // Check whether this Stripe account has been linked to ChurnGuard.
      // We actually read the response here (previously it was fire-and-forget).
      try {
        const sig = await fetchStripeSignature();
        const res = await fetch(`${apiBase}/risk?account_id=${accountId}`, {
          headers: { 'stripe-signature': sig },
        });
        if (res.ok) {
          const data = (await res.json()) as { linked?: boolean };
          setChurnGuardLinked(data.linked === true);
        }
      } catch {
        // Backend unavailable — Stripe-native scores shown, linked stays false
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load Stripe data');
    } finally {
      setLoading(false);
    }
  }, [accountId, apiBase]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box css={{ stack: 'y', gap: 'medium', padding: 'large', alignX: 'center' }}>
        <Spinner />
        <Box css={{ font: 'body' }}>Loading your customer risk scores…</Box>
      </Box>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>
        <Banner
          type="caution"
          title="Failed to load Stripe data"
          description={error}
          onDismiss={() => setError(null)}
        />
        <Button onPress={load}>Retry</Button>
      </Box>
    );
  }

  // ── No subscriptions ───────────────────────────────────────────────────────
  // Account IS connected (STRIPE_API_KEY worked), just no subscriptions yet.
  if (rows.length === 0) {
    return (
      <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>
        {isTestMode && (
          <Banner
            type="caution"
            title="Test mode"
            description="Create test subscriptions in this Stripe account to see risk scores here."
          />
        )}
        <Box css={{
          stack: 'y',
          gap: 'small',
          padding: 'medium',
          backgroundColor: 'container',
          borderRadius: 'medium',
        }}>
          <Box css={{ stack: 'x', gap: 'small', alignY: 'center' }}>
            <Badge type="positive">Live</Badge>
            <Box css={{ font: 'bodyEmphasized' }}>Stripe account connected</Box>
          </Box>
          <Box css={{ font: 'body' }}>
            No active subscriptions found. Risk scores will appear here automatically
            once subscriptions exist in this account.
          </Box>
        </Box>
        {!churnGuardLinked && (
          <Box css={{
            stack: 'y',
            gap: 'small',
            padding: 'medium',
            backgroundColor: 'container',
            borderRadius: 'medium',
          }}>
            <Box css={{ font: 'subheading' }}>Automate Retention with ChurnGuard</Box>
            <Box css={{ font: 'body' }}>
              When customers show churn signals — failed payments, scheduled cancellations,
              engagement drops — ChurnGuard automatically sends targeted email and SMS
              campaigns to bring them back.
            </Box>
            <Inline>
              <Button type="primary" href={connectUrl} target="_blank">
                Start Free Trial
              </Button>
            </Inline>
            <Inline>
              <Link href={`${APP_URL}/pricing?source=stripe_app`} external>
                See all plans →
              </Link>
            </Inline>
          </Box>
        )}
      </Box>
    );
  }

  // ── Main view — real customer risk data ────────────────────────────────────
  return (
    <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>
      {isTestMode && (
        <Banner
          type="caution"
          title="Test mode"
          description="Showing test data. Switch to live mode to see real customer risk."
        />
      )}

      {/* Summary stats */}
      <Box css={{ stack: 'x', gap: 'small' }}>
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

      {/* Customer risk table */}
      <Box css={{ stack: 'x', gap: 'small', alignY: 'center' }}>
        <Box css={{ font: 'subheading' }}>Customer Risk Scores</Box>
        <Badge type="neutral">{rows.length}</Badge>
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
              <Box css={{ font: 'bodyEmphasized' }}>{row.name}</Box>
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

      {/* ChurnGuard CTA — context-aware */}
      {churnGuardLinked ? (
        <Inline>
          <Link href={`${APP_URL}/dashboard?source=stripe_app`} external>
            View full ChurnGuard dashboard →
          </Link>
        </Inline>
      ) : (
        <Box css={{ stack: 'y', gap: 'small' }}>
          <Box css={{ font: 'body' }}>
            {highRisk.length > 0
              ? `${highRisk.length} high-risk customer${highRisk.length !== 1 ? 's' : ''} need${highRisk.length === 1 ? 's' : ''} attention.`
              : 'Keep your customers.'}{' '}
            ChurnGuard automatically sends retention campaigns the moment risk signals appear.
          </Box>
          <Inline>
            <Button type="primary" href={connectUrl} target="_blank">
              Start Free Trial
            </Button>
          </Inline>
          <Inline>
            <Link href={`${APP_URL}/pricing?source=stripe_app`} external>
              See all plans →
            </Link>
          </Inline>
        </Box>
      )}
    </Box>
  );
}
