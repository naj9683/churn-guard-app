import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date — use YYYY-MM-DD' }, { status: 400 });
  }

  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);

  const bookings = await prisma.booking.findMany({
    where: { date: { gte: start, lte: end }, status: { not: 'cancelled' } },
    select: { timeSlot: true },
  });

  return NextResponse.json({ bookedSlots: bookings.map(b => b.timeSlot) });
}
