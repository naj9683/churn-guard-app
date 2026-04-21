import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');

  if (!id) {
    return new NextResponse('Missing id', { status: 400 });
  }

  try {
    await prisma.auditLead.update({
      where: { id },
      data: { unsubscribed: true, nextEmailAt: null },
    });
  } catch {
    // Lead not found or already deleted — treat as success
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Unsubscribed</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a12;font-family:system-ui,sans-serif;}
.card{background:#0f172a;border:1px solid #1e293b;border-radius:14px;padding:40px;text-align:center;max-width:400px;}
h1{color:#fff;font-size:20px;margin:0 0 8px;}p{color:#94a3b8;font-size:14px;margin:0 0 20px;}
a{display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:600;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;}</style>
</head><body>
<div class="card">
  <div style="font-size:32px;margin-bottom:16px;">✓</div>
  <h1>You're unsubscribed.</h1>
  <p>You won't receive any more emails about your churn audit.</p>
  <a href="/">Back to ChurnGuard</a>
</div>
</body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  );
}
