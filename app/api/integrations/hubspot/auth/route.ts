import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID!;
const REDIRECT_URI = 'https://churnguardapp.com/api/integrations/hubspot/callback';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TRIM the userId to remove any trailing spaces!
    const cleanUserId = userId.trim();
    const state = encodeURIComponent(cleanUserId);

    const scopes = 'crm.objects.companies.read crm.objects.companies.write crm.objects.contacts.read crm.objects.contacts.write crm.schemas.contacts.read crm.schemas.contacts.write oauth';
    
    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&state=${state}&prompt=consent`;

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('HubSpot auth error:', error);
    return NextResponse.redirect('https://churnguardapp.com/integrations?error=hubspot_auth_failed');
  }
}
