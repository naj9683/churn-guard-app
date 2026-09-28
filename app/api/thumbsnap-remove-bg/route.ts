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

    // This route is Pro-only, so product is never 'free' here, but guard anyway.
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
    // Best effort
  }
}

// ── remove.bg ─────────────────────────────────────────────────────────────────

function extractBase64(dataUri: string): string {
  const idx = dataUri.indexOf('base64,');
  return idx >= 0 ? dataUri.slice(idx + 7) : dataUri;
}

async function callRemoveBg(imageBase64: string): Promise<string> {
  const apiKey = process.env.REMOVEBG_API_KEY!;

  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_file_b64: imageBase64, size: 'auto', format: 'png' }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const err: any = await res.json().catch(() => ({}));
    const msg = err?.errors?.[0]?.title ?? `remove.bg error ${res.status}`;
    throw new Error(msg);
  }

  const buf = await res.arrayBuffer();
  return Buffer.from(buf).toString('base64');
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
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

  // Check API key before doing any work
  if (!process.env.REMOVEBG_API_KEY) {
    console.error('[thumbsnap/remove-bg] REMOVEBG_API_KEY is not set');
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  // Parse + validate body
  let body: { appUserId?: unknown; image?: unknown };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { appUserId, image } = body;

  if (!appUserId || typeof appUserId !== 'string' || !appUserId.trim()) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'appUserId is required' },
      { status: 400 },
    );
  }
  if (!image || typeof image !== 'string') {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'image is required' },
      { status: 400 },
    );
  }

  const uid = appUserId.trim();
  const imageBase64 = extractBase64(image);

  // Tester bypass — no quota consumption
  if (TESTER_IDS.has(uid)) {
    try {
      const resultBase64 = await callRemoveBg(imageBase64);
      return NextResponse.json({ imageBase64: resultBase64, remaining: null, resetsAt: null });
    } catch (e) {
      console.error('[thumbsnap/remove-bg] remove.bg error:', (e as Error).message);
      return NextResponse.json({ error: (e as Error).message }, { status: 502 });
    }
  }

  // Pro gate
  const product = await getActiveProduct(uid);
  if (product === 'free') {
    return NextResponse.json({ error: 'pro_required' }, { status: 403 });
  }

  // Consume one generation credit
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
    console.error('[thumbsnap/remove-bg] credit error:', (e as Error).message);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  // Call remove.bg — roll back credit on failure
  let resultBase64: string;
  try {
    resultBase64 = await callRemoveBg(imageBase64);
  } catch (e) {
    console.error('[thumbsnap/remove-bg] remove.bg error:', (e as Error).message);
    await decrementCredit(uid, creditResult.source);
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }

  return NextResponse.json({
    imageBase64: resultBase64,
    remaining: creditResult.remaining,
    resetsAt: creditResult.resetsAt,
  });
}
