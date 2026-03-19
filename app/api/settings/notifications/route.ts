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
      notifEmail: user.notifEmail,
      notifSlack: user.notifSlack,
      slackWebhookUrl: user.slackWebhookUrl || '',
      alertFrequency: user.alertFrequency,
      alertRiskThreshold: user.alertRiskThreshold
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
        notifEmail: body.notifEmail !== undefined ? body.notifEmail : user.notifEmail,
        notifSlack: body.notifSlack !== undefined ? body.notifSlack : user.notifSlack,
        slackWebhookUrl: body.slackWebhookUrl !== undefined ? body.slackWebhookUrl : user.slackWebhookUrl,
        alertFrequency: body.alertFrequency || user.alertFrequency,
        alertRiskThreshold: body.alertRiskThreshold !== undefined ? body.alertRiskThreshold : user.alertRiskThreshold
      }
    });
    return NextResponse.json({ success: true, settings: {
      notifEmail: updated.notifEmail,
      notifSlack: updated.notifSlack,
      slackWebhookUrl: updated.slackWebhookUrl,
      alertFrequency: updated.alertFrequency,
      alertRiskThreshold: updated.alertRiskThreshold
    }});
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
