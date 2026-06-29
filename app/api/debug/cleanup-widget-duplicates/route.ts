import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/debug/cleanup-widget-duplicates
// Keeps the newest widget message per (userId, title, content) group and
// deletes all older duplicates across every user.
export async function GET() {
  try {
    const all = await prisma.widgetMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Group by userId + title + content. Because results are newest-first,
    // the first entry in each group is the one we keep.
    const seen = new Set<string>();
    const toDelete: string[] = [];

    for (const msg of all) {
      const key = `${msg.userId}|${msg.title ?? ""}|${msg.content ?? ""}`;
      if (seen.has(key)) {
        toDelete.push(msg.id);
      } else {
        seen.add(key);
      }
    }

    if (toDelete.length === 0) {
      return NextResponse.json({ success: true, deleted: 0, message: "No duplicates found" });
    }

    const { count } = await prisma.widgetMessage.deleteMany({
      where: { id: { in: toDelete } },
    });

    return NextResponse.json({ success: true, deleted: count });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
