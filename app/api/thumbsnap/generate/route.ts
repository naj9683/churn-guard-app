import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

// ── Types ─────────────────────────────────────────────────────────────────────

type Product = 'pro_yearly' | 'pro_monthly' | 'pro_weekly' | 'free';
type CreditSource = 'free' | 'period' | 'pack';

interface CreditsRow {
  app_user_id: string;
  free_used: number;
  period_start: Date | null;
  period_used: number;
  product: string | null;
  pack_credits: number;
}

// ── RevenueCat ────────────────────────────────────────────────────────────────

async function getActiveProduct(appUserId: string): Promise<Product> {
  try {
    const key = process.env.REVENUECAT_SECRET_KEY;
    if (!key) return 'free';

    const res = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(8_000),
      },
    );
    if (!res.ok) return 'free';

    const data: any = await res.json();
    const subs = data?.subscriber?.subscriptions ?? {};
    const now = new Date();
    for (const prod of ['pro_yearly', 'pro_monthly', 'pro_weekly'] as const) {
      const sub = subs[prod];
      if (sub?.expires_date && new Date(sub.expires_date) > now) return prod;
    }
    return 'free';
  } catch {
    return 'free';
  }
}

// ── Credit limits ─────────────────────────────────────────────────────────────

const TESTER_IDS = new Set(['$RCAnonymousID:9fdfa77b18cb4fe1a9b4dfbf8c7d7edb']);

const LIMITS: Record<Product, { total: number; periodDays: number | null }> = {
  free:        { total: 3,  periodDays: null },
  pro_weekly:  { total: 20, periodDays: 7    },
  pro_monthly: { total: 60, periodDays: 30   },
  pro_yearly:  { total: 60, periodDays: 30   },
};

class LimitReachedError extends Error {
  constructor(
    public readonly remaining: number,
    public readonly resetsAt: Date | null,
  ) {
    super('limit_reached');
  }
}

// Carries the full Gemini response body so call sites can surface it verbatim.
class GeminiSwapError extends Error {
  constructor(
    public readonly geminiBody: unknown,
  ) {
    const msg =
      (geminiBody as any)?.error?.message ??
      (geminiBody as any)?.message ??
      'generation failed';
    super(msg);
  }
}

async function atomicConsumeCredit(
  appUserId: string,
  product: Product,
): Promise<{ remaining: number; resetsAt: Date | null; source: CreditSource }> {
  const limit = LIMITS[product];
  const now = new Date();

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "thumbsnap_credits" (
      "app_user_id"  TEXT    NOT NULL,
      "free_used"    INTEGER NOT NULL DEFAULT 0,
      "period_start" TIMESTAMPTZ,
      "period_used"  INTEGER NOT NULL DEFAULT 0,
      "product"      TEXT,
      "pack_credits" INTEGER NOT NULL DEFAULT 0,
      CONSTRAINT "thumbsnap_credits_pkey" PRIMARY KEY ("app_user_id")
    )
  `;
  await prisma.$executeRaw`
    ALTER TABLE thumbsnap_credits ADD COLUMN IF NOT EXISTS pack_credits INTEGER NOT NULL DEFAULT 0
  `;

  return await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      INSERT INTO thumbsnap_credits (app_user_id, free_used, period_start, period_used, product, pack_credits)
      VALUES (${appUserId}, 0, ${now}, 0, ${product}, 0)
      ON CONFLICT (app_user_id) DO NOTHING
    `;

    const rows = await tx.$queryRaw<CreditsRow[]>`
      SELECT * FROM thumbsnap_credits WHERE app_user_id = ${appUserId} FOR UPDATE
    `;
    const row = rows[0];
    const packCredits = row.pack_credits ?? 0;

    if (product === 'free') {
      const used = row.free_used;
      if (used < limit.total) {
        await tx.$executeRaw`
          UPDATE thumbsnap_credits
          SET free_used = free_used + 1, product = ${product}
          WHERE app_user_id = ${appUserId}
        `;
        return { remaining: limit.total - used - 1 + packCredits, resetsAt: null, source: 'free' as CreditSource };
      }
      if (packCredits > 0) {
        await tx.$executeRaw`
          UPDATE thumbsnap_credits SET pack_credits = pack_credits - 1
          WHERE app_user_id = ${appUserId}
        `;
        return { remaining: packCredits - 1, resetsAt: null, source: 'pack' as CreditSource };
      }
      throw new LimitReachedError(0, null);
    }

    const periodDays = limit.periodDays!;
    const periodStart = row.period_start;
    const periodExpiry = periodStart
      ? new Date(periodStart.getTime() + periodDays * 86_400_000)
      : null;

    const periodExpired = !periodStart || (periodExpiry !== null && periodExpiry < now);
    const productChanged = row.product !== product;

    if (periodExpired || productChanged) {
      const resetsAt = new Date(now.getTime() + periodDays * 86_400_000);
      await tx.$executeRaw`
        UPDATE thumbsnap_credits
        SET period_start = ${now}, period_used = 1, product = ${product}
        WHERE app_user_id = ${appUserId}
      `;
      return { remaining: limit.total - 1 + packCredits, resetsAt, source: 'period' as CreditSource };
    }

    const used = row.period_used;
    const resetsAt = periodExpiry!;

    if (used < limit.total) {
      await tx.$executeRaw`
        UPDATE thumbsnap_credits SET period_used = period_used + 1
        WHERE app_user_id = ${appUserId}
      `;
      return { remaining: limit.total - used - 1 + packCredits, resetsAt, source: 'period' as CreditSource };
    }

    if (packCredits > 0) {
      await tx.$executeRaw`
        UPDATE thumbsnap_credits SET pack_credits = pack_credits - 1
        WHERE app_user_id = ${appUserId}
      `;
      return { remaining: packCredits - 1, resetsAt: null, source: 'pack' as CreditSource };
    }

    throw new LimitReachedError(0, resetsAt);
  });
}

