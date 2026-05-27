import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getAllSlugs, formatDate } from '@/lib/blog';

// Pre-render all known slugs at build time
export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };

  const url = `https://churnguardapp.com/blog/${post.slug}`;

  return {
    title: `${post.title} — ChurnGuard Blog`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: 'ChurnGuard',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

const PROSE_STYLES = `
  .prose { color: #cbd5e1; font-size: 17px; line-height: 1.8; }
  .prose h2 { color: #f1f5f9; font-size: 24px; font-weight: 700; margin: 2.5em 0 0.75em; letter-spacing: -0.02em; border-bottom: 1px solid #1e293b; padding-bottom: 0.5em; }
  .prose h3 { color: #e2e8f0; font-size: 19px; font-weight: 700; margin: 2em 0 0.6em; letter-spacing: -0.01em; }
  .prose p { margin: 0 0 1.4em; }
  .prose strong { color: #f1f5f9; font-weight: 700; }
  .prose em { color: #c4b5fd; font-style: italic; }
  .prose ul { margin: 0 0 1.4em; padding-left: 1.5em; }
  .prose ol { margin: 0 0 1.4em; padding-left: 1.5em; }
  .prose li { margin: 0 0 0.5em; }
  .prose a { color: #818cf8; text-decoration: underline; text-underline-offset: 3px; }
  .prose a:hover { color: #a5b4fc; }
  .prose blockquote { border-left: 3px solid #6366f1; padding: 4px 0 4px 20px; margin: 0 0 1.4em; color: #94a3b8; font-style: italic; }
  .prose code { background: #1e293b; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; color: '#c4b5fd'; font-family: monospace; }
  .prose pre { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 20px; overflow-x: auto; margin: 0 0 1.4em; }
  .prose pre code { background: none; padding: 0; }
  .prose hr { border: none; border-top: 1px solid #1e293b; margin: 2.5em 0; }
  .prose table { width: 100%; border-collapse: collapse; margin: 0 0 1.4em; }
  .prose th { background: #1e293b; color: #e2e8f0; font-weight: 700; padding: 10px 14px; text-align: left; }
  .prose td { padding: 10px 14px; border-bottom: 1px solid #1e293b; }
`;

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: post.author, jobTitle: post.authorRole },
    datePublished: post.date,
    dateModified: post.date,
    publisher: { '@type': 'Organization', name: 'ChurnGuard', url: 'https://churnguardapp.com' },
    url: `https://churnguardapp.com/blog/${post.slug}`,
    keywords: post.tags.join(', '),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{PROSE_STYLES}</style>

      {/* ── Header ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(51,65,85,0.6)' }}>
        <nav style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '18px', color: '#f1f5f9', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>🛡️</div>
            ChurnGuard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/blog" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>← Blog</Link>
            <Link href="/audit" style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
              Free Audit →
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Article ── */}
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ padding: '3px 10px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '12px', fontWeight: '600', color: '#818cf8' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: '800', lineHeight: '1.15', letterSpacing: '-0.03em', margin: '0 0 20px', color: '#f1f5f9' }}>
          {post.title}
        </h1>

        {/* Description */}
        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 32px' }}>
          {post.description}
        </p>

        {/* Byline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', marginBottom: '48px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', color: '#fff', flexShrink: 0 }}>
            {post.author.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>{post.author}</div>
            {post.authorRole && <div style={{ fontSize: '12px', color: '#64748b' }}>{post.authorRole}</div>}
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>{formatDate(post.date)}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>{post.readTime}</div>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* ── CTA ── */}
        <div style={{ marginTop: '72px', padding: '40px', background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '32px', flexShrink: 0 }}>🛡️</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#f1f5f9', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                See your Revenue at Risk — free
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 20px' }}>
                Connect your Stripe account and get a full churn audit in 2 minutes. No signup, no credit card. ChurnGuard shows you exactly which customers are about to cancel and how much MRR is at stake.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  href="/audit"
                  style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}
                >
                  Run Free Churn Audit →
                </Link>
                <Link
                  href="/#pricing"
                  style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '10px', border: '1px solid #334155', color: '#94a3b8', fontWeight: '600', fontSize: '15px', textDecoration: 'none' }}
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Back to blog ── */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #1e293b' }}>
          <Link href="/blog" style={{ color: '#818cf8', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Back to all posts
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '32px 24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        <p style={{ margin: 0 }}>© 2026 ChurnGuard · <Link href="/blog" style={{ color: '#64748b' }}>Blog</Link> · <Link href="/#pricing" style={{ color: '#64748b' }}>Pricing</Link></p>
      </footer>
    </div>
  );
}
