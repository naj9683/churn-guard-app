import { Resend } from 'resend';

// Lazy initialization - only create client when needed
let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not set - emails will be logged but not sent');
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendEmail(to: string, subject: string, html: string) {
  const client = getResend();
  
  if (!client) {
    // Log email for testing when API key is missing
    console.log('📧 EMAIL WOULD BE SENT:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('---');
    return { success: true, data: { id: 'mock-email-id' } };
  }

  try {
    const { data, error } = await client.emails.send({
      from: `${process.env.RESEND_FROM_NAME || 'ChurnGuard'} <${process.env.RESEND_FROM_EMAIL || 'admin@churnguardapp.com'}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error };
  }
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
// Slack webhook integration for playbook alerts
export async function sendSlackAlert(channel: string, message: string, details?: any) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('🔔 SLACK ALERT WOULD BE SENT:');
    console.log('Channel:', channel);
    console.log('Message:', message);
    console.log('Details:', details);
    console.log('---');
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
          {
            title: 'Customer',
            value: details.customerEmail || 'Unknown',
            short: true
          },
          {
            title: 'Risk Score',
            value: details.riskScore || 'N/A',
            short: true
          },
          {
            title: 'MRR',
            value: `$${details.mrr || 0}`,
            short: true
          },
          {
            title: 'Last Login',
            value: details.lastLogin || 'Never',
            short: true
          }
        ]
      }] : undefined
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Slack alert failed:', error);
    return { success: false, error };
  }
}

// Specific alert templates
export const slackAlerts = {
  silentQuitter: (customer: any, days: number) => ({
    channel: '#retention',
    message: `🚨 *Silent Quitter Alert* - User hasn't logged in for ${days} days!`,
    details: {
      customerEmail: customer.email,
      customerName: customer.name,
      riskScore: customer.riskScore,
      mrr: customer.mrr,
      lastLogin: customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleDateString() : 'Never'
    }
  }),
  
  onboardingRescue: (customer: any) => ({
    channel: '#onboarding',
    message: `📧 *Onboarding Rescue* - Day 3 user needs help!`,
    details: {
      customerEmail: customer.email,
      customerName: customer.name,
      riskScore: customer.riskScore,
      mrr: customer.mrr,
      signupDate: new Date(customer.signupAt).toLocaleDateString()
    }
  }),
  
  paymentFailed: (customer: any) => ({
    channel: '#finance',
    message: `💳 *Payment Failed* - Immediate attention required!`,
    details: {
      customerEmail: customer.email,
      customerName: customer.name,
      riskScore: customer.riskScore,
      mrr: customer.mrr
    }
  })
};