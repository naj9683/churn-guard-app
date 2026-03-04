import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get email from Clerk session
    const { sessionClaims } = await auth();
    const email = sessionClaims?.email as string;

    // Try to find user by ID first, then by email
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customers: true,
        playbooks: true
      }
    });

    // If not found by ID, try by email
    if (!user && email) {
      user = await prisma.user.findFirst({
        where: { email: email },
        include: {
          customers: true,
          playbooks: true
        }
      });
    }

    // If still not found, try the test email from your old code
    if (!user) {
      user = await prisma.user.findFirst({
        where: { email: 'test@example.com' },
        include: {
          customers: true,
          playbooks: true
        }
      });
    }

    if (!user) {
      return NextResponse.json({ 
        customers: [], 
        playbooks: [],
        stats: {
          totalCustomers: 0,
          atRisk: 0,
          activePlaybooks: 0,
          monthlyRevenue: 0
        }
      });
    }

    // Calculate stats
    const totalCustomers = user.customers?.length || 0;
    const atRisk = user.customers?.filter((c: any) => c.riskScore > 50).length || 0;
    const activePlaybooks = user.playbooks?.filter((p: any) => p.active).length || 0;
    const monthlyRevenue = user.customers?.reduce((sum: number, c: any) => sum + (c.mrr || 0), 0) || 0;

    return NextResponse.json({
      customers: user.customers || [],
      playbooks: user.playbooks || [],
      stats: {
        totalCustomers,
        atRisk,
        activePlaybooks,
        monthlyRevenue
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ 
      error: "Failed to load dashboard data",
      customers: [],
      playbooks: [],
      stats: {
        totalCustomers: 0,
        atRisk: 0,
        activePlaybooks: 0,
        monthlyRevenue: 0
      }
    }, { status: 500 });
  }
}