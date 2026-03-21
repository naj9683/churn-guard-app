import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID!;
const REDIRECT_URI = 'https://churnguardapp.com/api/integrations/salesforce/callback';

function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('uid');

    if (!SALESFORCE_CLIENT_ID) {
      console.error('Salesforce auth: SALESFORCE_CLIENT_ID not set');
      return NextResponse.redirect('https://churnguardapp.com/integrations?error=' + encodeURIComponent('Salesforce client ID not configured'));
    }

    if (!userId) {
      console.error('Salesforce auth: no uid param');
      return NextResponse.redirect('https://churnguardapp.com/integrations?error=' + encodeURIComponent('Not authenticated'));
    }

    const { verifier, challenge } = generatePKCE();
    const state = Buffer.from(JSON.stringify({ userId: userId.trim(), codeVerifier: verifier })).toString('base64');
    const authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${SALESFORCE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=api%20refresh_token&code_challenge=${challenge}&code_challenge_method=S256`;

    console.log('Salesforce auth: redirecting to Salesforce OAuth for user', userId.slice(0, 8) + '...');
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Salesforce auth error:', error);
    return NextResponse.redirect('https://churnguardapp.com/integrations?error=' + encodeURIComponent(error?.message ?? 'auth_failed'));
  }
}
