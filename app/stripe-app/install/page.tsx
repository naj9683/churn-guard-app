/**
 * /stripe-app/install
 *
 * Post-install landing page — Stripe redirects users here after they install
 * the ChurnGuard app from the Stripe Marketplace.
 *
 * Stripe passes: ?user_id=usr_xxx&account_id=acct_xxx
 *
 * We pre-fill those params into the signup URL so their Stripe account is
 * automatically linked when they create a ChurnGuard account.
 */

import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    user_id?: string;
    account_id?: string;
  }>;
}

export default async function StripeAppInstallPage({ searchParams }: Props) {
  const params = await searchParams;
  const { account_id, user_id } = params;

  const qs = new URLSearchParams({
    source: 'stripe_app_install',
    ...(account_id ? { stripe_account_id: account_id } : {}),
    ...(user_id ? { stripe_user_id: user_id } : {}),
  });

  redirect(`/signup?${qs.toString()}`);
}
