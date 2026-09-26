import { NextRequest, NextResponse } from 'next/server';

// ── In-memory IP rate limiter (10 req / 60 s per IP) ─────────────────────────

const ipWindows = new Map<string, { count: number; windowStart: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  if (ipWindows.size > 1_000) {
    ipWindows.forEach((v, k) => {
      if (now - v.windowStart > RATE_WINDOW_MS * 2) ipWindows.delete(k);
    });
  }
  const entry = ipWindows.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    ipWindows.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Body size cap: 20 KB
  const rawBody = await req.text();
  if (rawBody.length > 20_480) {
    return NextResponse.json({ error: 'request_too_large' }, { status: 413 });
  }

  // IP rate limit
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  if (!checkIpRateLimit(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  // Parse body
  let body: { appUserId?: unknown; topic?: unknown };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { appUserId, topic } = body;

  if (!appUserId || typeof appUserId !== 'string' || !appUserId.trim()) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'appUserId is required' },
      { status: 400 },
    );
  }
  if (
    !topic ||
    typeof topic !== 'string' ||
    topic.trim().length === 0 ||
    topic.length > 300
  ) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'topic must be 1–300 characters' },
      { status: 400 },
    );
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('[thumbsnap/suggest-titles] GEMINI_API_KEY not set');
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }

  const prompt =
    `You are a YouTube thumbnail and title expert optimising for click-through rate.\n` +
    `Given the video topic below, generate exactly:\n` +
    `- 5 catchy, high-CTR YouTube video titles (compelling, under 70 characters each)\n` +
    `- 5 short thumbnail overlay texts (maximum 4 words each, punchy, bold)\n\n` +
    `Video topic: ${topic.trim()}\n\n` +
    `Respond ONLY with valid JSON matching this shape exactly — no markdown, no explanation:\n` +
    `{"titles":["...","...","...","...","..."],"overlays":["...","...","...","...","..."]}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
        signal: AbortSignal.timeout(30_000),
      },
    );

    if (!res.ok) {
      const err: any = await res.json().catch(() => ({}));
      throw new Error(`Gemini ${res.status}: ${err?.error?.message ?? 'unknown'}`);
    }

    const data: any = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const parsed = JSON.parse(text);

    if (
      !Array.isArray(parsed.titles) || parsed.titles.length !== 5 ||
      !Array.isArray(parsed.overlays) || parsed.overlays.length !== 5
    ) {
      throw new Error('Unexpected response shape from Gemini');
    }

    return NextResponse.json({
      titles: parsed.titles as string[],
      overlays: parsed.overlays as string[],
    });
  } catch (e) {
    console.error('[thumbsnap/suggest-titles] error:', (e as Error).message);
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }
}
