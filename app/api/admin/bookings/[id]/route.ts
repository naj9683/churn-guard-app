import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_IDS = ['user_3AP7xokH0oin2NoqgK37ER9Y4su'];
const VALID_STATUSES = ['confirmed', 'cancelled', 'completed'];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { status } = await req.json().catch(() => ({}));
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id: params.id },
    data: { status },
  }).catch(() => null);

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, booking });
}
