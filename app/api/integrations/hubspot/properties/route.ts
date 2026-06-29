import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getValidHubSpotToken, ensureCustomProperties } from '@/lib/crm/hubspot';

// POST /api/integrations/hubspot/properties — force-create ChurnGuard custom properties
export async function POST() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findFirst({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  try {
    const token = await getValidHubSpotToken(user.id);
    const { available, errors } = await ensureCustomProperties(token);
    return NextResponse.json({
      created: Array.from(available),
      errors,
      success: errors.length === 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
