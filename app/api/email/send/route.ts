import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Settings cache
const settingsCache: any = {};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { customerEmail, template, metadata } = body;

    if (!customerEmail) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        error: "Email not configured", 
        message: "Add RESEND_API_KEY to GitHub Secrets" 
      }, { status: 500 });
    }

    // Get user's white-label settings
    const settings = settingsCache[user.id] || {
      companyName: 'Your Company',
      logoUrl: '',
      brandColor: '#6366f1',
      fromEmail: 'onboarding@resend.dev',
      emailSignature: 'Best regards,\nThe Team'
    };

    // Generate branded email
    const emailHtml = generateBrandedEmail(settings, customerEmail);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: settings.fromEmail || 'onboarding@resend.dev',
        to: customerEmail,
        subject: `We miss you! Here's a special offer from ${settings.companyName} 🎁`,
        html: emailHtml
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const result = await response.json();

    return NextResponse.json({ success: true, id: result.id });

  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function generateBrandedEmail(settings: any, customerEmail: string) {
  const { companyName, logoUrl, brandColor, emailSignature } = settings;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We Miss You - ${companyName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header with Brand Color -->
              <tr>
                <td style="background: ${brandColor}; padding: 40px 40px 30px 40px; text-align: center;">
                  ${logoUrl ? 
                    `<img src="${logoUrl}" alt="${companyName}" style="max-height: 60px; max-width: 200px;" />` : 
                    `<h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">${companyName}</h1>`
                  }
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">We miss you! 💙</h2>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Hi there,
                  </p>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    We noticed you haven't been active lately, and we wanted to reach out personally. Your success matters to us at ${companyName}, and we're here to help you get the most out of our platform.
                  </p>

                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    As a valued customer, we'd love to welcome you back with a <strong style="color: ${brandColor};">special 20% discount</strong> on your next month. This exclusive offer is our way of saying thank you for being part of the ${companyName} family.
                  </p>

                  <!-- CTA Button with Brand Color -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="https://churn-guard-app.vercel.app/pricing" style="display: inline-block; padding: 16px 40px; background: ${brandColor}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                          Claim Your 20% Off 🎉
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    This offer expires in 7 days. Don't miss out!
                  </p>
                </td>
              </tr>

              <!-- Features Section -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                  <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; text-align: center;">Why customers love us:</h3>
                  
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding: 10px; vertical-align: top;">
                        <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center;">
                          <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
                          <p style="margin: 0; color: #1f2937; font-weight: 600;">Analytics</p>
                          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Track your growth</p>
                        </div>
                      </td>
                      <td width="50%" style="padding: 10px; vertical-align: top;">
                        <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center;">
                          <div style="font-size: 32px; margin-bottom: 8px;">🚀</div>
                          <p style="margin: 0; color: #1f2937; font-weight: 600;">Automation</p>
                          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Save time daily</p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #1f2937; padding: 30px 40px; text-align: center;">
                  <p style="color: #ffffff; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">
                    ${companyName}
                  </p>
                  <p style="color: #9ca3af; font-size: 14px; margin: 0 0 15px 0; white-space: pre-line;">
                    ${emailSignature}
                  </p>
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
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
