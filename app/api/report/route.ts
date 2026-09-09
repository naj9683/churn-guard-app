import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGIN = "https://churnguardapp.com";
const MAX_BODY_BYTES = 5_000;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

// Per-instance in-memory store. Resets on cold start — sufficient for a
// low-traffic public form; swap for Upstash KV if global limiting is needed.
const ipHits = new Map<string, { count: number; resetAt: number }>();

function corsHeaders(origin: string | null): Record<string, string> {
  const base: Record<string, string> = { Vary: "Origin" };
  if (origin === ALLOWED_ORIGIN) {
    base["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;
    base["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    base["Access-Control-Allow-Headers"] = "Content-Type";
  }
  return base;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req.headers.get("origin"));

  // Payload cap — Content-Length header (fast path)
  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413, headers });
  }

  // IP rate limit
  if (isRateLimited(getIp(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    // Payload cap — actual byte count (catches missing Content-Length)
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413, headers });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers });
  }

  const { reason, details, prompt, timestamp, _hp } = body as Record<string, string>;

  // Honeypot — bots fill hidden fields; silently accept so they think it worked
  if (_hp) {
    return NextResponse.json({ ok: true }, { headers });
  }

  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) {
    console.error("POSTMARK_API_KEY not configured");
    return NextResponse.json({ error: "Email not configured" }, { status: 500, headers });
  }

  try {
    const res = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": apiKey,
      },
      body: JSON.stringify({
        From: "admin@churnguardapp.com",
        To: "admin@churnguardapp.com",
        Subject: `ChurnGuard Report: ${reason ?? "No reason provided"}`,
        MessageStream: "outbound",
        HtmlBody: `
          <h2>ChurnGuard Report</h2>
          <p><strong>Reason:</strong> ${reason ?? "—"}</p>
          <p><strong>Details:</strong> ${details ?? "—"}</p>
          <p><strong>Prompt:</strong> ${prompt ?? "—"}</p>
          <p><strong>Timestamp:</strong> ${timestamp ?? "—"}</p>
        `,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.ErrorCode !== 0) {
      throw new Error(data.Message ?? `HTTP ${res.status}`);
    }
    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    console.error("Report email error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500, headers }
    );
  }
}
