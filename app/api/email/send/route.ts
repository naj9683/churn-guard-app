import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Settings cache (same as settings API)
const settingsCache: any = {};

const templates: Record<string, (settings: any, customerName: string) => { subject: string; html: string }> = {
  welcome: (settings, name) => ({
    subject: `Welcome to ${settings.companyName}! 🎉`,
    html: generateEmail(settings, name, 'welcome', {
      title: 'Welcome Aboard!',
      body: `Hi ${name},<br><br>Welcome to ${settings.companyName}! We're excited to help you reduce churn and grow your business.<br><br>Here's what you can do next:`,
      cta: 'Get Started',
      ctaLink: 'https://churn-guard-app.vercel.app/dashboard'
    })
  }),
  
  churnRisk: (settings, name) => ({
    subject: `Action needed: Your account needs attention ⚠️`,
    html: generateEmail(settings, name, 'churnRisk', {
      title: 'We noticed you might be struggling',
      body: `Hi ${name},<br><br>We've noticed some signals that you might not be getting the full value from ${settings.companyName}. We want to help.<br><br>Let's schedule a quick call to get you back on track:`,
      cta: 'Schedule Call',
      ctaLink: 'https://calendly.com/your-company'
    })
  }),
  
  winBack: (settings, name) => ({
    subject: `We miss you! Here's 20% off 🎁`,
    html: generateEmail(settings, name, 'winBack', {
      title: 'We miss you! 💙',
      body: `Hi ${name},<br><br>We noticed you haven't been active lately. Your success matters to us at ${settings.companyName}.<br><br>Come back with a <strong style="color: ${settings.brandColor};">special 20% discount</strong>:`,
      cta: 'Claim 20% Off',
      ctaLink: 'https://churn-guard-app.vercel.app/pricing'
    })
  }),
  
  checkIn: (settings, name) => ({
    subject: `Quick check-in from ${settings.companyName}`,
    html: generateEmail(settings, name, 'checkIn', {
      title: 'How are things going?',
      body: `Hi ${name},<br><br>Just checking in to see how you're doing with ${settings.companyName}. Any questions or feedback?`,
      cta: 'Reply to this email',
      ctaLink: `mailto:${settings.fromEmail}`
    })
  })
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { customerEmail, template = 'winBack', customerName = 'there' } = body;

    if (!customerEmail) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        error: "Email not configured",
        message: "Add RESEND_API_KEY to environment variables"
      }, { status: 500 });
    }

    // ✅ FETCH WHITE-LABEL SETTINGS (from cache)
    const settings = settingsCache[user.id] || {
      companyName: 'ChurnGuard',  // Default fallback
      brandColor: '#6366f1',
      fromEmail: 'onboarding@resend.dev',
      logoUrl: '',
      emailSignature: 'Best regards,\nThe Team'
    };

    // Get template
    const emailTemplate = templates[template];
    if (!emailTemplate) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }

    const { subject, html } = emailTemplate(settings, customerName);

    // Send email via Resend WITH USER'S FROM EMAIL
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: settings.fromEmail,  // ✅ User's white-label from email
        to: customerEmail,
        subject,
        html
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const result = await response.json();

    console.log(`✅ Email sent: ${template} to ${customerEmail} from ${settings.companyName}`);

    return NextResponse.json({ 
      success: true, 
      id: result.id,
      template,
      to: customerEmail,
      from: settings.fromEmail,
      company: settings.companyName
    });

  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PATCH endpoint to update settings cache (called by settings page)
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    settingsCache[user.id] = {
      ...settingsCache[user.id],
      ...body
    };

    return NextResponse.json({ success: true, settings: settingsCache[user.id] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function generateEmail(settings: any, customerName: string, type: string, content: any) {
  const { companyName, brandColor, logoUrl, emailSignature } = settings;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${content.title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header with Logo -->
              <tr>
                <td style="background: ${brandColor}; padding: 40px; text-align: center;">
                  ${logoUrl ? 
                    `<img src="${logoUrl}" alt="${companyName}" style="max-height: 60px; max-width: 200px;" />` :
                    `<h1 style="color: #ffffff; margin: 0; font-size: 28px;">${companyName}</h1>`
                  }
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">${content.title}</h2>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    ${content.body}
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${content.ctaLink}" style="display: inline-block; padding: 16px 40px; background: ${brandColor}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                          ${content.cta}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer with Signature -->
              <tr>
                <td style="background-color: #1f2937; padding: 30px; text-align: center;">
                  <p style="color: #ffffff; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">
                    ${companyName}
                  </p>
                  <p style="color: #9ca3af; font-size: 14px; margin: 0; white-space: pre-line;">
                    ${emailSignature}
                  </p>
                  <p style="color: #6b7280; font-size: 12px; margin: 15px 0 0 0;">
                    © ${new Date().getFullYear()} ${companyName}. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
