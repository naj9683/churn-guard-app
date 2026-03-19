import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const check = await requireAdmin();
  if ('error' in check) return check.error;

  // Recent activity logs as security events
  const recentActivity = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, type: true, description: true, createdAt: true, userId: true, customerId: true }
  });

  // User count with API keys
  const usersWithKeys = await prisma.user.count({ where: { apiKey: { not: null } } });
  const totalUsers = await prisma.user.count();

  return NextResponse.json({
    stats: {
      totalUsers,
      usersWithApiKeys: usersWithKeys,
      activeWebhooks: await prisma.webhook.count({ where: { active: true } }),
    },
    recentActivity,
    policies: {
      twoFactorEnforced: false,
      sessionTimeout: 24,
      maxLoginAttempts: 10,
      ipWhitelistEnabled: false,
    }
  });
}
