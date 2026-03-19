import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const playbook = await prisma.playbook.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!playbook) return NextResponse.json({ error: "Playbook not found" }, { status: 404 });

    // Parse trigger string (e.g. "risk_score>=70") into form fields
    const triggerMatch = playbook.trigger?.match(/^([a-z_]+)[<>!=]+(\d+)$/);
    const triggerType = triggerMatch?.[1] ?? playbook.trigger ?? 'risk_score';
    const triggerValue = triggerMatch?.[2] ?? '70';

    const actions = playbook.actions as any;
    const actionType = actions?.type ?? 'slack_alert';

    return NextResponse.json({
      ...playbook,
      triggerType,
      triggerValue,
      actionType,
    });
  } catch (error) {
    console.error("Error fetching playbook:", error);
    return NextResponse.json({ error: "Failed to fetch playbook" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { name, description, triggerType, triggerValue, actionType, isActive } = body;

    // Map form fields to Prisma model fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (triggerType !== undefined) {
      updateData.trigger = triggerValue !== undefined
        ? `${triggerType}>=${triggerValue}`
        : triggerType;
    }
    if (actionType !== undefined) {
      updateData.actions = { type: actionType };
    }

    const playbook = await prisma.playbook.update({
      where: { id: params.id, userId: user.id },
      data: updateData,
    });

    return NextResponse.json({ playbook });
  } catch (error) {
    console.error("Error updating playbook:", error);
    return NextResponse.json({ error: "Failed to update playbook" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.playbook.delete({
      where: { id: params.id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting playbook:", error);
    return NextResponse.json({ error: "Failed to delete playbook" }, { status: 500 });
  }
}
