import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await prisma.crmIntegration.updateMany({
      where: { userId: user.id },
      data: { enabled: false, accessToken: null, refreshToken: null, syncStatus: 'disconnected' }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { crmType: null, crmApiKey: null }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
