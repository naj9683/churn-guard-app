import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';

// How long to wait before re-firing the same rule for the same customer
const COOLDOWN_HOURS: Record<string, number> = {
  risk_threshold: 24,
  payment_failed: 1,      // fire quickly on each new failure, but debounce 1h
  feature_abandonment: 48,
};

type ActionResult = { status: 'success' | 'failed' | 'skipped'; message: string };

// ── Action executors ───────────────────────────────────────────────────────

async function execSendEmail(
  customer: { email: string; name: string | null },
  actionConfig: Record<string, unknown>
): Promise<ActionResult> {
  const template = actionConfig.template as keyof typeof emailTemplates | undefined;
  let subject = actionConfig.subject as string | undefined;
  let html = actionConfig.html as string | undefined;

  if (template && emailTemplates[template]) {
    const t = emailTemplates[template]();
    subject = subject ?? t.subject;
    html = html ?? t.html;
  }

  if (!subject || !html) {
    return { status: 'failed', message: 'Missing email subject or html in actionConfig' };
  }

  const to = (actionConfig.to as string | undefined) ?? customer.email;
  const ok = await sendEmail({ to, subject, html });
  return ok
    ? { status: 'success', message: `Email sent to ${to}` }
    : { status: 'failed', message: `Failed to send email to ${to}` };
}

async function execSendSlack(
  customer: { email: string; name: string | null; riskScore: number; mrr: number },
  actionConfig: Record<string, unknown>,
  slackWebhookUrl: string | null
): Promise<ActionResult> {
  if (!slackWebhookUrl) {
    return { status: 'skipped', message: 'No Slack webhook configured for this user' };
  }

  const rawMessage = actionConfig.message as string | undefined;
  const text = rawMessage
    ?? `ChurnGuard Alert — ${customer.name ?? customer.email} | Risk: ${customer.riskScore} | MRR: $${customer.mrr}`;

  const body = {
    username: 'ChurnGuard',
    icon_emoji: ':warning:',
    text,
    attachments: [{
      color: customer.riskScore >= 80 ? 'danger' : 'warning',
      fields: [
        { title: 'Customer', value: customer.name ?? customer.email, short: true },
        { title: 'Risk Score', value: String(customer.riskScore), short: true },
        { title: 'MRR', value: `$${customer.mrr}`, short: true },
      ],
    }],
  };

  try {
    const res = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { status: 'success', message: `Slack message sent for ${customer.email}` };
  } catch (e: any) {
    return { status: 'failed', message: `Slack failed: ${e.message}` };
  }
}

