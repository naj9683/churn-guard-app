import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encrypt';
import { generatePersonalizedEmail, type CustomerEmailContext } from '@/lib/ai-email-generator';

// ── Provider helpers ──────────────────────────────────────────────────────────

async function sendViaPostmark(
  to: string, subject: string, html: string,
  apiKey: string, fromName: string, fromEmail: string,
  userId: string | undefined, emailSource: string | undefined,
): Promise<{ success: boolean; data?: any; errorMessage?: string }> {
  const from = `${fromName} <${fromEmail}>`;
  try {
    const res = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': apiKey,
      },
      body: JSON.stringify({ From: from, To: to, Subject: subject, HtmlBody: html }),
    });
    const data = await res.json();
    if (!res.ok || data.ErrorCode !== 0) {
      const errMsg: string = data.Message ?? `HTTP ${res.status}`;
      prisma.emailLog.create({ data: { userId, to, subject, status: 'failed', errorMessage: errMsg, emailSource, sendProvider: 'postmark' } }).catch(() => {});
      return { success: false, errorMessage: errMsg };
    }
    prisma.emailLog.create({ data: { userId, to, subject, status: 'sent', messageId: data.MessageID, emailSource, sendProvider: 'postmark' } }).catch(() => {});
    return { success: true, data };
  } catch (err: any) {
    const errMsg: string = err?.message ?? String(err);
    prisma.emailLog.create({ data: { userId, to, subject, status: 'failed', errorMessage: errMsg, emailSource, sendProvider: 'postmark' } }).catch(() => {});
    return { success: false, errorMessage: errMsg };
  }
}

async function sendViaResend(
  to: string, subject: string, html: string,
  apiKey: string,
  userId: string | undefined, emailSource: string | undefined,
): Promise<{ success: boolean; data?: any; errorMessage?: string }> {
  const fromName  = process.env.RESEND_FROM_NAME  ?? 'ChurnGuard';
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'admin@churnguardapp.com';
  const from = `${fromName} <${fromEmail}>`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    const data = await res.json();
    if (!res.ok) {
      const errMsg: string = data.message ?? data.name ?? `HTTP ${res.status}`;
      prisma.emailLog.create({ data: { userId, to, subject, status: 'failed', errorMessage: errMsg, emailSource, sendProvider: 'resend' } }).catch(() => {});
      return { success: false, errorMessage: errMsg };
    }
    prisma.emailLog.create({ data: { userId, to, subject, status: 'sent', messageId: data.id, emailSource, sendProvider: 'resend' } }).catch(() => {});
    return { success: true, data };
  } catch (err: any) {
    const errMsg: string = err?.message ?? String(err);
    prisma.emailLog.create({ data: { userId, to, subject, status: 'failed', errorMessage: errMsg, emailSource, sendProvider: 'resend' } }).catch(() => {});
    return { success: false, errorMessage: errMsg };
  }
}

// ── sendEmail ─────────────────────────────────────────────────────────────────
//
// Fallback chain (evaluated in order, first available wins):
//   1. Tenant Postmark  — userId provided + postmarkApiKey in DB
//   2. Platform Resend  — RESEND_API_KEY env var
//   3. Platform Postmark — POSTMARK_API_KEY env var
//   4. Mock             — no provider configured
//
// sendProvider in EmailLog tells you which path was taken.

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  userId?: string,
  emailSource?: 'ai' | 'fallback' | 'hardcoded'
): Promise<{ success: boolean; data?: any; errorMessage?: string }> {

  // ── Step 1: Tenant Postmark (requires userId + stored key) ────────────────
  if (userId) {
    const userCfg = await prisma.user.findUnique({
      where: { id: userId },
      select: { postmarkApiKey: true, postmarkFromEmail: true, postmarkFromName: true },
    }).catch(() => null);

    if (userCfg?.postmarkApiKey) {
      const apiKey   = decrypt(userCfg.postmarkApiKey);
      const fromName  = userCfg.postmarkFromName  ?? process.env.POSTMARK_FROM_NAME  ?? 'ChurnGuard';
      const fromEmail = userCfg.postmarkFromEmail ?? process.env.POSTMARK_FROM_EMAIL ?? 'admin@churnguardapp.com';
      console.log(`[sendEmail] Tenant Postmark → ${to}`);
      return sendViaPostmark(to, subject, html, apiKey, fromName, fromEmail, userId, emailSource);
    }
    // No tenant Postmark key — fall through to platform providers
    console.log(`[sendEmail] Tenant ${userId} has no Postmark key — falling back to platform provider`);
  }

  // ── Step 2: Platform Resend ───────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    console.log(`[sendEmail] Platform Resend → ${to}`);
    return sendViaResend(to, subject, html, resendKey, userId, emailSource);
  }

  // ── Step 3: Platform Postmark ─────────────────────────────────────────────
  const postmarkKey = process.env.POSTMARK_API_KEY;
  if (postmarkKey) {
    const fromName  = process.env.POSTMARK_FROM_NAME  ?? 'ChurnGuard';
    const fromEmail = process.env.POSTMARK_FROM_EMAIL ?? 'admin@churnguardapp.com';
    console.log(`[sendEmail] Platform Postmark → ${to}`);
    return sendViaPostmark(to, subject, html, postmarkKey, fromName, fromEmail, userId, emailSource);
  }

  // ── Step 4: Mock (no provider configured) ────────────────────────────────
  console.log('📧 EMAIL WOULD BE SENT (no provider configured):', to, subject);
  prisma.emailLog.create({ data: { userId, to, subject, status: 'mock', messageId: 'mock-' + Date.now(), emailSource, sendProvider: 'postmark' } }).catch(() => {});
  return { success: true, data: { id: 'mock-email-id' } };
}

