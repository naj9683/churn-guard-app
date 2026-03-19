/**
 * Automated action sequences engine.
 *
 * Three sequences:
 *  - dunning          → triggered by invoice.payment_failed Stripe webhook
 *  - risk_retention   → triggered when customer riskScore crosses 80
 *  - welcome          → triggered when a new Customer record is created
 *
 * Step timing is measured from enrollment.startedAt (absolute, not step-to-step).
 * Cron runs every hour and processes all SequenceEnrollments where nextRunAt ≤ now.
 */

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import OpenAI from 'openai';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://churn-guard-app.vercel.app';

// Hours from enrollment start at which each step fires
const STEP_HOURS: Record<string, number[]> = {
  dunning:        [0,   72,  168],  // immediate · day 3 · day 7
  risk_retention: [0,   48,  168],  // immediate · 48 h  · day 7
  welcome:        [0,   72,  168],  // day 1     · day 3 · day 7
};

// ── SMS (Twilio) ───────────────────────────────────────────────────────────

async function sendSms(to: string, body: string): Promise<{ ok: boolean; error?: string }> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    return { ok: false, error: 'Twilio env vars not configured' };
  }
  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: to, From: TWILIO_PHONE_NUMBER, Body: body }).toString(),
      }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data.message ?? `Twilio error ${res.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message ?? 'Network error' };
  }
}

// ── OpenAI personalised email ──────────────────────────────────────────────

async function generateRetentionEmail(
  customer: { name: string | null; plan: string | null; mrr: number; lastLoginAt: Date | null; featuresUsed: unknown; riskReason: string | null }
): Promise<{ subject: string; html: string }> {
  const fallback = {
    subject: `We've noticed a change in your activity`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <p>Hi ${customer.name ?? 'there'},</p>
      <p>We noticed you haven't been as active lately. Our success team would love to help — just reply to this email.</p>
      <p>Best,<br>The ChurnGuard Team</p>
    </div>`,
  };

  if (!process.env.OPENAI_API_KEY) return fallback;

  const daysSinceLogin = customer.lastLoginAt
    ? Math.floor((Date.now() - customer.lastLoginAt.getTime()) / 86_400_000)
    : null;
  const features = Array.isArray(customer.featuresUsed)
    ? (customer.featuresUsed as string[]).join(', ') || 'none recorded'
    : 'none recorded';

  const prompt = `You are a customer success manager at a B2B SaaS company called ChurnGuard.
Write a personalised retention email for a customer at risk of churning.

Customer:
- Name: ${customer.name ?? 'there'}
- Plan: ${customer.plan ?? 'unknown'}, MRR: $${customer.mrr}
- Days since last login: ${daysSinceLogin ?? 'never logged in'}
- Features used: ${features}
- Risk reason: ${customer.riskReason ?? 'high churn probability detected'}

