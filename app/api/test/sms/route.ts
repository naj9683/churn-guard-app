import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function twilioAuth(sid: string, token: string) {
  return `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`;
}

/** POST /api/test/sms — send a test SMS */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

  const missing = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'].filter(
    k => !process.env[k]
  );
  if (missing.length > 0) {
    return NextResponse.json({ error: 'Twilio not configured', missing }, { status: 503 });
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
        Authorization: twilioAuth(TWILIO_ACCOUNT_SID!, TWILIO_AUTH_TOKEN!),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: TWILIO_PHONE_NUMBER!, Body: message }).toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      prisma.smsLog.create({ data: { userId, to, body: message, status: 'failed', errorMessage: data.message } }).catch(() => {});
      // Return full Twilio error so frontend can display it precisely
      return NextResponse.json(
        { error: data.message ?? 'Twilio request failed', code: data.code, moreInfo: data.more_info },
        { status: 400 }
      );
    }

    prisma.smsLog.create({ data: { userId, to, body: message, status: 'sent', messageSid: data.sid } }).catch(() => {});
    return NextResponse.json({ success: true, messageSid: data.sid, to: data.to, from: data.from, status: data.status });
  } catch (e: any) {
    prisma.smsLog.create({ data: { userId, to, body: message, status: 'failed', errorMessage: String(e.message) } }).catch(() => {});
    return NextResponse.json({ error: String(e.message) }, { status: 500 });
  }
}

/** GET /api/test/sms — configuration status + account diagnostics */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

  const configured = !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER);
  if (!configured) {
    return NextResponse.json({ configured, fromNumber: null, accountSidPrefix: null });
  }

  const auth2 = twilioAuth(TWILIO_ACCOUNT_SID!, TWILIO_AUTH_TOKEN!);
  const base = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}`;

  // Fetch account info, balance, and phone numbers in parallel — treat failures as non-fatal
  const [accountRes, balanceRes, numbersRes, callerIdsRes] = await Promise.all([
    fetch(`${base}.json`, { headers: { Authorization: auth2 } }).catch(() => null),
    fetch(`${base}/Balance.json`, { headers: { Authorization: auth2 } }).catch(() => null),
    fetch(`${base}/IncomingPhoneNumbers.json`, { headers: { Authorization: auth2 } }).catch(() => null),
    fetch(`${base}/OutgoingCallerIds.json`, { headers: { Authorization: auth2 } }).catch(() => null),
  ]);

  const account = accountRes?.ok ? await accountRes.json().catch(() => null) : null;
  const balanceData = balanceRes?.ok ? await balanceRes.json().catch(() => null) : null;
  const numbersData = numbersRes?.ok ? await numbersRes.json().catch(() => null) : null;
  const callerIdsData = callerIdsRes?.ok ? await callerIdsRes.json().catch(() => null) : null;

  // Find the configured from-number in the account's phone number list
  const matchedNumber = (numbersData?.incoming_phone_numbers ?? []).find(
    (n: any) => n.phone_number === TWILIO_PHONE_NUMBER
  );

  const verifiedNumbers: string[] = (callerIdsData?.outgoing_caller_ids ?? []).map(
    (c: any) => c.phone_number
  );

  return NextResponse.json({
    configured,
    fromNumber: TWILIO_PHONE_NUMBER,
    accountSidPrefix: TWILIO_ACCOUNT_SID?.slice(0, 8) ?? null,
    // Account diagnostics
    accountStatus: account?.status ?? null,          // 'active' | 'suspended' | 'closed'
    accountType: account?.type ?? null,              // 'Trial' | 'Full'
    balance: balanceData?.balance ?? null,           // e.g. "15.00"
    currency: balanceData?.currency ?? null,         // e.g. "USD"
    // Phone number diagnostics
    numberFound: !!matchedNumber,
    numberSmsEnabled: matchedNumber?.capabilities?.sms ?? null,
    numberVoiceEnabled: matchedNumber?.capabilities?.voice ?? null,
    // Trial account: list of verified destination numbers
    verifiedNumbers,
  });
}
