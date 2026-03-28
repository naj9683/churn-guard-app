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
  dunning:              [0,   72,  168],  // immediate · day 3 · day 7
  risk_retention:       [0,   48,  168],  // immediate · 48 h  · day 7
  welcome:              [0,   72,  168],  // day 1     · day 3 · day 7
  vip_early_warning:    [0,   24,   72],  // immediate · 24 h  · day 3
  new_customer_rescue:  [0,   72,  168],  // immediate · day 3 · day 7
  win_back:             [0,  168,  336],  // immediate · day 7 · day 14
  downgrade_prevention: [0,   72],        // immediate · day 3
  support_followup:     [0,   48,  168],  // immediate · 48 h  · day 7
};

// ── SMS (Twilio) ───────────────────────────────────────────────────────────

export async function sendSms(to: string, body: string): Promise<{ ok: boolean; error?: string }> {
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

  // ── VIP EARLY WARNING ────────────────────────────────────────────────────
  if (enrollment.sequenceType === 'vip_early_warning') {

    if (step === 0) {
      // Immediate: Slack alert + personal email
      const emailOk = await sendEmail({
        to: customer.email,
        subject: `A personal note from the ChurnGuard team`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">We're here for you</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>As one of our most valued customers, your success is our top priority. We noticed some changes in your account activity and wanted to reach out personally.</p>
          <p>Your dedicated success manager would love to connect — even just 15 minutes to make sure ChurnGuard is delivering the value you need.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/schedule" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">Book a Call</a>
          </p>
          <p>Or simply reply to this email — we read every one.</p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      if (user.slackWebhookUrl) {
        await fetch(user.slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'ChurnGuard',
            icon_emoji: ':rotating_light:',
            text: `*VIP Early Warning* — High-value customer at risk`,
            attachments: [{
              color: 'danger',
              fields: [
                { title: 'Customer', value: customer.name ?? customer.email, short: true },
                { title: 'MRR', value: `$${customer.mrr}`, short: true },
                { title: 'Risk Score', value: String(customer.riskScore), short: true },
                { title: 'Action', value: 'Personal email sent — book a call recommended', short: false },
              ],
            }],
          }),
        }).catch(() => {});
      }
      return emailOk
        ? { status: 'success', message: 'VIP early warning step 0: email + Slack alert sent' }
        : { status: 'failed',  message: 'VIP early warning step 0: email failed' };
    }

    if (step === 1) {
      // 24h — if no response, create intervention
      const loggedInSince = customer.lastLoginAt && customer.lastLoginAt > enrollment.startedAt;
      if (loggedInSince) {
        return { status: 'skipped', message: 'VIP customer engaged — intervention not needed' };
      }
      const daysSinceLogin = customer.lastLoginAt
        ? Math.floor((Date.now() - customer.lastLoginAt.getTime()) / 86_400_000) : 0;
      await prisma.interventionOutcome.create({
        data: {
          userId: enrollment.userId, customerId: customer.id,
          interventionType: 'success_call', mrrAtRisk: customer.mrr,
          riskScoreAtStart: customer.riskScore, customerSegment: customer.plan ?? 'vip',
          plan: customer.plan ?? 'unknown', daysSinceLogin, status: 'active',
          triggerEvent: 'vip_early_warning_24h',
          notes: JSON.stringify({ legacyNotes: 'VIP: no engagement 24h after outreach — CSM call needed' }),
        },
      });
      return { status: 'success', message: 'VIP early warning step 1: CSM intervention created (no engagement in 24h)' };
    }

    if (step === 2) {
      // Day 3 — escalate to critical if still no login
      const loggedInSince = customer.lastLoginAt && customer.lastLoginAt > enrollment.startedAt;
      if (loggedInSince) {
        return { status: 'skipped', message: 'VIP customer engaged — escalation not needed', complete: true };
      }
      await prisma.customer.update({
        where: { id: customer.id },
        data: { csmStatus: 'critical_call_required', riskScore: Math.max(customer.riskScore, 90) },
      });
      return { status: 'success', message: 'VIP early warning step 2: escalated to critical', complete: true };
    }
  }

  // ── NEW CUSTOMER RESCUE ───────────────────────────────────────────────────
  if (enrollment.sequenceType === 'new_customer_rescue') {

    if (step === 0) {
      const ok = await sendEmail({
        to: customer.email,
        subject: `Let's make sure you're getting started right`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">We're here to help you get started</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>We noticed you haven't had a chance to explore ChurnGuard yet — and we want to help. Getting set up takes less than 10 minutes.</p>
          <p><strong>Here's the fastest path to your first win:</strong></p>
          <ol style="line-height:1.9">
            <li>Connect your Stripe or HubSpot account</li>
            <li>Watch your customers get automatically scored</li>
            <li>Set up one automation rule to intervene when someone is at risk</li>
          </ol>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/dashboard" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">Start Setup</a>
          </p>
          <p>Need help? Reply to this email and a human will respond within the hour.</p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'New customer rescue step 0: onboarding help email sent' }
        : { status: 'failed',  message: 'New customer rescue step 0: email failed' };
    }

    if (step === 1) {
      // Day 3 — if still no login, offer a call
      const loggedInSince = customer.lastLoginAt && customer.lastLoginAt > enrollment.startedAt;
      if (loggedInSince) {
        return { status: 'skipped', message: 'New customer logged in — day-3 follow-up not needed' };
      }
      const ok = await sendEmail({
        to: customer.email,
        subject: `Can we help? Quick 15-minute setup call`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">A quick call makes all the difference</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>You signed up but haven't had a chance to log in yet. We'd love to do a quick 15-minute setup call — we'll get everything connected for you.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/schedule" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">Book a Free Setup Call</a>
          </p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'New customer rescue step 1: call offer email sent' }
        : { status: 'failed',  message: 'New customer rescue step 1: email failed' };
    }

    if (step === 2) {
      // Day 7 — create intervention if still no activity
      const loggedInSince = customer.lastLoginAt && customer.lastLoginAt > enrollment.startedAt;
      if (loggedInSince) {
        return { status: 'skipped', message: 'New customer engaged — intervention not needed', complete: true };
      }
      await prisma.interventionOutcome.create({
        data: {
          userId: enrollment.userId, customerId: customer.id,
          interventionType: 'manual_outreach', mrrAtRisk: customer.mrr,
          riskScoreAtStart: customer.riskScore, customerSegment: 'new_customer',
          plan: customer.plan ?? 'unknown', daysSinceLogin: 7, status: 'active',
          triggerEvent: 'new_customer_rescue_day7',
          notes: JSON.stringify({ legacyNotes: 'New customer — no login 7 days after signup. Manual outreach needed.' }),
        },
      });
      return { status: 'success', message: 'New customer rescue step 2: manual outreach intervention created', complete: true };
    }
  }

  // ── WIN-BACK CAMPAIGN ─────────────────────────────────────────────────────
  if (enrollment.sequenceType === 'win_back') {

    if (step === 0) {
      const ok = await sendEmail({
        to: customer.email,
        subject: `We miss you — here's a special offer to come back`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">Come back to ChurnGuard</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>We noticed you're no longer an active customer, and we'd love to earn your business back.</p>
          <p>As a returning customer, we're offering you <strong>3 months at 40% off</strong> — no commitment required.</p>
          <p>A lot has changed since you left: AI-powered risk scoring, 9 new automation triggers, and HubSpot/Salesforce sync now work out of the box.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/pricing?promo=winback" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">Claim Your 40% Discount</a>
          </p>
          <p>Questions? Just reply — we'd love to hear what would make ChurnGuard work for you.</p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'Win-back step 0: offer email sent' }
        : { status: 'failed',  message: 'Win-back step 0: email failed' };
    }

    if (step === 1) {
      // Day 7 — follow-up with social proof
      const ok = await sendEmail({
        to: customer.email,
        subject: `What our customers are saying about ChurnGuard`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">Here's what you're missing</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>Our customers are saving an average of <strong>$12,000/year</strong> in prevented churn using ChurnGuard's automation rules.</p>
          <blockquote style="border-left:3px solid #6366f1;padding-left:16px;margin:20px 0;color:#374151;font-style:italic">
            "ChurnGuard paid for itself in the first week. We caught a $2,400/month customer before they cancelled."
          </blockquote>
          <p>Your 40% discount offer is still active. It expires in 7 days.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/pricing?promo=winback" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">Restart for 40% Off</a>
          </p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'Win-back step 1: social proof follow-up sent' }
        : { status: 'failed',  message: 'Win-back step 1: email failed' };
    }

    if (step === 2) {
      // Day 14 — final offer
      const ok = await sendEmail({
        to: customer.email,
        subject: `Last chance — your discount expires today`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">This is our last email</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>We promised to respect your inbox, so this is the last we'll reach out. Your 40% discount expires today.</p>
          <p>If there's anything we could have done better, we genuinely want to hear it — just reply.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/pricing?promo=winback" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">Accept the Offer</a>
          </p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'Win-back step 2: final offer email sent', complete: true }
        : { status: 'failed',  message: 'Win-back step 2: email failed' };
    }
  }

  // ── DOWNGRADE PREVENTION ──────────────────────────────────────────────────
  if (enrollment.sequenceType === 'downgrade_prevention') {

    if (step === 0) {
      const ok = await sendEmail({
        to: customer.email,
        subject: `Before you downgrade — let us help`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">We can make this work for you</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>We noticed you may be considering a change to your plan. Before you do, we'd love to offer a solution that keeps all your features at a price that works for you.</p>
          <p><strong>What we can offer:</strong></p>
          <ul style="line-height:1.9">
            <li><strong>3 months at 25% off</strong> — keep your current plan, lower cost</li>
            <li><strong>A free strategy call</strong> — make sure you're using every feature that drives ROI</li>
            <li><strong>Annual billing</strong> — save 20% automatically</li>
          </ul>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/settings/billing" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">Talk to Us First</a>
          </p>
          <p>Just reply and we'll make it happen.</p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'Downgrade prevention step 0: retention offer email sent' }
        : { status: 'failed',  message: 'Downgrade prevention step 0: email failed' };
    }

    if (step === 1) {
      // Day 3 — Slack alert for team to follow up
      if (user.slackWebhookUrl) {
        const res = await fetch(user.slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'ChurnGuard',
            icon_emoji: ':arrow_down:',
            text: `*Downgrade Prevention* — customer considering downgrade`,
            attachments: [{
              color: 'warning',
              fields: [
                { title: 'Customer', value: customer.name ?? customer.email, short: true },
                { title: 'Current MRR', value: `$${customer.mrr}`, short: true },
                { title: 'Plan', value: customer.plan ?? 'unknown', short: true },
                { title: 'Action', value: 'Retention offer emailed 3 days ago — CSM follow-up recommended', short: false },
              ],
            }],
          }),
        }).catch(() => ({ ok: false }));
        return (res as Response).ok
          ? { status: 'success', message: 'Downgrade prevention step 1: Slack team alert sent', complete: true }
          : { status: 'failed',  message: 'Downgrade prevention step 1: Slack failed', complete: true };
      }
      return { status: 'skipped', message: 'No Slack webhook — step skipped', complete: true };
    }
  }

  // ── SUPPORT TICKET FOLLOW-UP ──────────────────────────────────────────────
  if (enrollment.sequenceType === 'support_followup') {

    if (step === 0) {
      const ticketCount = (enrollment.metadata as any)?.ticketCount ?? 'several';
      const ok = await sendEmail({
        to: customer.email,
        subject: `Following up on your recent support experience`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#6366f1;margin:0 0 16px">We want to make sure everything's resolved</h2>
          <p>Hi ${customer.name ?? 'there'},</p>
          <p>You've had ${ticketCount} support interactions recently, and we want to make sure everything has been fully resolved to your satisfaction.</p>
          <p>Is there anything still outstanding? Our team is here to help, and we take your experience seriously.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${APP_URL}/support" style="background:#6366f1;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600">Contact Support</a>
          </p>
          <p>Or just reply here — a human will respond within a few hours.</p>
          <p>Best,<br>The ChurnGuard Team</p>
        </div>`,
      });
      return ok
        ? { status: 'success', message: 'Support follow-up step 0: check-in email sent' }
        : { status: 'failed',  message: 'Support follow-up step 0: email failed' };
    }

    if (step === 1) {
      // 48h — if no login/engagement, Slack the team
      const loggedInSince = customer.lastLoginAt && customer.lastLoginAt > enrollment.startedAt;
      if (loggedInSince) {
        return { status: 'skipped', message: 'Customer engaged after check-in — Slack not needed' };
      }
      if (!user.slackWebhookUrl) {
        return { status: 'skipped', message: 'No Slack webhook configured' };
      }
      const res = await fetch(user.slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'ChurnGuard',
          icon_emoji: ':ticket:',
          text: `*Support Ticket Follow-up* — customer hasn't engaged after check-in`,
          attachments: [{
            color: 'warning',
            fields: [
              { title: 'Customer', value: customer.name ?? customer.email, short: true },
              { title: 'MRR', value: `$${customer.mrr}`, short: true },
              { title: 'Risk Score', value: String(customer.riskScore), short: true },
              { title: 'Action', value: 'Check-in email sent 48h ago — personal outreach recommended', short: false },
            ],
          }],
        }),
      }).catch(() => ({ ok: false }));
      return (res as Response).ok
        ? { status: 'success', message: 'Support follow-up step 1: Slack team alert sent' }
        : { status: 'failed',  message: 'Support follow-up step 1: Slack failed' };
    }

    if (step === 2) {
      // Day 7 — create intervention if still no engagement
      const loggedInSince = customer.lastLoginAt && customer.lastLoginAt > enrollment.startedAt;
      if (loggedInSince) {
        return { status: 'skipped', message: 'Customer engaged — intervention not needed', complete: true };
      }
      const daysSinceLogin = customer.lastLoginAt
        ? Math.floor((Date.now() - customer.lastLoginAt.getTime()) / 86_400_000) : 0;
      await prisma.interventionOutcome.create({
        data: {
          userId: enrollment.userId, customerId: customer.id,
          interventionType: 'manual_outreach', mrrAtRisk: customer.mrr,
          riskScoreAtStart: customer.riskScore, customerSegment: customer.plan ?? 'unknown',
          plan: customer.plan ?? 'unknown', daysSinceLogin, status: 'active',
          triggerEvent: 'support_followup_day7',
          notes: JSON.stringify({ legacyNotes: 'Support follow-up: no engagement 7 days after check-in — manual outreach needed' }),
        },
      });
      return { status: 'success', message: 'Support follow-up step 2: intervention created', complete: true };
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
  sequenceType: 'dunning' | 'risk_retention' | 'welcome' | 'vip_early_warning' | 'new_customer_rescue' | 'win_back' | 'downgrade_prevention' | 'support_followup' | string,
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
