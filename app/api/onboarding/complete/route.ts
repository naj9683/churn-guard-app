import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// No-op endpoint — onboarding completion is now determined by user record existence.
// Kept so completeOnboarding() in the UI doesn't hit a 404.
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ ok: true });
}
