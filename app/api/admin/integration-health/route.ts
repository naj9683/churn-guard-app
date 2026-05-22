import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const check = await requireAdmin();
    if ('error' in check) return check.error;

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since24hMs = BigInt(Date.now() - 24 * 60 * 60 * 1000);

    const [
      slackAlerts,
      crmLogs,
      crmIntegrations,
      stripeEvents,
      emailLogs,
      smsLogs,
      webhooks,
      automationLogs,
      sequenceLogs,
    ] = await Promise.all([
      prisma.slackAlert.findMany({
        orderBy: { sentAt: 'desc' },
        take: 50,
        select: { id: true, alertType: true, messageSent: true, errorMessage: true, sentAt: true, riskScore: true, message: true },
      }),
      prisma.crmSyncLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: { id: true, crmType: true, direction: true, entityType: true, status: true, message: true, createdAt: true },
      }),
      prisma.crmIntegration.findMany({
        select: {
          userId: true, type: true, enabled: true, syncStatus: true,
          lastError: true, lastSyncAt: true, lastFullSyncAt: true, lastSyncCount: true,
        },
      }),
      prisma.event.findMany({
        where: { timestamp: { gte: since24hMs } },
        orderBy: { timestamp: 'desc' },
        take: 50,
        select: { id: true, event: true, timestamp: true, createdAt: true },
      }),
      prisma.emailLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: { id: true, to: true, subject: true, status: true, messageId: true, errorMessage: true, createdAt: true },
      }),
      prisma.smsLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: { id: true, to: true, body: true, status: true, messageSid: true, errorMessage: true, createdAt: true },
      }),
      prisma.webhook.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 20,
        select: { id: true, url: true, events: true, active: true, lastTestedAt: true, lastStatus: true, label: true, updatedAt: true },
      }),
      prisma.automationLog.findMany({
        orderBy: { executedAt: 'desc' },
        take: 10,
        select: {
          id: true, triggerType: true, actionType: true, status: true,
          message: true, executedAt: true, customerId: true,
          rule: { select: { name: true } },
        },
      }),
      prisma.sequenceLog.findMany({
        orderBy: { executedAt: 'desc' },
        take: 10,
        select: {
          id: true, step: true, action: true, status: true, message: true, executedAt: true,
          enrollment: { select: { sequenceType: true, customerId: true } },
        },
      }),
    ]);

    const slackRecent = slackAlerts.filter(a => a.sentAt >= since24h);
    const crmRecent = crmLogs.filter(l => l.createdAt >= since24h);
    const emailRecent = emailLogs.filter(l => l.createdAt >= since24h);
    const smsRecent = smsLogs.filter(l => l.createdAt >= since24h);

    const automationTrace = [
      ...automationLogs.map(l => ({
        id: l.id,
        type: 'automation' as const,
        label: l.rule.name,
        trigger: l.triggerType,
        conditionMet: true,
        action: l.actionType,
        status: l.status,
        message: l.message,
        executedAt: l.executedAt.toISOString(),
        customerId: l.customerId,
      })),
      ...sequenceLogs.map(l => ({
        id: l.id,
        type: 'sequence' as const,
        label: l.enrollment.sequenceType,
        trigger: `step_${l.step}`,
        conditionMet: true,
        action: l.action,
        status: l.status,
        message: l.message,
        executedAt: l.executedAt.toISOString(),
        customerId: l.enrollment.customerId,
      })),
    ].sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()).slice(0, 10);

    return NextResponse.json({
      fetchedAt: new Date().toISOString(),
      slack: {
        recent: slackAlerts.slice(0, 20),
        total24h: slackRecent.length,
        successCount: slackRecent.filter(a => a.messageSent).length,
        failedCount: slackRecent.filter(a => !a.messageSent).length,
      },
      crm: {
        logs: crmLogs.slice(0, 20),
        integrations: crmIntegrations,
        total24h: crmRecent.length,
        successCount: crmRecent.filter(l => l.status === 'success').length,
        failedCount: crmRecent.filter(l => l.status === 'error').length,
      },
      stripe: {
        events: stripeEvents.slice(0, 20).map(e => ({ ...e, timestamp: e.timestamp.toString() })),
        total24h: stripeEvents.length,
      },
      email: {
        logs: emailLogs.slice(0, 20),
        total24h: emailRecent.length,
        successCount: emailRecent.filter(l => l.status === 'sent' || l.status === 'mock').length,
        failedCount: emailRecent.filter(l => l.status === 'failed').length,
      },
      sms: {
        logs: smsLogs.slice(0, 20),
        total24h: smsRecent.length,
        successCount: smsRecent.filter(l => l.status === 'sent').length,
        failedCount: smsRecent.filter(l => l.status === 'failed').length,
      },
      webhooks,
      automationTrace,
    });
  } catch (err) {
    console.error('integration-health error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
