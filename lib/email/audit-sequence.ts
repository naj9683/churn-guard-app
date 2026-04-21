const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://churnguardapp.com';
const PRICING_URL = `${APP_URL}/#pricing`;

interface AuditLeadData {
  id: string;
  email: string;
  monthlyChurnRate: number;
  revenueAtRisk: number;
  annualizedLoss: number;
  totalMrr: number;
  industryPercentile: number;
}

function shell(content: string, leadId: string): string {
  const unsubUrl = `${APP_URL}/api/audit/unsubscribe?id=${leadId}`;
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#0a0a12;">
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:580px;margin:0 auto;background:#0f172a;border-radius:14px;overflow:hidden;border:1px solid #1e293b;">
  <div style="padding:22px 28px;border-bottom:1px solid #1e293b;">
    <span style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:7px 13px;border-radius:8px;font-weight:700;font-size:15px;color:#fff;letter-spacing:-0.01em;">🛡️ ChurnGuard</span>
  </div>
  <div style="padding:28px 28px 24px;">
    ${content}
  </div>
  <div style="padding:16px 28px;border-top:1px solid #1e293b;background:#0d1424;">
    <p style="color:#334155;font-size:11px;margin:0;line-height:1.5;">
      You're receiving this because you ran a free churn audit at churnguardapp.com. &nbsp;·&nbsp;
      <a href="${unsubUrl}" style="color:#475569;text-decoration:underline;">Unsubscribe</a>
    </p>
  </div>
</div>
</body></html>`;
}

function stat(label: string, value: string, color: string): string {
  return `<div style="flex:1;background:#1e293b;border-radius:10px;padding:16px;text-align:center;border:1px solid #334155;">
    <p style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:.06em;margin:0 0 6px;">${label}</p>
    <p style="font-size:26px;font-weight:800;color:${color};margin:0;line-height:1;">${value}</p>
  </div>`;
}

function cta(text: string, url: string): string {
  return `<div style="text-align:center;margin-top:28px;">
    <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:-0.01em;">
      ${text}
    </a>
  </div>`;
}

// ── Email 1: Immediate — Audit results ───────────────────────────────────────

export function email1(lead: AuditLeadData): { subject: string; html: string } {
  const churnColor = lead.monthlyChurnRate > 5 ? '#ef4444' : lead.monthlyChurnRate > 2 ? '#f97316' : '#f59e0b';
  const bottomPct = 100 - lead.industryPercentile;
  const preventable = Math.round(lead.revenueAtRisk * 0.78);

  const content = `
    <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 6px;line-height:1.2;">Your churn audit is ready.</h1>
    <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">Here's what we found in your account.</p>

    <div style="display:flex;gap:12px;margin-bottom:24px;">
      ${stat('Monthly Churn', `${lead.monthlyChurnRate.toFixed(1)}%`, churnColor)}
      ${stat('Revenue at Risk', `$${lead.revenueAtRisk.toLocaleString()}`, '#f59e0b')}
      ${stat('Annual Loss', `$${lead.annualizedLoss.toLocaleString()}`, '#ef4444')}
    </div>

    <div style="background:#1a0505;border:1px solid #7f1d1d;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
      <p style="color:#fca5a5;font-size:14px;margin:0;line-height:1.6;">
        You're in the <strong style="color:#ef4444;">bottom ${bottomPct}%</strong> of SaaS companies by churn rate.
        At this pace, you'll lose <strong style="color:#ef4444;">$${lead.annualizedLoss.toLocaleString()}</strong> this year — just from churn.
      </p>
    </div>

    <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 8px;">Here's the part most founders miss:</p>
    <ul style="color:#94a3b8;font-size:14px;line-height:1.8;margin:0 0 20px;padding-left:20px;">
      <li><strong style="color:#e2e8f0;">~78% of this is preventable</strong> — that's $${preventable.toLocaleString()}/mo you could keep</li>
      <li>Most churn is <strong style="color:#e2e8f0;">predictable 30+ days before it happens</strong></li>
      <li>The window to intervene closes fast — <strong style="color:#e2e8f0;">silence is not a retention strategy</strong></li>
    </ul>

    <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 4px;">Want to see how ChurnGuard catches these customers before they cancel — automatically?</p>

    ${cta('See How It Works →', `${APP_URL}/#features`)}

    <p style="color:#475569;font-size:12px;text-align:center;margin-top:16px;">Setup takes 5 minutes. No credit card required.</p>
  `;

  return {
    subject: `Your churn audit — you're losing $${lead.revenueAtRisk.toLocaleString()}/month`,
    html: shell(content, lead.id),
  };
}

