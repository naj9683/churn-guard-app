import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = 'najwa.saadi1@hotmail.com';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Admin email bypasses all onboarding requirements
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    if (email === ADMIN_EMAIL) {
      return NextResponse.json({ onboardingComplete: true, stripe: true, slack: true, firstCustomer: true, isAdmin: true });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId: userId },
      include: {
        customers: { take: 1 },
      },
    });

    if (!user) {
      return NextResponse.json({ onboardingComplete: false, stripe: false, slack: false, firstCustomer: false });
    }

    const stripe = !!user.stripeCustomerId;
    const slack = !!user.slackWebhookUrl;
    const firstCustomer = user.customers.length > 0;
    const onboardingComplete = stripe && slack && firstCustomer;

    return NextResponse.json({ onboardingComplete, stripe, slack, firstCustomer });
  } catch (error) {
    console.error("Onboarding status error:", error);
    return NextResponse.json({ onboardingComplete: false, stripe: false, slack: false, firstCustomer: false });
  }
}
