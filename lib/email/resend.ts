import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'ChurnGuard <noreply@churnguard.io>',
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

// Email templates for each playbook
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