// ── Email 2: Day 2 — Social proof ────────────────────────────────────────────

export function email2(lead: AuditLeadData): { subject: string; html: string } {
  const content = `
    <p style="color:#94a3b8;font-size:13px;margin:0 0 16px;">Following up on your churn audit from 2 days ago.</p>
    <h1 style="color:#fff;font-size:21px;font-weight:800;margin:0 0 20px;line-height:1.3;">How one founder stopped losing $4,200/month to churn in 60 days</h1>

    <div style="background:#1e293b;border-left:3px solid #6366f1;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:20px;">
      <p style="color:#e2e8f0;font-size:14px;line-height:1.7;margin:0;">
        "We were bleeding ~$4K/month and didn't even know which customers were at risk. We installed ChurnGuard, connected our Stripe account, and within a week we had a list of the 8 highest-risk customers.
        <strong style="color:#a5b4fc;"> We reached out to 6 of them. 5 stayed.</strong> That's $3,400/month saved from one afternoon of outreach."
      </p>
      <p style="color:#6366f1;font-size:13px;font-weight:600;margin:12px 0 0;">— Founder, B2B SaaS · $180K ARR</p>
    </div>

    <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 16px;">
      The playbook is simple:
    </p>
    <ol style="color:#94a3b8;font-size:14px;line-height:1.8;margin:0 0 20px;padding-left:20px;">
      <li>Connect Stripe (one JS snippet or API key)</li>
      <li>ChurnGuard scores every customer by churn risk — daily</li>
      <li>When a customer hits 70%+ risk, you get an alert with a suggested action</li>
      <li>Intervene before they cancel, not after</li>
    </ol>

    <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 4px;">
      You already know your numbers from the audit. The question is: what are you doing about them?
    </p>

    ${cta('Start Your 14-Day Free Trial →', PRICING_URL)}

    <p style="color:#475569;font-size:12px;text-align:center;margin-top:16px;">No credit card. Cancel anytime.</p>
  `;

  return {
    subject: `How [a founder like you] stopped losing $4K/month to churn`,
    html: shell(content, lead.id),
  };
}

// ── Email 3: Day 5 — Urgency + math ─────────────────────────────────────────

