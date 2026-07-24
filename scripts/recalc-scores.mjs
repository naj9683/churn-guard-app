/**
 * scripts/recalc-scores.mjs
 *
 * Rescores every customer using the current formula:
 *   billing_pts  (0–40): payment_failed × 20 + downgrade 15, capped at 40
 *   recency_pts  (0–35): login recency (only if widget data present)
 *   activity_pts (0–25): login frequency (only if widget data present)
 *
 * Customers with no widget data (lastLoginAt = null) score on billing alone (max 40).
 * Customers above 50 are enrolled in the risk-retention sequence by the analyzer cron.
 *
 * Usage:
 *   node scripts/recalc-scores.mjs              # uses DATABASE_URL from .env
 *   node scripts/recalc-scores.mjs --dry-run    # prints changes without writing
 *   node scripts/recalc-scores.mjs --email foo@bar.com  # single customer by email
 *
 * npm shortcuts:
 *   npm run admin:recalc
 *   npm run admin:recalc-dry
 */

import { PrismaClient } from '@prisma/client';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const emailFilter = (() => {
  const idx = args.indexOf('--email');
  return idx !== -1 ? args[idx + 1] : null;
})();

const prisma = new PrismaClient();

// Mirror of lib/risk-formula.ts — keep in sync if formula changes
function computeRiskScore({ lastLoginAt, loginCountThisMonth, recentEvents }) {
  const now = Date.now();
  const msPerDay = 1000 * 60 * 60 * 24;
  const ms30Days = 30 * msPerDay;

  const failedPayments30d = recentEvents.filter(
    e => e.event === 'payment_failed' && (now - Number(e.timestamp)) <= ms30Days
  ).length;

  const hasDowngrade30d = recentEvents.some(
    e => e.event === 'downgrade_detected' && (now - Number(e.timestamp)) <= ms30Days
  );

  const billingPts = Math.min(failedPayments30d * 20 + (hasDowngrade30d ? 15 : 0), 40);

  const hasEngagementData = lastLoginAt !== null;

  const daysSinceLogin = hasEngagementData
    ? Math.floor((now - new Date(lastLoginAt).getTime()) / msPerDay)
    : null;

  const recencyPts = hasEngagementData
    ? Math.round((Math.min(daysSinceLogin, 30) / 30) * 35)
    : 0;

  const logins = loginCountThisMonth ?? 0;
  const activityPts = hasEngagementData
    ? (logins === 0 ? 25 : logins < 3 ? 12 : 0)
    : 0;

  const score = Math.min(100, Math.max(0, billingPts + recencyPts + activityPts));

  return { score, daysSinceLogin, billingPts, recencyPts, activityPts, hasEngagementData, failedPayments30d, hasDowngrade30d };
}

async function main() {
  if (DRY_RUN) console.log('[DRY RUN] No writes will be made.\n');
  if (emailFilter) console.log(`[FILTER] Only processing: ${emailFilter}\n`);

  const where = emailFilter ? { email: emailFilter } : {};
  const customers = await prisma.customer.findMany({
    where,
    select: {
      id: true,
      email: true,
      riskScore: true,
      lastLoginAt: true,
      loginCountThisMonth: true,
      events: {
        select: { event: true, timestamp: true },
        orderBy: { timestamp: 'desc' },
        take: 30,
      },
    },
    orderBy: { email: 'asc' },
  });

  console.log(`Found ${customers.length} customer(s). Recalculating...\n`);

  const bands = { '0-25': 0, '26-50': 0, '51-75': 0, '76-100': 0 };
  let missingData = 0;
  let changed = 0;
  let unchanged = 0;

  for (const c of customers) {
    const { score, daysSinceLogin, billingPts, recencyPts, activityPts, hasEngagementData, failedPayments30d, hasDowngrade30d } = computeRiskScore({
      lastLoginAt: c.lastLoginAt,
      loginCountThisMonth: c.loginCountThisMonth,
      recentEvents: c.events,
    });

    // Tally bands and flags using the NEW score
    if (score <= 25) bands['0-25']++;
    else if (score <= 50) bands['26-50']++;
    else if (score <= 75) bands['51-75']++;
    else bands['76-100']++;

    if (!hasEngagementData) missingData++;

    const arrow = score !== c.riskScore ? `${c.riskScore} → ${score}` : `${score} (no change)`;
    const billingDetail = [
      failedPayments30d > 0 && `${failedPayments30d} failure(s)`,
      hasDowngrade30d && 'downgrade',
    ].filter(Boolean).join('+') || 'no billing signals';

    const detail = hasEngagementData
      ? `billing=${billingPts}(${billingDetail}) recency=${recencyPts}(${daysSinceLogin}d) activity=${activityPts}`
      : `billing=${billingPts}(${billingDetail}) [no widget data]`;

    if (score !== c.riskScore) {
      console.log(`  ✓ ${c.email.padEnd(40)} ${arrow}`);
      console.log(`    ${detail}`);
      if (!DRY_RUN) {
        await prisma.customer.update({
          where: { id: c.id },
          data: { riskScore: score },
        });
      }
      changed++;
    } else {
      unchanged++;
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Updated: ${changed}  |  Unchanged: ${unchanged}  |  Total: ${customers.length}`);
  console.log(`\nScore distribution (new scores):`);
  console.log(`  0–25:    ${bands['0-25']} customers`);
  console.log(`  26–50:   ${bands['26-50']} customers`);
  console.log(`  51–75:   ${bands['51-75']} customers`);
  console.log(`  76–100:  ${bands['76-100']} customers`);
  console.log(`\nengagement_data_missing: ${missingData} customers (lastLoginAt = null)`);
  if (DRY_RUN) console.log('\n[DRY RUN] No database writes were made.');
}

main()
  .catch(err => {
    console.error('\nError:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
