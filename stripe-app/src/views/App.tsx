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

  const accountId = userContext?.account?.id ?? '';
  const apiBase = (environment?.constants as Record<string, string> | undefined)?.API_BASE
    ?? `${APP_URL}/api/stripe-app`;
  const isTestMode = environment?.mode === 'test';

  // Initialise connect URL immediately from accountId so the button is never empty.
  // After load() we upgrade it with a short-lived OAuth state for backend verification.
  const [connectUrl, setConnectUrl] = useState(
    `${APP_URL}/signup?${new URLSearchParams({ stripe_account_id: accountId, source: 'stripe_app' })}`
  );

  const atRisk = rows.filter(r => r.riskScore >= 40);
  const highRisk = rows.filter(r => r.riskScore >= 70);
  const revenueAtRisk = atRisk.reduce((sum, r) => sum + r.mrr, 0);
  const displayRows = showingAll ? rows : rows.slice(0, 8);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // STRIPE_API_KEY is the merchant's own restricted key — granted when they
      // installed this app. No separate OAuth needed to read their Stripe data.
      //
      // NOTE: do NOT expand data.latest_invoice.payment_intent — that requires
      // invoice_read permission which is not in the manifest and will cause a
      // Stripe permission error that silently breaks the whole request.
      const [subscriptionsRes, chargesRes] = await Promise.all([
        stripe.subscriptions.list({
          limit: 100,
          expand: ['data.customer', 'data.items.data.price'],
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load Stripe data');
    } finally {
      setLoading(false);
    }

    // Run these after setLoading(false) so they never block the data display.

    // Upgrade connect URL with a short-lived OAuth state for backend verification.
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
      // Keep the basic signup URL already set
    }

    // Check whether this Stripe account has been linked to ChurnGuard.
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
  }, [accountId, apiBase]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box css={{ stack: 'y', gap: 'medium', padding: 'large', alignX: 'center' }}>
        <Spinner />
        <Box css={{ font: 'body' }}>Loading customer risk scores…</Box>
      </Box>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>
        <Banner
          type="caution"
          title="Could not load Stripe data"
          description={error}
          onDismiss={() => setError(null)}
        />
        <Button onPress={load}>Retry</Button>
      </Box>
    );
  }

  // ── No subscriptions yet ───────────────────────────────────────────────────
  if (rows.length === 0) {
    return (
      <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>
        {isTestMode && (
          <Banner
            type="caution"
            title="Test mode"
            description="Add test subscriptions in your Stripe account to see risk scores here."
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
            <Box css={{ font: 'bodyEmphasized' }}>Reading your Stripe data</Box>
          </Box>
          <Box css={{ font: 'body' }}>
            No active subscriptions found. ChurnGuard will show risk scores here as soon
            as subscriptions exist in this account — no extra setup needed.
          </Box>
          <Button type="secondary" onPress={load}>Refresh</Button>
        </Box>
      </Box>
    );
  }

  // ── Main view — live customer risk scores ──────────────────────────────────
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

      {/* Footer: dashboard link if ChurnGuard linked, upgrade CTA if not */}
      {churnGuardLinked ? (
        <Inline>
          <Link href={`${APP_URL}/dashboard?source=stripe_app`} external>
            Open full ChurnGuard dashboard →
          </Link>
        </Inline>
      ) : (
        <Box css={{ stack: 'y', gap: 'xsmall' }}>
          <Box css={{ font: 'caption' }}>
            {highRisk.length > 0
              ? `${highRisk.length} high-risk customer${highRisk.length !== 1 ? 's' : ''} — automate retention with ChurnGuard.`
              : 'Automate retention campaigns when risk signals appear.'}
          </Box>
          <Inline>
            <Button type="primary" href={connectUrl} target="_blank">
              Start Free Trial
            </Button>
          </Inline>
        </Box>
      )}
    </Box>
  );
}