export function email3(lead: AuditLeadData): { subject: string; html: string } {
  const dailyCost   = Math.round(lead.annualizedLoss / 365);
  const weeklyCost  = dailyCost * 7;

  const content = `
    <p style="color:#94a3b8;font-size:13px;margin:0 0 16px;">Since your audit 5 days ago, here's what's happened:</p>
    <h1 style="color:#fff;font-size:21px;font-weight:800;margin:0 0 20px;line-height:1.3;">
      That $${lead.revenueAtRisk.toLocaleString()}/month loss compounds to $${lead.annualizedLoss.toLocaleString()} this year.
    </h1>

    <div style="background:#1a0505;border:1px solid #7f1d1d;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr style="border-bottom:1px solid #3f1a1a;">
          <td style="padding:10px 0;color:#94a3b8;font-size:13px;">Every day you wait</td>
          <td style="padding:10px 0;color:#ef4444;font-weight:700;font-size:15px;text-align:right;">−$${dailyCost.toLocaleString()}</td>
        </tr>
        <tr style="border-bottom:1px solid #3f1a1a;">
          <td style="padding:10px 0;color:#94a3b8;font-size:13px;">Every week you wait</td>
          <td style="padding:10px 0;color:#ef4444;font-weight:700;font-size:15px;text-align:right;">−$${weeklyCost.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#94a3b8;font-size:13px;">This year, if nothing changes</td>
          <td style="padding:10px 0;color:#ef4444;font-weight:700;font-size:17px;text-align:right;">−$${lead.annualizedLoss.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 16px;">
      I know it feels easier to deal with this "later." But churn doesn't wait, and every customer that slips away quietly is one you'll never get back.
    </p>

    <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px;">
      ChurnGuard flags at-risk customers before they decide to leave. One email to the right customer at the right time is often all it takes.
    </p>

    ${cta('Activate ChurnGuard — 30 Days Free, No CC →', PRICING_URL)}

    <p style="color:#475569;font-size:12px;text-align:center;margin-top:16px;">Takes 5 minutes to set up. First at-risk alerts appear within hours.</p>
  `;

  return {
    subject: `That $${lead.revenueAtRisk.toLocaleString()}/month is costing you $${lead.annualizedLoss.toLocaleString()}/year`,
    html: shell(content, lead.id),
  };
}

// ── Email 4: Day 7 — Last call ───────────────────────────────────────────────

export function email4(lead: AuditLeadData): { subject: string; html: string } {
  const content = `
    <p style="color:#94a3b8;font-size:13px;margin:0 0 16px;">This is my last email about your audit.</p>
    <h1 style="color:#fff;font-size:21px;font-weight:800;margin:0 0 16px;line-height:1.3;">
      Last call — your audit data will be deleted in 24 hours.
    </h1>

    <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 16px;">
      We automatically delete audit data after 7 days for privacy. After tonight, your churn report and at-risk customer list will be gone.
    </p>

    <div style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
      <p style="color:#94a3b8;font-size:13px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.05em;font-weight:600;">What you found in your audit</p>
      <p style="color:#e2e8f0;font-size:14px;margin:0;line-height:1.7;">
        📊 Monthly churn: <strong style="color:#f97316;">${lead.monthlyChurnRate.toFixed(1)}%</strong><br/>
        ⚠️ Revenue at risk: <strong style="color:#f59e0b;">$${lead.revenueAtRisk.toLocaleString()}/mo</strong><br/>
        📉 Annual loss projection: <strong style="color:#ef4444;">$${lead.annualizedLoss.toLocaleString()}</strong>
      </p>
    </div>

    <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 8px;">
      I'm offering a few beta spots this month — <strong style="color:#a5b4fc;">full access, 30 days free, no credit card</strong>. If you're serious about fixing your churn, now is the time.
    </p>
    <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px;">
      Or just reply <strong style="color:#fff;">YES</strong> and I'll send your access link directly.
    </p>

    ${cta('Claim Your Beta Spot →', PRICING_URL)}

    <p style="color:#475569;font-size:12px;text-align:center;margin-top:16px;">After this email I'll stop following up. No hard feelings either way.</p>
  `;

  return {
    subject: `Last call — your audit expires in 24 hours`,
    html: shell(content, lead.id),
  };
}

// ── Step dispatcher ──────────────────────────────────────────────────────────

export function getEmailForStep(step: number, lead: AuditLeadData): { subject: string; html: string } | null {
  switch (step) {
    case 1: return email1(lead);
    case 2: return email2(lead);
    case 3: return email3(lead);
    case 4: return email4(lead);
    default: return null;
  }
}

// Days until next email after sending the given step
export function daysUntilNextEmail(step: number): number | null {
  switch (step) {
    case 1: return 2; // send email 2 in 2 days
    case 2: return 3; // send email 3 in 3 days (day 5 total)
    case 3: return 2; // send email 4 in 2 days (day 7 total)
    default: return null; // sequence complete
  }
}
