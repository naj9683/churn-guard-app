import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID!;
const REDIRECT_URI = 'https://churn-guard-app.vercel.app/api/integrations/hubspot/callback';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const state = userId;
    
    // OAuth scope names (different from Private App scopes)
    const scopes = [
      'crm.objects.contacts.read',
      'crm.objects.contacts.write',
      'crm.objects.companies.read',
      'crm.objects.companies.write',
      'oauth'
    ].join(' ');

    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&state=${state}`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('HubSpot auth error:', error);
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
  }
}