async function decrementCredit(appUserId: string, source: CreditSource): Promise<void> {
  try {
    if (source === 'free') {
      await prisma.$executeRaw`
        UPDATE thumbsnap_credits
        SET free_used = GREATEST(0, free_used - 1)
        WHERE app_user_id = ${appUserId}
      `;
    } else if (source === 'period') {
      await prisma.$executeRaw`
        UPDATE thumbsnap_credits
        SET period_used = GREATEST(0, period_used - 1)
        WHERE app_user_id = ${appUserId}
      `;
    } else {
      await prisma.$executeRaw`
        UPDATE thumbsnap_credits
        SET pack_credits = pack_credits + 1
        WHERE app_user_id = ${appUserId}
      `;
    }
  } catch {
    // Best effort — Gemini already failed, no need to surface a DB error too
  }
}

// ── Gemini helpers ────────────────────────────────────────────────────────────

// Detect JPEG vs PNG from the first bytes of the base64 string.
function detectMimeType(base64: string): 'image/jpeg' | 'image/png' {
  return base64.startsWith('iVBOR') ? 'image/png' : 'image/jpeg';
}

// Strip a data URI prefix (data:image/jpeg;base64,…) to get raw base64.
// If no prefix is present the string is returned as-is.
function extractBase64(dataUri: string): string {
  const idx = dataUri.indexOf('base64,');
  return idx >= 0 ? dataUri.slice(idx + 7) : dataUri;
}

// Returns true when the user's prompt already explains how to use the reference,
// so we don't double-prepend the default instruction.
function promptMentionsUsage(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return (
    lower.includes('reference') ||
    lower.includes('attached') ||
    lower.includes('this image') ||
    lower.includes('use the image')
  );
}

// ── Gemini ────────────────────────────────────────────────────────────────────

