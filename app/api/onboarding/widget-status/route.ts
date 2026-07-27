import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({
    where: { clerkId: userId },
    select: { widgetInstalled: true },
  });

  return NextResponse.json({ widgetInstalled: user?.widgetInstalled ?? false });
}
