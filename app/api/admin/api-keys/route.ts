import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const check = await requireAdmin();
  if ('error' in check) return check.error;

  const users = await prisma.user.findMany({
    where: { apiKey: { not: null } },
    select: { id: true, email: true, name: true, apiKey: true, createdAt: true, _count: { select: { customers: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ keys: users });
}

export async function DELETE(req: NextRequest) {
  const check = await requireAdmin();
  if ('error' in check) return check.error;

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  await prisma.user.update({ where: { id: userId }, data: { apiKey: null } });
  return NextResponse.json({ success: true });
}
