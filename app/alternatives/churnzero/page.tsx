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
      name: 'Is ChurnZero pricing public?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. ChurnZero does not publish pricing. It is sold through a sales process with annual contracts, typically starting in the mid-five-figures per year. As of August 2026 no public pricing page exists.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can ChurnGuard replace ChurnZero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For teams with a dedicated CS department, probably not — ChurnZero is built for that workflow. For founder-led teams without a CS hire, ChurnGuard covers the core use case (identifying at-risk customers and triggering retention actions) without the overhead.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does ChurnGuard actually do when a customer is at risk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ChurnGuard monitors Stripe billing signals and usage patterns to score every customer daily. When a customer crosses a risk threshold you set, it can alert you, trigger an email sequence, or pause a cancellation flow — depending on which playbook is active.',
      },
    },
  ],
};

const tableRows = [
  { label: 'Built for',      cz: 'CS teams managing accounts manually',        cg: 'Founders and small teams without a CS hire' },
  { label: 'Pricing',        cz: 'Custom quote, annual contract (no public pricing)', cg: 'Transparent monthly pricing, free tier available' },
  { label: 'Free trial',     cz: 'No',                                          cg: 'Yes — free audit + free tier' },
  { label: 'Setup',          cz: 'Onboarding takes weeks; requires CS ops configuration', cg: 'Connect Stripe; first alerts within hours' },
  { label: 'What it does',   cz: 'Health scores, playbooks, QBR tracking, CS team workflows', cg: 'Automated risk scoring, retention email sequences, billing recovery' },
  { label: 'Who operates it',cz: 'Customer success managers',                   cg: 'Runs automatically; you review alerts and approve actions' },
  { label: 'Contract',       cz: 'Annual',                                       cg: 'Monthly, cancel anytime' },
];

export default function ChurnZeroPage() {
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
          <span style={{ color: DK_MUTED }}>ChurnZero</span>
        </p>

        {/* Hero */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 800, color: DK_TEXT, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            ChurnGuard vs ChurnZero
          </h1>
          <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 20px' }}>
            ChurnZero is a mature customer success platform built for dedicated CS teams. ChurnGuard is automated churn prevention built for SaaS founders who don't have one. These tools serve different problems.
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
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: DK_MUTED, fontWeight: 600, fontSize: '13px', width: '37%' }}>ChurnZero</th>
                  <th style={{ textAlign: 'left', padding: '10px 0 10px 16px', color: DK_ACCENT, fontWeight: 600, fontSize: '13px', width: '37%' }}>ChurnGuard</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${DK_BORDER}` }}>
                    <td style={{ padding: '14px 16px 14px 0', color: DK_FAINT, fontWeight: 500, verticalAlign: 'top' }}>{row.label}</td>
                    <td style={{ padding: '14px 16px', color: DK_MUTED, verticalAlign: 'top', lineHeight: 1.5 }}>{row.cz}</td>
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
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: DK_FAINT, marginBottom: '14px' }}>Choose ChurnZero if…</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'You have at least one dedicated customer success manager',
                'You manage high-touch B2B accounts that need manual QBR workflows',
                'Your ARR supports a five-figure annual software budget',
                'You need deep CRM integrations and CS team collaboration features',
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
                'You are a founder or small team without a CS hire',
                'You want automated risk scoring that runs without daily management',
                'You need setup in minutes, not weeks',
                'You want transparent monthly pricing with no annual commitment',
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
            If you have a CS team and manage high-touch accounts, ChurnZero is a serious tool worth evaluating. If you are a founder wearing every hat, ChurnZero will cost you a large annual fee and require CS ops work you don't have time for. ChurnGuard is built for that second scenario.
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
            See what ChurnGuard would catch in your account
          </h2>
          <p style={{ fontSize: '14px', color: DK_MUTED, lineHeight: 1.65, margin: '0 0 24px' }}>
            Free audit, no card. See your at-risk revenue in minutes.
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
