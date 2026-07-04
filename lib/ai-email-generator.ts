import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || '',
});

export interface CustomerEmailContext {
  name: string;
  email: string;
  plan?: string | null;
  mrr?: number;
  riskScore?: number;
  daysSinceLogin?: number;
  paymentFailureCount?: number;
  lastInvoiceDate?: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  generatedAt: Date;
  source: 'ai' | 'fallback';
}

const PLACEHOLDER_RE = /\[(Your Name|Company Name|Your Company|Name)\]/gi;

const AI_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

export async function generatePersonalizedEmail(
  customer: CustomerEmailContext,
  emailType: string,
  userId: string,
  extra?: Record<string, unknown>
): Promise<GeneratedEmail> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiEmailEnabled: true },
  }).catch(() => null);

  const aiEnabled = (user?.aiEmailEnabled ?? true) && !!AI_API_KEY;

  if (!aiEnabled) {
    return { ...buildFallback(customer, emailType), source: 'fallback' };
  }

  // Rate limit: max 100 AI emails per day per tenant
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const todayCount = await prisma.emailLog.count({
    where: { userId, emailSource: 'ai', createdAt: { gte: dayStart } },
  }).catch(() => 0);

  if (todayCount >= 100) {
    console.warn(`[ai-email] daily limit reached for tenant ${userId}`);
    return { ...buildFallback(customer, emailType), source: 'fallback' };
  }

  try {
    // MRR is stored in cents; convert to dollars for display
    const mrrDollars = customer.mrr != null ? Math.round(customer.mrr / 100) : null;
    const mrrDisplay = mrrDollars != null ? `$${mrrDollars}/mo` : 'unknown';
    const firstName = customer.name?.split(' ')[0] || 'there';

    console.log('[ai-email] generating for:', {
      name: customer.name,
      plan: customer.plan,
      mrr: mrrDisplay,
      riskScore: customer.riskScore,
      daysSinceLogin: customer.daysSinceLogin,
      emailType,
    });

    const prompt = buildPrompt(emailType, {
      firstName,
      fullName: customer.name || 'there',
      plan: customer.plan || 'free',
      mrr: mrrDisplay,
      riskScore: customer.riskScore ?? 50,
      daysSinceLogin: customer.daysSinceLogin,
      paymentFailureCount: customer.paymentFailureCount,
      lastInvoiceDate: customer.lastInvoiceDate,
      ...extra,
    });

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content[0]?.type === 'text' ? response.content[0].text : '';

    // Extract JSON — Claude sometimes wraps it in ```json fences
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object found in response');
    const parsed = JSON.parse(jsonMatch[0]) as { subject?: string; body?: string };

    if (!parsed.subject || !parsed.body) throw new Error('AI returned invalid structure');

    // Sanitize any stray bracket placeholders
    const cleanBody    = parsed.body.replace(PLACEHOLDER_RE, 'ChurnGuard Team');
    const cleanSubject = parsed.subject.replace(PLACEHOLDER_RE, 'ChurnGuard Team');

    console.log('[ai-email] generated subject:', cleanSubject);

    return { subject: cleanSubject, body: cleanBody, generatedAt: new Date(), source: 'ai' };
  } catch (err) {
    console.error('[ai-email] generation failed, falling back:', err);
    return { ...buildFallback(customer, emailType), source: 'fallback' };
  }
}

function buildPrompt(type: string, v: Record<string, unknown>): string {
  const systemInstructions = `You are a world-class SaaS customer success writer specializing in churn prevention emails.

CRITICAL RULES — follow every one without exception:
1. Reference the customer's EXACT plan name (${v.plan}), MRR (${v.mrr}), and risk score (${v.riskScore}/100) naturally in the email body. Use specific numbers. Never say "exploring our platform" or other vague filler.
2. Sign EVERY email exactly as: "Best regards,\\nChurnGuard Team" — NEVER write [Your Name], [Company Name], [Your Company], or any bracket placeholder.
3. Conversational, direct tone. No clichés: no "hope this finds you well", "circle back", "touch base".
4. Max 130 words for the body text. One clear, specific call-to-action.
5. Output ONLY valid JSON with exactly two keys: "subject" and "body".
6. "body" must be complete, valid HTML with inline styles: white background #ffffff, font-family Arial sans-serif 14px, max-width 600px, line-height 1.6, padding 24px.`;

  const ctx = `CUSTOMER DATA — use these exact values naturally in the email:
- First name: ${v.firstName}
- Plan type: ${v.plan}
- Monthly MRR: ${v.mrr}
- Churn risk score: ${v.riskScore}/100 (70+ = high risk, 90+ = critical)
${v.daysSinceLogin != null ? `- Days since last login: ${v.daysSinceLogin} days` : '- Last login: unknown'}
${v.paymentFailureCount ? `- Payment failures recently: ${v.paymentFailureCount}` : ''}
${v.lastInvoiceDate ? `- Last invoice: ${v.lastInvoiceDate}` : ''}`;

  const prompts: Record<string, string> = {
    onboardingRescue: `${systemInstructions}

${ctx}

Write a re-engagement email to ${v.firstName} who signed up for a ${v.plan} plan (${v.mrr}) but hasn't set up their first retention playbook yet. Mention their specific plan. Goal: get them to log in and complete setup. Offer direct, personal help. CTA button: "Set Up My First Playbook". Sign as: Best regards, ChurnGuard Team.`,

    silentQuitter: `${systemInstructions}

${ctx}

Write a re-engagement email to ${v.firstName} who is on the ${v.plan} plan (${v.mrr}) and hasn't logged in for ${v.daysSinceLogin ?? 14} days (risk score: ${v.riskScore}/100). Reference the specific number of days and their plan. Ask one genuine, direct question about their retention challenges. Don't be pushy. Sign as: Best regards, ChurnGuard Team.`,

    paymentSaver: `${systemInstructions}

${ctx}

Write a payment recovery email to ${v.firstName} whose payment failed${v.paymentFailureCount ? ` ${v.paymentFailureCount} time(s)` : ''}. Mention their ${v.plan} plan and ${v.mrr} MRR. Reassure: data is safe, account still active. Offer three options: update card, pause 30 days, or downgrade to free. Warm, non-alarming tone. Sign as: Best regards, ChurnGuard Team.`,

    churnRisk: `${systemInstructions}

${ctx}

Write a proactive retention check-in to ${v.firstName} on the ${v.plan} plan (${v.mrr}/month). Their risk score is ${v.riskScore}/100 — high risk. Do NOT mention "churn risk" directly. Reference their plan and MRR naturally. Ask how they're getting value from the product and offer a 1-on-1 call or personalized help. Human and specific — zero generic filler. Sign as: Best regards, ChurnGuard Team.`,

    winBack: `${systemInstructions}

${ctx}

Write a win-back email to ${v.firstName} who recently cancelled their ${v.plan} plan (was ${v.mrr}/month). Acknowledge their cancellation directly. Ask one genuine question about why they left. Offer a specific incentive: 20% off for 3 months. Short, non-desperate. Sign as: Best regards, ChurnGuard Team.`,

    checkIn: `${systemInstructions}

${ctx}

Write a brief proactive check-in to ${v.firstName} on the ${v.plan} plan paying ${v.mrr}/month. Reference their plan and MRR. Goal: surface friction before it becomes churn. One open-ended question about their biggest challenge right now. Under 80 words. Sign as: Best regards, ChurnGuard Team.`,
  };

  return prompts[type] ?? prompts.checkIn;
}

