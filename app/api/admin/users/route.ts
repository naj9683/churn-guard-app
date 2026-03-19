import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const check = await requireAdmin();
  if ('error' in check) return check.error;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    where: q ? { OR: [{ email: { contains: q, mode: 'insensitive' } }, { name: { contains: q, mode: 'insensitive' } }] } : undefined,
    select: {
      id: true, email: true, name: true, company: true, createdAt: true,
      stripeCustomerId: true, mrr: true, apiKey: true, timezone: true,
      _count: { select: { customers: true } }
    }
  });

  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  const check = await requireAdmin();
  if ('error' in check) return check.error;

  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const updated = await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ success: true, user: updated });
}
