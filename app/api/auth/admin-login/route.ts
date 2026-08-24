import { clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';

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
    const { data: users } = await client.users.getUserList({ emailAddress: [ADMIN_EMAIL] });
    const adminUser = users[0];
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found in Clerk' }, { status: 404 });
    }
    const { token } = await client.signInTokens.createSignInToken({
      userId: adminUser.id,
      expiresInSeconds: 120,
    });
    return NextResponse.json({ ticket: token });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: error.message ?? 'Failed to create token' }, { status: 500 });
  }
}
