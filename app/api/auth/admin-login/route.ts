import { clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';
const ADMIN_CLERK_USER_ID = 'user_3AP7xokH0oin2NoqgK37ER9Y4su';

/**
 * POST /api/auth/admin-login
 * Creates a Clerk sign-in token for the admin user, bypassing password.
 * Only works for the hardcoded admin email.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string = body.email ?? '';

  if (!email || email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const client = await clerkClient();
    const { token } = await client.signInTokens.createSignInToken({
      userId: ADMIN_CLERK_USER_ID,
      expiresInSeconds: 120,
    });
    return NextResponse.json({ ticket: token });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: error.message ?? 'Failed to create token' }, { status: 500 });
  }
}
