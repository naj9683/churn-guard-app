import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// In-memory cache for settings (will reset on deploy, but works for now)
const settingsCache: any = {};

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Return cached settings or defaults
    const settings = settingsCache[user.id] || {
      companyName: 'Your Company',
      logoUrl: '',
      brandColor: '#6366f1',
      fromEmail: 'noreply@yourcompany.com',
      emailSignature: 'Best regards,\nThe Team'
    };

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

    // Save to cache
    settingsCache[user.id] = {
      companyName: companyName || 'Your Company',
      logoUrl: logoUrl || '',
      brandColor: brandColor || '#6366f1',
      fromEmail: fromEmail || 'noreply@yourcompany.com',
      emailSignature: emailSignature || 'Best regards,\nThe Team'
    };

    return NextResponse.json({ success: true, settings: settingsCache[user.id] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
