import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CREDITS_PER_PACK: Record<string, number> = { credits_50: 50 };

async function ensureTables(): Promise<void> {
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
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "thumbsnap_pack_claims" (
      "purchase_token" TEXT        NOT NULL,
      "app_user_id"    TEXT        NOT NULL,
      "claimed_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "thumbsnap_pack_claims_pkey" PRIMARY KEY ("purchase_token")
    )
  `;
}

async function fetchPackTokens(appUserId: string, productId: string): Promise<string[]> {
  const key = process.env.REVENUECAT_SECRET_KEY;
  if (!key) return [];
  try {
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
    if (!res.ok) return [];
    const data: any = await res.json();
    const purchases: any[] = data?.subscriber?.non_subscriptions?.[productId] ?? [];
    return purchases.map((t: any) => t.id as string).filter(Boolean);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  let body: { appUserId?: unknown; productId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { appUserId, productId } = body;

  if (!appUserId || typeof appUserId !== 'string' || !appUserId.trim()) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'appUserId is required' },
      { status: 400 },
    );
  }
  if (!productId || typeof productId !== 'string' || !(productId in CREDITS_PER_PACK)) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'productId must be "credits_50"' },
      { status: 400 },
    );
  }

  const uid = appUserId.trim();
  const credits = CREDITS_PER_PACK[productId];

  await ensureTables();

  const tokens = await fetchPackTokens(uid, productId);

  let added = 0;
  for (const token of tokens) {
    try {
      await prisma.$transaction(async (tx) => {
        const inserted = await tx.$executeRaw`
          INSERT INTO thumbsnap_pack_claims (purchase_token, app_user_id)
          VALUES (${token}, ${uid})
          ON CONFLICT (purchase_token) DO NOTHING
        `;
        if (Number(inserted) === 0) return;

        await tx.$executeRaw`
          INSERT INTO thumbsnap_credits (app_user_id, free_used, period_start, period_used, product, pack_credits)
          VALUES (${uid}, 0, NULL, 0, NULL, ${credits})
          ON CONFLICT (app_user_id) DO UPDATE SET pack_credits = thumbsnap_credits.pack_credits + ${credits}
        `;
        added += credits;
      });
    } catch {
      // best effort per token
    }
  }

  const rows = await prisma.$queryRaw<{ pack_credits: number }[]>`
    SELECT pack_credits FROM thumbsnap_credits WHERE app_user_id = ${uid}
  `;
  const packCredits = Number(rows[0]?.pack_credits ?? 0);

  return NextResponse.json({ packCredits, added });
}
