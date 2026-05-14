import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const campaign = await prisma.emailCampaign.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    if (campaign.status === 'sent') {
      return NextResponse.json({ error: 'Campaign has already been sent' }, { status: 400 });
    }

    const body = await req.json();
    const { sendNow, scheduledAt } = body;

    if (scheduledAt) {
      const schedDate = new Date(scheduledAt);
      if (isNaN(schedDate.getTime())) {
        return NextResponse.json({ error: 'Invalid scheduled date' }, { status: 400 });
      }
      await prisma.emailCampaign.update({
        where: { id: params.id },
        data: { status: 'scheduled', scheduledAt: schedDate },
      });
      return NextResponse.json({ success: true, status: 'scheduled', message: `Scheduled for ${schedDate.toLocaleString()}` });
    }

    if (!sendNow) {
      return NextResponse.json({ error: 'Provide sendNow: true or scheduledAt date' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email not configured — add RESEND_API_KEY to environment variables' }, { status: 503 });
    }

    // Resolve segment → customer list
    const riskFilter =
      campaign.segment === 'high-risk' || campaign.segment === 'at-risk' ? { gte: 70 } :
      campaign.segment === 'critical' ? { gte: 90 } : undefined;

    const customers = await prisma.customer.findMany({
      where: { userId: user.id, ...(riskFilter ? { riskScore: riskFilter } : {}) },
      select: { email: true, name: true },
      take: 200,
    });

    if (customers.length === 0) {
      await prisma.emailCampaign.update({
        where: { id: params.id },
        data: { status: 'sent', sentAt: new Date() },
      });
      return NextResponse.json({ success: true, status: 'sent', sent: 0, message: 'No customers matched the segment' });
    }

    // Send to each customer
    let sent = 0;
    let failed = 0;
    for (const customer of customers) {
      const result = await sendEmail(customer.email, campaign.subject, campaign.content, user.id);
      if (result.success) sent++; else failed++;
    }

    await prisma.emailCampaign.update({
      where: { id: params.id },
      data: { status: 'sent', sentAt: new Date() },
    });

    return NextResponse.json({ success: true, status: 'sent', sent, failed, total: customers.length });
  } catch (error) {
    console.error('Campaign send error:', error);
    return NextResponse.json({ error: 'Failed to send campaign' }, { status: 500 });
  }
}
