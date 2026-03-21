import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const HUBSPOT_CLIENT_ID     = process.env.HUBSPOT_CLIENT_ID || 'fca37c1f-fec2-4feb-ab8c-345fa617ab87';
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET!;
const REDIRECT_URI = 'https://churnguardapp.com/api/integrations/hubspot/callback';

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

    const clerkUserId = decodeURIComponent(state);

    const dbUser = await prisma.user.findFirst({ where: { clerkId: clerkUserId } });
    if (!dbUser) {
      console.error('HubSpot callback: no DB user found for clerkId', clerkUserId);
      return NextResponse.redirect('https://churnguardapp.com/auth/oauth-complete?error=user_not_found');
    }

    const tokenRes = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'authorization_code',
        code,
        client_id:     HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri:  REDIRECT_URI,
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('HubSpot token exchange failed:', tokens);
      const errMsg: string = tokens.message ?? tokens.error ?? 'token_failed';
      return NextResponse.redirect(`https://churnguardapp.com/auth/oauth-complete?error=${encodeURIComponent(errMsg)}`);
    }

    await prisma.crmIntegration.upsert({
      where:  { userId: dbUser.id },
      update: {
        type:         'hubspot',
        accessToken:  tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt:    new Date(Date.now() + (tokens.expires_in ?? 1800) * 1000),
        syncStatus:   'connected',
        enabled:      true,
        lastError:    null,
      },
      create: {
        userId:       dbUser.id,
        type:         'hubspot',
        accessToken:  tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt:    new Date(Date.now() + (tokens.expires_in ?? 1800) * 1000),
        syncStatus:   'connected',
        enabled:      true,
      },
    });

    return NextResponse.redirect('https://churnguardapp.com/auth/oauth-complete?success=hubspot_connected');
  } catch (e: any) {
    console.error('HubSpot callback error:', e);
    return NextResponse.redirect(`https://churnguardapp.com/auth/oauth-complete?error=${encodeURIComponent(e?.message ?? 'callback_error')}`);
  }
}
