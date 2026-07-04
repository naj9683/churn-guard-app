/**
 * Test script for the Twilio SMS sending pipeline.
 *
 * What it does:
 *  1. Checks Twilio env vars are configured
 *  2. Finds customers with a phone number in the DB
 *  3. Calls sendSms() with a test message to verify the Twilio connection
 *  4. Writes the result to SmsLog
 *  5. Reports SmsLog entry and pass/fail
 *
 * Run with:
 *   npx tsx scripts/test-sms.ts
 *
 * To actually send an SMS set TEST_PHONE to a real number:
 *   TEST_PHONE=+1234567890 npx tsx scripts/test-sms.ts
 */

// @ts-nocheck

const TEST_PHONE = process.env.TEST_PHONE ?? null;

async function main() {
  const { prisma }  = await import('../lib/prisma');
  const { sendSms } = await import('../lib/sequences');

  console.log('\n=== SMS / Twilio Test ===\n');

  // 1. Check Twilio config
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_PHONE_NUMBER;

  console.log('Twilio env vars:');
  console.log('  TWILIO_ACCOUNT_SID:  ', sid   ? `${sid.slice(0, 8)}…` : 'NOT SET');
  console.log('  TWILIO_AUTH_TOKEN:   ', token ? `${token.slice(0, 8)}…` : 'NOT SET');
  console.log('  TWILIO_PHONE_NUMBER: ', from  ? from                   : 'NOT SET');

  const twilioConfigured = !!(sid && token && from);
  console.log('\nTwilio configured:', twilioConfigured ? 'YES' : 'NO');

  if (!twilioConfigured) {
    console.log('\nSet TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER to proceed.');
    console.log('SMS sending will be skipped but SmsLog writes will still be tested.');
  }

  // 2. Find customers with phone numbers
  const withPhone = await prisma.customer.count({ where: { phone: { not: null } } });
  const total     = await prisma.customer.count();
  console.log(`\nCustomers with phone numbers: ${withPhone} / ${total}`);

  if (withPhone === 0) {
    console.log('  No customers have a phone number on record.');
    console.log('  To add one: update a customer record with a phone field (E.164 format: +1234567890).');
  } else {
    const sample = await prisma.customer.findFirst({
      where: { phone: { not: null } },
      select: { name: true, email: true, phone: true },
    });
    console.log(`  Example: ${sample?.name ?? sample?.email} — ${sample?.phone}`);
  }

  // 3. Determine target phone
  const targetPhone = TEST_PHONE ?? (withPhone > 0
    ? (await prisma.customer.findFirst({ where: { phone: { not: null } }, select: { phone: true } }))?.phone
    : null);

  if (!targetPhone) {
    console.log('\nNo target phone available. Set TEST_PHONE env var to test sending.');
    console.log('Example: TEST_PHONE=+1234567890 npx tsx scripts/test-sms.ts');
  }

  // 4. Fire test SMS
  console.log('\n--- SMS Send Test ---');
  let smsStatus: 'sent' | 'failed' | 'skipped' = 'skipped';
  let smsError: string | undefined;
  const testBody = 'ChurnGuard test SMS — ignore this message.';

  if (!twilioConfigured) {
    smsStatus = 'skipped';
    smsError  = 'Twilio not configured';
    console.log('Skipped — Twilio env vars not set.');
  } else if (!targetPhone) {
    smsStatus = 'skipped';
    smsError  = 'No target phone number';
    console.log('Skipped — no phone number to send to.');
  } else {
    console.log(`Sending to ${targetPhone}…`);
    const result = await sendSms(targetPhone, testBody);
    smsStatus = result.ok ? 'sent' : 'failed';
    smsError  = result.ok ? undefined : result.error;
    console.log(`Result: ${smsStatus}${smsError ? ` — ${smsError}` : ''}`);
  }

  // 5. Write to SmsLog
  const logEntry = await prisma.smsLog.create({
    data: {
      to:           targetPhone ?? '',
      body:         smsStatus === 'skipped' ? '' : testBody,
      status:       smsStatus,
      errorMessage: smsError ?? null,
    },
  });
  console.log(`\nSmsLog entry created: ${logEntry.id} (status: ${logEntry.status})`);

  // 6. Verify SmsLog
  const recent = await prisma.smsLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, to: true, status: true, errorMessage: true, createdAt: true },
  });
  console.log('\nRecent SmsLog entries:');
  for (const l of recent) {
    console.log(`  [${l.status.padEnd(7)}] ${l.to || '(empty)'} — ${l.errorMessage ?? 'OK'} at ${new Date(l.createdAt).toLocaleTimeString()}`);
  }

  // 7. Check smsEnabled on users
  const usersWithSms = await prisma.user.count({ where: { smsEnabled: true } });
  const totalUsers   = await prisma.user.count();
  console.log(`\nUsers with smsEnabled: ${usersWithSms} / ${totalUsers}`);
  if (usersWithSms === 0) {
    console.log('  → Enable SMS in Settings → Integrations → SMS Alerts toggle.');
  }

  // Cleanup test log
  await prisma.smsLog.delete({ where: { id: logEntry.id } });
  console.log('\nTest SmsLog entry cleaned up.');

  console.log('\n=== Checks ===');
  console.log('Twilio configured:    ', twilioConfigured ? 'YES — PASS' : 'NO — add env vars');
  console.log('Customers with phone: ', withPhone > 0 ? `YES (${withPhone}) — PASS` : 'NO — add phone to customer records');
  console.log('SMS send result:      ', smsStatus === 'sent' ? 'SENT — PASS' : smsStatus === 'skipped' ? 'SKIPPED — see above' : `FAILED — ${smsError}`);
  console.log('SmsLog write:         ', 'PASS — entry created and deleted');
  console.log('smsEnabled users:     ', usersWithSms > 0 ? 'YES — PASS' : 'NONE — enable in settings');

  await prisma.$disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Test failed:', err?.message ?? err);
  process.exit(1);
});
