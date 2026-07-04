/**
 * Test AI email generation with a mock customer.
 * Run with:  npx tsx scripts/test-ai-email.ts
 * (tsx handles .env automatically via cross-env or pass OPENAI_API_KEY inline)
 */

// @ts-nocheck — script file, not part of the Next.js app bundle

const mockCustomer = {
  name: 'Margaret Chen',
  email: 'margaret@example.com',
  plan: 'Growth',
  mrr: 14900,        // $149/mo stored in cents
  riskScore: 78,
  daysSinceLogin: 21,
  paymentFailureCount: 0,
};

async function main() {
  // Dynamic imports so this file has zero top-level side effects at build time
  const { generatePersonalizedEmail } = await import('../lib/ai-email-generator');

  console.log('\n=== AI Email Generation Test ===\n');
  console.log('Mock customer:', JSON.stringify(mockCustomer, null, 2));
  console.log('\nGenerating churnRisk email...\n');

  const result = await generatePersonalizedEmail(mockCustomer, 'churnRisk', 'test-user-id');

  console.log('Source:  ', result.source);
  console.log('Subject: ', result.subject);

  const text = result.body
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  console.log('\nBody (text):\n', text);

  console.log('\n=== Checks ===');
  console.log('[Your Name] placeholder present:', /\[Your Name\]/i.test(result.body) ? 'YES — BUG' : 'NO — PASS');
  console.log('Mentions plan (Growth):',         result.body.includes('Growth')       ? 'YES — PASS' : 'NO');
  console.log('Mentions MRR ($149):',            result.body.includes('149')          ? 'YES — PASS' : 'NO');
  console.log('Mentions risk score (78):',       result.body.includes('78')           ? 'YES — PASS' : 'NO');

  process.exit(0);
}

main().catch(err => { console.error('Test failed:', err.message ?? err); process.exit(1); });
