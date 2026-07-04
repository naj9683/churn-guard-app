import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

async function resolveUser(clerkId: string) {
  return prisma.user.findFirst({ where: { clerkId } });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await resolveUser(clerkId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const template = await prisma.emailTemplate.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ template });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await resolveUser(clerkId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const existing = await prisma.emailTemplate.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json() as { name?: string; subject?: string; bodyHtml?: string; variables?: string[] };
    const { name, subject, bodyHtml, variables } = body;

    const template = await prisma.emailTemplate.update({
      where: { id: params.id },
      data: {
        ...(name?.trim() && { name: name.trim() }),
        ...(subject?.trim() && { subject: subject.trim() }),
        ...(bodyHtml?.trim() && { bodyHtml: bodyHtml.trim() }),
        ...(variables !== undefined && { variables: variables?.length ? JSON.stringify(variables) : null }),
      },
    });

    return NextResponse.json({ template });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await resolveUser(clerkId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const existing = await prisma.emailTemplate.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.emailTemplate.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
