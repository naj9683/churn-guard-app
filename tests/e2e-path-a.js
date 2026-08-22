// Path A live acceptance test
// Run with: node tests/e2e-path-a.js
'use strict';

const { PrismaClient } = require('@prisma/client');

// Inlined from lib/risk-formula.ts — kept in sync manually for test purposes
function computeRiskScore(input) {
  const now = Date.now();
  const msPerDay = 1000 * 60 * 60 * 24;
  const ms30Days = 30 * msPerDay;

  const failedPayments30d = input.recentEvents.filter(
    e => e.event === 'payment_failed' && (now - e.timestamp) <= ms30Days
  ).length;
  const hasDowngrade30d = input.recentEvents.some(
    e => e.event === 'downgrade_detected' && (now - e.timestamp) <= ms30Days
  );
  const billingPts = Math.min(failedPayments30d * 20 + (hasDowngrade30d ? 15 : 0), 40);

  const hasEngagementData = input.lastLoginAt !== null;
  const daysSinceLogin = hasEngagementData
    ? Math.floor((now - new Date(input.lastLoginAt).getTime()) / msPerDay)
    : null;
  const recencyPts = hasEngagementData
    ? Math.round((Math.min(daysSinceLogin, 30) / 30) * 35)
    : 0;

  const uniqueDaysLast30d = hasEngagementData
    ? new Set(
        input.recentEvents
          .filter(e => e.event === 'page_view' && (now - e.timestamp) <= ms30Days)
          .map(e => new Date(e.timestamp).toDateString())
      ).size
    : 0;
  const activityPts = hasEngagementData
    ? (uniqueDaysLast30d === 0 ? 25 : uniqueDaysLast30d < 5 ? 12 : 0)
    : 0;

  const score = Math.min(100, Math.max(0, billingPts + recencyPts + activityPts));
  return { daysSinceLogin, billingPts, recencyPts, activityPts, uniqueDaysLast30d,
           hasEngagementData, failedPayments30d, hasDowngrade30d, score };
}

const PROD_URL = 'https://churnguardapp.com';
const API_KEY   = 'cmq9ec1rf0001hrjtoiy5pbnw'; // najwasaadi1@gmail.com
const DB_URL    = 'postgresql://neondb_owner:npg_mH5nXkxd1bLr@ep-dawn-hat-aijv7imr.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });
const now    = Date.now();
const day    = 24 * 60 * 60 * 1000;

function pass(label, detail) { console.log(`  PASS  ${label}${detail ? ' — ' + detail : ''}`); }
function fail(label, detail) { console.log(`  FAIL  ${label}${detail ? ' — ' + detail : ''}`); process.exitCode = 1; }
function check(cond, label, detail) { cond ? pass(label, detail) : fail(label, detail); }

// ── helpers ────────────────────────────────────────────────────────────────────

async function trackEvent(customerId, event, timestamp) {
  const body = JSON.stringify({ apiKey: API_KEY, customerId, event, timestamp });
  const res  = await fetch(`${PROD_URL}/api/track`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
  });
  if (!res.ok) throw new Error(`/api/track ${res.status}: ${await res.text()}`);
  return res.json();
}

async function insertEvent(customerId, event, tsMs) {
  await prisma.event.create({
    data: { customerId, event, metadata: {}, timestamp: BigInt(tsMs) },
  });
}

// ── SECTION A + E: active customer — page_view fires, lastLoginAt updates ──────

async function testActiveCustomer() {
  console.log('\n[A+E] Active customer — page_view + lastLoginAt');
  const extId = `e2e-active-${Date.now()}`;

  // Fire a live page_view through the production endpoint
  const tracked = await trackEvent(extId, 'page_view', now);
  console.log(`      /api/track response: riskScore=${tracked.riskScore}, success=${tracked.success}`);

  // Fetch the customer row to confirm lastLoginAt was written
  const user = await prisma.user.findFirst({ where: { apiKey: API_KEY }, select: { id: true } });
  const cust = await prisma.customer.findFirst({
    where: { userId: user.id, externalId: extId },
  });
  if (!cust) { fail('[A] customer row created', 'row not found'); return null; }
  pass('[A] customer row created', `id=${cust.id}`);

  check(cust.lastLoginAt !== null, '[E] lastLoginAt set', cust.lastLoginAt?.toISOString());

  return cust;
}

// ── SECTION B + C: seed distinct days, verify uniqueDaysLast30d ───────────────

async function testUniquedays(cust) {
  console.log('\n[B+C] Seed 3 backdated page_view events — expect uniqueDaysLast30d = 4');

  // Backdate events: 3, 10, 22 days ago — combined with the live event (today) = 4 distinct days
  const backdatedDays = [3, 10, 22];
  for (const d of backdatedDays) {
    await insertEvent(cust.id, 'page_view', now - d * day);
    console.log(`      inserted page_view ${d} days ago (${new Date(now - d * day).toDateString()})`);
  }

  // Pull those events back (30-day window, as the analysis route does)
  const thirtyDaysAgo = BigInt(now - 30 * day);
  const events = await prisma.event.findMany({
    where: { customerId: cust.id, timestamp: { gte: thirtyDaysAgo } },
    orderBy: { timestamp: 'desc' },
  });
  const recentEvents = events.map(e => ({ event: e.event, timestamp: Number(e.timestamp) }));

  // Compute score using the updated formula
  const result = computeRiskScore({
    lastLoginAt: cust.lastLoginAt,
    recentEvents,
  });

  console.log(`      events in 30d window: ${recentEvents.length}`);
  console.log(`      uniqueDaysLast30d computed: ${result.uniqueDaysLast30d}`);
  console.log(`      activityPts: ${result.activityPts}, recencyPts: ${result.recencyPts}, score: ${result.score}`);

  const expectedDays = 4; // today (live event) + 3 + 10 + 22 days ago
  check(
    result.uniqueDaysLast30d === expectedDays,
    '[C] uniqueDaysLast30d matches seeded days',
    `expected ${expectedDays}, got ${result.uniqueDaysLast30d}`
  );
  if (result.uniqueDaysLast30d !== expectedDays) {
    console.log('  STOP: uniqueDaysLast30d mismatch — showing event timestamps:');
    recentEvents.filter(e => e.event === 'page_view').forEach(e =>
      console.log(`    ${new Date(e.timestamp).toDateString()} (${e.timestamp})`)
    );
    process.exit(1);
  }

  return { result, recentEvents };
}

