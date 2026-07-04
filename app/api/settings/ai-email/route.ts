import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      select: { aiEmailEnabled: true },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const openaiConfigured = !!process.env.OPENAI_API_KEY;
    return NextResponse.json({ aiEmailEnabled: user.aiEmailEnabled, openaiConfigured });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { aiEmailEnabled } = await req.json() as { aiEmailEnabled: boolean };
    if (typeof aiEmailEnabled !== 'boolean') {
      return NextResponse.json({ error: 'aiEmailEnabled must be a boolean' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { aiEmailEnabled },
    });

    return NextResponse.json({ success: true, aiEmailEnabled });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
