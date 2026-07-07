/**
 * HubSpot two-way sync test script.
 *
 * What it does:
 *  1. Checks HubSpot env vars
 *  2. Finds connected HubSpot integrations in DB
 *  3. Validates token freshness
 *  4. Runs a full bidirectional sync
 *  5. Shows pull/push counts and any errors
 *  6. Shows recent CrmSyncLog entries
 *
 * Run with:
 *   npx tsx scripts/test-hubspot-sync.ts
 *
 * To target a specific user:
 *   USER_EMAIL=you@example.com npx tsx scripts/test-hubspot-sync.ts
 */

// @ts-nocheck

const TARGET_EMAIL = process.env.USER_EMAIL ?? null;

async function main() {
  const { prisma }      = await import('../lib/prisma');
  const { syncHubSpot, getValidHubSpotToken, HubSpotReconnectError } = await import('../lib/crm/hubspot');

  console.log('\n=== HubSpot Two-Way Sync Test ===\n');

  // 1. Check env vars
  const clientId     = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  console.log('Env vars:');
  console.log('  HUBSPOT_CLIENT_ID:     ', clientId     ? `${clientId.slice(0, 8)}…`     : 'NOT SET (using hardcoded fallback)');
  console.log('  HUBSPOT_CLIENT_SECRET: ', clientSecret ? `${clientSecret.slice(0, 8)}…` : 'NOT SET — webhook verification disabled');

  // 2. Find connected integrations
  let userIds: string[] | undefined;
  if (TARGET_EMAIL) {
    const u = await prisma.user.findFirst({ where: { email: TARGET_EMAIL }, select: { id: true } });
    if (!u) { console.log(`  No user found with email ${TARGET_EMAIL}.`); await prisma.$disconnect(); process.exit(0); }
    userIds = [u.id];
  }

  const integrations = await prisma.crmIntegration.findMany({
    where: { type: 'hubspot', enabled: true, ...(userIds ? { userId: { in: userIds } } : {}) },
  });

  // Fetch emails for display
  const userEmailMap: Record<string, string> = {};
  if (integrations.length > 0) {
    const ids = integrations.map(i => i.userId);
    const users = await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, email: true } });
    for (const u of users) userEmailMap[u.id] = u.email;
  }

  console.log(`\nConnected HubSpot integrations: ${integrations.length}`);
  if (integrations.length === 0) {
    const total = await prisma.crmIntegration.count({ where: { type: 'hubspot' } });
    if (total === 0) {
      console.log('  No HubSpot integrations in DB. Connect via Settings → Integrations → HubSpot.');
    } else {
      console.log(`  ${total} integration(s) exist but none are enabled.`);
    }
    await prisma.$disconnect();
    process.exit(0);
  }

  for (const integration of integrations) {
    const userEmail = userEmailMap[integration.userId] ?? integration.userId;
    console.log(`\n─── ${userEmail} ───`);
    console.log(`  syncStatus:  ${integration.syncStatus}`);
    console.log(`  enabled:     ${integration.enabled}`);
    console.log(`  lastSyncAt:  ${integration.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleString() : 'never'}`);
    console.log(`  expiresAt:   ${integration.expiresAt ? new Date(integration.expiresAt).toLocaleString() : 'unknown'}`);
    if (integration.lastError) console.log(`  lastError:   ${integration.lastError}`);

    // 3. Validate token
    console.log('\n  Token check:');
    const expired = integration.expiresAt
      ? integration.expiresAt.getTime() < Date.now()
      : false;
    const expiresInMin = integration.expiresAt
      ? Math.round((integration.expiresAt.getTime() - Date.now()) / 60_000)
      : null;

    if (expired) {
      console.log('  ⚠ Access token is EXPIRED — attempting refresh...');
    } else {
      console.log(`  ✓ Access token valid (expires in ${expiresInMin ?? '?'} min)`);
    }

    let tokenOk = false;
    try {
      await getValidHubSpotToken(integration.userId);
      tokenOk = true;
      console.log('  ✓ Token (or refreshed token) is usable');
    } catch (e: any) {
      if (e instanceof HubSpotReconnectError) {
        console.log('  ✗ RECONNECT REQUIRED — refresh token is invalid. Reconnect via Settings → Integrations → HubSpot.');
      } else {
        console.log(`  ✗ Token error: ${e.message}`);
      }
    }

    if (!tokenOk) continue;

    // 4. Run full sync
    console.log('\n  Running full bidirectional sync...');
    const start = Date.now();
    try {
      const result = await syncHubSpot(integration.userId, { fullSync: true });
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`\n  Sync complete in ${elapsed}s:`);
      console.log(`    Contacts pulled from HubSpot: ${result.pulled}`);
      console.log(`    Customers created:            ${result.created}`);
      console.log(`    Customers updated:            ${result.updated}`);
      console.log(`    Risk scores pushed:           ${result.pushed}`);
      console.log(`    Errors:                       ${result.errors.length}`);
      if (result.errors.length > 0) {
        for (const err of result.errors.slice(0, 5)) {
          console.log(`      - ${err}`);
        }
        if (result.errors.length > 5) console.log(`      ... and ${result.errors.length - 5} more`);
      }
    } catch (e: any) {
      console.log(`  ✗ Sync failed: ${e.message}`);
    }

    // 5. Recent CrmSyncLog
    const logs = await prisma.crmSyncLog.findMany({
      where: { userId: integration.userId, crmType: 'hubspot' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    console.log(`\n  Recent CrmSyncLog (${logs.length} entries):`);
    if (logs.length === 0) {
      console.log('    (none)');
    }
    for (const log of logs) {
      const dir  = log.direction === 'inbound' ? '← Pull' : '→ Push';
      const mark = log.status === 'success' ? '✓' : '✗';
      const time = new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      console.log(`    [${mark}] ${dir} ${log.entityType}:${log.entityId.slice(0, 10)} — ${log.message ?? ''} (${time})`);
    }

    // 6. Customer counts
    const hubspotCustomers = await prisma.customer.count({
      where: { userId: integration.userId, externalId: { startsWith: 'hubspot_' } },
    });
    const totalCustomers = await prisma.customer.count({ where: { userId: integration.userId } });
    console.log(`\n  Customers: ${hubspotCustomers} from HubSpot / ${totalCustomers} total`);
  }

  console.log('\n=== Checks ===');
  console.log('Env vars:      ', clientId ? 'PASS' : 'WARN (using hardcoded client ID)');
  console.log('DB integrations found: PASS');
  console.log('Sync ran:      see results above');
  console.log('CrmSyncLog:    see entries above');

  await prisma.$disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Test failed:', err?.message ?? err);
  process.exit(1);
});