async function callGemini(
  prompt: string,
  model: string,
  referenceBase64?: string,
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not configured');

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(model)}:generateContent?key=${key}`;

  // When a reference image is attached, prepend the usage instruction unless
  // the prompt already describes how to use it.
  const textPrompt = referenceBase64 && !promptMentionsUsage(prompt)
    ? `Use the attached image as the main subject/reference for this YouTube thumbnail. ${prompt}`
    : prompt;

  // Build content parts: optional reference image first, then the text prompt.
  const parts: object[] = [];
  if (referenceBase64) {
    parts.push({
      inlineData: {
        mimeType: detectMimeType(referenceBase64),
        data: referenceBase64,
      },
    });
  }
  parts.push({ text: `${textPrompt} -- 16:9 widescreen YouTube thumbnail format` });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '16:9' },
      },
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const err: any = await res.json().catch(() => ({}));
    throw new Error(`Gemini ${res.status}: ${err?.error?.message ?? 'generation failed'}`);
  }

  const data: any = await res.json();
  const imagePart = data?.candidates?.[0]?.content?.parts?.find(
    (p: any) => p.inlineData?.data,
  );
  if (!imagePart) throw new Error('No image in Gemini response');
  return imagePart.inlineData.data as string;
}

// ── Face-swap Gemini call ─────────────────────────────────────────────────────

const FACE_SWAP_INSTRUCTIONS: Record<'swap' | 'insert', string> = {
  swap: 'Replace the face of the person in the first image with the face from the second image. Keep the same pose, expression, lighting, colors and overall art style of the first image. Do not change anything else.',
  insert: "Insert the person from the second image into the first image's scene naturally, matching the lighting, perspective, scale and art style. Do not change anything else.",
};

async function callGeminiFaceSwap(
  baseBase64: string,
  faceBase64: string,
  mode: 'swap' | 'insert',
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not configured');

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `gemini-3.1-flash-image:generateContent?key=${key}`;

  const parts = [
    { inlineData: { mimeType: detectMimeType(baseBase64), data: baseBase64 } },
    { inlineData: { mimeType: detectMimeType(faceBase64), data: faceBase64 } },
    { text: FACE_SWAP_INSTRUCTIONS[mode] },
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '16:9' },
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  });

  // Parse body first so it's available for both error paths.
  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) throw new GeminiSwapError(data);

  const imagePart = data?.candidates?.[0]?.content?.parts?.find(
    (p: any) => p.inlineData?.data,
  );
  if (!imagePart) {
    // Blocked or empty response — surface candidates (finishReason / safetyRatings).
    throw new GeminiSwapError({ message: 'No image in Gemini response', raw: data });
  }
  return imagePart.inlineData.data as string;
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Body size cap raised to 8 MB to accommodate optional reference images.
  // Old requests without a reference are typically <1 KB and pass unchanged.
  const rawBody = await req.text();
  if (rawBody.length > 8_388_608) {
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

  // Parse + validate body
  let body: {
    appUserId?: unknown; prompt?: unknown; referenceImageBase64?: unknown;
    face_image?: unknown; base_image?: unknown; mode?: unknown;
  };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { appUserId, prompt, referenceImageBase64, face_image, base_image, mode } = body;

  if (!appUserId || typeof appUserId !== 'string' || !appUserId.trim()) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'appUserId is required' },
      { status: 400 },
    );
  }
  if (
    face_image == null && (
      !prompt ||
      typeof prompt !== 'string' ||
      prompt.length < 5 ||
      prompt.length > 1_000
    )
  ) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'prompt must be 5–1000 characters' },
      { status: 400 },
    );
  }

  // Validate optional reference image
  let refBase64: string | undefined;
  if (referenceImageBase64 != null) {
    if (typeof referenceImageBase64 !== 'string') {
      return NextResponse.json(
        { error: 'invalid_input', detail: 'referenceImageBase64 must be a string' },
        { status: 400 },
      );
    }
    // ~6 MB of base64 ≈ ~4.5 MB binary — large enough for any phone photo
    if (referenceImageBase64.length > 6_000_000) {
      return NextResponse.json(
        { error: 'reference_too_large', detail: 'referenceImageBase64 must be under 6 MB' },
        { status: 400 },
      );
    }
    refBase64 = referenceImageBase64;
  }

  // Validate face-swap fields
  if (mode != null && mode !== 'swap' && mode !== 'insert') {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'mode must be "swap" or "insert"' },
      { status: 400 },
    );
  }
  if (face_image != null && typeof face_image !== 'string') {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'face_image must be a string' },
      { status: 400 },
    );
  }
  if (base_image != null && typeof base_image !== 'string') {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'base_image must be a string' },
      { status: 400 },
    );
  }
  if (face_image != null && base_image == null) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'base_image is required when face_image is provided' },
      { status: 400 },
    );
  }

  const faceBase64 = face_image != null ? extractBase64(face_image as string) : undefined;
  const baseBase64 = base_image != null ? extractBase64(base_image as string) : undefined;
  const swapMode = (mode as 'swap' | 'insert' | undefined) ?? 'swap';

  if (faceBase64) {
    console.log('[thumbsnap/face-swap] body bytes:', rawBody.length);
  }

  const uid = appUserId.trim();

  // Tester bypass — unlimited generations, no credit/entitlement check
  if (TESTER_IDS.has(uid)) {
    let imageBase64: string;
    try {
      imageBase64 = faceBase64
        ? await callGeminiFaceSwap(baseBase64!, faceBase64, swapMode)
        : await callGemini(prompt as string, 'gemini-3.1-flash-image', refBase64);
    } catch (e) {
      if (e instanceof GeminiSwapError) {
        console.error('[thumbsnap/face-swap] Gemini error:', JSON.stringify(e.geminiBody));
        return NextResponse.json({ error: e.message, detail: e.geminiBody }, { status: 502 });
      }
      console.error('[thumbsnap] Gemini error:', (e as Error).message);
      return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
    }
    return NextResponse.json({ imageBase64, remaining: null, resetsAt: null });
  }

  // Determine subscription tier (errors → free)
  const product = await getActiveProduct(uid);

  // Atomically consume one credit (throws if limit hit)
  let creditResult: { remaining: number; resetsAt: Date | null; source: CreditSource };
  try {
    creditResult = await atomicConsumeCredit(uid, product);
  } catch (e) {
    if (e instanceof LimitReachedError) {
      return NextResponse.json(
        { error: 'limit_reached', remaining: 0, resetsAt: e.resetsAt },
        { status: 429 },
      );
    }
    console.error('[thumbsnap] credit error:', (e as Error).message);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  // Select model by tier
  const model = 'gemini-3.1-flash-image';

  // Generate image — roll back the credit on any failure
  let imageBase64: string;
  try {
    imageBase64 = faceBase64
      ? await callGeminiFaceSwap(baseBase64!, faceBase64, swapMode)
      : await callGemini(prompt as string, model, refBase64);
  } catch (e) {
    if (e instanceof GeminiSwapError) {
      console.error('[thumbsnap/face-swap] Gemini error:', JSON.stringify(e.geminiBody));
      await decrementCredit(uid, creditResult.source);
      return NextResponse.json({ error: e.message, detail: e.geminiBody }, { status: 502 });
    }
    console.error('[thumbsnap] Gemini error:', (e as Error).message);
    await decrementCredit(uid, creditResult.source);
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 });
  }

  return NextResponse.json({
    imageBase64,
    remaining: creditResult.remaining,
    resetsAt: creditResult.resetsAt,
  });
}
