import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { sendSms } from '@/lib/sequences';
import { enrollInSequence } from '@/lib/sequences';

// How long to wait before re-firing the same rule for the same customer
const COOLDOWN_HOURS: Record<string, number> = {
  risk_threshold:       24,
  payment_failed:        1,
  feature_abandonment:  48,
  multi_condition:      12,
  days_since_login:     24,
  mrr_value:            48,
  plan_type:            72,
  payment_status:       24,
  account_age:         168, // 7 days
  feature_not_used:     48,
  support_tickets:      24,
  trial_ending:         24,
  no_activity:          48,
};

type ActionResult = { status: 'success' | 'failed' | 'skipped'; message: string };

// ── Multi-condition evaluator ───────────────────────────────────────────────

interface SingleCondition {
  field: string;    // riskScore | daysSinceLogin | mrrValue | planType | paymentStatus | featureUsed
  operator: string; // > | < | == | != | contains
  value: string | number;
}

interface ConditionGroup {
  logic: 'AND' | 'OR';
  conditions: SingleCondition[];
}

function evaluateSingle(customer: any, cond: SingleCondition): boolean {
  const { field, operator, value } = cond;
  let actual: any;

  switch (field) {
    case 'riskScore':
      actual = customer.riskScore ?? 0;
      break;
    case 'daysSinceLogin':
      actual = customer.lastLoginAt
        ? Math.floor((Date.now() - new Date(customer.lastLoginAt).getTime()) / 86_400_000)
        : 9999;
      break;
    case 'mrrValue':
      actual = customer.mrr ?? 0;
      break;
    case 'planType':
      actual = (customer.plan ?? '').toLowerCase();
      break;
    case 'paymentStatus':
      actual = (customer.paymentStatus ?? 'active').toLowerCase();
      break;
    case 'featureUsed': {
      const used: string[] = Array.isArray(customer.featuresUsed) ? customer.featuresUsed : [];
      if (operator === 'contains') return used.some(f => f.toLowerCase().includes(String(value).toLowerCase()));
      if (operator === '!=')      return !used.some(f => f.toLowerCase().includes(String(value).toLowerCase()));
      return false;
    }
    case 'loginCount':
      actual = customer.loginCountThisMonth ?? 0;
      break;
    case 'accountAge':
      actual = customer.createdAt
        ? Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / 86_400_000)
        : 0;
      break;
    default:
      return false;
  }

  switch (operator) {
    case '>':        return Number(actual) > Number(value);
    case '<':        return Number(actual) < Number(value);
    case '>=':       return Number(actual) >= Number(value);
    case '<=':       return Number(actual) <= Number(value);
    case '==':       return String(actual) === String(value);
    case '!=':       return String(actual) !== String(value);
    case 'contains': return String(actual).toLowerCase().includes(String(value).toLowerCase());
    default:         return false;
  }
}

function evaluateConditionGroup(customer: any, group: ConditionGroup): boolean {
  if (!group.conditions?.length) return false;
  const results = group.conditions.map(c => evaluateSingle(customer, c));
  return group.logic === 'OR' ? results.some(Boolean) : results.every(Boolean);
}

// ── Action executors ────────────────────────────────────────────────────────

async function execSendEmail(
  customer: { email: string; name: string | null },
  actionConfig: Record<string, unknown>
): Promise<ActionResult> {
  const template = actionConfig.template as keyof typeof emailTemplates | undefined;
  let subject = actionConfig.subject as string | undefined;
  let html    = actionConfig.html as string | undefined;

  if (template && emailTemplates[template]) {
    const t = emailTemplates[template]();
    subject = subject ?? t.subject;
    html    = html    ?? t.html;
  }

  if (!subject || !html) {
    return { status: 'failed', message: 'Missing email subject or html in actionConfig' };
  }

  const to = (actionConfig.to as string | undefined) ?? customer.email;
  const ok = await sendEmail({ to, subject, html });
  return ok
    ? { status: 'success', message: `Email sent to ${to}` }
    : { status: 'failed',  message: `Failed to send email to ${to}` };
}

