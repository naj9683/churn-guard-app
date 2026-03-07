import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const emailTemplates = {
  retention: {
    subject: "We miss you! Here's a special offer 🎁",
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">We miss you!</h2>
        <p>We noticed you haven't been active lately. Here's a <strong>20% discount</strong> to help you get back on track.</p>
        <a href="${data.offerLink}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Claim Offer</a>
      </div>
    `
  }
};

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

    const selectedTemplate = emailTemplates[template as keyof typeof emailTemplates] || emailTemplates.retention;
    
    // Send via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ChurnGuard <noreply@churnguard.app>',
        to: customerEmail,
        subject: selectedTemplate.subject,
        html: selectedTemplate.html({
          offerLink: metadata?.offerLink || 'https://churn-guard-app.vercel.app'
        })
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();

    return NextResponse.json({ success: true, id: result.id });

  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
