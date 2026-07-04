import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId } });
    if (!user) return NextResponse.json({ templates: [] });

    const templates = await prisma.emailTemplate.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ templates });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json() as { name?: string; subject?: string; bodyHtml?: string; variables?: string[] };
    const { name, subject, bodyHtml, variables } = body;

    if (!name?.trim() || !subject?.trim() || !bodyHtml?.trim()) {
      return NextResponse.json({ error: 'name, subject, and body are required' }, { status: 400 });
    }

    const template = await prisma.emailTemplate.create({
      data: {
        userId: user.id,
        name: name.trim(),
        subject: subject.trim(),
        bodyHtml: bodyHtml.trim(),
        variables: variables?.length ? JSON.stringify(variables) : null,
        isDefault: false,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
