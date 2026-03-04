// Professional HTML Email Templates for ChurnGuard

export const emailTemplates = {
  onboardingRescue: (customerName: string) => ({
    subject: "Welcome! Let's get you started 🚀",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ChurnGuard</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 40px 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">ChurnGuard</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Customer Retention Automation</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #111827; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Hi ${customerName}, we miss you!</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                We noticed you signed up for ChurnGuard a few days ago but haven't had a chance to explore yet. 
                Don't worry - getting started is easier than you think!
              </p>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #1e40af; margin: 0 0 10px; font-size: 18px; font-weight: 600;">🎯 Quick Start Guide:</h3>
                <ul style="color: #1e40af; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Connect your Stripe account</li>
                  <li>Add your first customer</li>
                  <li>Activate your retention playbooks</li>
                  <li>Watch your churn rate drop!</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://churn-guard-app.vercel.app/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                  Get Started Now →
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0;">
                Need help? Just reply to this email or check our documentation. We're here to help you reduce churn and grow your revenue.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2026 ChurnGuard. All rights reserved.<br>
                You're receiving this because you signed up for ChurnGuard.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }),

  silentQuitter: (customerName: string, daysAbsent: number) => ({
    subject: "We miss you! Come back and see what's new 👋",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Miss You</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">We Miss You, ${customerName}! 💙</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                It's been <strong>${daysAbsent} days</strong> since you last logged into ChurnGuard. We hope everything is going well!
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                While you were away, we've been working hard to help businesses like yours save customers. Here's what you might have missed:
              </p>
              
              <div style="background-color: #fffbeb; border: 2px solid #f59e0b; padding: 24px; margin: 30px 0; border-radius: 12px;">
                <h3 style="color: #92400e; margin: 0 0 15px; font-size: 18px; font-weight: 600;">📊 Your Account Status:</h3>
                <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Your retention playbooks are waiting</li>
                  <li>New features have been added</li>
                  <li>Your customers need attention</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://churn-guard-app.vercel.app/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);">
                  Return to Dashboard →
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0;">
                If you're having trouble or need assistance, just reply to this email. We're here to help!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2026 ChurnGuard. All rights reserved.<br>
                Automated retention for growing businesses.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }),

  paymentSaver: (customerName: string) => ({
    subject: "Don't leave! Here's a special offer just for you 💎",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Special Offer</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">We Don't Want to Lose You! 💚</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hi ${customerName}, we noticed your recent payment didn't go through. We understand things happen, and we don't want you to lose access to ChurnGuard.
              </p>
              
              <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 3px solid #10b981; padding: 30px; margin: 30px 0; border-radius: 16px; text-align: center;">
                <h2 style="color: #065f46; margin: 0 0 10px; font-size: 24px; font-weight: 700;">🎁 Special Offer: 30% OFF</h2>
                <p style="color: #065f46; font-size: 18px; margin: 0; font-weight: 600;">
                  Stay with us and save 30% on your next 3 months!
                </p>
                <p style="color: #059669; font-size: 14px; margin: 15px 0 0;">
                  Use code: <strong>SAVE30</strong>
                </p>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Or if you prefer, you can <strong>pause your account</strong> for 30 days instead of canceling. No questions asked.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://churn-guard-app.vercel.app/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); margin: 0 10px 10px 0;">
                  Claim 30% Off →
                </a>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                  <strong>Need help?</strong> Reply to this email and our team will assist you with payment options or account recovery within 24 hours.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2026 ChurnGuard. All rights reserved.<br>
                This offer expires in 7 days. Terms apply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  })
};