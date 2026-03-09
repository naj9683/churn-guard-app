import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID!;
const REDIRECT_URI = 'https://churn-guard-app.vercel.app/api/integrations/salesforce/callback';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const state = userId;
    
    const authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${SALESFORCE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=api%20refresh_token`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Salesforce auth error:', error);
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
  }
}
