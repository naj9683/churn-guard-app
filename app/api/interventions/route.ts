import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';
import { sendSms } from '@/lib/sequences';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://churnguardapp.com';

// Email templates per intervention type
function buildEmail(type: string, customer: { name: string | null; email: string; mrr: number }) {
  const name = customer.name ?? 'there';
  switch (type) {
    case 'discount_offer':
      return {
        subject: `A special offer just for you, ${name}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#6366f1">We'd love to keep you</h2>
          <p>Hi ${name},</p>
          <p>We noticed your account may be at risk and we want to make things right. As a valued customer, we'd like to offer you <strong>20% off your next month</strong> — no action needed on your part.</p>
          <p style="text-align:center;margin:32px 0">
            <a href="${APP_URL}/settings/billing" style="background:#6366f1;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600">Claim Your Discount</a>
          </p>
          <p>If there's anything we can do better, just reply to this email.</p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      };
    case 'success_call':
      return {
        subject: `Let's connect — we'd love 15 minutes of your time`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#6366f1">Let's talk</h2>
          <p>Hi ${name},</p>
          <p>Your customer success manager would love to connect with you for a quick 15-minute call to make sure you're getting the most out of ChurnGuard.</p>
          <p style="text-align:center;margin:32px 0">
            <a href="${APP_URL}/schedule" style="background:#6366f1;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600">Book a Call</a>
          </p>
          <p>Or just reply here with a time that works for you.</p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      };
    case 'email_campaign':
      return {
        subject: `Tips to get more from ChurnGuard`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#6366f1">Make the most of ChurnGuard</h2>
          <p>Hi ${name},</p>
          <p>Here are the three features our most successful customers use every week:</p>
          <ul style="line-height:1.9">
            <li><strong>Automation Rules</strong> — set triggers and let the system act for you</li>
            <li><strong>Risk Analysis</strong> — AI scores all your customers every 6 hours</li>
            <li><strong>CRM Sync</strong> — keep HubSpot/Salesforce in sync automatically</li>
          </ul>
          <p style="text-align:center;margin:32px 0">
            <a href="${APP_URL}/dashboard" style="background:#6366f1;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600">Go to Dashboard</a>
          </p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      };
    case 'high_priority_call':
    case 'critical_call_required':
    case 'manual_outreach':
    default:
      return {
        subject: `Checking in — we're here to help`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#6366f1">We noticed you might need support</h2>
          <p>Hi ${name},</p>
          <p>Our team flagged your account for a personal check-in. We want to make sure ChurnGuard is working exactly the way you need it to.</p>
          <p>Is there anything we can help with? Just reply to this email — we read every one.</p>
          <p style="text-align:center;margin:32px 0">
            <a href="${APP_URL}/dashboard" style="background:#6366f1;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600">Go to Dashboard</a>
          </p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      };
  }
}

export interface ExecutionLog {
  executedAt: string;
  channels: {
    email: { status: 'sent' | 'failed'; to: string; subject: string; sentAt: string; error?: string };
    sms?: { status: 'sent' | 'failed' | 'skipped'; to?: string; body?: string; sentAt: string; reason?: string };
    slack?: { status: 'sent' | 'failed' | 'skipped'; sentAt: string; reason?: string };
  };
  emailContent: { subject: string; html: string };
  timeline: Array<{ event: string; timestamp: string; detail: string }>;
  resolvedAt?: string;
  resolvedBy?: string;
}

