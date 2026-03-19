import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { enrollInSequence } from "@/lib/sequences";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const customers = await prisma.customer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        externalId: true,
        name: true,
        email: true,
        riskScore: true,
        mrr: true,
        arr: true,
        plan: true,
        createdAt: true
      }
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${userId}@unknown.com`;

    // Ensure user exists in DB
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId, email },
    });

    const body = await req.json();
    const { name, email: customerEmail, riskScore, mrr } = body;

    if (!customerEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        userId: user.id,
        externalId: `manual_${Date.now()}`,
        name: name || null,
        email: customerEmail,
        riskScore: parseInt(riskScore) || 50,
        mrr: parseInt(mrr) || 0,
      },
    });

    // Enroll new customer in the welcome sequence
    await enrollInSequence(user.id, customer.id, 'welcome');

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
