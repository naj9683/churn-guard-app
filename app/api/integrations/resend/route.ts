import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const configured = !!process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? null;
  const fromName = process.env.RESEND_FROM_NAME ?? 'ChurnGuard';

  const recentLogs = await prisma.emailLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, to: true, subject: true, status: true, messageId: true, errorMessage: true, createdAt: true },
  });

  return NextResponse.json({ configured, fromEmail, fromName, recentLogs });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const to: string = body.to ?? 'najwa.saadi1@hotmail.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'admin@churnguardapp.com';

  const result = await sendEmail(
    to,
    'ChurnGuard — Test Email',
    `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;max-width:520px;margin:40px auto;padding:0 20px;">
      <h2 style="color:#6366f1;margin:0 0 12px">ChurnGuard Email Test</h2>
      <p style="color:#374151;line-height:1.6">Your Resend integration is working correctly.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:13px;">
        <tr><td style="padding:6px 0;color:#6b7280;width:120px">Sent at</td><td style="color:#111827">${new Date().toLocaleString()}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">From</td><td style="color:#111827">${fromEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">To</td><td style="color:#111827">${to}</td></tr>
      </table>
      <p style="color:#6b7280;font-size:12px;margin-top:24px">Sent from churnguardapp.com</p>
    </body></html>`,
    userId,
  );

  if (!result.success) {
    const errMsg = (result as any).errorMessage ?? 'Send failed';
    console.error('[resend/test] failed:', errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }

  return NextResponse.json({ success: true, to });
}
