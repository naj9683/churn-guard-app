import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID!;
const REDIRECT_URI = 'https://churnguardapp.com/api/integrations/hubspot/callback';

export async function GET() {
  try {
    console.log('HubSpot auth route hit');

    if (!HUBSPOT_CLIENT_ID) {
      console.error('HubSpot auth: HUBSPOT_CLIENT_ID env var is not set');
      return NextResponse.redirect('https://churnguardapp.com/integrations?error=' + encodeURIComponent('HUBSPOT_CLIENT_ID is not configured'));
    }

    const session = await auth();
    const userId = session?.userId;
    console.log('HubSpot auth: userId =', userId ? 'found' : 'missing');

    if (!userId) {
      return NextResponse.redirect('https://churnguardapp.com/sign-in?redirect_url=' + encodeURIComponent('/integrations'));
    }

    const cleanUserId = userId.trim();
    const state = encodeURIComponent(cleanUserId);

    const scopes = 'crm.objects.companies.read crm.objects.companies.write crm.objects.contacts.read crm.objects.contacts.write crm.schemas.contacts.read crm.schemas.contacts.write oauth';

    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&state=${state}&prompt=consent`;

    console.log('HubSpot auth: redirecting to HubSpot OAuth');
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('HubSpot auth error:', error);
    const msg = error?.message ?? 'auth_failed';
    return NextResponse.redirect('https://churnguardapp.com/integrations?error=' + encodeURIComponent(msg));
  }
}
