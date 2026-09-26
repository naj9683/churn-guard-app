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

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectMimeType(base64: string): string {
  if (base64.startsWith('/9j/'))  return 'image/jpeg';
  if (base64.startsWith('iVBOR')) return 'image/png';
  if (base64.startsWith('UklGR')) return 'image/webp';
  return 'image/jpeg';
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Body size cap: 8 MB (images are ~1 MB each as base64)
  const rawBody = await req.text();
  if (rawBody.length > 8 * 1024 * 1024) {
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
  let body: { appUserId?: unknown; imageBase64?: unknown; compareImageBase64?: unknown };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { appUserId, imageBase64, compareImageBase64 } = body;

  if (!appUserId || typeof appUserId !== 'string' || !appUserId.trim()) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'appUserId is required' },
      { status: 400 },
    );
  }
  if (!imageBase64 || typeof imageBase64 !== 'string' || !imageBase64.trim()) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'imageBase64 is required' },
      { status: 400 },
    );
  }

  const compareMode =
    typeof compareImageBase64 === 'string' && compareImageBase64.trim().length > 0;

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('[thumbsnap/score] GEMINI_API_KEY not set');
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }

  // Build Gemini parts
  const scoringCriteria =
    `- Readability at small size (mobile screen / YouTube grid)\n` +
    `- Color contrast and visual pop\n` +
    `- Emotional pull and curiosity trigger\n` +
    `- Clarity of subject and main message`;

  let parts: object[];

  if (compareMode) {
    const promptText =
      `You are a YouTube thumbnail expert. You will receive two thumbnails labelled A and B.\n` +
      `Score EACH thumbnail 1-10 based on:\n${scoringCriteria}\n\n` +
      `Also declare which is the stronger thumbnail overall and explain why in one sentence.\n\n` +
      `Respond ONLY with valid JSON matching this shape exactly — no markdown, no explanation:\n` +
      `{"score":{"A":<1-10>,"B":<1-10>},"tips":["tip1","tip2","tip3"],"winner":"A or B","reason":"one sentence"}`;

    parts = [
      { text: 'Thumbnail A:' },
      { inlineData: { mimeType: detectMimeType(imageBase64), data: imageBase64 } },
      { text: 'Thumbnail B:' },
      { inlineData: { mimeType: detectMimeType(compareImageBase64 as string), data: compareImageBase64 } },
      { text: promptText },
    ];
  } else {
    const promptText =
      `You are a YouTube thumbnail expert. Rate this thumbnail 1-10 based on:\n${scoringCriteria}\n\n` +
      `Provide 3 specific, actionable improvement tips.\n\n` +
      `Respond ONLY with valid JSON matching this shape exactly — no markdown, no explanation:\n` +
      `{"score":<1-10>,"tips":["tip1","tip2","tip3"]}`;

    parts = [
      { inlineData: { mimeType: detectMimeType(imageBase64), data: imageBase64 } },
      { text: promptText },
    ];
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
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

    if (compareMode) {
      if (
        typeof parsed.score?.A !== 'number' ||
        typeof parsed.score?.B !== 'number' ||
        !Array.isArray(parsed.tips) ||
        (parsed.winner !== 'A' && parsed.winner !== 'B') ||
        typeof parsed.reason !== 'string'
      ) {
        throw new Error('Unexpected compare response shape from Gemini');
      }
      return NextResponse.json({
        score: { A: parsed.score.A, B: parsed.score.B },
        tips: parsed.tips as string[],
        winner: parsed.winner as 'A' | 'B',
        reason: parsed.reason as string,
      });
    } else {
      if (typeof parsed.score !== 'number' || !Array.isArray(parsed.tips)) {
        throw new Error('Unexpected score response shape from Gemini');
      }
      return NextResponse.json({
        score: parsed.score as number,
        tips: parsed.tips as string[],
      });
    }
  } catch (e) {
    console.error('[thumbsnap/score] error:', (e as Error).message);
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }
}
