import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';

async function resolveUser(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, postmarkApiKey: true, postmarkFromEmail: true, postmarkFromName: true },
  });
}

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await resolveUser(clerkId);

  const configured = !!user?.postmarkApiKey;
  const fromEmail = user?.postmarkFromEmail ?? null;
  const fromName = user?.postmarkFromName ?? 'ChurnGuard';

  const recentLogs = user
    ? await prisma.emailLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, to: true, subject: true, status: true, messageId: true, errorMessage: true, createdAt: true },
      })
    : [];

  return NextResponse.json({ configured, fromEmail, fromName, recentLogs });
}

// Save / update per-tenant Postmark config
export async function PUT(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { apiKey, fromEmail, fromName } = body as { apiKey?: string; fromEmail?: string; fromName?: string };

  if (!apiKey || !fromEmail) {
    return NextResponse.json({ error: 'apiKey and fromEmail are required' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      postmarkApiKey: apiKey.trim(),
      postmarkFromEmail: fromEmail.trim(),
      postmarkFromName: (fromName?.trim() || 'ChurnGuard'),
    },
  });

  return NextResponse.json({ success: true });
}

// Disconnect — clears per-tenant Postmark config
export async function DELETE() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await prisma.user.update({
    where: { id: user.id },
    data: { postmarkApiKey: null, postmarkFromEmail: null, postmarkFromName: null },
  });

  return NextResponse.json({ success: true });
}

// Send test email using the tenant's own Postmark config
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await resolveUser(clerkId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (!user.postmarkApiKey) {
    return NextResponse.json({ error: 'Postmark not configured for your account' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const to: string = body.to ?? 'test@example.com';
  const fromEmail = user.postmarkFromEmail ?? 'admin@churnguardapp.com';

  const result = await sendEmail(
    to,
    'ChurnGuard — Test Email',
    `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;max-width:520px;margin:40px auto;padding:0 20px;">
      <h2 style="color:#6366f1;margin:0 0 12px">ChurnGuard Email Test</h2>
      <p style="color:#374151;line-height:1.6">Your Postmark integration is working correctly.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:13px;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px">Sent at</td><td style="color:#111827">${new Date().toLocaleString()}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">From</td><td style="color:#111827">${fromEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">To</td><td style="color:#111827">${to}</td></tr>
      </table>
      <p style="color:#6b7280;font-size:12px;margin-top:24px">Sent from churnguardapp.com via Postmark</p>
    </body></html>`,
    user.id,
  );

  if (!result.success) {
    const errMsg = (result as any).errorMessage ?? 'Send failed';
    console.error('[postmark/test] failed:', errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }

  return NextResponse.json({ success: true, to });
}
