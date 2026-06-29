import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const ADMIN_IDS = ['user_3AP7xokH0oin2NoqgK37ER9Y4su'];

export async function GET() {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    orderBy: [{ date: 'desc' }, { timeSlot: 'asc' }],
  });

  return NextResponse.json({ bookings });
}
