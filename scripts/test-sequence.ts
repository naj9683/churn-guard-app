/**
 * End-to-end test for the sequence execution engine.
 *
 * What it does:
 *  1. Finds the first customer in the DB
 *  2. Enrolls them in the 'welcome' sequence with nextRunAt = now
 *  3. Calls runSequences() — processes the enrollment immediately
 *  4. Fetches and prints the SequenceLog entry
 *  5. Prints EmailLog entries created during the run
 *  6. Cleans up the test enrollment + its logs
 *
 * NOTE: step 0 of 'welcome' sends a real welcome email to the customer.
 *
 * Run with:
 *   npx tsx scripts/test-sequence.ts
 */

// @ts-nocheck

async function main() {
  const { prisma }          = await import('../lib/prisma');
  const { runSequences }    = await import('../lib/sequences');

  console.log('\n=== Sequence Engine Test ===\n');

  // 1. Find a real customer to test with
  const customer = await prisma.customer.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, userId: true },
  });

  if (!customer) {
    console.error('No customers found in DB. Ingest some customers first.');
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log(`Test customer: ${customer.name ?? customer.email} (id: ${customer.id})`);

  // 2. Cancel any existing welcome enrollments for this customer (clean slate)
  await prisma.sequenceEnrollment.updateMany({
    where: { customerId: customer.id, sequenceType: 'welcome', status: 'active' },
    data: { status: 'cancelled' },
  });

  // 3. Create a test enrollment with nextRunAt = now
  const enrollment = await prisma.sequenceEnrollment.create({
    data: {
      userId:       customer.userId,
      customerId:   customer.id,
      sequenceType: 'welcome',
      currentStep:  0,
      nextRunAt:    new Date(),
      status:       'active',
      metadata:     { testRun: true },
    },
  });

  console.log(`Enrollment created: ${enrollment.id} (nextRunAt = now, step 0)\n`);

  // 4. Count EmailLog entries before the run
  const emailsBefore = await prisma.emailLog.count({ where: { userId: customer.userId } });

  // 5. Run sequences
  console.log('Running sequences...\n');
  const runTimestamp = new Date();
  const result = await runSequences();
  console.log('Run result:', result);

  // 6. Fetch the SequenceLog written for this enrollment
  const logs = await prisma.sequenceLog.findMany({
    where: { enrollmentId: enrollment.id },
    orderBy: { executedAt: 'asc' },
  });

  console.log('\n--- SequenceLog entries ---');
  if (logs.length === 0) {
    console.log('  (none — enrollment may not have been processed)');
  }
  for (const log of logs) {
    console.log(`  step ${log.step} [${log.status}] ${log.action}: ${log.message}`);
  }

  // 7. Check EmailLog for new entries
  const emailsAfter = await prisma.emailLog.count({ where: { userId: customer.userId } });
  const newEmails   = emailsAfter - emailsBefore;
  console.log(`\n--- EmailLog ---`);
  console.log(`  Emails before run: ${emailsBefore}`);
  console.log(`  Emails after run:  ${emailsAfter}`);
  console.log(`  New emails sent:   ${newEmails}`);

  if (newEmails > 0) {
    const latest = await prisma.emailLog.findFirst({
      where: { userId: customer.userId, createdAt: { gte: runTimestamp } },
      orderBy: { createdAt: 'desc' },
    });
    if (latest) {
      console.log(`  Latest → to: ${latest.to} | subject: ${latest.subject} | status: ${latest.status}`);
    }
  }

  // 8. Check updated enrollment status
  const updated = await prisma.sequenceEnrollment.findUnique({ where: { id: enrollment.id } });
  console.log(`\n--- Enrollment after run ---`);
  console.log(`  status: ${updated?.status}  currentStep: ${updated?.currentStep}`);

  // 9. Clean up test data
  await prisma.sequenceLog.deleteMany({ where: { enrollmentId: enrollment.id } });
  await prisma.sequenceEnrollment.delete({ where: { id: enrollment.id } });
  console.log('\nCleanup done (enrollment + logs deleted).');

  // 10. Results summary
  console.log('\n=== Checks ===');
  console.log('SequenceLog created:        ', logs.length > 0          ? 'YES — PASS' : 'NO — FAIL');
  console.log('Step logged as success:     ', logs[0]?.status === 'success' ? 'YES — PASS' : `NO (${logs[0]?.status ?? 'no log'}) — check above`);
  console.log('EmailLog entry created:     ', newEmails > 0             ? 'YES — PASS' : 'NO — check Resend config');
  console.log('Enrollment advanced/completed:', updated?.status === 'completed' || (updated?.currentStep ?? 0) > 0 ? 'YES — PASS' : 'NO — FAIL');

  await prisma.$disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('Test failed:', err?.message ?? err);
  process.exit(1);
});
