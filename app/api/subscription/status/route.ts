import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;

    // Admin email bypass — always grant full access
    if (email === ADMIN_EMAIL) {
      return NextResponse.json({ hasAccess: true, isAdmin: true });
    }

    // Check for active subscription in DB
    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          take: 1,
        },
      },
    });

    const hasAccess = !!(user && user.subscriptions.length > 0);

    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json({ hasAccess: false }, { status: 500 });
  }
}
