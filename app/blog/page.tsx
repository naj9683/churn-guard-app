import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatDate } from '@/lib/blog';

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

export default function BlogIndex() {
  const posts = getAllPosts();
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <style>{`
        .blog-card { transition: border-color 0.2s, transform 0.2s; }
        .blog-card:hover { border-color: #6366f1 !important; transform: translateY(-2px); }
        .featured-card { transition: border-color 0.2s, transform 0.2s; }
        .featured-card:hover { border-color: rgba(99,102,241,0.5) !important; transform: translateY(-2px); }
        .blog-nav-link:hover { color: #f1f5f9 !important; }
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr !important; }
          .blog-hero { padding: 48px 16px 32px !important; }
          .blog-header-links { display: none !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(51,65,85,0.6)' }}>
        <nav style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '18px', color: '#f1f5f9', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🛡️</div>
            ChurnGuard
          </Link>
          <div className="blog-header-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/#features" className="blog-nav-link" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>Features</Link>
            <Link href="/#pricing" className="blog-nav-link" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/blog" style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Blog</Link>
            <Link href="/audit" style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Free Audit</Link>
            <Link href="/login" style={{ color: '#94a3b8', fontSize: '14px', padding: '8px 16px', border: '1px solid #334155', borderRadius: '8px', textDecoration: 'none' }}>Login</Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <div className="blog-hero" style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 24px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', fontSize: '13px', fontWeight: '600', color: '#818cf8', marginBottom: '20px' }}>
            Churn Prevention Insights
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            Stop losing revenue
            <br />
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              to preventable churn
            </span>
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '520px', margin: '0 auto', lineHeight: '1.6' }}>
            Data-backed strategies for SaaS founders and customer success teams. No fluff — just what works.
          </p>
        </div>

        {/* ── Featured post ── */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: '48px' }}>
            <div className="featured-card" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: 'clamp(24px,4vw,40px) clamp(20px,5vw,48px)' }}>
              <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '11px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                Featured
              </div>
              <h2 style={{ fontSize: 'clamp(20px,3vw,30px)', fontWeight: '800', color: '#f1f5f9', lineHeight: '1.2', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                {featured.title}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', margin: '0 0 24px', maxWidth: '680px' }}>
                {featured.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{featured.author}</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>·</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{formatDate(featured.date)}</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>·</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{featured.readTime}</span>
                <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#818cf8', fontWeight: '600' }}>Read article →</span>
              </div>
            </div>
          </Link>
        )}

        {/* ── Post grid ── */}
        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '24px' }}>
          {rest.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article className="blog-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} style={{ padding: '2px 8px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '11px', fontWeight: '600' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', lineHeight: '1.3', margin: '0 0 10px', letterSpacing: '-0.01em', flex: '0' }}>
                  {post.title}
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 20px', flex: 1 }}>
                  {post.description.slice(0, 120)}{post.description.length > 120 ? '…' : ''}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#6366f1', fontWeight: '600' }}>Read →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: '80px', textAlign: 'center', padding: '56px 32px', background: 'linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.04))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '24px' }}>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: '800', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            See your own Revenue at Risk
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0 0 28px auto', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
            Run a free audit of your Stripe account. No signup required — see your churn risk and at-risk MRR in 2 minutes.
          </p>
          <Link href="/audit" style={{ display: 'inline-block', padding: '14px 36px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: '700', fontSize: '16px', textDecoration: 'none' }}>
            Run Free Audit →
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '32px 24px', textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '40px' }}>
        <p style={{ margin: 0 }}>© 2026 ChurnGuard · <Link href="/blog" style={{ color: '#64748b' }}>Blog</Link> · <Link href="/#pricing" style={{ color: '#64748b' }}>Pricing</Link></p>
      </footer>
    </div>
  );
}
