import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID!;
const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET!;
const REDIRECT_URI = 'https://churnguardapp.com/api/integrations/salesforce/callback';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      return NextResponse.redirect('https://churnguardapp.com/settings/integrations?error=' + error);
    }

    if (!code || !state) {
      return NextResponse.redirect('https://churnguardapp.com/settings/integrations?error=missing_params');
    }

    // Decode state to get userId and codeVerifier
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const { userId, codeVerifier } = stateData;

    // Exchange code for tokens WITH code_verifier
    const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: SALESFORCE_CLIENT_ID,
        client_secret: SALESFORCE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier, // REQUIRED for PKCE
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token error:', tokens);
      return NextResponse.redirect('https://churnguardapp.com/settings/integrations?error=token_failed');
    }

    // Save to database
    await prisma.crmIntegration.upsert({
      where: { userId },
      update: {
        type: 'salesforce',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        instanceUrl: tokens.instance_url,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        syncStatus: 'connected',
      },
      create: {
        userId,
        type: 'salesforce',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        instanceUrl: tokens.instance_url,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        syncStatus: 'connected',
      },
    });

    return NextResponse.redirect('https://churnguardapp.com/settings/integrations?success=salesforce_connected');
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect('https://churnguardapp.com/settings/integrations?error=callback_failed');
  }
}
