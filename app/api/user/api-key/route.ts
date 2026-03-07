import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by Clerk ID or create if not exists
    let user = await prisma.user.findFirst({
      where: { clerkId: userId }
    });

    // If no user found by clerkId, try finding by email (fallback)
    if (!user) {
      // Get user email from Clerk (you might need @clerk/nextjs client here)
      // For now, create user with clerkId
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `user_${userId}@temp.com`, // Temporary - should get real email
          apiKey: `cg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
        }
      });
    }

    // If user exists but no API key, generate one
    if (user && !user.apiKey) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { 
          apiKey: `cg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
        }
      });
    }

    return NextResponse.json({ apiKey: user?.apiKey || "error" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to get API key" }, { status: 500 });
  }
}
