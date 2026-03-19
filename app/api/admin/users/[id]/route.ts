import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const check = await requireAdmin();
  if ('error' in check) return check.error;

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { _count: { select: { customers: true, playbooks: true, webhooks: true } } }
  });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const recentCustomers = await prisma.customer.findMany({
    where: { userId: params.id }, orderBy: { createdAt: 'desc' }, take: 5,
    select: { id: true, name: true, email: true, riskScore: true, mrr: true, createdAt: true }
  });

  return NextResponse.json({ user, recentCustomers });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const check = await requireAdmin();
  if ('error' in check) return check.error;

  // Soft-delete: revoke API key
  await prisma.user.update({ where: { id: params.id }, data: { apiKey: null } });
  return NextResponse.json({ success: true });
}