export const emailTemplates = {
  onboardingRescue: (name: string) => ({
    subject: "Need help getting started?",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hey ${name},</h2>
        <p>I noticed you signed up for ChurnGuard a few days ago but haven't set up your first retention playbook yet.</p>
        <p>The most successful SaaS companies recover 15-20% of at-risk customers with automated playbooks like these:</p>
        <ul>
          <li>✅ Onboarding emails for users who don't complete setup</li>
          <li>✅ "We miss you" campaigns for inactive users</li>
          <li>✅ Payment recovery for failed charges</li>
        </ul>
        <p><a href="#" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">Set Up My First Playbook</a></p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          P.S. Hit reply if you need help - I read every email.
        </p>
      </div>
    `
  }),

  silentQuitter: (name: string, days: number) => ({
    subject: "We miss you at ChurnGuard",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hey ${name},</h2>
        <p>It's been ${days} days since you last logged into ChurnGuard.</p>
        <p>I hope everything is going well with your SaaS. If you're struggling with churn or retention, I'd love to help.</p>
        <p><strong>Quick question:</strong> What's the biggest challenge you're facing with customer retention right now?</p>
        <p><a href="#" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">Reply to this email</a></p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          If ChurnGuard isn't the right fit, no hard feelings. Just let me know and I'll close your account.
        </p>
      </div>
    `
  }),

  paymentSaver: (name: string) => ({
    subject: "Your ChurnGuard subscription",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hey ${name},</h2>
        <p>We couldn't process your last payment for ChurnGuard.</p>
        <p><strong>Don't worry - your data is safe.</strong> We won't delete anything.</p>
        <p>Instead of canceling your account, would you like to:</p>
        <ul>
          <li>✅ <strong>Pause for 30 days</strong> - Free, no charge</li>
          <li>✅ <strong>Switch to free plan</strong> - Keep basic features</li>
          <li>✅ <strong>Update payment method</strong> - Continue seamlessly</li>
        </ul>
        <p><a href="#" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">Choose an option</a></p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Having trouble? Just reply to this email and I'll help.
        </p>
      </div>
    `
  })
};

const PLACEHOLDER_RE = /\[(Your Name|Company Name|Your Company|Name)\]/gi;

// AI-powered personalized email send — calls Claude, falls back to hardcoded template
export async function sendPersonalizedEmail(
  customer: CustomerEmailContext,
  emailType: string,
  userId: string,
  extra?: Record<string, unknown>
): Promise<{ success: boolean; errorMessage?: string; source: 'ai' | 'fallback' }> {
  const generated = await generatePersonalizedEmail(customer, emailType, userId, extra);

  // Strip any leftover bracket placeholders the model may have emitted
  const cleanSubject = generated.subject.replace(PLACEHOLDER_RE, 'ChurnGuard Team');
  const cleanBody    = generated.body.replace(PLACEHOLDER_RE, 'ChurnGuard Team');

  const result = await sendEmail(customer.email, cleanSubject, cleanBody, userId, generated.source);
  return { ...result, source: generated.source };
}

// Slack webhook integration — unchanged
export async function sendSlackAlert(channel: string, message: string, details?: any) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('🔔 SLACK ALERT WOULD BE SENT:', channel, message);
    return { success: true };
  }

  try {
    const payload = {
      channel: channel || '#retention',
      username: 'ChurnGuard Bot',
      icon_emoji: ':warning:',
      text: message,
      attachments: details ? [{
        color: details.riskScore > 70 ? 'danger' : 'warning',
        fields: [
          { title: 'Customer', value: details.customerEmail || 'Unknown', short: true },
          { title: 'Risk Score', value: details.riskScore || 'N/A', short: true },
          { title: 'MRR', value: `$${details.mrr || 0}`, short: true },
          { title: 'Last Login', value: details.lastLogin || 'Never', short: true },
        ]
      }] : undefined
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Slack API error: ${response.status}`);
    return { success: true };
  } catch (error) {
    console.error('Slack alert failed:', error);
    return { success: false, error };
  }
}

export const slackAlerts = {
  silentQuitter: (customer: any, days: number) => ({
    channel: '#retention',
    message: `🚨 *Silent Quitter Alert* - User hasn't logged in for ${days} days!`,
    details: { customerEmail: customer.email, customerName: customer.name, riskScore: customer.riskScore, mrr: customer.mrr, lastLogin: customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleDateString() : 'Never' }
  }),
  onboardingRescue: (customer: any) => ({
    channel: '#onboarding',
    message: `📧 *Onboarding Rescue* - Day 3 user needs help!`,
    details: { customerEmail: customer.email, customerName: customer.name, riskScore: customer.riskScore, mrr: customer.mrr, signupDate: new Date(customer.signupAt).toLocaleDateString() }
  }),
  paymentFailed: (customer: any) => ({
    channel: '#finance',
    message: `💳 *Payment Failed* - Immediate attention required!`,
    details: { customerEmail: customer.email, customerName: customer.name, riskScore: customer.riskScore, mrr: customer.mrr }
  })
};
