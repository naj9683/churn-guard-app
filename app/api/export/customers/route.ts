import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const customers = await prisma.customer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    // Generate CSV
    const headers = ['ID', 'External ID', 'Email', 'Name', 'MRR', 'ARR', 'Risk Score', 'Health Score', 'Plan', 'CRM ID', 'Created At', 'Updated At'];
    const rows = customers.map(c => [
      c.id,
      c.externalId || '',
      c.email || '',
      c.name || '',
      c.mrr || 0,
      c.arr || 0,
      c.riskScore || 0,
      c.healthScore || '',
      c.plan || '',
      c.crmId || '',
      new Date(c.createdAt).toISOString(),
      new Date(c.updatedAt).toISOString()
    ]);

    // Escape CSV values
    const escapeCSV = (val: any) => {
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="customers-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
