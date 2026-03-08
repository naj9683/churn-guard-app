import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';

const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_URL || 'https://churn-guard-app.vercel.app'}/api/integrations/salesforce/callback`;

// Generate PKCE code verifier and challenge
function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { verifier, challenge } = generatePKCE();
    const state = Buffer.from(JSON.stringify({ userId, codeVerifier: verifier })).toString('base64');
    
    // Include PKCE parameters
    const authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${SALESFORCE_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=api%20refresh_token&code_challenge=${challenge}&code_challenge_method=S256`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Salesforce auth error:', error);
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
  }
}
