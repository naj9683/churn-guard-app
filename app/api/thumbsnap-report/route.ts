import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ── In-memory IP rate limiter (5 req / 60 s per IP) ──────────────────────────

const ipWindows = new Map<string, { count: number; windowStart: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

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
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  if (!checkIpRateLimit(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let body: { appUserId?: unknown; thumbnailRef?: unknown; prompt?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { appUserId, thumbnailRef, prompt } = body;

  if (!appUserId || typeof appUserId !== 'string' || !appUserId.trim()) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'appUserId is required' },
      { status: 400 },
    );
  }
  if (!thumbnailRef || typeof thumbnailRef !== 'string' || !thumbnailRef.trim()) {
    return NextResponse.json(
      { error: 'invalid_input', detail: 'thumbnailRef is required' },
      { status: 400 },
    );
  }
  const promptValue = typeof prompt === 'string' ? prompt.slice(0, 2_000) : null;

  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS thumbsnap_reports (
      id            BIGSERIAL   PRIMARY KEY,
      app_user_id   TEXT        NOT NULL,
      thumbnail_ref TEXT        NOT NULL,
      prompt        TEXT,
      created_at    TIMESTAMPTZ DEFAULT now()
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO thumbsnap_reports (app_user_id, thumbnail_ref, prompt)
    VALUES (${appUserId.trim()}, ${thumbnailRef.trim()}, ${promptValue})
  `;

  return NextResponse.json({ ok: true });
}