async function executeIntervention(
  intervention: { id: string; interventionType: string; mrrAtRisk: number; userId: string },
  customer: { email: string; name: string | null; mrr: number; phone: string | null }
): Promise<ExecutionLog> {
  const now = new Date().toISOString();
  const { subject, html } = buildEmail(intervention.interventionType, customer);

  const log: ExecutionLog = {
    executedAt: now,
    channels: {
      email: { status: 'failed', to: customer.email, subject, sentAt: now },
    },
    emailContent: { subject, html },
    timeline: [
      { event: 'Intervention created', timestamp: now, detail: `Type: ${intervention.interventionType.replace(/_/g, ' ')}` },
    ],
  };

  // 1. Send email
  const emailResult = await sendEmail(customer.email, subject, html);
  if (emailResult.success) {
    log.channels.email = { status: 'sent', to: customer.email, subject, sentAt: now };
    log.timeline.push({ event: 'Email sent', timestamp: now, detail: `"${subject}" → ${customer.email}` });
  } else {
    log.channels.email = { status: 'failed', to: customer.email, subject, sentAt: now, error: JSON.stringify(emailResult.error) };
    log.timeline.push({ event: 'Email failed', timestamp: now, detail: `Failed to send to ${customer.email}` });
  }

  // 2. SMS — critical types only
  const criticalTypes = ['high_priority_call', 'critical_call_required', 'discount_offer'];
  if (criticalTypes.includes(intervention.interventionType)) {
    if (customer.phone) {
      const smsBody = `ChurnGuard: Hi ${customer.name ?? 'there'}, we sent you an important email. Reply or visit ${APP_URL} for support.`;
      const smsResult = await sendSms(customer.phone, smsBody);
      if (smsResult.ok) {
        log.channels.sms = { status: 'sent', to: customer.phone, body: smsBody, sentAt: now };
        log.timeline.push({ event: 'SMS sent', timestamp: now, detail: `Message sent to ${customer.phone}` });
      } else {
        log.channels.sms = { status: 'failed', to: customer.phone, body: smsBody, sentAt: now, reason: smsResult.error };
        log.timeline.push({ event: 'SMS failed', timestamp: now, detail: smsResult.error ?? 'Twilio error' });
      }
    } else {
      log.channels.sms = { status: 'skipped', sentAt: now, reason: 'No phone number on customer record' };
      log.timeline.push({ event: 'SMS skipped', timestamp: now, detail: 'No phone number on customer record' });
    }
  }

  // 3. Slack — high-priority types only
  const slackTypes = ['high_priority_call', 'critical_call_required'];
  if (slackTypes.includes(intervention.interventionType)) {
    const user = await prisma.user.findFirst({
      where: { id: intervention.userId },
      select: { slackWebhookUrl: true },
    });
    if (user?.slackWebhookUrl) {
      const slackMsg = {
        username: 'ChurnGuard',
        icon_emoji: ':rotating_light:',
        text: `*Intervention Auto-Executed* — ${intervention.interventionType.replace(/_/g, ' ')}`,
        attachments: [{
          color: 'danger',
          fields: [
            { title: 'Customer', value: customer.name ?? customer.email, short: true },
            { title: 'MRR at Risk', value: `$${customer.mrr}`, short: true },
            { title: 'Action', value: 'Email sent automatically', short: false },
          ],
        }],
      };
      try {
        const res = await fetch(user.slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slackMsg),
        });
        if (res.ok) {
          log.channels.slack = { status: 'sent', sentAt: now };
          log.timeline.push({ event: 'Slack alert posted', timestamp: now, detail: 'High-risk alert posted to team channel' });
        } else {
          log.channels.slack = { status: 'failed', sentAt: now, reason: `HTTP ${res.status}` };
          log.timeline.push({ event: 'Slack failed', timestamp: now, detail: `HTTP ${res.status}` });
        }
      } catch (e: any) {
        log.channels.slack = { status: 'failed', sentAt: now, reason: e.message };
        log.timeline.push({ event: 'Slack error', timestamp: now, detail: e.message });
      }
    } else {
      log.channels.slack = { status: 'skipped', sentAt: now, reason: 'No Slack webhook configured' };
      log.timeline.push({ event: 'Slack skipped', timestamp: now, detail: 'No Slack webhook configured' });
    }
  }

  return log;
}

// GET handler - list all interventions
export async function GET() {
  try {
    const interventions = await prisma.interventionOutcome.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        customer: { select: { name: true, email: true } },
      },
    });
    
    return NextResponse.json({ 
      interventions,
      count: interventions.length
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch interventions' }, { status: 500 });
  }
}

// POST handler - create new intervention
export async function POST(request: Request) {
  try {
    console.log('STEP 1: Getting auth...');
    const { userId } = await auth();
    console.log('STEP 1: userId =', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'No userId from auth' }, { status: 401 });
    }

    console.log('STEP 2: Finding user...');
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    console.log('STEP 2: user =', user);

    if (!user) {
      return NextResponse.json({ error: 'User not in database' }, { status: 404 });
    }

    console.log('STEP 3: Parsing request...');
    const data = await request.json();
    
    if (!data.customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
    }
    console.log('STEP 3: data =', data);

    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, userId: user.id }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Create intervention with 'active' status (auto-executed immediately)
    const intervention = await prisma.interventionOutcome.create({
      data: {
        userId: user.id,
        customerId: data.customerId,
        interventionType: data.interventionType || 'manual_outreach',
        mrrAtRisk: data.mrrAtRisk || 0,
        riskScoreAtStart: data.riskScoreAtStart || 50,
        customerSegment: data.customerSegment || 'unknown',
        plan: data.plan || 'unknown',
        daysSinceLogin: data.daysSinceLogin || 0,
        status: 'active',
      }
    });

    // Auto-execute immediately — store structured JSON log in notes
    const log = await executeIntervention(intervention, customer).catch((e) => null);
    if (log) {
      await prisma.interventionOutcome.update({
        where: { id: intervention.id },
        data: { notes: JSON.stringify(log) },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Intervention auto-executed',
      intervention,
      log,
    });
  } catch (error: any) {
    console.error('ERROR:', error.message);
    return NextResponse.json({ 
      error: 'Failed', 
      message: error.message,
      code: error.code 
    }, { status: 500 });
  }
}

// PATCH handler - update intervention status
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const body = await request.json();
    const { interventionId, status, mrrSaved, mrrLost, notes } = body;
    
    if (!interventionId) {
      return NextResponse.json({ error: 'Missing interventionId' }, { status: 400 });
    }
    
    const updateData: any = {
      status,
      notes: notes || '',
      completedAt: new Date()
    };
    
    if (status === 'saved') {
      updateData.mrrSaved = mrrSaved || 0;
      updateData.successful = true;
    } else if (status === 'churned') {
      updateData.mrrLost = mrrLost || 0;
      updateData.churnedAt = new Date();
      updateData.successful = false;
    }
    
    const intervention = await prisma.interventionOutcome.update({
      where: { id: interventionId, userId: user.id },
      data: updateData
    });
    
    return NextResponse.json({ success: true, intervention });
    
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: error.message
    }, { status: 500 });
  }
}

// DELETE handler - delete intervention
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing intervention ID' }, { status: 400 });
    }

    await prisma.interventionOutcome.delete({
      where: { id, userId: user.id }
    });

    return NextResponse.json({ success: true, message: 'Intervention deleted' });

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}