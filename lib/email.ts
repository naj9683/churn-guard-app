import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.resend.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'resend',
    pass: process.env.RESEND_API_KEY || '',
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: 'Churn Guard <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Email failed:', error);
    return false;
  }
}

export const emailTemplates = {
  onboardingRescue: () => ({
    subject: 'Stuck? Let me help you get started',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You signed up 3 days ago but haven't finished setup</h2>
        <p>Hi there,</p>
        <p>I noticed you started your journey with us but hit a roadblock. That's normal - SaaS setup can be tricky.</p>
        <p><strong>Here's what most successful users do next:</strong></p>
        <ul>
          <li>Connect their Stripe account (2 mins)</li>
          <li>Set up their first playbook (3 mins)</li>
          <li>Watch the magic happen</li>
        </ul>
        <p style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Complete Setup Now
          </a>
        </p>
        <p>Need help? Just reply to this email - I read every single one.</p>
        <p>Best,<br>The Churn Guard Team</p>
      </div>
    `,
  }),

  silentQuitter: () => ({
    subject: 'We miss you - and your feedback matters',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You were one of our most engaged users...</h2>
        <p>Hi there,</p>
        <p>You haven't logged in for a while, and I wanted to personally check in.</p>
        <p><strong>Did something change?</strong></p>
        <p>Most "silent quitters" tell us one of these:</p>
        <ul>
          <li>"I got busy with other priorities"</li>
          <li>"I wasn't sure how to use the advanced features"</li>
          <li>"I didn't see the value right away"</li>
        </ul>
        <p>If it's #2 or #3, I can fix that in a 10-minute call. If it's #1, I get it - but don't let your churn rate suffer while you're away.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Schedule a Quick Check-in
          </a>
        </p>
        <p>Or just reply with "I'm good" and I'll leave you alone :)</p>
        <p>Best,<br>The Churn Guard Team</p>
      </div>
    `,
  }),

  paymentSaver: () => ({
    subject: 'Payment failed - but don\'t cancel yet',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your payment didn't go through</h2>
        <p>Hi there,</p>
        <p>Your subscription payment failed. This usually happens when:</p>
        <ul>
          <li>Card expired</li>
          <li>Bank flagged the charge</li>
          <li>Insufficient funds</li>
        </ul>
        <p><strong>But here's the thing:</strong> Instead of canceling, you can pause your account for 30 days.</p>
        <p>Why pause instead of cancel?</p>
        <ul>
          <li>Keep all your data and settings</li>
          <li>No setup hassle when you return</li>
          <li>Your churn analytics stay intact</li>
        </ul>
        <p style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Pause Account (Keep Everything)
          </a>
        </p>
        <p style="text-align: center; margin: 10px 0;">
          <a href="#" style="color: #666; font-size: 14px;">
            Or update payment method to keep active
          </a>
        </p>
        <p>Best,<br>The Churn Guard Team</p>
      </div>
    `,
  }),
};