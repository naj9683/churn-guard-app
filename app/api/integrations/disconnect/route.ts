import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json().catch(() => ({}));
    const type: string | undefined = body.type; // 'hubspot' | 'salesforce'

    await prisma.crmIntegration.updateMany({
      where: { userId: user.id, ...(type ? { type } : {}) },
      data: { enabled: false, accessToken: null, refreshToken: null, syncStatus: 'disconnected' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
