import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';

const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID!;
const REDIRECT_URI = 'https://churnguardapp.com/api/integrations/salesforce/callback';

function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

export async function GET() {
  try {
    console.log('Salesforce auth route hit');

    if (!SALESFORCE_CLIENT_ID) {
      console.error('Salesforce auth: SALESFORCE_CLIENT_ID env var is not set');
      return NextResponse.redirect('https://churnguardapp.com/integrations?error=' + encodeURIComponent('SALESFORCE_CLIENT_ID is not configured'));
    }

    const session = await auth();
    const userId = session?.userId;
    console.log('Salesforce auth: userId =', userId ? 'found' : 'missing');

    if (!userId) {
      return NextResponse.redirect('https://churnguardapp.com/sign-in?redirect_url=' + encodeURIComponent('/integrations'));
    }

    const { verifier, challenge } = generatePKCE();
    const state = Buffer.from(JSON.stringify({ userId, codeVerifier: verifier })).toString('base64');

    const authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${SALESFORCE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=api%20refresh_token&code_challenge=${challenge}&code_challenge_method=S256`;

    console.log('Salesforce auth: redirecting to Salesforce OAuth');
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Salesforce auth error:', error);
    const msg = error?.message ?? 'auth_failed';
    return NextResponse.redirect('https://churnguardapp.com/integrations?error=' + encodeURIComponent(msg));
  }
}
