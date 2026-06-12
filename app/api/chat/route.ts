import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SYSTEM_PROMPT =
  "You are ChurnGuard's AI support assistant. Help SaaS founders reduce subscription churn. " +
  "Answer questions about pricing ($79/$149/$299), features (churn predictions, alerts, SMS, email, " +
  "workflows, dunning, cancellation flows), setup (Stripe + HubSpot integration, ~15 minutes), and " +
  "security (AES-256 encryption, data privacy). Be concise and professional. " +
  "If you cannot answer, suggest they book a call or share their email.";

// GET /api/chat — safe diagnostic (never exposes the full key)
export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY ?? '';
  return NextResponse.json({
    keySet: key.length > 0,
    keyPrefix: key.length > 0 ? key.slice(0, 14) + '…' : null,
    model: 'claude-3-haiku-20240307',
  });
}

export async function POST(req: NextRequest) {
  // ── Email capture ────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (body.captureEmail) {
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const question = typeof body.question === 'string' ? body.question.slice(0, 500) : undefined;
    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    await prisma.chatLead.create({ data: { email, question } });
    return NextResponse.json({ ok: true });
  }

  // ── API key guard ────────────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY ?? '';
  if (!apiKey) {
    console.error('[chat] ANTHROPIC_API_KEY is not set');
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  // ── Validate messages ────────────────────────────────────────────────────────
  const rawMessages = body.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
  }
  const messages = (rawMessages as { role: string; content: string }[])
    .slice(-20)
    .map(m => ({ role: m.role as 'user' | 'assistant', content: String(m.content) }));

  // ── Call Anthropic (with one retry on 5xx) ───────────────────────────────────
  const requestBody = {
    model: 'claude-3-haiku-20240307',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages,
  };

  async function callAnthropic() {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Always read response as text first so we can log it exactly
    const rawText = await res.text();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error('[chat] Anthropic returned non-JSON response, status:', res.status, 'body:', rawText.slice(0, 500));
      return { ok: false, status: res.status, text: '' };
    }

    if (!res.ok) {
      console.error('[chat] Anthropic API error — status:', res.status, 'body:', JSON.stringify(parsed));
      return { ok: false, status: res.status, text: '' };
    }

    const content = parsed.content;
    const text =
      Array.isArray(content) && content[0]?.type === 'text'
        ? String(content[0].text)
        : '';

    if (!text) {
      console.error('[chat] Anthropic returned OK but no text content:', JSON.stringify(parsed));
    }

    return { ok: true, status: res.status, text };
  }

  let result = await callAnthropic();

  if (!result.ok && result.status >= 500) {
    console.warn('[chat] retrying after 1s (status was', result.status, ')');
    await new Promise(r => setTimeout(r, 1000));
    result = await callAnthropic();
  }

  if (!result.ok || !result.text) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const text = result.text;
  const suggestEmail =
    text.toLowerCase().includes('not sure') ||
    text.toLowerCase().includes('book a call') ||
    text.toLowerCase().includes('reach out') ||
    text.toLowerCase().includes('contact') ||
    messages.filter(m => m.role === 'user').length >= 8;

  return NextResponse.json({ response: text, suggestEmail });
}
