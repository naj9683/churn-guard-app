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
      name: 'Is Vitally worth it for a small team?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "If you have (or are hiring) a CSM, it can be — that's who it's built for. If nobody owns customer success day to day, a productivity tool for that role won't get used, which is why its value shows up only with an operator.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can ChurnGuard do what a CSM does?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The first 20% — the part that matters most for small SaaS: watching every customer for risk signals, sending the right retention email at the right moment, recovering failed payments, and winning back cancellations. High-touch enterprise relationship management, no — that needs a human.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do prices compare?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "ChurnGuard is published and starts at $79/month. Vitally doesn't publish pricing; third-party reports (August 2026) suggest from around $300/month via a demo process.",
      },
    },
  ],
};

const tableRows = [
  { label: 'Core idea',                  vi: 'Copilot that makes CSMs more productive',                 cg: 'Autopilot that works without a CSM' },
  { label: 'Built for',                  vi: 'Teams with customer success managers',                     cg: 'Founder-led SaaS' },
  { label: 'Pricing',                    vi: 'Not public; third-party reports from ~$300/month',         cg: 'Published: $79 / $149 / $299 per month' },
  { label: 'What happens at churn risk', vi: 'A CSM gets a task in their queue',                         cg: 'The save fires automatically — emails, dunning, win-backs' },
  { label: 'Time to value',              vi: 'Onboarding + playbook building',                           cg: 'Same day — playbooks pre-built' },
  { label: 'Best for',                   vi: 'Scaling CS productivity',                                  cg: 'Replacing the need for CS headcount (for now)' },
];

export default function VitallyPage() {
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
          <span style={{ color: DK_MUTED }}>Vitally</span>
        </p>

        {/* Hero */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 800, color: DK_TEXT, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            The Vitally alternative for teams with no CSM to copilot
          </h1>
          <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 16px' }}>
            Vitally&rsquo;s pitch is a copilot for customer success — and it&rsquo;s a good one. If you have CSMs drowning in accounts, Vitally makes them faster: AI-assisted workflows, productivity tooling, clean health tracking. It&rsquo;s popular with well-run CS teams for a reason.
          </p>
          <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 20px' }}>
            But a copilot needs a pilot. Every feature Vitally sells assumes a customer success manager in the seat — someone to triage the queue, run the playbooks, and work the accounts. If that seat is empty, a copilot has nobody to assist. Third-party reports put Vitally&rsquo;s pricing from around $300/month (August 2026), quoted via demo.
          </p>
          <p style={{ fontSize: '13px', color: DK_FAINT, margin: 0 }}>Last updated: August 2026</p>
        </div>

        {/* Comparison table */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: DK_TEXT, margin: '0 0 8px' }}>Side-by-side comparison</h2>
          <p style={{ fontSize: '13px', color: DK_FAINT, margin: '0 0 20px' }}>Competitor facts from third-party reports, as of August 2026.</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${DK_BORDER_MED}` }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px 10px 0', color: DK_FAINT, fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', width: '26%' }}></th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: DK_MUTED, fontWeight: 600, fontSize: '13px', width: '37%' }}>Vitally</th>
                  <th style={{ textAlign: 'left', padding: '10px 0 10px 16px', color: DK_ACCENT, fontWeight: 600, fontSize: '13px', width: '37%' }}>ChurnGuard</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${DK_BORDER}` }}>
                    <td style={{ padding: '14px 16px 14px 0', color: DK_FAINT, fontWeight: 500, verticalAlign: 'top' }}>{row.label}</td>
                    <td style={{ padding: '14px 16px', color: DK_MUTED, verticalAlign: 'top', lineHeight: 1.5 }}>{row.vi}</td>
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
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: DK_FAINT, marginBottom: '14px' }}>Choose Vitally if&hellip;</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'You have CSMs and want them leveraged — one CSM handling 100 accounts instead of 40.',
              ].map((item, i) => (
                <li key={i} style={{ fontSize: '13px', color: DK_MUTED, lineHeight: 1.55, paddingLeft: '16px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: DK_FAINT }}>–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '22px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: DK_ACCENT, marginBottom: '14px' }}>Choose ChurnGuard if&hellip;</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                "The CSM headcount is zero and will stay zero for a while. ChurnGuard doesn't make a CSM faster; it does the CSM's first job — watching for risk and reaching out — automatically.",
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
            Copilot vs autopilot is exactly the right frame. If there&rsquo;s a pilot, buy the copilot. If there&rsquo;s nobody in the seat, you need the thing that flies the leg itself.
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
            Put churn prevention on autopilot — start with the free audit.
          </h2>
          <p style={{ fontSize: '14px', color: DK_MUTED, lineHeight: 1.65, margin: '0 0 24px' }}>
            Free audit, no card. Results in minutes.
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
            Run the Free Churn Audit &rarr;
          </a>
        </div>

      </main>
    </DarkShell>
  );
}
