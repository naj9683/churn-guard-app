import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

// In-memory config (reset on deploy — for persistent config, add a SystemConfig model)
let config = {
  defaultRiskThreshold: 70,
  highRiskThreshold: 85,
  emailNotificationsEnabled: true,
  slackNotificationsEnabled: true,
  widgetsEnabled: true,
  maintenanceMode: false,
  maxCustomersPerUser: 10000,
  apiRateLimit: 1000,
  allowNewSignups: true,
  debugMode: false,
};

export async function GET() {
  const check = await requireAdmin();
  if ('error' in check) return check.error;
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  const check = await requireAdmin();
  if ('error' in check) return check.error;
  const body = await req.json();
  config = { ...config, ...body };
  return NextResponse.json({ success: true, config });
}
