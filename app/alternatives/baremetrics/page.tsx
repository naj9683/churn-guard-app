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
      name: "Does ChurnGuard replace Baremetrics' dashboards?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No — and we don't try to. ChurnGuard shows you at-risk customers and dollars recovered, not investor reporting. It replaces the manual work of responding to churn signals, not your metrics stack.",
      },
    },
    {
      '@type': 'Question',
      name: 'I already use Baremetrics Recover for dunning. Why switch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Maybe you shouldn't — if failed payments are your only churn leak and Recover covers it, that's a fine setup. ChurnGuard makes sense when you also want pre-cancellation retention and win-backs included: Recover alone is reported to start around $204/month (August 2026, third-party sources); ChurnGuard's full playbook set starts at $79/month.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use ChurnGuard alongside Baremetrics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — both connect read-only to Stripe with no conflict. Analytics from Baremetrics, automated action from ChurnGuard.',
      },
    },
  ],
};

const tableRows = [
  { label: 'Core product',                        bm: 'Subscription analytics & dashboards',                                                          cg: 'Automated churn prevention playbooks' },
  { label: 'Churn response',                      bm: 'Recover (dunning add-on, reported ~$204/mo floor) + Cancellation Insights (exit surveys)',      cg: 'Included in every plan: retention emails, 3-step dunning, win-back campaigns' },
  { label: 'What happens when a customer is at risk', bm: 'It appears on your dashboard',                                                             cg: 'A save play fires automatically — before cancellation' },
  { label: 'Pricing',                             bm: 'Published, scales with MRR',                                                                    cg: 'Published: $79 / $149 / $299 per month — everything included' },
  { label: 'Who operates it',                     bm: 'You, checking the dashboard',                                                                    cg: 'Nobody — it runs itself' },
  { label: 'Best for',                            bm: 'Founders who want metrics clarity',                                                              cg: 'Founders who want churn handled, not just measured' },
];

export default function BaremetricsPage() {
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
          <span style={{ color: DK_MUTED }}>Baremetrics</span>
        </p>

        {/* Hero */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 800, color: DK_TEXT, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            The Baremetrics alternative that acts on the numbers
          </h1>
          <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 16px' }}>
            Baremetrics is the original Stripe analytics tool, and it earned that position: beautiful MRR dashboards, cohort analysis, open benchmarks, and a decade of trust in the indie SaaS community. If you want to see your subscription metrics, it&rsquo;s excellent.
          </p>
          <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 20px' }}>
            But here&rsquo;s the question Baremetrics can&rsquo;t answer for you: a dashboard tells you churn happened — what happens next? Their Recover add-on handles failed payments (reported from ~$204/month, third-party sources), and Cancellation Insights collects exit feedback. Seeing clearly, though, isn&rsquo;t the same as acting. ChurnGuard exists in the gap between &ldquo;your dashboard says a customer is at risk&rdquo; and &ldquo;someone did something about it.&rdquo;
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
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: DK_MUTED, fontWeight: 600, fontSize: '13px', width: '37%' }}>Baremetrics</th>
                  <th style={{ textAlign: 'left', padding: '10px 0 10px 16px', color: DK_ACCENT, fontWeight: 600, fontSize: '13px', width: '37%' }}>ChurnGuard</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${DK_BORDER}` }}>
                    <td style={{ padding: '14px 16px 14px 0', color: DK_FAINT, fontWeight: 500, verticalAlign: 'top' }}>{row.label}</td>
                    <td style={{ padding: '14px 16px', color: DK_MUTED, verticalAlign: 'top', lineHeight: 1.5 }}>{row.bm}</td>
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
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: DK_FAINT, marginBottom: '14px' }}>Choose Baremetrics if&hellip;</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Your primary need is financial metrics and reporting — MRR movements, cohorts, benchmarking — and you have a separate plan (or person) for acting on churn signals.',
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
                'You want the response built in. ChurnGuard watches the same Stripe signals, but instead of charting them, it acts: at-risk customers get retention emails, failed payments get a 3-step recovery sequence, cancellations get win-back campaigns. Automatically.',
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
            Plenty of teams run both: Baremetrics for investor-grade metrics, ChurnGuard for automated saves. If you can only pick one, ask yourself which problem you actually have — &ldquo;I don&rsquo;t know my numbers&rdquo; or &ldquo;I know them and customers still slip away.&rdquo;
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
            See the customers your dashboard can&rsquo;t save for you — free audit.
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
