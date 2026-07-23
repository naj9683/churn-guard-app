import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatDate } from '@/lib/blog';
import PublicShell from '@/app/components/ui/PublicShell';
import {
  ACCENT, ACCENT_BG, ACCENT_BORDER, BORDER, BORDER_MED,
  TEXT, MUTED, FAINT, WHITE, PAGE_BG, btnPrimary,
} from '@/app/lib/design-tokens';

export const metadata: Metadata = {
  title: 'Blog — ChurnGuard | SaaS Churn Prevention Insights',
  description:
    'Data-backed strategies for reducing SaaS churn, recovering failed payments, and building retention systems that run on autopilot.',
  openGraph: {
    title: 'Blog — ChurnGuard | SaaS Churn Prevention Insights',
    description:
      'Practical guides for SaaS founders and customer success teams on reducing churn, recovering revenue, and automating retention.',
    url: 'https://churnguardapp.com/blog',
    siteName: 'ChurnGuard',
    type: 'website',
  },
  alternates: { canonical: 'https://churnguardapp.com/blog' },
  robots: { index: true, follow: true },
};

const BASE = 'https://churnguardapp.com';

export default function BlogIndex() {
  const posts    = getAllPosts();
  const featured = posts.find(p => p.featured);
  const rest     = posts.filter(p => !p.featured);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${BASE}/blog`,
    name: 'ChurnGuard Blog — SaaS Churn Prevention Insights',
    description:
      'Data-backed strategies for reducing SaaS churn, recovering failed payments, and building retention systems that run on autopilot.',
    url: `${BASE}/blog`,
    isPartOf: { '@type': 'WebSite', '@id': `${BASE}/#website` },
    about: { '@type': 'Thing', name: 'SaaS churn prevention' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <PublicShell activeHref="/blog">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <style>{`
        .cg-blog-card { transition: border-color 150ms; }
        .cg-blog-card:hover { border-color: ${ACCENT_BORDER} !important; }
        .cg-featured-card { transition: border-color 150ms; }
        .cg-featured-card:hover { border-color: ${ACCENT} !important; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 24px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '999px', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, fontSize: '13px', fontWeight: 500, color: ACCENT, marginBottom: '20px' }}>
            Churn Prevention Insights
          </div>
          <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 16px', color: TEXT }}>
            Stop losing revenue to preventable churn
          </h1>
          <p style={{ fontSize: '18px', color: MUTED, maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Data-backed strategies for SaaS founders and customer success teams. No fluff — just what works.
          </p>
        </div>

        {/* ── Featured post ── */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: '48px' }}>
            <div className="cg-featured-card" style={{ background: WHITE, border: `1px solid ${BORDER_MED}`, borderRadius: '16px', padding: 'clamp(24px,4vw,40px) clamp(20px,5vw,48px)' }}>
              <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '999px', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, fontSize: '11px', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                Featured
              </div>
              <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)', fontWeight: 500, color: TEXT, lineHeight: 1.2, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                {featured.title}
              </h2>
              <p style={{ color: MUTED, fontSize: '16px', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '680px' }}>
                {featured.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', color: FAINT }}>{featured.author}</span>
                <span style={{ fontSize: '13px', color: FAINT }}>·</span>
                <span style={{ fontSize: '13px', color: FAINT }}>{formatDate(featured.date)}</span>
                <span style={{ fontSize: '13px', color: FAINT }}>·</span>
                <span style={{ fontSize: '13px', color: FAINT }}>{featured.readTime}</span>
                <span style={{ marginLeft: 'auto', fontSize: '14px', color: ACCENT, fontWeight: 500 }}>Read article →</span>
              </div>
            </div>
          </Link>
        )}

        {/* ── Post grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article className="cg-blog-card" style={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} style={{ padding: '2px 8px', borderRadius: '999px', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT, fontSize: '11px', fontWeight: 500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 style={{ fontSize: '16px', fontWeight: 500, color: TEXT, lineHeight: 1.35, margin: '0 0 10px', letterSpacing: '-0.01em', flex: '0' }}>
                  {post.title}
                </h2>
                <p style={{ color: MUTED, fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px', flex: 1 }}>
                  {post.description.slice(0, 120)}{post.description.length > 120 ? '…' : ''}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: FAINT }}>
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: ACCENT, fontWeight: 500 }}>Read →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: '80px', textAlign: 'center', padding: '56px 32px', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, borderRadius: '16px' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', fontWeight: 500, color: TEXT, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            See your own Revenue at Risk
          </h2>
          <p style={{ color: MUTED, fontSize: '16px', margin: '0 0 28px', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Run a free audit of your Stripe account. No signup required — see your churn risk and at-risk MRR in 2 minutes.
          </p>
          <Link href="/audit" style={btnPrimary}>
            Run Free Audit →
          </Link>
        </div>

      </div>
    </PublicShell>
  );
}