Write exactly 3 short paragraphs: empathetic opening, concrete & specific help offer, soft CTA. No marketing fluff.
Return ONLY valid JSON (no markdown): { "subject": "...", "html": "..." }
The html must use basic inline styles and be wrapped in a max-width:600px div.`;

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 700,
    });
    const raw = (completion.choices[0]?.message?.content ?? '')
      .replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// ── Step result ────────────────────────────────────────────────────────────

interface StepResult {
  status: 'success' | 'failed' | 'skipped';
  message: string;
  complete?: boolean; // true → mark enrollment completed immediately
}

// ── Step executor ──────────────────────────────────────────────────────────

async function executeStep(
  enrollment: { id: string; userId: string; sequenceType: string; currentStep: number; startedAt: Date; metadata: unknown },
  customer: { id: string; email: string; name: string | null; mrr: number; riskScore: number; plan: string | null; phone: string | null; lastLoginAt: Date | null; featuresUsed: unknown; riskReason: string | null },
  user: { id: string; slackWebhookUrl: string | null }
): Promise<StepResult> {
  const step = enrollment.currentStep;
  const meta = (enrollment.metadata ?? {}) as Record<string, unknown>;

  // ── DUNNING ──────────────────────────────────────────────────────────────
  if (enrollment.sequenceType === 'dunning') {

    if (step === 0) {
      const ok = await sendEmail({
        to: customer.email,
        subject: 'Action required: Your payment failed',
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#ef4444;margin:0 0 16px">Payment Failed</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>We were unable to process your payment${meta.amount ? ` of <strong>$${meta.amount}</strong>` : ''}. To keep your account active, please update your payment method now.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/settings/billing" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">
              Update Payment Method
            </a>
          </p>
          <p style="color:#6b7280;font-size:13px">If you've already resolved this, please ignore this email.</p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'Dunning step 0: payment failed email sent' }
        : { status: 'failed',  message: 'Dunning step 0: email send failed' };
    }

    if (step === 1) {
      // Day 3 — check if resolved; if not, send SMS
      if (await paymentResolvedSince(customer.id, enrollment.startedAt)) {
        return { status: 'skipped', message: 'Payment resolved — SMS skipped', complete: true };
      }
      if (!customer.phone) {
        return { status: 'skipped', message: 'No phone number — SMS step skipped' };
      }
      const { ok, error } = await sendSms(
        customer.phone,
        `Reminder: Your ChurnGuard payment is still outstanding. Update your card at ${APP_URL}/settings/billing`
      );
      return ok
        ? { status: 'success', message: `SMS sent to ${customer.phone}` }
        : { status: 'failed',  message: `SMS failed: ${error ?? 'unknown error'}` };
    }

    if (step === 2) {
      // Day 7 — check if resolved; if not, create high-priority intervention
      if (await paymentResolvedSince(customer.id, enrollment.startedAt)) {
        return { status: 'skipped', message: 'Payment resolved — CSM intervention skipped', complete: true };
      }
      await prisma.interventionOutcome.create({
        data: {
          userId: enrollment.userId,
          customerId: customer.id,
          interventionType: 'high_priority_call',
          mrrAtRisk: customer.mrr,
          riskScoreAtStart: customer.riskScore,
          customerSegment: customer.plan ?? 'unknown',
          plan: customer.plan ?? 'unknown',
          daysSinceLogin: 0,
          status: 'pending',
          triggerEvent: 'dunning_day7',
          notes: 'Auto-created: 7 days unpaid — CSM call required',
        },
      });
      return { status: 'success', message: 'Dunning step 2: high-priority CSM intervention created', complete: true };
    }
  }

  // ── RISK RETENTION ───────────────────────────────────────────────────────
  if (enrollment.sequenceType === 'risk_retention') {

    if (step === 0) {
      const { subject, html } = await generateRetentionEmail(customer);
      const ok = await sendEmail({ to: customer.email, subject, html });
      return ok
        ? { status: 'success', message: 'Risk retention step 0: AI-personalised email sent' }
        : { status: 'failed',  message: 'Risk retention step 0: email send failed' };
    }

    if (step === 1) {
      // 48 h — if customer hasn't logged in since enrollment, Slack alert to team
      const loggedInSince = customer.lastLoginAt && customer.lastLoginAt > enrollment.startedAt;
      if (loggedInSince) {
        return { status: 'skipped', message: 'Customer logged in after email — Slack alert not needed' };
      }
      if (!user.slackWebhookUrl) {
        return { status: 'skipped', message: 'No Slack webhook configured' };
      }
      const daysSince = customer.lastLoginAt
        ? Math.floor((Date.now() - customer.lastLoginAt.getTime()) / 86_400_000)
        : null;
      const slackBody = {
        username: 'ChurnGuard',
        icon_emoji: ':rotating_light:',
        text: `*High-Risk Customer — No Login After Retention Email*`,
        attachments: [{
          color: 'danger',
          fields: [
            { title: 'Customer',        value: customer.name ?? customer.email,          short: true },
            { title: 'Risk Score',      value: String(customer.riskScore),               short: true },
            { title: 'MRR',             value: `$${customer.mrr}`,                       short: true },
            { title: 'Last Login',      value: daysSince != null ? `${daysSince}d ago` : 'Never', short: true },
            { title: 'Risk Reason',     value: customer.riskReason ?? 'N/A',             short: false },
          ],
        }],
      };
      try {
        const res = await fetch(user.slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slackBody),
        });
        return res.ok
          ? { status: 'success', message: 'Risk retention step 1: Slack team alert sent (no login in 48 h)' }
          : { status: 'failed',  message: `Risk retention step 1: Slack returned ${res.status}` };
      } catch (e: any) {
        return { status: 'failed', message: `Risk retention step 1: Slack error — ${e.message}` };
      }
    }

    if (step === 2) {
      // Day 7 — mark as Critical + create intervention
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          csmStatus: 'critical_call_required',
          riskScore: Math.max(customer.riskScore, 95),
          riskReason: `Critical — Call Required. ${customer.riskReason ?? 'No login for 7+ days after high-risk outreach.'}`,
        },
      });
      const daysSinceLogin = customer.lastLoginAt
        ? Math.floor((Date.now() - customer.lastLoginAt.getTime()) / 86_400_000)
        : 0;
      await prisma.interventionOutcome.create({
        data: {
          userId: enrollment.userId,
          customerId: customer.id,
          interventionType: 'critical_call_required',
          mrrAtRisk: customer.mrr,
          riskScoreAtStart: customer.riskScore,
          customerSegment: customer.plan ?? 'unknown',
          plan: customer.plan ?? 'unknown',
          daysSinceLogin,
          status: 'pending',
          triggerEvent: 'risk_retention_day7',
          notes: 'Auto-created: no login 7 days after high-risk email — Critical Call Required',
        },
      });
      return { status: 'success', message: 'Risk retention step 2: marked Critical + intervention created', complete: true };
    }
  }

  // ── WELCOME ──────────────────────────────────────────────────────────────
  if (enrollment.sequenceType === 'welcome') {

    if (step === 0) {
      const ok = await sendEmail({
        to: customer.email,
        subject: `Welcome to ChurnGuard${customer.name ? `, ${customer.name}` : ''}!`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">Welcome to ChurnGuard!</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>We're glad you're here. Here's what to do first:</p>
          <ul style="line-height:1.8">
            <li><strong>Connect your CRM or Stripe</strong> — sync customers in minutes</li>
            <li><strong>Set up a playbook</strong> — automate your first retention action</li>
            <li><strong>Check your risk scores</strong> — see who needs attention today</li>
          </ul>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/dashboard" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">
              Go to Dashboard
            </a>
          </p>
          <p>Questions? Reply to this email — we read every one.</p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'Welcome step 0: welcome email sent (day 1)' }
        : { status: 'failed',  message: 'Welcome step 0: email send failed' };
    }

    if (step === 1) {
      // Day 3 — send "connect your first integration" only if none connected yet
      const hasIntegration = await prisma.crmIntegration.findFirst({
        where: { userId: enrollment.userId, enabled: true },
      });
      if (hasIntegration) {
        return { status: 'skipped', message: 'Integration already connected — day-3 email skipped' };
      }
      const ok = await sendEmail({
        to: customer.email,
        subject: 'Connect your first integration in ChurnGuard',
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">You're 2 minutes away from automated retention</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>You haven't connected an integration yet. Connecting ChurnGuard to Stripe or your CRM unlocks automatic risk scoring for all your customers.</p>
          <ul style="line-height:1.8">
            <li><strong>HubSpot / Salesforce</strong> — sync contacts and deals</li>
            <li><strong>Stripe</strong> — pull MRR and payment events automatically</li>
            <li><strong>Slack</strong> — get real-time alerts when customers are at risk</li>
          </ul>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/integrations" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">
              Connect an Integration
            </a>
          </p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'Welcome step 1: connect-integration email sent (day 3)' }
        : { status: 'failed',  message: 'Welcome step 1: email send failed' };
    }

    if (step === 2) {
      // Day 7 — "Here's how to read your first risk score"
      const ok = await sendEmail({
        to: customer.email,
        subject: 'How to read your ChurnGuard risk scores',
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">Understanding your risk scores</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>ChurnGuard assigns every customer a <strong>risk score from 0–100</strong>, updated every 6 hours by our AI:</p>
          <ul style="line-height:1.9">
            <li><strong style="color:#ef4444">70–100 High Risk</strong> — likely to churn within 30 days. Act now.</li>
            <li><strong style="color:#f59e0b">40–69 Medium Risk</strong> — watch carefully; consider a proactive check-in.</li>
            <li><strong style="color:#10b981">0–39 Low Risk</strong> — healthy. Focus on expansion opportunities.</li>
          </ul>
          <p>Scores are driven by: login frequency, features used, MRR changes, and open support tickets.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/customers" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">
              View Your Risk Scores
            </a>
          </p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'Welcome step 2: risk score explainer sent (day 7)', complete: true }
        : { status: 'failed',  message: 'Welcome step 2: email send failed' };
    }
  }

  return { status: 'failed', message: `Unknown sequence "${enrollment.sequenceType}" step ${step}` };
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function paymentResolvedSince(customerId: string, since: Date): Promise<boolean> {
  const ev = await prisma.event.findFirst({
    where: {
      customerId,
      event: 'payment_succeeded',
      timestamp: { gte: BigInt(since.getTime()) },
    },
  });
  return !!ev;
}

// ── Enrollment ─────────────────────────────────────────────────────────────

export async function enrollInSequence(
  userId: string,
  customerId: string,
  sequenceType: 'dunning' | 'risk_retention' | 'welcome',
  metadata: Record<string, unknown> = {}
) {
  // Cancel any existing active enrollment for this customer + sequence
  await prisma.sequenceEnrollment.updateMany({
    where: { customerId, sequenceType, status: 'active' },
    data: { status: 'cancelled' },
  });

  await prisma.sequenceEnrollment.create({
    data: {
      userId,
      customerId,
      sequenceType,
      currentStep: 0,
      nextRunAt: new Date(), // step 0 runs immediately on next cron tick
      status: 'active',
      metadata: metadata as any,
    },
  });
}

// ── Main runner (called by cron) ───────────────────────────────────────────

export interface SequenceRunResult {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  completed: number;
}

export async function runSequences(): Promise<SequenceRunResult> {
  const result: SequenceRunResult = { processed: 0, succeeded: 0, failed: 0, skipped: 0, completed: 0 };

  const due = await prisma.sequenceEnrollment.findMany({
    where: { status: 'active', nextRunAt: { lte: new Date() } },
    include: { customer: true },
  });

  for (const enrollment of due) {
    result.processed++;

    const user = await prisma.user.findFirst({
      where: { id: enrollment.userId },
      select: { id: true, slackWebhookUrl: true },
    });
    if (!user) continue;

    let stepResult: StepResult;
    try {
      stepResult = await executeStep(enrollment, enrollment.customer, user);
    } catch (e: any) {
      stepResult = { status: 'failed', message: e.message ?? 'Unexpected error in step executor' };
    }

    // Write log entry
    await prisma.sequenceLog.create({
      data: {
        enrollmentId: enrollment.id,
        step: enrollment.currentStep,
        action: `${enrollment.sequenceType}_step_${enrollment.currentStep}`,
        status: stepResult.status,
        message: stepResult.message,
      },
    });

    if (stepResult.status === 'success') result.succeeded++;
    else if (stepResult.status === 'failed') result.failed++;
    else result.skipped++;

    const delays = STEP_HOURS[enrollment.sequenceType] ?? [];
    const nextStep = enrollment.currentStep + 1;
    const isLastStep = nextStep >= delays.length;
    const shouldComplete = stepResult.complete || isLastStep;

    if (shouldComplete) {
      await prisma.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: { status: 'completed', currentStep: nextStep, updatedAt: new Date() },
      });
      result.completed++;
    } else {
      // Next step fires at startedAt + absolute delay
      const nextRunAt = new Date(
        new Date(enrollment.startedAt).getTime() + delays[nextStep] * 3_600_000
      );
      await prisma.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: { currentStep: nextStep, nextRunAt, updatedAt: new Date() },
      });
    }
  }

  return result;
}
