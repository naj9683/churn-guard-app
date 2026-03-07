import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by Clerk ID (we need to match clerkId)
    let user = await prisma.user.findFirst({
      where: { email: userId } // Temporary workaround - should use clerkId field
    });

    if (!user) {
      // Try to find by email from Clerk session
      // For now, create if not exists
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If no API key exists, generate one
    if (!user.apiKey) {
      const newApiKey = `cg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      user = await prisma.user.update({
        where: { id: user.id },
        data: { apiKey: newApiKey }
      });
    }

    return NextResponse.json({ apiKey: user.apiKey });
  } catch (error) {
    console.error("Error fetching API key:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
