import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    stripe_account_id?: string;
    state?: string;
    challenge?: string;
    source?: string;
  }>;
}

// Receives the OAuth handoff from the Stripe App (via createOAuthState).
// Forwards to the ChurnGuard signup flow with the Stripe account pre-filled.
// The state + challenge params can be verified against Stripe's challenge API
// once a full OAuth integration is wired up.
export default async function StripeAppConnectPage({ searchParams }: Props) {
  const params = await searchParams;
  const { stripe_account_id, state, source } = params;

  const signupParams = new URLSearchParams({
    ...(stripe_account_id ? { stripe_account_id } : {}),
    ...(state ? { oauth_state: state } : {}),
    source: source ?? 'stripe_app_connect',
  });

  redirect(`/signup?${signupParams}`);
}
