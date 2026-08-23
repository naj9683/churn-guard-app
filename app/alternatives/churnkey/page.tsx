import DarkShell from '@/app/components/ui/DarkShell';

const DK_CARD       = '#0f172a';
const DK_TEXT       = '#f1f5f9';
const DK_MUTED      = '#94a3b8';
const DK_FAINT      = '#64748b';
const DK_ACCENT     = '#6366f1';
const DK_BORDER     = '#1e293b';
const DK_BORDER_MED = '#334155';
const AMBER         = '#d97706';
const AMBER_BG      = 'rgba(217,119,6,0.1)';
const AMBER_BR      = 'rgba(217,119,6,0.3)';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does ChurnGuard have cancel flows like Churnkey?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ChurnGuard does not build cancel flows. It focuses on the earlier stage — identifying at-risk customers before they reach the cancel button and triggering retention outreach at that point. The two tools address adjacent but distinct moments in the churn lifecycle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which is cheaper — Churnkey or ChurnGuard?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both tools offer entry-level plans. Churnkey pricing is based on the revenue you recover through cancel flows. ChurnGuard pricing is based on the number of customers monitored. The better comparison is which problem costs you more — customers who reach the cancel button, or customers who silently disengage before that.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use both Churnkey and ChurnGuard?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — they operate at different points. Churnkey works at the cancellation moment. ChurnGuard works in the weeks before. Some teams run both: ChurnGuard to reduce the number of customers who reach the cancel flow, and Churnkey to handle those who do.',
      },
    },
  ],
};

const tableRows = [
  { label: 'Core focus',   ck: 'Cancellation flows, pause offers, win-back at cancel',   cg: 'Early risk detection before the cancel decision' },
  { label: 'Also covers',  ck: 'Failed payment recovery (dunning)',                        cg: 'Billing recovery, retention email sequences' },
  { label: 'Pricing',      ck: 'Based on revenue recovered through cancel flows',          cg: 'Based on number of customers monitored' },
  { label: 'Free entry',   ck: 'Free plan with revenue cap',                               cg: 'Free audit + free tier' },
  { label: 'Setup',        ck: 'Embed cancel flow; Stripe integration',                    cg: 'Connect Stripe; no front-end changes required' },
  { label: 'Best for',     ck: 'Reducing cancellations at the cancel moment',              cg: 'Reducing churn before customers decide to cancel' },
];

export default function ChurnkeyPage() {
  return (
    <DarkShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '80px 24px 96px' }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: '13px', color: DK_FAINT, marginBottom: '24px' }}>
          <a href="/alternatives" style={{ color: DK_FAINT, textDecoration: 'none' }}>Alternatives</a>
          {' '}/{' '}
          <span style={{ color: DK_MUTED }}>Churnkey</span>
        </p>

        {/* Hero */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 800, color: DK_TEXT, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            ChurnGuard vs Churnkey
          </h1>
          <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 20px' }}>
            Churnkey is a well-built tool that works at the cancellation moment — it intercepts customers who click cancel and offers pauses, discounts, or tailored exit flows. ChurnGuard works earlier, in the weeks of disengagement before that decision is made.
          </p>
          <p style={{ fontSize: '13px', color: DK_FAINT, margin: 0 }}>Last updated: August 2026</p>
        </div>

        {/* Comparison table */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: DK_TEXT, margin: '0 0 20px' }}>Side-by-side comparison</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${DK_BORDER_MED}` }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px 10px 0', color: DK_FAINT, fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', width: '26%' }}></th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: DK_MUTED, fontWeight: 600, fontSize: '13px', width: '37%' }}>Churnkey</th>
                  <th style={{ textAlign: 'left', padding: '10px 0 10px 16px', color: DK_ACCENT, fontWeight: 600, fontSize: '13px', width: '37%' }}>ChurnGuard</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${DK_BORDER}` }}>
                    <td style={{ padding: '14px 16px 14px 0', color: DK_FAINT, fontWeight: 500, verticalAlign: 'top' }}>{row.label}</td>
                    <td style={{ padding: '14px 16px', color: DK_MUTED, verticalAlign: 'top', lineHeight: 1.5 }}>{row.ck}</td>
                    <td style={{ padding: '14px 0 14px 16px', color: DK_MUTED, verticalAlign: 'top', lineHeight: 1.5 }}>{row.cg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Choose grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          <div style={{ background: DK_CARD, border: `1px solid ${DK_BORDER}`, borderRadius: '12px', padding: '22px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: DK_FAINT, marginBottom: '14px' }}>Choose Churnkey if…</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'A significant portion of your churn happens at the cancel button',
                'You want to offer pauses or custom exit flows during cancellation',
                'You need a proven dunning / failed payment recovery solution',
                'You can embed a cancel flow into your app frontend',
              ].map((item, i) => (
                <li key={i} style={{ fontSize: '13px', color: DK_MUTED, lineHeight: 1.55, paddingLeft: '16px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: DK_FAINT }}>–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '22px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: DK_ACCENT, marginBottom: '14px' }}>Choose ChurnGuard if…</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'You want to catch at-risk customers before they ever decide to cancel',
                'You prefer proactive outreach over reactive cancel interception',
                'You want no front-end changes — just connect Stripe',
                'You need automated retention email sequences, not cancel-moment flows',
              ].map((item, i) => (
                <li key={i} style={{ fontSize: '13px', color: DK_MUTED, lineHeight: 1.55, paddingLeft: '16px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: DK_ACCENT }}>–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Honest take */}
        <div style={{ background: AMBER_BG, border: `1px solid ${AMBER_BR}`, borderRadius: '12px', padding: '20px 22px', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: AMBER, marginBottom: '10px' }}>Honest take</p>
          <p style={{ fontSize: '14px', color: DK_MUTED, lineHeight: 1.7, margin: 0 }}>
            These two tools overlap less than you'd think. Churnkey handles what happens when a customer reaches the cancel button. ChurnGuard handles the weeks before that moment. If your biggest problem is customers reaching cancel, Churnkey is worth evaluating. If your biggest problem is customers going quiet and churning without warning, that's ChurnGuard's territory. Many teams can justify both.
          </p>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: DK_TEXT, margin: '0 0 24px' }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {faqSchema.mainEntity.map((item, i) => (
              <div key={i} style={{
                borderTop: `1px solid ${DK_BORDER}`,
                padding: '20px 0',
                ...(i === faqSchema.mainEntity.length - 1 ? { borderBottom: `1px solid ${DK_BORDER}` } : {}),
              }}>
                <p style={{ fontSize: '15px', fontWeight: 600, color: DK_TEXT, margin: '0 0 8px' }}>{item.name}</p>
                <p style={{ fontSize: '14px', color: DK_MUTED, lineHeight: 1.65, margin: 0 }}>{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: DK_CARD, border: `1px solid ${DK_BORDER}`, borderRadius: '14px', padding: '40px 28px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: DK_TEXT, margin: '0 0 12px' }}>
            Find out where your churn actually happens
          </h2>
          <p style={{ fontSize: '14px', color: DK_MUTED, lineHeight: 1.65, margin: '0 0 24px' }}>
            Free Stripe audit — results in minutes, no card required.
          </p>
          <a href="/audit" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '15px',
            padding: '14px 32px',
            borderRadius: '10px',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}>
            Run the Free Churn Audit →
          </a>
        </div>

      </main>
    </DarkShell>
  );
}
