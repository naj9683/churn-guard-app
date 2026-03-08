import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_URL || 'https://churn-guard-app.vercel.app'}/api/integrations/hubspot/callback`;

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
    
    const scopes = [
      'crm.schemas.read',
      'crm.objects.contacts.read',
      'crm.objects.contacts.write',
      'crm.objects.companies.read',
      'crm.objects.companies.write',
      'oauth',
      'refresh_token'
    ].join(' ');

    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&state=${state}`;

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('HubSpot auth error:', error);
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
  }
}