// ── SECTION D: persist activityDays30d ────────────────────────────────────────

async function testPersistence(cust, result) {
  console.log('\n[D] Persist activityDays30d to customer row');

  await prisma.customer.update({
    where: { id: cust.id },
    data: {
      riskScore: result.score,
      activityDays30d: result.uniqueDaysLast30d,
    },
  });

  const updated = await prisma.customer.findUnique({
    where: { id: cust.id },
    select: { riskScore: true, activityDays30d: true },
  });

  check(
    updated.activityDays30d === result.uniqueDaysLast30d,
    '[D] activityDays30d persisted',
    `stored=${updated.activityDays30d}, expected=${result.uniqueDaysLast30d}`
  );
}

// ── SECTION F: drifting customer — score ≥ 50, widget popup fires ──────────────

async function testDriftingCustomer() {
  console.log('\n[F] Drifting customer — 0 active days in 30d, lastLoginAt 25 days ago');

  const extId = `e2e-drift-${Date.now()}`;
  const user  = await prisma.user.findFirst({ where: { apiKey: API_KEY }, select: { id: true } });

  // Create the drifting customer directly — lastLoginAt 25 days ago, no recent events
  const drifter = await prisma.customer.create({
    data: {
      userId:     user.id,
      externalId: extId,
      email:      `${extId}@test.invalid`,
      name:       'E2E Drifter',
      mrr:        99,
      riskScore:  50,
      lastLoginAt: new Date(now - 25 * day),
    },
  });

  // No page_view events in the last 30d → uniqueDaysLast30d = 0

  const thirtyDaysAgo = BigInt(now - 30 * day);
  const events = await prisma.event.findMany({
    where: { customerId: drifter.id, timestamp: { gte: thirtyDaysAgo } },
  });
  const recentEvents = events.map(e => ({ event: e.event, timestamp: Number(e.timestamp) }));

  const result = computeRiskScore({
    lastLoginAt: drifter.lastLoginAt,
    recentEvents,
  });

  console.log(`      uniqueDaysLast30d: ${result.uniqueDaysLast30d}`);
  console.log(`      recencyPts: ${result.recencyPts}, activityPts: ${result.activityPts}, score: ${result.score}`);

  check(result.score >= 50, '[F] drifter score ≥ 50', `score=${result.score}`);

  // Persist score so the widget messages endpoint sees it
  await prisma.customer.update({
    where: { id: drifter.id },
    data: { riskScore: result.score, activityDays30d: result.uniqueDaysLast30d },
  });

  // Check if there is a high_risk WidgetMessage to test with
  const messages = await prisma.widgetMessage.findMany({
    where: { userId: user.id, isActive: true },
  });
  console.log(`      WidgetMessages for user: ${messages.length} total (${messages.filter(m => m.trigger === 'high_risk').length} high_risk)`);

  if (messages.length === 0) {
    console.log('      No widget messages configured — creating one for the test');
    await prisma.widgetMessage.create({
      data: {
        userId:   user.id,
        title:    'E2E Test Message',
        content:  'This is an acceptance test message.',
        trigger:  'high_risk',
        isActive: true,
      },
    });
  }

  // Hit the live widget/messages endpoint
  const wRes = await fetch(
    `${PROD_URL}/api/widget/messages?apiKey=${API_KEY}&customerId=${extId}`
  );
  const wData = await wRes.json();
  console.log(`      /api/widget/messages response: status=${wRes.status}, customerRisk=${wData.customerRisk}, messages=${JSON.stringify(wData.messages?.map(m => m.title))}`);

  const triggeredHighRisk = wData.messages && wData.messages.length > 0;
  check(
    wData.customerRisk >= 50,
    '[F] widget/messages sees riskScore ≥ 50',
    `customerRisk=${wData.customerRisk}`
  );
  check(
    triggeredHighRisk,
    '[F] high_risk popup trigger fires at threshold 50',
    `messages returned: ${wData.messages?.length}`
  );
}

// ── MAIN ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Path A live acceptance test ===');
  console.log(`    target: ${PROD_URL}`);
  console.log(`    apiKey: ${API_KEY}`);

  try {
    const cust = await testActiveCustomer();
    if (!cust) { await prisma.$disconnect(); return; }

    const { result } = await testUniquedays(cust);
    await testPersistence(cust, result);
    await testDriftingCustomer();

    console.log('\n=== Done ===');
  } catch (err) {
    console.error('\nUnhandled error:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
