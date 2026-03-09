import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID!;
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET!;
const REDIRECT_URI = 'https://churn-guard-app.vercel.app/api/integrations/hubspot/callback';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('HubSpot OAuth error:', error);
      return NextResponse.redirect(`https://churn-guard-app.vercel.app/settings/integrations?error=${error}`);
    }

    if (!code || !state) {
      return NextResponse.redirect('https://churn-guard-app.vercel.app/settings/integrations?error=missing_params');
    }

    // Decode the state back to userId
    const userId = decodeURIComponent(state);

    console.log('Exchanging code for token...');

    // Exchange code for tokens
    const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokens);
      return NextResponse.redirect('https://churn-guard-app.vercel.app/settings/integrations?error=token_failed');
    }

    console.log('Token received, saving to database...');

    // Save to database
    await prisma.crmIntegration.upsert({
      where: { userId },
      update: {
        type: 'hubspot',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        syncStatus: 'connected',
        enabled: true,
      },
      create: {
        userId,
        type: 'hubspot',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        syncStatus: 'connected',
        enabled: true,
      },
    });

    return NextResponse.redirect('https://churn-guard-app.vercel.app/settings/integrations?success=hubspot_connected');
  } catch (error: any) {
    console.error('HubSpot callback error:', error);
    const errorMessage = error?.message || 'Unknown error';
    return NextResponse.redirect(`https://churn-guard-app.vercel.app/settings/integrations?error=callback_error&message=${encodeURIComponent(errorMessage)}`);
  }
}
