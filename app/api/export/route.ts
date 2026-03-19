import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const escapeCSV = (val: any) => {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

function makeCSV(headers: string[], rows: any[][]): NextResponse {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="export-${new Date().toISOString().split('T')[0]}.csv"`
    }
  });
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'customers';
    const format = searchParams.get('format') || 'csv'; // 'csv' or 'json'

    if (type === 'customers') {
      const customers = await prisma.customer.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });
      const headers = ['ID', 'External ID', 'Email', 'Name', 'MRR', 'ARR', 'Risk Score', 'Health Score', 'Plan', 'CRM ID', 'Created At', 'Updated At'];
      const rows = customers.map(c => [
        c.id, c.externalId || '', c.email || '', c.name || '',
        c.mrr || 0, c.arr || 0, c.riskScore || 0, c.healthScore || '',
        c.plan || '', c.crmId || '',
        new Date(c.createdAt).toISOString(), new Date(c.updatedAt).toISOString()
      ]);
      if (format === 'json') return NextResponse.json({ headers, rows, title: 'Customers Report', count: rows.length });
      return makeCSV(headers, rows);
    }

    if (type === 'interventions') {
      const interventions = await prisma.interventionOutcome.findMany({
        where: { userId: user.id },
        orderBy: { startedAt: 'desc' },
        include: { customer: { select: { name: true, email: true } } }
      });
      const headers = ['ID', 'Customer Name', 'Customer Email', 'Type', 'Status', 'MRR At Risk', 'MRR Saved', 'Started At', 'Completed At'];
      const rows = interventions.map((i: any) => [
        i.id, i.customer?.name || '', i.customer?.email || '',
        i.interventionType || '', i.status || '',
        i.mrrAtRisk || 0, i.mrrSaved || 0,
        new Date(i.startedAt).toISOString(),
        i.completedAt ? new Date(i.completedAt).toISOString() : ''
      ]);
      if (format === 'json') return NextResponse.json({ headers, rows, title: 'Interventions Report', count: rows.length });
      return makeCSV(headers, rows);
    }

    if (type === 'analytics') {
      const customers = await prisma.customer.findMany({
        where: { userId: user.id }
      });
      const total = customers.length;
      const highRisk = customers.filter(c => c.riskScore >= 70).length;
      const medRisk = customers.filter(c => c.riskScore >= 40 && c.riskScore < 70).length;
      const lowRisk = customers.filter(c => c.riskScore < 40).length;
      const totalMRR = customers.reduce((s, c) => s + (c.mrr || 0), 0);
      const atRiskMRR = customers.filter(c => c.riskScore >= 70).reduce((s, c) => s + (c.mrr || 0), 0);
      const headers = ['Metric', 'Value'];
      const rows = [
        ['Total Customers', total],
        ['High Risk Customers', highRisk],
        ['Medium Risk Customers', medRisk],
        ['Low Risk Customers', lowRisk],
        ['Total MRR', `$${totalMRR.toLocaleString()}`],
        ['At-Risk MRR', `$${atRiskMRR.toLocaleString()}`],
        ['Export Date', new Date().toISOString()]
      ];
      if (format === 'json') return NextResponse.json({ headers, rows, title: 'Analytics Report', count: rows.length });
      return makeCSV(headers, rows);
    }

    if (type === 'revenue') {
      const customers = await prisma.customer.findMany({
        where: { userId: user.id },
        orderBy: { riskScore: 'desc' }
      });
      const headers = ['ID', 'Name', 'Email', 'MRR', 'ARR', 'Risk Score', 'Health Score', 'Plan', 'Status'];
      const rows = customers.map(c => [
        c.id, c.name || '', c.email || '',
        c.mrr || 0, c.arr || 0, c.riskScore || 0, c.healthScore || '',
        c.plan || '', c.riskScore >= 70 ? 'At Risk' : c.riskScore >= 40 ? 'Watch' : 'Healthy'
      ]);
      if (format === 'json') return NextResponse.json({ headers, rows, title: 'Revenue Impact Report', count: rows.length });
      return makeCSV(headers, rows);
    }

    return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
