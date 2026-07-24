/**
 * scripts/recalc-scores.mjs
 *
 * Rescores every customer using the current formula:
 *   - billing_pts  (0–40): payment_failed events in last 30 days × 20, capped at 40
 *   - recency_pts  (0–35): login recency (only if widget data present)
 *   - activity_pts (0–25): login frequency (only if widget data present)
 *
 * Customers with no widget data (lastLoginAt = null) score on billing alone.
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

  // Billing: payment_failed events in last 30 days (max 40 pts)
  const failedPayments30d = recentEvents.filter(
    e => e.event === 'payment_failed' && (now - Number(e.timestamp)) <= ms30Days
  ).length;
  const billingPts = Math.min(failedPayments30d * 20, 40);

  // Engagement: only scored when widget data is present
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

  return { score, daysSinceLogin, billingPts, recencyPts, activityPts, hasEngagementData, failedPayments30d };
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

  let changed = 0;
  let unchanged = 0;

  for (const c of customers) {
    const { score, daysSinceLogin, billingPts, recencyPts, activityPts, hasEngagementData, failedPayments30d } = computeRiskScore({
      lastLoginAt: c.lastLoginAt,
      loginCountThisMonth: c.loginCountThisMonth,
      recentEvents: c.events,
    });

    const arrow = score !== c.riskScore ? `${c.riskScore} → ${score}` : `${score} (no change)`;
    const detail = [
      `billing=${billingPts}(${failedPayments30d} failures)`,
      hasEngagementData
        ? `recency=${recencyPts}(${daysSinceLogin}d ago) activity=${activityPts}`
        : `recency=0 activity=0 [no widget data]`,
    ].join(' ');

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
  if (DRY_RUN) console.log('[DRY RUN] No database writes were made.');
}

main()
  .catch(err => {
    console.error('\nError:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
