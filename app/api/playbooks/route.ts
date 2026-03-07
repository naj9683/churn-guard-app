import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const playbooks = await prisma.playbook.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ playbooks });
  } catch (error) {
    console.error("Error fetching playbooks:", error);
    return NextResponse.json({ error: "Failed to fetch playbooks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { name, trigger, description, actions } = body;

    if (!name || !trigger) {
      return NextResponse.json({ error: "Name and trigger required" }, { status: 400 });
    }

    const playbook = await prisma.playbook.create({
      data: {
        userId: user.id,
        name,
        trigger,
        description: description || "",
        actions: actions || { type: "slack_alert" },
        isActive: true
      }
    });

    return NextResponse.json({ playbook });
  } catch (error) {
    console.error("Error creating playbook:", error);
    return NextResponse.json({ error: "Failed to create playbook" }, { status: 500 });
  }
}
