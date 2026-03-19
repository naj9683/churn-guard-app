import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/email-campaigns/[id]/send
// Body: { sendNow: true } or { scheduledAt: "2026-03-20T10:00" }
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const campaign = await prisma.emailCampaign.findFirst({
      where: { id: params.id, userId: user.id }
    });
    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

    if (campaign.status === 'sent') {
      return NextResponse.json({ error: 'Campaign has already been sent' }, { status: 400 });
    }

    const body = await req.json();
    const { sendNow, scheduledAt } = body;

    if (sendNow) {
      await prisma.emailCampaign.update({
        where: { id: params.id },
        data: { status: 'sent', sentAt: new Date(), scheduledAt: null }
      });
      return NextResponse.json({ success: true, status: 'sent', message: 'Campaign marked as sent' });
    }

    if (scheduledAt) {
      const schedDate = new Date(scheduledAt);
      if (isNaN(schedDate.getTime())) {
        return NextResponse.json({ error: 'Invalid scheduled date' }, { status: 400 });
      }
      await prisma.emailCampaign.update({
        where: { id: params.id },
        data: { status: 'scheduled', scheduledAt: schedDate }
      });
      return NextResponse.json({ success: true, status: 'scheduled', message: `Campaign scheduled for ${schedDate.toLocaleString()}` });
    }

    return NextResponse.json({ error: 'Provide sendNow: true or scheduledAt date' }, { status: 400 });
  } catch (error) {
    console.error('Campaign send error:', error);
    return NextResponse.json({ error: 'Failed to send campaign' }, { status: 500 });
  }
}
