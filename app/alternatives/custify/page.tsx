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
      name: 'Is Custify cheaper than the big CS platforms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, reportedly — third-party sources (August 2026) put entry pricing around $199/month, well below Gainsight-class contracts. ChurnGuard still starts lower, at $79/month published, with a 30-day free trial.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens after Custify alerts you about churn risk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A person on your team investigates, decides on a response, and executes it — Custify supports that workflow well. ChurnGuard automates that response for the most common cases: retention sequences, failed-payment recovery, and win-backs fire the moment risk crosses the threshold.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which is better for a 5-person SaaS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A tool that doesn\'t need an operator. At five people, nobody has "work the churn queue" in their week — which is exactly the gap ChurnGuard was built to fill.',
      },
    },
  ],
};

const tableRows = [
  { label: 'What it does with churn risk', cu: 'Surfaces it for your team to act on',                cu2: '', cg: 'Acts on it — retention emails, dunning, win-backs fire automatically' },
  { label: 'Built for',                    cu: 'Mid-market CS teams',                                 cu2: '', cg: 'Founder-led SaaS' },
  { label: 'Pricing',                      cu: 'Not public; third-party reports ~$199–500/month entry', cu2: '', cg: 'Published: $79 / $149 / $299 per month' },
  { label: 'Setup',                        cu: 'Onboarding with their team',                           cu2: '', cg: 'Same day — connect Stripe, toggle playbooks' },
  { label: 'The loop',                     cu: 'Detect → alert → human decides → human acts',         cu2: '', cg: 'Detect → act → you see dollars recovered' },
  { label: 'Best for',                     cu: 'Teams with someone owning renewals',                   cu2: '', cg: 'Teams where nobody does' },
];

export default function CustifyPage() {
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
          <span style={{ color: DK_MUTED }}>Custify</span>
        </p>

        {/* Hero */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 800, color: DK_TEXT, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            The Custify alternative that closes the loop itself
          </h1>
          <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 16px' }}>
            Custify is a well-regarded customer success tool for mid-market SaaS: it surfaces churn risk, tracks health scores, and helps CS teams secure renewals. Among the CS platforms, it&rsquo;s one of the more accessible — third-party reports put entry pricing around $199/month (August 2026), far below the enterprise suites.
          </p>
          <p style={{ fontSize: '16px', color: DK_MUTED, lineHeight: 1.7, margin: '0 0 20px' }}>
            The difference is the last mile. Custify surfaces risk — a dashboard, a score, an alert — and then a person on your team decides what to do and does it. For a CS team, that&rsquo;s the right design. For a founder at 11pm, &ldquo;User has 73% churn risk&rdquo; is just one more notification asking for time you don&rsquo;t have.
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
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: DK_MUTED, fontWeight: 600, fontSize: '13px', width: '37%' }}>Custify</th>
                  <th style={{ textAlign: 'left', padding: '10px 0 10px 16px', color: DK_ACCENT, fontWeight: 600, fontSize: '13px', width: '37%' }}>ChurnGuard</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${DK_BORDER}` }}>
                    <td style={{ padding: '14px 16px 14px 0', color: DK_FAINT, fontWeight: 500, verticalAlign: 'top' }}>{row.label}</td>
                    <td style={{ padding: '14px 16px', color: DK_MUTED, verticalAlign: 'top', lineHeight: 1.5 }}>{row.cu}</td>
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
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: DK_FAINT, marginBottom: '14px' }}>Choose Custify if&hellip;</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                "You have someone whose job includes working a churn-risk queue — they'll get a solid, reasonably-priced CS tool.",
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
                'The queue would sit unworked. ChurnGuard closes the loop without you: risk detected → save play fires → outcome tracked in dollars.',
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
            &ldquo;Surfacing&rdquo; vs &ldquo;saving&rdquo; is the whole comparison. Alerts are valuable when someone is paid to answer them. If that&rsquo;s not your team today, buy the tool that answers them itself.
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
            Close the loop without adding to your queue — free churn audit.
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
