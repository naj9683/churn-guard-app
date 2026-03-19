import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const check = await requireAdmin();
  if ('error' in check) return check.error;

  const [
    userCount, customerCount, eventCount, interventionCount,
    playbookCount, webhookCount, campaignCount, alertCount
  ] = await Promise.all([
    prisma.user.count(),
    prisma.customer.count(),
    prisma.event.count(),
    prisma.interventionOutcome.count(),
    prisma.playbook.count(),
    prisma.webhook.count(),
    prisma.emailCampaign.count(),
    prisma.alertLog.count(),
  ]);

  const tables = [
    { name: 'User', rows: userCount, description: 'ChurnGuard accounts' },
    { name: 'Customer', rows: customerCount, description: 'Tracked customers' },
    { name: 'Event', rows: eventCount, description: 'Product usage events' },
    { name: 'InterventionOutcome', rows: interventionCount, description: 'Intervention records' },
    { name: 'Playbook', rows: playbookCount, description: 'Automation playbooks' },
    { name: 'Webhook', rows: webhookCount, description: 'Webhook endpoints' },
    { name: 'EmailCampaign', rows: campaignCount, description: 'Email campaigns' },
    { name: 'AlertLog', rows: alertCount, description: 'Alert history' },
  ];

  return NextResponse.json({
    status: 'connected',
    provider: 'postgresql (Neon)',
    tables,
    totalRows: userCount + customerCount + eventCount + interventionCount + playbookCount + webhookCount + campaignCount + alertCount,
    lastChecked: new Date().toISOString(),
  });
}
