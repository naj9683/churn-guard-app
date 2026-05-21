import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/resend';
import {
  TRIAL_KEYS,
  TRIAL_DEFAULTS,
  renderTemplate,
  type TrialKey,
} from '@/lib/email/trial-sequence';

// GET — list all 5 templates merged with DB overrides + send stats
export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const [dbTemplates, emailLogs] = await Promise.all([
    prisma.emailTemplate.findMany({ where: { key: { in: [...TRIAL_KEYS] } } }),
    prisma.emailLog.groupBy({
      by: ['subject'],
      _count: { id: true },
      where: {
        subject: { in: TRIAL_KEYS.map(k => TRIAL_DEFAULTS[k as TrialKey].subject) },
      },
    }),
  ]);

  const dbMap = Object.fromEntries(dbTemplates.map(t => [t.key, t]));

  // Also count by looking at what subjects match our templates
  const subjectToKey = Object.fromEntries(
    TRIAL_KEYS.map(k => [TRIAL_DEFAULTS[k as TrialKey].subject, k])
  );
  const sentMap: Record<string, number> = {};
  for (const row of emailLogs) {
    const k = subjectToKey[row.subject];
    if (k) sentMap[k] = (sentMap[k] ?? 0) + row._count.id;
  }

  // Better: count by querying logs with subject prefix since subjects have variables
  const trialLogCounts = await prisma.emailLog.findMany({
    where: { subject: { contains: 'trial' } },
    select: { subject: true, status: true },
    take: 10000,
  });

  const templates = TRIAL_KEYS.map(key => {
    const defaults = TRIAL_DEFAULTS[key as TrialKey];
    const db       = dbMap[key];
    const totalSent = trialLogCounts.filter(l => l.status === 'sent').length;

    return {
      key,
      name:       db?.name       ?? defaults.name,
      subject:    db?.subject    ?? defaults.subject,
      bodyHtml:   db?.bodyHtml   ?? defaults.bodyHtml,
      isCustom:   !!db,
      isActive:   db?.isActive   ?? true,
      updatedAt:  db?.updatedAt  ?? null,
      sentCount:  sentMap[key]   ?? 0,
    };
  });

  return NextResponse.json({ templates });
}

// PATCH — upsert a single template
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await req.json();
  const { key, subject, bodyHtml, name, isActive } = body;

  if (!key || !TRIAL_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Invalid template key' }, { status: 400 });
  }

  const defaults = TRIAL_DEFAULTS[key as TrialKey];

  const template = await prisma.emailTemplate.upsert({
    where: { key },
    update: {
      subject:  subject  ?? undefined,
      bodyHtml: bodyHtml ?? undefined,
      name:     name     ?? undefined,
      isActive: isActive ?? undefined,
    },
    create: {
      key,
      name:     name     ?? defaults.name,
      subject:  subject  ?? defaults.subject,
      bodyHtml: bodyHtml ?? defaults.bodyHtml,
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json({ template });
}

// DELETE — reset a template to code default (delete DB override)
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { key } = await req.json();
  if (!key || !TRIAL_KEYS.includes(key)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  await prisma.emailTemplate.deleteMany({ where: { key } });
  return NextResponse.json({ ok: true });
}

// POST — send a test email or seed all defaults
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await req.json();

  // Seed all templates to DB
  if (body.action === 'seed') {
    const ops = TRIAL_KEYS.map(key =>
      prisma.emailTemplate.upsert({
        where: { key },
        update: {},
        create: { key, ...TRIAL_DEFAULTS[key as TrialKey] },
      })
    );
    await Promise.all(ops);
    return NextResponse.json({ ok: true, seeded: TRIAL_KEYS.length });
  }

  // Send test email
  const { key, testEmail } = body;
  if (!key || !testEmail) {
    return NextResponse.json({ error: 'key and testEmail required' }, { status: 400 });
  }

  const dbTpl   = await prisma.emailTemplate.findUnique({ where: { key } });
  const defaults = TRIAL_DEFAULTS[key as TrialKey];
  const subject  = dbTpl?.subject  ?? defaults.subject;
  const bodyHtml = dbTpl?.bodyHtml ?? defaults.bodyHtml;

  const previewVars: Record<string, string> = {
    firstName:        'Demo',
    appUrl:           process.env.NEXT_PUBLIC_APP_URL ?? 'https://churnguardapp.com',
    revenueAtRisk:    '4,200',
    annualizedLoss:   '50,400',
    recoveryEstimate: '1,470',
    stripeStatus:     'based on your connected Stripe account,',
    customers:        '42',
    playbooks:        '3',
    avgRisk:          '65',
  };

  const renderedSubject = renderTemplate(subject, previewVars);
  const renderedHtml    = renderTemplate(bodyHtml, previewVars);

  const result = await sendEmail(testEmail, `[TEST] ${renderedSubject}`, renderedHtml);

  return NextResponse.json({ ok: result.success, error: result.success ? undefined : result.errorMessage });
}
