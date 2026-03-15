import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - List audit logs
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type');

    let whereClause: any = { userId: user.id };
    if (type) whereClause.type = type;

    const logs = await prisma.activityLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        customer: {
          select: { name: true, email: true }
        }
      }
    });

    const formattedLogs = logs.map((log: any) => ({
      id: log.id,
      type: log.type,
      description: log.description,
      customerName: log.customer?.name || 'Unknown',
      customerEmail: log.customer?.email || '',
      createdAt: log.createdAt,
      formattedDate: new Date(log.createdAt).toLocaleString()
    }));

    return NextResponse.json({ logs: formattedLogs });
  } catch (error) {
    console.error('Audit logs fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

// POST - Create audit log entry
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { customerId, type, description } = body;

    if (!customerId || !type || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const log = await prisma.activityLog.create({
      data: {
        userId: user.id,
        customerId,
        type,
        description,
        createdAt: new Date()
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error('Audit log creation error:', error);
    return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 });
  }
}
