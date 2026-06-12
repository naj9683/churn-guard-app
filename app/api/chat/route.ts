import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the ChurnGuard sales assistant — friendly, concise, and knowledgeable. ChurnGuard is an AI-powered churn prevention platform for SaaS companies.

KEY FACTS:
- What it does: Monitors customer health scores every 6 hours, predicts churn risk, and automatically sends personalized retention messages via Email, SMS (Twilio), and Slack
- Revenue at Risk dashboard: Shows exactly how many dollars are at risk from churning customers
- Integrations: HubSpot CRM, Stripe (billing), Postmark/Resend (email), Twilio (SMS), Slack
- Setup: Takes ~15 minutes; connect your tools once, AI does the rest
- Security: AES-256 encryption, SOC 2 compliant, GDPR-ready

PRICING (monthly, billed monthly):
- Seed: $79/month — up to 500 customers, email alerts, HubSpot sync
- Growth: $149/month — up to 2,000 customers, SMS + Slack, playbooks, priority support
- Scale: $299/month — unlimited customers, custom AI models, dedicated CSM, SLA

HOW IT WORKS:
1. Connect your CRM, billing, and communication tools
2. ChurnGuard ingests customer usage data and calculates risk scores
3. AI identifies at-risk customers and triggers automated retention sequences
4. Track saved MRR and intervention outcomes on the dashboard

COMMON QUESTIONS:
- Free trial: 14-day free trial on all plans, no credit card required
- ROI: Average customer saves 3-5x their monthly subscription in prevented churn within 60 days
- Data: We sync from your existing tools; no manual data entry required
- Cancel anytime: No contracts, month-to-month billing

Keep answers under 3 sentences unless the question requires more detail. If asked something you don't know or that's outside ChurnGuard's scope, say you're not sure and suggest booking a call with the team. Never make up specific numbers or features not listed above.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Email capture branch
    if (body.captureEmail) {
      const { email, question } = body;
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
      }
      await prisma.chatLead.create({ data: { email: email.trim().toLowerCase(), question: question?.slice(0, 500) } });
      return NextResponse.json({ ok: true });
    }

    // Chat branch
    const { messages } = body as { messages: { role: 'user' | 'assistant'; content: string }[] };
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Cap at 20 total messages (10 user + 10 assistant) to control costs
    const trimmed = messages.slice(-20);

    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: trimmed,
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';

    // Suggest email capture if the bot can't answer or for sales-intent phrases
    const suggestEmail =
      text.toLowerCase().includes("not sure") ||
      text.toLowerCase().includes("book a call") ||
      text.toLowerCase().includes("reach out") ||
      text.toLowerCase().includes("contact") ||
      trimmed.filter(m => m.role === 'user').length >= 8;

    return NextResponse.json({ response: text, suggestEmail });
  } catch (err) {
    console.error('[chat route]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
