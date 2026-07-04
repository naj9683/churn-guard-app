import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const twilioConfigured = !!(
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_PHONE_NUMBER
);

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({
      where: { clerkId },
      select: { smsEnabled: true },
    });
    if (!user) return NextResponse.json({ smsEnabled: false, twilioConfigured });

    return NextResponse.json({ smsEnabled: user.smsEnabled, twilioConfigured });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { smsEnabled } = await req.json() as { smsEnabled?: boolean };
    if (typeof smsEnabled !== 'boolean') {
      return NextResponse.json({ error: 'smsEnabled must be a boolean' }, { status: 400 });
    }

    await prisma.user.update({ where: { id: user.id }, data: { smsEnabled } });

    return NextResponse.json({ smsEnabled, twilioConfigured });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
