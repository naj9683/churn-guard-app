import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get or create settings
    let settings = await prisma.userSettings.findUnique({
      where: { userId: user.id }
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          companyName: 'Your Company',
          logoUrl: '',
          brandColor: '#6366f1',
          fromEmail: 'noreply@yourcompany.com',
          emailSignature: 'Best regards,\nThe Team'
        }
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { companyName, logoUrl, brandColor, fromEmail, emailSignature } = body;

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        companyName: companyName || 'Your Company',
        logoUrl: logoUrl || '',
        brandColor: brandColor || '#6366f1',
        fromEmail: fromEmail || 'noreply@yourcompany.com',
        emailSignature: emailSignature || 'Best regards,\nThe Team'
      },
      create: {
        userId: user.id,
        companyName: companyName || 'Your Company',
        logoUrl: logoUrl || '',
        brandColor: brandColor || '#6366f1',
        fromEmail: fromEmail || 'noreply@yourcompany.com',
        emailSignature: emailSignature || 'Best regards,\nThe Team'
      }
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
