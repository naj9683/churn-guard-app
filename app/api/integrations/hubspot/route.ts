import { NextResponse } from 'next/server';

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID!;
const REDIRECT_URI = 'https://churnguardapp.com/api/integrations/hubspot/callback';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('uid');

    if (!HUBSPOT_CLIENT_ID) {
      return NextResponse.redirect('https://churnguardapp.com/integrations?error=' + encodeURIComponent('HubSpot client ID not configured'));
    }

    if (!userId) {
      return NextResponse.redirect('https://churnguardapp.com/integrations?error=' + encodeURIComponent('Not authenticated'));
    }

    const state = encodeURIComponent(userId.trim());
    const scopes = 'crm.objects.companies.read crm.objects.companies.write crm.objects.contacts.read crm.objects.contacts.write crm.schemas.contacts.read crm.schemas.contacts.write oauth';
    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&state=${state}&prompt=consent`;

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('HubSpot auth error:', error);
    return NextResponse.redirect('https://churnguardapp.com/integrations?error=' + encodeURIComponent(error?.message ?? 'auth_failed'));
  }
}
