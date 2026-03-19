import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER_ID = 'user_3AP7xokH0oin2NoqgK37ER9Y4su';
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || 'your-secret-key-123';

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();

    if (!key || key !== ADMIN_ACCESS_KEY) {
      return NextResponse.json({ error: "Invalid key" }, { status: 403 });
    }

    const client = await clerkClient();
    const { token } = await client.signInTokens.createSignInToken({
      userId: ADMIN_USER_ID,
      expiresInSeconds: 120,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Admin token error:", error);
    return NextResponse.json({ error: "Failed to create token" }, { status: 500 });
  }
}
