import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const uid = url.searchParams.get('uid');
  const clientId = process.env.HUBSPOT_CLIENT_ID;

  return NextResponse.json({
    HUBSPOT_CLIENT_ID_set: !!clientId,
    HUBSPOT_CLIENT_ID_prefix: clientId ? clientId.slice(0, 8) + '...' : null,
    uid_received: !!uid,
    uid_prefix: uid ? uid.slice(0, 8) + '...' : null,
    redirect_would_go_to: clientId && uid
      ? `https://app.hubspot.com/oauth/authorize?client_id=${clientId.slice(0, 6)}...`
      : `https://churnguardapp.com/integrations?error=${clientId ? 'Not+authenticated' : 'HubSpot+client+ID+not+configured'}`,
  });
}
