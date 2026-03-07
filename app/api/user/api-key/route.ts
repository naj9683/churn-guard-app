import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { apiKey: true }
    });
    
    if (!user?.apiKey) {
      // Generate new API key
      const newApiKey = crypto.randomUUID();
      await prisma.user.update({
        where: { id: userId },
        data: { apiKey: newApiKey }
      });
      return NextResponse.json({ apiKey: newApiKey });
    }
    
    return NextResponse.json({ apiKey: user.apiKey });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get API key' }, { status: 500 });
  }
}
