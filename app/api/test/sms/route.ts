import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/test/sms
 * Sends a test SMS via Twilio to verify configuration.
 * Body: { to: string, message?: string }
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

  const missing = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'].filter(
    k => !process.env[k]
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: 'Twilio not configured', missing },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const to: string | undefined = body.to;
  if (!to) return NextResponse.json({ error: 'Missing required field: to' }, { status: 400 });

  const message: string = body.message ?? 'ChurnGuard SMS test — Twilio is working correctly!';

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: TWILIO_PHONE_NUMBER!,
        Body: message,
      }).toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Twilio error', code: data.code, detail: data.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageSid: data.sid,
      to: data.to,
      from: data.from,
      status: data.status,
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e.message) }, { status: 500 });
  }
}

/** GET /api/test/sms — returns current Twilio configuration status (no secrets exposed) */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const configured = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );

  return NextResponse.json({
    configured,
    fromNumber: configured ? process.env.TWILIO_PHONE_NUMBER : null,
    accountSidPrefix: process.env.TWILIO_ACCOUNT_SID?.slice(0, 8) ?? null,
  });
}
