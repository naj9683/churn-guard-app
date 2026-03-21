import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SALESFORCE_CLIENT_ID     = process.env.SALESFORCE_CLIENT_ID!;
const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET!;
const REDIRECT_URI = 'https://churnguardapp.com/api/integrations/salesforce/callback';

export async function GET(req: Request) {
  try {
    const url   = new URL(req.url);
    const code  = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`https://churnguardapp.com/auth/oauth-complete?error=${encodeURIComponent(error)}`);
    }
    if (!code || !state) {
      return NextResponse.redirect('https://churnguardapp.com/auth/oauth-complete?error=missing_params');
    }

    const stateData    = JSON.parse(Buffer.from(state, 'base64').toString());
    const clerkUserId: string = stateData.userId;
    const codeVerifier: string = stateData.codeVerifier;

    const dbUser = await prisma.user.findFirst({ where: { clerkId: clerkUserId } });
    if (!dbUser) {
      console.error('Salesforce callback: no DB user found for clerkId', clerkUserId);
      return NextResponse.redirect('https://churnguardapp.com/auth/oauth-complete?error=user_not_found');
    }

    const tokenRes = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'authorization_code',
        code,
        client_id:     SALESFORCE_CLIENT_ID,
        client_secret: SALESFORCE_CLIENT_SECRET,
        redirect_uri:  REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('Salesforce token error:', tokens);
      const errMsg: string = tokens.error_description ?? tokens.error ?? 'token_failed';
      return NextResponse.redirect(`https://churnguardapp.com/auth/oauth-complete?error=${encodeURIComponent(errMsg)}`);
    }

    await prisma.crmIntegration.upsert({
      where:  { userId: dbUser.id },
      update: {
        type:         'salesforce',
        accessToken:  tokens.access_token,
        refreshToken: tokens.refresh_token,
        instanceUrl:  tokens.instance_url,
        expiresAt:    new Date(Date.now() + 2 * 60 * 60 * 1000),
        syncStatus:   'connected',
        enabled:      true,
        lastError:    null,
      },
      create: {
        userId:       dbUser.id,
        type:         'salesforce',
        accessToken:  tokens.access_token,
        refreshToken: tokens.refresh_token,
        instanceUrl:  tokens.instance_url,
        expiresAt:    new Date(Date.now() + 2 * 60 * 60 * 1000),
        syncStatus:   'connected',
        enabled:      true,
      },
    });

    return NextResponse.redirect('https://churnguardapp.com/auth/oauth-complete?success=salesforce_connected');
  } catch (e: any) {
    console.error('Salesforce callback error:', e);
    return NextResponse.redirect(`https://churnguardapp.com/auth/oauth-complete?error=${encodeURIComponent(e?.message ?? 'callback_failed')}`);
  }
}
