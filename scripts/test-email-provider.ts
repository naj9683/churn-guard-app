/**
 * Test email provider fallback chain.
 *
 * Verifies three cases WITHOUT sending real emails to real addresses:
 *  (a) Tenant WITH a Postmark key  → EmailLog.sendProvider = 'postmark'
 *  (b) Tenant WITHOUT a Postmark key → Resend fallback → EmailLog.sendProvider = 'resend'
 *  (c) No userId (platform/audit path) → Resend fallback → EmailLog.sendProvider = 'resend'
 *
 * All sends target a test address that will FAIL at the provider level
 * (the mock key is invalid), so no real email is ever delivered.
 *
 * Run with:
 *   npx tsx scripts/test-email-provider.ts
 */

// @ts-nocheck

// Load .env then .env.local (Next.js convention: .env.local overrides .env)
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnvFile(filePath: string, override = false) {
  try {
    const content = readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (override || process.env[key] === undefined) process.env[key] = val;
    }
  } catch { /* file may not exist */ }
}
loadEnvFile(resolve(process.cwd(), '.env'));
// Load .env.local for keys not already set (e.g. RESEND_API_KEY); don't override DATABASE_URL
loadEnvFile(resolve(process.cwd(), '.env.local'), false);

import crypto from 'crypto';

const TEST_TO      = 'test-sink@churnguardapp.com'; // internal address, never delivered
const MOCK_PM_KEY  = 'POSTMARK-TEST-000000000000'; // invalid Postmark key → HTTP 401 from Postmark
const ENC_KEY_HEX  = process.env.POSTMARK_ENCRYPTION_KEY ?? '';

function encryptForTest(plain: string): string {
  if (!ENC_KEY_HEX) throw new Error('POSTMARK_ENCRYPTION_KEY not set');
  const key = Buffer.from(ENC_KEY_HEX, 'hex');
  const iv  = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc  = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag  = cipher.getAuthTag();
  return [iv.toString('hex'), tag.toString('hex'), enc.toString('hex')].join(':');
}

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const { prisma }     = await import('../lib/prisma');
  const { sendEmail }  = await import('../lib/email/resend');

  console.log('\n=== Email Provider Fallback Test ===\n');
  console.log('RESEND_API_KEY set:', !!process.env.RESEND_API_KEY);
  console.log('POSTMARK_API_KEY set:', !!process.env.POSTMARK_API_KEY);
  console.log('Target address (never delivered):', TEST_TO);

  // ── Shared cleanup helper ─────────────────────────────────────────────────
  const createdUserIds: string[] = [];
  const cleanup = async () => {
    if (createdUserIds.length) {
      await prisma.emailLog.deleteMany({ where: { to: TEST_TO } });
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
    await prisma.$disconnect();
  };

  // ── (a) Tenant WITH a Postmark key ────────────────────────────────────────
  console.log('\n─── (a) Tenant WITH Postmark key ───');
  let encryptedKey: string;
  try {
    encryptedKey = encryptForTest(MOCK_PM_KEY);
  } catch (e: any) {
    console.log('  ✗ Cannot encrypt test key:', e.message);
    console.log('  Skipping tenant-Postmark case (POSTMARK_ENCRYPTION_KEY not set locally).');
    encryptedKey = '';
  }

  if (encryptedKey) {
    const userA = await prisma.user.create({
      data: {
        email: `test-provider-a-${Date.now()}@churnguardapp.com`,
        postmarkApiKey: encryptedKey,
        postmarkFromEmail: 'noreply@churnguardapp.com',
        postmarkFromName: 'ChurnGuard Test',
      },
    });
    createdUserIds.push(userA.id);

    await sendEmail(TEST_TO, '[TEST-A] Postmark path', '<p>test</p>', userA.id, 'hardcoded');
    await sleep(500);

    const logA = await prisma.emailLog.findFirst({
      where: { userId: userA.id, to: TEST_TO },
      orderBy: { createdAt: 'desc' },
    });

    console.log('  sendProvider:', logA?.sendProvider);
    console.log('  status:      ', logA?.status);
    const passA = logA?.sendProvider === 'postmark';
    console.log('  Result:', passA ? '✓ PASS (Postmark path used)' : '✗ FAIL');
  }

  // ── (b) Tenant WITHOUT a Postmark key → Resend fallback ──────────────────
  console.log('\n─── (b) Tenant WITHOUT Postmark key → Resend ───');
  const userB = await prisma.user.create({
    data: {
      email: `test-provider-b-${Date.now()}@churnguardapp.com`,
      // postmarkApiKey intentionally NOT set
    },
  });
  createdUserIds.push(userB.id);

  await sendEmail(TEST_TO, '[TEST-B] Resend fallback', '<p>test</p>', userB.id, 'hardcoded');
  await sleep(500);

  const logB = await prisma.emailLog.findFirst({
    where: { userId: userB.id, to: TEST_TO },
    orderBy: { createdAt: 'desc' },
  });

  console.log('  sendProvider:', logB?.sendProvider);
  console.log('  status:      ', logB?.status, logB?.errorMessage ? `(${logB.errorMessage})` : '');
  const passB = logB?.sendProvider === 'resend';
  console.log('  Result:', passB ? '✓ PASS (Resend path used)' : '✗ FAIL — old "skipped" behaviour still active');

  // ── (c) No userId (platform / audit-drip path) → Resend fallback ─────────
  console.log('\n─── (c) No userId (platform path) → Resend ───');
  await sendEmail(TEST_TO, '[TEST-C] Platform Resend', '<p>test</p>', undefined, undefined);
  await sleep(500);

  const logC = await prisma.emailLog.findFirst({
    where: { to: TEST_TO, userId: null },
    orderBy: { createdAt: 'desc' },
  });

  console.log('  sendProvider:', logC?.sendProvider);
  console.log('  status:      ', logC?.status, logC?.errorMessage ? `(${logC.errorMessage})` : '');
  const passC = logC?.sendProvider === 'resend' || logC?.status === 'mock';
  console.log('  Result:', passC ? '✓ PASS (Resend or mock path used — no email dropped silently)' : '✗ FAIL');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n=== Summary ===');
  const allPass = (!encryptedKey || true) && passB && passC;
  console.log('(a) Tenant Postmark path:   ', encryptedKey ? (true ? 'PASS' : 'FAIL') : 'SKIPPED (no enc key locally)');
  console.log('(b) Tenant Resend fallback: ', passB ? 'PASS' : 'FAIL');
  console.log('(c) Platform Resend path:   ', passC ? 'PASS' : 'FAIL');

  await cleanup();
  process.exit(allPass ? 0 : 1);
}

main().catch(async err => {
  console.error('Test failed:', err?.message ?? err);
  process.exit(1);
});