function buildFallback(customer: CustomerEmailContext, emailType: string): { subject: string; body: string; generatedAt: Date } {
  const firstName = customer.name?.split(' ')[0] || 'there';
  const days = customer.daysSinceLogin ?? 14;
  const plan = customer.plan ?? 'current';

  const templates: Record<string, { subject: string; body: string }> = {
    onboardingRescue: {
      subject: `Need help getting started, ${firstName}?`,
      body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;line-height:1.6;background:#ffffff">
<p>Hey ${firstName},</p>
<p>I noticed you signed up for the ${plan} plan but haven't set up your first retention playbook yet.</p>
<p>The most successful SaaS companies recover 15–20% of at-risk customers with automated playbooks. I'd love to help you set one up.</p>
<p><a href="#" style="background:#6366f1;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:8px">Set Up My First Playbook</a></p>
<p>Best regards,<br>ChurnGuard Team</p>
</div>`,
    },
    silentQuitter: {
      subject: `We miss you — it's been ${days} days, ${firstName}`,
      body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;line-height:1.6;background:#ffffff">
<p>Hey ${firstName},</p>
<p>It's been ${days} days since you last logged into ChurnGuard. You're on the ${plan} plan — I want to make sure it's working for you.</p>
<p>Quick question: what's the biggest challenge you're facing with customer retention right now?</p>
<p>Best regards,<br>ChurnGuard Team</p>
</div>`,
    },
    paymentSaver: {
      subject: `Action needed: update your payment method, ${firstName}`,
      body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;line-height:1.6;background:#ffffff">
<p>Hey ${firstName},</p>
<p>We couldn't process your last payment — but your ${plan} plan data is safe and your account is still active.</p>
<ul>
<li><strong>Update your card</strong> to continue seamlessly</li>
<li><strong>Pause for 30 days</strong> at no charge</li>
<li><strong>Switch to the free plan</strong> and keep basic features</li>
</ul>
<p><a href="#" style="background:#10b981;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:8px">Choose an option</a></p>
<p>Best regards,<br>ChurnGuard Team</p>
</div>`,
    },
    churnRisk: {
      subject: `Quick check-in, ${firstName} — how's the ${plan} plan working?`,
      body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;line-height:1.6;background:#ffffff">
<p>Hey ${firstName},</p>
<p>Just checking in — how is ChurnGuard working for you on the ${plan} plan? Are you getting the value you expected?</p>
<p>I'd love to jump on a quick 15-minute call to make sure you're set up for success.</p>
<p><a href="#" style="background:#6366f1;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:8px">Book a 15-min call</a></p>
<p>Best regards,<br>ChurnGuard Team</p>
</div>`,
    },
    winBack: {
      subject: `We'd love to have you back, ${firstName}`,
      body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;line-height:1.6;background:#ffffff">
<p>Hey ${firstName},</p>
<p>We noticed you recently cancelled your ${plan} plan — and I wanted to reach out personally to understand why.</p>
<p>If you're open to giving ChurnGuard another shot, I'd like to offer you <strong>20% off for 3 months</strong> — no commitment.</p>
<p><a href="#" style="background:#6366f1;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:8px">Restart with 20% off</a></p>
<p>Best regards,<br>ChurnGuard Team</p>
</div>`,
    },
    checkIn: {
      subject: `Quick check-in, ${firstName}`,
      body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;line-height:1.6;background:#ffffff">
<p>Hey ${firstName},</p>
<p>Just a quick check-in — is everything going well with your ${plan} plan on ChurnGuard?</p>
<p>What's one thing we could do to make the product more valuable for you?</p>
<p>Best regards,<br>ChurnGuard Team</p>
</div>`,
    },
  };

  return {
    ...(templates[emailType] ?? templates.checkIn),
    generatedAt: new Date(),
  };
}
