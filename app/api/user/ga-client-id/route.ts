import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let gaClientId: string | null = null;
  try {
    const body = await req.json();
    gaClientId = typeof body.gaClientId === 'string' ? body.gaClientId : null;
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { clerkId }, select: { id: true } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await prisma.user.update({
    where: { id: user.id },
    data: { gaClientId },
  });

  return NextResponse.json({ ok: true });
}
