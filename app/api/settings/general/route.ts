import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({
      name: user.name || '',
      company: user.company || '',
      timezone: user.timezone || 'UTC',
      email: user.email
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const body = await req.json();
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name !== undefined ? body.name : user.name,
        company: body.company !== undefined ? body.company : user.company,
        timezone: body.timezone || user.timezone
      }
    });
    return NextResponse.json({ success: true, name: updated.name, company: updated.company, timezone: updated.timezone });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