async function execSendSlack(
  customer: { email: string; name: string | null; riskScore: number; mrr: number },
  actionConfig: Record<string, unknown>,
  slackWebhookUrl: string | null
): Promise<ActionResult> {
  if (!slackWebhookUrl) {
    return { status: 'skipped', message: 'No Slack webhook configured for this user' };
  }

  const text = (actionConfig.message as string | undefined)
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
    return { status: 'success', message: `Slack alert sent for ${customer.email}` };
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
    ? Math.floor((Date.now() - customer.lastLoginAt.getTime()) / 86_400_000)
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

async function execSendSms(
  customer: { id: string; email: string; phone?: string | null },
  actionConfig: Record<string, unknown>
): Promise<ActionResult> {
  const phone = customer.phone ?? (actionConfig.phone as string | undefined);
  if (!phone) return { status: 'skipped', message: 'No phone number on customer record' };

  const message = (actionConfig.message as string | undefined)
    ?? `ChurnGuard: Hi, we noticed you haven't logged in recently. Need help? Reply STOP to opt out.`;

  const result = await sendSms(phone, message);
  return result.ok
    ? { status: 'success', message: `SMS sent to ${phone}` }
    : { status: 'failed',  message: `SMS failed: ${(result as any).error ?? 'unknown'}` };
}

async function execEscalateToHuman(
  customer: { id: string; email: string },
  actionConfig: Record<string, unknown>
): Promise<ActionResult> {
  const note = (actionConfig.note as string | undefined) ?? 'Auto-escalated by automation rule';
  await prisma.customer.update({
    where: { id: customer.id },
    data: { csmStatus: 'critical_call_required' } as any,
  });
  return { status: 'success', message: `${customer.email} escalated for human review: ${note}` };
}

async function execTriggerSequence(
  customer: { id: string; email: string },
  actionConfig: Record<string, unknown>,
  userId: string
): Promise<ActionResult> {
  const sequenceType = (actionConfig.sequenceType as string | undefined) ?? 'risk_retention';
  try {
    await enrollInSequence(userId, customer.id, sequenceType as any, {
      triggeredBy: 'automation_rule',
      ...actionConfig,
    });
    return { status: 'success', message: `Enrolled in "${sequenceType}" sequence` };
  } catch (e: any) {
    return { status: 'failed', message: `Sequence enroll failed: ${e.message}` };
  }
}

// ── Cooldown check ──────────────────────────────────────────────────────────

async function isOnCooldown(ruleId: string, customerId: string, triggerType: string): Promise<boolean> {
  const hours = COOLDOWN_HOURS[triggerType] ?? 24;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const recent = await prisma.automationLog.findFirst({
    where: { ruleId, customerId, executedAt: { gte: since }, status: 'success' },
  });
  return !!recent;
}

// ── Extra AND conditions filter ──────────────────────────────────────────────

function applyExtraConditions(customers: any[], condition: Record<string, unknown>): any[] {
  const extra = Array.isArray(condition.extraConditions)
    ? (condition.extraConditions as SingleCondition[])
    : [];
  if (!extra.length) return customers;
  return customers.filter(c => extra.every(cond => evaluateSingle(c, cond)));
}

// ── Main engine ─────────────────────────────────────────────────────────────

export interface EngineOptions {
  userId?: string;
  triggerTypes?: string[];
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
    const condition   = rule.condition   as Record<string, unknown>;
    const actionConfig = rule.actionConfig as Record<string, unknown>;

    let customerWhere: Record<string, unknown> = { userId: rule.userId };
    if (opts.customerId) customerWhere = { ...customerWhere, id: opts.customerId };

    let candidates: any[] = [];

    // ── Resolve candidates ─────────────────────────────────────────────────
    if (rule.triggerType === 'multi_condition') {
      // Fetch all customers and evaluate locally
      candidates = await prisma.customer.findMany({ where: customerWhere });
      const group = condition as unknown as ConditionGroup;
      candidates = candidates.filter(c => evaluateConditionGroup(c, group));

    } else if (rule.triggerType === 'risk_threshold') {
      const threshold = Number(condition.value ?? 70);
      candidates = await prisma.customer.findMany({
        where: { ...customerWhere, riskScore: { gte: threshold } },
      });

    } else if (rule.triggerType === 'payment_failed') {
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
      const days   = Number(condition.days ?? 7);
      const cutoff = new Date(Date.now() - days * 86_400_000);
      candidates = await prisma.customer.findMany({
        where: {
          ...customerWhere,
          OR: [
            { lastFeatureUsedAt: { lt: cutoff } },
            { lastFeatureUsedAt: null, lastLoginAt: { lt: cutoff } },
          ],
        },
      });

    } else if (rule.triggerType === 'days_since_login') {
      const days   = Number(condition.days ?? 7);
      const cutoff = new Date(Date.now() - days * 86_400_000);
      candidates = await prisma.customer.findMany({
        where: {
          ...customerWhere,
          OR: [
            { lastLoginAt: { lt: cutoff } },
            { lastLoginAt: null },
          ],
        },
      });

    } else if (rule.triggerType === 'mrr_value') {
      const operator = String(condition.operator ?? '>');
      const value    = Number(condition.value ?? 0);
      const opMap: Record<string, object> = {
        '>':  { gt: value },
        '<':  { lt: value },
        '>=': { gte: value },
        '<=': { lte: value },
        '==': { equals: value },
      };
      const mrrFilter = opMap[operator] ?? { gt: value };
      candidates = await prisma.customer.findMany({
        where: { ...customerWhere, mrr: mrrFilter },
      });

    } else if (rule.triggerType === 'plan_type') {
      const plan = String(condition.plan ?? '');
      candidates = await prisma.customer.findMany({
        where: { ...customerWhere, plan },
      });

    } else if (rule.triggerType === 'payment_status') {
      const status = String(condition.status ?? 'failed');
      // paymentStatus is not a schema field — filter in-memory from events
      const allCustomers = await prisma.customer.findMany({ where: customerWhere });
      const recentPaymentEvents = await prisma.event.findMany({
        where: {
          event: { in: ['payment_failed', 'payment_succeeded', 'subscription_cancelled', 'subscription_past_due'] },
          timestamp: { gte: BigInt(Date.now() - 30 * 86_400_000) },
        },
        orderBy: { timestamp: 'desc' },
        distinct: ['customerId'],
      });
      const statusMap: Record<string, string> = {
        payment_failed:          'failed',
        payment_succeeded:       'active',
        subscription_cancelled:  'cancelled',
        subscription_past_due:   'past_due',
      };
      const customerStatuses = new Map<string, string>(
        recentPaymentEvents.map(e => [e.customerId, statusMap[e.event] ?? 'active'])
      );
      candidates = allCustomers.filter(c => {
        const cs = customerStatuses.get(c.id) ?? 'active';
        return cs === status;
      });

    } else if (rule.triggerType === 'account_age') {
      const days   = Number(condition.days ?? 90);
      const cutoff = new Date(Date.now() - days * 86_400_000);
      candidates = await prisma.customer.findMany({
        where: { ...customerWhere, createdAt: { lt: cutoff } },
      });

    } else if (rule.triggerType === 'feature_not_used') {
      const feature = String(condition.feature ?? '');
      const days    = Number(condition.days ?? 14);
      const cutoff  = new Date(Date.now() - days * 86_400_000);
      const all = await prisma.customer.findMany({ where: customerWhere });
      candidates = all.filter(c => {
        const used: string[] = Array.isArray(c.featuresUsed) ? c.featuresUsed as string[] : [];
        const notUsed = feature
          ? !used.some(f => f.toLowerCase().includes(feature.toLowerCase()))
          : used.length === 0;
        const inactive = !c.lastFeatureUsedAt || c.lastFeatureUsedAt < cutoff;
        return notUsed && inactive;
      });

    } else if (rule.triggerType === 'support_tickets') {
      const minCount  = Number(condition.count ?? 3);
      const withinDays = Number(condition.withinDays ?? 30);
      const since = BigInt(Date.now() - withinDays * 86_400_000);
      const ticketEvents = await prisma.event.findMany({
        where: { event: 'support_ticket', timestamp: { gte: since } },
      });
      const countByCustomer = new Map<string, number>();
      for (const e of ticketEvents) {
        countByCustomer.set(e.customerId, (countByCustomer.get(e.customerId) ?? 0) + 1);
      }
      const qualifyingIds = Array.from(countByCustomer.entries())
        .filter(([, cnt]) => cnt >= minCount)
        .map(([id]) => id);
      if (qualifyingIds.length === 0) {
        candidates = [];
      } else {
        candidates = await prisma.customer.findMany({
          where: { ...customerWhere, id: { in: qualifyingIds } },
        });
      }

    } else if (rule.triggerType === 'trial_ending') {
      const withinDays = Number(condition.withinDays ?? 3);
      const nowMs = Date.now();
      const windowEnd = BigInt(nowMs + withinDays * 86_400_000);
      const trialEvents = await prisma.event.findMany({
        where: {
          event: 'trial_ending',
          timestamp: { gte: BigInt(nowMs), lte: windowEnd },
        },
        distinct: ['customerId'],
      });
      const trialIds = trialEvents.map(e => e.customerId);
      if (trialIds.length === 0) {
        // Fallback: customers on trial plan created 14-withinDays to 14 days ago
        const trialStart = new Date(nowMs - 14 * 86_400_000);
        const trialEnd   = new Date(nowMs - (14 - withinDays) * 86_400_000);
        candidates = await prisma.customer.findMany({
          where: { ...customerWhere, plan: 'trial', createdAt: { gte: trialStart, lte: trialEnd } },
        });
      } else {
        candidates = await prisma.customer.findMany({
          where: { ...customerWhere, id: { in: trialIds } },
        });
      }

    } else if (rule.triggerType === 'no_activity') {
      const days   = Number(condition.days ?? 30);
      const cutoff = new Date(Date.now() - days * 86_400_000);
      candidates = await prisma.customer.findMany({
        where: {
          ...customerWhere,
          AND: [
            { OR: [{ lastLoginAt: { lt: cutoff } }, { lastLoginAt: null }] },
            { OR: [{ lastFeatureUsedAt: { lt: cutoff } }, { lastFeatureUsedAt: null }] },
          ],
        },
      });
    }

    // Apply any extra AND conditions stored in condition.extraConditions
    candidates = applyExtraConditions(candidates, condition);

    // ── Execute action for each candidate ─────────────────────────────────
    for (const customer of candidates) {
      if (await isOnCooldown(rule.id, customer.id, rule.triggerType)) {
        result.skipped++;
        continue;
      }

      let actionResult: ActionResult;
      try {
        switch (rule.actionType) {
          case 'send_email':
            actionResult = await execSendEmail(customer, actionConfig);
            break;
          case 'send_slack':
            actionResult = await execSendSlack(customer, actionConfig, rule.user.slackWebhookUrl);
            break;
          case 'send_sms':
            actionResult = await execSendSms(customer, actionConfig);
            break;
          case 'create_intervention':
            actionResult = await execCreateIntervention(customer, actionConfig, rule.userId);
            break;
          case 'escalate_to_human':
            actionResult = await execEscalateToHuman(customer, actionConfig);
            break;
          case 'trigger_sequence':
            actionResult = await execTriggerSequence(customer, actionConfig, rule.userId);
            break;
          default:
            actionResult = { status: 'failed', message: `Unknown actionType: ${rule.actionType}` };
        }
      } catch (e: any) {
        actionResult = { status: 'failed', message: e.message ?? 'Unknown error' };
      }

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
      if (actionResult.status === 'success')      result.fired++;
      else if (actionResult.status === 'failed')  result.failed++;
      else                                        result.skipped++;
    }
  }

  return result;
}