async function execCreateIntervention(
  customer: { id: string; mrr: number; riskScore: number; plan: string | null; lastLoginAt: Date | null },
  actionConfig: Record<string, unknown>,
  userId: string
): Promise<ActionResult> {
  const interventionType = (actionConfig.interventionType as string | undefined) ?? 'auto_outreach';
  const daysSinceLogin = customer.lastLoginAt
    ? Math.floor((Date.now() - customer.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  await prisma.interventionOutcome.create({
    data: {
      userId,
      customerId: customer.id,
      interventionType,
      mrrAtRisk: customer.mrr,
      riskScoreAtStart: customer.riskScore,
      customerSegment: customer.plan ?? 'unknown',
      plan: customer.plan ?? 'unknown',
      daysSinceLogin,
      status: 'pending',
      triggerEvent: 'automation_rule',
    },
  });
  return { status: 'success', message: `Intervention "${interventionType}" created` };
}

// ── Cooldown check ─────────────────────────────────────────────────────────

async function isOnCooldown(ruleId: string, customerId: string, triggerType: string): Promise<boolean> {
  const hours = COOLDOWN_HOURS[triggerType] ?? 24;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const recent = await prisma.automationLog.findFirst({
    where: { ruleId, customerId, executedAt: { gte: since }, status: 'success' },
  });
  return !!recent;
}

// ── Main engine ────────────────────────────────────────────────────────────

export interface EngineOptions {
  /** Limit to a single user (undefined = all users) */
  userId?: string;
  /** Limit to specific trigger types */
  triggerTypes?: string[];
  /** Limit to one customer (for webhook-driven calls) */
  customerId?: string;
}

export interface EngineResult {
  rulesEvaluated: number;
  fired: number;
  skipped: number;
  failed: number;
  logs: Array<{ rule: string; customer: string; status: string; message: string }>;
}

export async function runAutomationEngine(opts: EngineOptions = {}): Promise<EngineResult> {
  const result: EngineResult = { rulesEvaluated: 0, fired: 0, skipped: 0, failed: 0, logs: [] };

  // Fetch all matching active rules
  const rules = await prisma.automationRule.findMany({
    where: {
      isActive: true,
      ...(opts.userId ? { userId: opts.userId } : {}),
      ...(opts.triggerTypes?.length ? { triggerType: { in: opts.triggerTypes } } : {}),
    },
    include: { user: { select: { id: true, slackWebhookUrl: true } } },
  });

  for (const rule of rules) {
    result.rulesEvaluated++;
    const condition = rule.condition as Record<string, unknown>;
    const actionConfig = rule.actionConfig as Record<string, unknown>;

    // ── Build candidate customers ────────────────────────────────────────
    let customerWhere: Record<string, unknown> = { userId: rule.userId };
    if (opts.customerId) customerWhere = { ...customerWhere, id: opts.customerId };

    let candidates: any[] = [];

    if (rule.triggerType === 'risk_threshold') {
      const threshold = Number(condition.value ?? 70);
      candidates = await prisma.customer.findMany({
        where: { ...customerWhere, riskScore: { gte: threshold } },
      });
    } else if (rule.triggerType === 'payment_failed') {
      // Customers with a 'payment_failed' event within the last withinHours hours
      const withinHours = Number(condition.withinHours ?? 24);
      const since = BigInt(Date.now() - withinHours * 60 * 60 * 1000);
      const events = await prisma.event.findMany({
        where: { event: 'payment_failed', timestamp: { gte: since } },
        include: { customer: true },
        distinct: ['customerId'],
      });
      candidates = events
        .map(e => e.customer)
        .filter(c => c.userId === rule.userId && (!opts.customerId || c.id === opts.customerId));
    } else if (rule.triggerType === 'feature_abandonment') {
      const days = Number(condition.days ?? 7);
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      candidates = await prisma.customer.findMany({
        where: {
          ...customerWhere,
          OR: [
            { lastFeatureUsedAt: { lt: cutoff } },
            { lastFeatureUsedAt: null, lastLoginAt: { lt: cutoff } },
          ],
        },
      });
    }

    // ── Evaluate each candidate ──────────────────────────────────────────
    for (const customer of candidates) {
      // Cooldown check
      if (await isOnCooldown(rule.id, customer.id, rule.triggerType)) {
        result.skipped++;
        continue;
      }

      let actionResult: ActionResult;

      try {
        if (rule.actionType === 'send_email') {
          actionResult = await execSendEmail(customer, actionConfig);
        } else if (rule.actionType === 'send_slack') {
          actionResult = await execSendSlack(customer, actionConfig, rule.user.slackWebhookUrl);
        } else if (rule.actionType === 'create_intervention') {
          actionResult = await execCreateIntervention(customer, actionConfig, rule.userId);
        } else {
          actionResult = { status: 'failed', message: `Unknown actionType: ${rule.actionType}` };
        }
      } catch (e: any) {
        actionResult = { status: 'failed', message: e.message ?? 'Unknown error' };
      }

      // Write log
      await prisma.automationLog.create({
        data: {
          ruleId: rule.id,
          customerId: customer.id,
          userId: rule.userId,
          triggerType: rule.triggerType,
          actionType: rule.actionType,
          status: actionResult.status,
          message: actionResult.message,
        },
      });

      result.logs.push({ rule: rule.name, customer: customer.email, ...actionResult });
      if (actionResult.status === 'success') result.fired++;
      else if (actionResult.status === 'failed') result.failed++;
      else result.skipped++;
    }
  }

  return result;
}
