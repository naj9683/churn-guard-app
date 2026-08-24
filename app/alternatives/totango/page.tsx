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
      name: 'Is Totango really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — as of August 2026, Totango offers a genuine free tier, which is rare and commendable in this category. Paid plans unlock scale and features; third-party reports put them from roughly $249/month. The cost to weigh isn't the subscription — it's the setup and maintenance time.",
      },
    },
    {
      '@type': 'Question',
      name: 'What does ChurnGuard need me to configure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Connect Stripe (read-only), pick your playbooks, paste one line of code if you want usage signals too. The retention emails, dunning sequence, and win-back campaigns are pre-written and fire automatically. Most teams are live in under ten minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I migrate from Totango to ChurnGuard?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "There's nothing to migrate — no journeys to rebuild, no blocks to recreate. Connect Stripe and ChurnGuard starts scoring risk and running playbooks from your live billing data on day one.",
      },
    },
  ],
};

const tableRows = [
  { label: 'Model',           to: 'Composable CS platform — assemble SuccessBLOCs',                             cg: 'Pre-built playbooks — toggle on, done' },
  { label: 'Pricing',         to: 'Free tier available; paid plans reported from ~$249/month (third-party reports)', cg: 'Published: $79 / $149 / $299 per month' },
  { label: 'Setup work',      to: 'Choose blocks, connect data, configure triggers — you build the system',       cg: 'Connect Stripe in minutes; playbooks are pre-built' },
  { label: 'Who operates it', to: 'Someone on your team, ongoing',                                                cg: 'Nobody — runs automatically' },
  { label: 'What you get',    to: 'A CS toolkit you assemble',                                                    cg: 'Retention emails, dunning, and win-backs that fire on their own' },
  { label: 'Best for',        to: 'Teams ready to invest setup time in a CS system',                              cg: 'Teams with no time to build or run one' },
];

export default function TotangoPage() {
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
          <span style={{ color: DK_MUTED }}>Totango</span>
        </p>

        {/* Hero */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 800, color: DK_TEXT, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            The Totango alternative that needs no configuration at all
          </h1>
          <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 16px' }}>
            Totango deserves real credit: it offers a genuine free tier in a category where &ldquo;free&rdquo; usually means &ldquo;demo.&rdquo; Its composable SuccessBLOCs let you assemble a customer success practice from pre-built blocks, and for a small team with time to invest, it&rsquo;s a legitimate starting point.
          </p>
          <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 20px' }}>
            The catch isn&rsquo;t price — it&rsquo;s the operator. SuccessBLOCs are building blocks, and building blocks need a builder: someone to choose the blocks, wire the data, tune the triggers, and maintain the system. If that someone is you — on top of support, sales, and product — &ldquo;free&rdquo; starts costing the most expensive thing you have.
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
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: DK_MUTED, fontWeight: 600, fontSize: '13px', width: '37%' }}>Totango</th>
                  <th style={{ textAlign: 'left', padding: '10px 0 10px 16px', color: DK_ACCENT, fontWeight: 600, fontSize: '13px', width: '37%' }}>ChurnGuard</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${DK_BORDER}` }}>
                    <td style={{ padding: '14px 16px 14px 0', color: DK_FAINT, fontWeight: 500, verticalAlign: 'top' }}>{row.label}</td>
                    <td style={{ padding: '14px 16px', color: DK_MUTED, verticalAlign: 'top', lineHeight: 1.5 }}>{row.to}</td>
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
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: DK_FAINT, marginBottom: '14px' }}>Choose Totango if&hellip;</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'You want a free starting point AND you have genuine hours to configure and maintain it — or you plan to grow into a full CS platform with dedicated ownership.',
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
                '"Configure the churn system" has been on your to-do list for months. ChurnGuard\'s playbooks are pre-built: connect Stripe, toggle them on, and retention emails, failed-payment recovery, and win-backs run without you.',
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
            Totango&rsquo;s free tier is real, and if you&rsquo;ll actually do the setup work, try it — free is free. But be honest with yourself about the maintenance hours. Unused, half-configured tools don&rsquo;t save customers; automation that runs does.
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
            Skip the configuration — run the free audit and see your at-risk revenue today.
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
