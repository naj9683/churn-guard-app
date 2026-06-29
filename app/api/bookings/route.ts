import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';

const VALID_SLOTS = new Set([
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
]);

const OWNER_EMAIL = 'najwasaadi1@gmail.com';

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

async function sendConfirmation(booking: { name: string; email: string; company: string | null; date: Date; timeSlot: string; notes: string | null }) {
  const dateStr = booking.date.toISOString().split('T')[0];
  const displayDate = formatDate(dateStr);
  const html = `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;max-width:520px;margin:40px auto;padding:0 20px;color:#111827;">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
      <span style="font-size:32px">📅</span>
      <h2 style="color:#fff;margin:8px 0 4px;font-size:20px">Your call is confirmed!</h2>
      <p style="color:#c7d2fe;margin:0;font-size:14px">30-Minute Demo Call with ChurnGuard</p>
    </div>
    <p style="color:#374151;line-height:1.6;">Hi ${booking.name},</p>
    <p style="color:#374151;line-height:1.6;">Your demo call has been confirmed. Here are the details:</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#f9fafb;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr><td style="padding:12px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #e5e7eb;width:120px;">📅 Date</td><td style="padding:12px 16px;font-size:13px;font-weight:600;color:#111827;border-bottom:1px solid #e5e7eb;">${displayDate}</td></tr>
      <tr><td style="padding:12px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #e5e7eb;">🕐 Time</td><td style="padding:12px 16px;font-size:13px;font-weight:600;color:#111827;border-bottom:1px solid #e5e7eb;">${booking.timeSlot} EST</td></tr>
      <tr><td style="padding:12px 16px;font-size:13px;color:#6b7280;">⏱ Duration</td><td style="padding:12px 16px;font-size:13px;font-weight:600;color:#111827;">30 minutes</td></tr>
    </table>
    <p style="color:#374151;line-height:1.6;">I'll send a video call link closer to the time. If you need to reschedule, just reply to this email.</p>
    <p style="color:#374151;line-height:1.6;">Looking forward to chatting!<br><strong>Najwa</strong><br><span style="color:#6b7280;font-size:13px;">Founder, ChurnGuard</span></p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="color:#9ca3af;font-size:12px;margin:0;">ChurnGuard · churnguardapp.com</p>
  </body></html>`;

  await sendEmail(booking.email, `Your ChurnGuard demo call is confirmed — ${displayDate}`, html);
}

async function sendOwnerNotification(booking: { name: string; email: string; company: string | null; date: Date; timeSlot: string; notes: string | null }) {
  const dateStr = booking.date.toISOString().split('T')[0];
  const displayDate = formatDate(dateStr);
  const html = `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;max-width:520px;margin:40px auto;padding:0 20px;color:#111827;">
    <div style="background:#1e1b4b;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <h2 style="color:#fff;margin:0 0 4px;font-size:18px">🗓 New Demo Booking</h2>
      <p style="color:#a5b4fc;margin:0;font-size:13px">Someone just booked a call!</p>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #e5e7eb;width:100px;">Name</td><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#111827;border-bottom:1px solid #e5e7eb;">${booking.name}</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Email</td><td style="padding:10px 16px;font-size:13px;color:#111827;border-bottom:1px solid #e5e7eb;"><a href="mailto:${booking.email}" style="color:#6366f1">${booking.email}</a></td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Company</td><td style="padding:10px 16px;font-size:13px;color:#111827;border-bottom:1px solid #e5e7eb;">${booking.company ?? '—'}</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Date</td><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#111827;border-bottom:1px solid #e5e7eb;">${displayDate}</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Time</td><td style="padding:10px 16px;font-size:13px;font-weight:600;color:#6366f1;border-bottom:1px solid #e5e7eb;">${booking.timeSlot} EST</td></tr>
      <tr><td style="padding:10px 16px;font-size:13px;color:#6b7280;">Notes</td><td style="padding:10px 16px;font-size:13px;color:#111827;white-space:pre-wrap;">${booking.notes ?? '—'}</td></tr>
    </table>
  </body></html>`;

  await sendEmail(OWNER_EMAIL, `New booking: ${booking.name} — ${displayDate} at ${booking.timeSlot}`, html);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { name, email, company, notes, date, timeSlot } = body as Record<string, string>;

  if (!name?.trim() || !email?.trim() || !date || !timeSlot) {
    return NextResponse.json({ error: 'name, email, date, and timeSlot are required' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format — use YYYY-MM-DD' }, { status: 400 });
  }
  if (!VALID_SLOTS.has(timeSlot)) {
    return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 });
  }

  // Reject past dates
  const bookingDate = new Date(`${date}T00:00:00.000Z`);
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  if (bookingDate < today) {
    return NextResponse.json({ error: 'Cannot book a date in the past' }, { status: 400 });
  }

  // Check availability (race-condition safe: unique constraint on date+timeSlot below could also be used)
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);
  const conflict = await prisma.booking.findFirst({
    where: { date: { gte: start, lte: end }, timeSlot, status: { not: 'cancelled' } },
  });
  if (conflict) {
    return NextResponse.json({ error: 'That time slot was just booked — please select another time.' }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim() || null,
      notes: notes?.trim() || null,
      date: bookingDate,
      timeSlot,
    },
  });

  // Send emails — fire-and-forget, don't block the response
  sendConfirmation(booking).catch(e => console.error('[booking/confirm-email]', e));
  sendOwnerNotification(booking).catch(e => console.error('[booking/owner-email]', e));

  return NextResponse.json({ success: true, booking: { id: booking.id, name: booking.name, email: booking.email, date, timeSlot } });
}
