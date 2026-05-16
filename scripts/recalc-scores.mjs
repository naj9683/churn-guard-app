/**
 * scripts/recalc-scores.mjs
 *
 * Recalculates riskScore for every customer using the live formula.
 * Runs directly against the database — no HTTP auth, no browser needed.
 *
 * Usage:
 *   node scripts/recalc-scores.mjs              # uses DATABASE_URL from .env
 *   node scripts/recalc-scores.mjs --dry-run    # prints changes without writing
 *   node scripts/recalc-scores.mjs --email foo@bar.com  # single customer
 *
 * Prisma automatically loads .env. If your DATABASE_URL is only in .env.local,
 * pass it inline: DATABASE_URL="..." node scripts/recalc-scores.mjs
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
function computeRiskScore({ lastLoginAt, healthScore, loginCountThisMonth }) {
  const msPerDay = 1000 * 60 * 60 * 24;

  const daysSinceLogin = lastLoginAt
    ? Math.floor((Date.now() - new Date(lastLoginAt).getTime()) / msPerDay)
    : null;

  const loginDays = daysSinceLogin ?? 999;
  const cappedDays = Math.min(loginDays, 30);
  const loginPts = Math.round((cappedDays / 30) * 45);

  const health = healthScore ?? 100;
  const healthPts = Math.round(((100 - health) / 100) * 30);

  const logins = loginCountThisMonth ?? 0;
  const activityPts = logins === 0 ? 25 : logins < 3 ? 12 : 0;

  const score = Math.min(100, Math.max(0, loginPts + healthPts + activityPts));
  return { score, daysSinceLogin, loginPts, healthPts, activityPts };
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
      healthScore: true,
      lastLoginAt: true,
      loginCountThisMonth: true,
    },
    orderBy: { email: 'asc' },
  });

  console.log(`Found ${customers.length} customer(s). Recalculating...\n`);

  let changed = 0;
  let unchanged = 0;

  for (const c of customers) {
    const { score, daysSinceLogin, loginPts, healthPts, activityPts } = computeRiskScore({
      lastLoginAt: c.lastLoginAt,
      healthScore: c.healthScore,
      loginCountThisMonth: c.loginCountThisMonth,
    });

    const arrow = score !== c.riskScore ? `${c.riskScore} → ${score}` : `${score} (no change)`;
    const detail = `  login=${loginPts} health=${healthPts} activity=${activityPts}  lastLogin=${daysSinceLogin === null ? 'never' : daysSinceLogin + 'd ago'}`;

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
