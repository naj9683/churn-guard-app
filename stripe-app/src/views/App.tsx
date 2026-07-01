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

const DEMO_ROWS: CustomerRow[] = [
  { id: 'demo-1', name: 'Emily Zhao',      email: 'emily@launchpad.dev',  riskScore: 92, riskLevel: 'high',   subscriptionStatus: 'past_due', cancelAtPeriodEnd: false, daysSinceLastPayment: 67, mrr: 299 },
  { id: 'demo-2', name: 'Sarah Mitchell',  email: 'sarah@acme.io',        riskScore: 87, riskLevel: 'high',   subscriptionStatus: 'active',   cancelAtPeriodEnd: false, daysSinceLastPayment: 45, mrr: 199 },
  { id: 'demo-3', name: 'Priya Nair',      email: 'priya@scalehq.com',    riskScore: 61, riskLevel: 'medium', subscriptionStatus: 'active',   cancelAtPeriodEnd: true,  daysSinceLastPayment: 28, mrr: 79  },
  { id: 'demo-4', name: 'James Okafor',    email: 'james@buildco.com',    riskScore: 45, riskLevel: 'medium', subscriptionStatus: 'active',   cancelAtPeriodEnd: false, daysSinceLastPayment: 12, mrr: 99  },
  { id: 'demo-5', name: 'Carlos Rivera',   email: 'carlos@growthops.io',  riskScore: 23, riskLevel: 'low',    subscriptionStatus: 'active',   cancelAtPeriodEnd: false, daysSinceLastPayment: 3,  mrr: 149 },
];

// Truncate long strings so they don't overflow the narrow drawer
function trunc(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '…' : s;
}

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

  // Initialise connect URL immediately so the button is never empty.
  // After load() we upgrade it with a short-lived OAuth state.
  const [connectUrl, setConnectUrl] = useState(
    `${APP_URL}/signup?${new URLSearchParams({ stripe_account_id: accountId, source: 'stripe_app' })}`
  );

  const isDemo = !loading && !error && rows.length === 0;
  const sourceRows = isDemo ? DEMO_ROWS : rows;

  const atRisk = sourceRows.filter(r => r.riskScore >= 40);
  const highRisk = sourceRows.filter(r => r.riskScore >= 70);
  const revenueAtRisk = atRisk.reduce((sum, r) => sum + r.mrr, 0);
  const displayRows = showingAll ? sourceRows : sourceRows.slice(0, 8);

  // Format MRR compactly to avoid overflow: $1.2k instead of $1,234
  function fmtMrr(n: number): string {
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
    return `$${n}`;
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // STRIPE_API_KEY is the merchant's own restricted key — granted at install.
      // Do NOT expand data.latest_invoice.payment_intent — requires invoice_read
      // which is not in the manifest and causes a silent permission error.
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

    // Run after setLoading(false) so they never block the data display.

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
      // Keep the basic signup URL
    }

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
      // Backend unavailable — native scores shown, linked stays false
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

  // ── Main view ──────────────────────────────────────────────────────────────
  return (
    <Box css={{ stack: 'y', gap: 'medium', padding: 'medium' }}>
      {isDemo && (
        <Banner
          type="caution"
          title="No subscriptions found"
          description="Showing sample data so you can explore the UI. Real risk scores appear automatically once subscriptions exist."
        />
      )}
      {!isDemo && isTestMode && (
        <Banner
          type="caution"
          title="Test mode"
          description="Showing test data. Switch to live mode to see real customer risk."
        />
      )}

      {/* Summary stats — three equal-width tiles */}
      <Box css={{ stack: 'x', gap: 'xsmall' }}>
        <Box css={{
          width: 'fill',
          stack: 'y',
          gap: 'xxsmall',
          padding: 'small',
          backgroundColor: 'container',
          borderRadius: 'medium',
        }}>
          <Box css={{ font: 'caption' }}>At Risk</Box>
          <Box css={{ font: 'title' }}>{atRisk.length}</Box>
          <Box css={{ font: 'caption' }}>score ≥ 40</Box>
        </Box>
        <Box css={{
          width: 'fill',
          stack: 'y',
          gap: 'xxsmall',
          padding: 'small',
          backgroundColor: 'container',
          borderRadius: 'medium',
        }}>
          <Box css={{ font: 'caption' }}>High Risk</Box>
          <Box css={{ font: 'title' }}>{highRisk.length}</Box>
          <Box css={{ font: 'caption' }}>act now</Box>
        </Box>
        <Box css={{
          width: 'fill',
          stack: 'y',
          gap: 'xxsmall',
          padding: 'small',
          backgroundColor: 'container',
          borderRadius: 'medium',
        }}>
          <Box css={{ font: 'caption' }}>MRR Risk</Box>
          <Box css={{ font: 'title' }}>{fmtMrr(revenueAtRisk)}</Box>
          <Box css={{ font: 'caption' }}>monthly</Box>
        </Box>
      </Box>

      <Divider />

      {/* Customer risk list — card layout, fits any drawer width */}
      <Box css={{ stack: 'x', gap: 'small', alignY: 'center' }}>
        <Box css={{ font: 'subheading' }}>Customer Risk Scores</Box>
        {isDemo
          ? <Badge type="warning">Demo data</Badge>
          : <Badge type="neutral">{rows.length}</Badge>
        }
      </Box>

      <Box css={{ stack: 'y', gap: 'xsmall' }}>
        {displayRows.map(row => (
          <Box
            key={row.id}
            css={{
              stack: 'y',
              gap: 'xxsmall',
              padding: 'small',
              backgroundColor: 'container',
              borderRadius: 'medium',
            }}
          >
            {/* Row 1: name + email on left, risk badge on right */}
            <Box css={{ stack: 'x', gap: 'small', alignY: 'center' }}>
              <Box css={{ stack: 'y', gap: 'xxsmall', width: 'fill' }}>
                <Box css={{ font: 'bodyEmphasized' }}>{trunc(row.name, 24)}</Box>
                <Box css={{ font: 'caption' }}>{trunc(row.email, 30)}</Box>
              </Box>
              <Badge type={riskBadgeType(row.riskLevel)}>
                {row.riskScore}{' '}
                {row.riskLevel === 'high' ? 'High' : row.riskLevel === 'medium' ? 'Med' : 'Low'}
              </Badge>
            </Box>

            {/* Row 2: status badge + MRR + last payment (all small) */}
            <Box css={{ stack: 'x', gap: 'xsmall', alignY: 'center' }}>
              <Badge type={subscriptionBadgeType(row.subscriptionStatus, row.cancelAtPeriodEnd)}>
                {subscriptionLabel(row.subscriptionStatus, row.cancelAtPeriodEnd)}
              </Badge>
              <Box css={{ font: 'caption' }}>
                {fmtMrr(row.mrr)}/mo
                {row.daysSinceLastPayment !== null
                  ? ` · ${row.daysSinceLastPayment}d ago`
                  : ''}
              </Box>
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

      {/* Footer CTA */}
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
