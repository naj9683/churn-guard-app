import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getAllSlugs, formatDate } from '@/lib/blog';
import DarkShell from '@/app/components/ui/DarkShell';

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };

  const url = `https://churnguardapp.com/blog/${post.slug}`;
  const metaTitle = post.metaTitle || `${post.title} — ChurnGuard Blog`;

  return {
    title: metaTitle,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: metaTitle,
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
      title: metaTitle,
      description: post.description,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

const DK_BG        = '#020617';
const DK_CARD      = '#0f172a';
const DK_TEXT      = '#f1f5f9';
const DK_MUTED     = '#94a3b8';
const DK_FAINT     = '#64748b';
const DK_BORDER    = 'rgba(51,65,85,0.5)';
const DK_ACCENT    = '#6366f1';
const DK_ACCENT_BG = 'rgba(99,102,241,0.12)';
const DK_ACCENT_BR = 'rgba(99,102,241,0.25)';

const STYLES = `
  .prose { color: ${DK_MUTED}; font-size: 17px; line-height: 1.8; }
  .prose h2 { color: ${DK_TEXT}; font-size: 22px; font-weight: 600; margin: 2.5em 0 0.75em; letter-spacing: -0.02em; border-bottom: 1px solid ${DK_BORDER}; padding-bottom: 0.5em; scroll-margin-top: 80px; }
  .prose h3 { color: ${DK_TEXT}; font-size: 18px; font-weight: 600; margin: 2em 0 0.6em; letter-spacing: -0.01em; scroll-margin-top: 80px; }
  .prose p { margin: 0 0 1.4em; }
  .prose strong { color: ${DK_TEXT}; font-weight: 600; }
  .prose em { color: ${DK_ACCENT}; font-style: italic; }
  .prose ul { margin: 0 0 1.4em; padding-left: 1.5em; }
  .prose ol { margin: 0 0 1.4em; padding-left: 1.5em; }
  .prose li { margin: 0 0 0.5em; }
  .prose a { color: ${DK_ACCENT}; text-decoration: underline; text-underline-offset: 3px; }
  .prose a:hover { opacity: 0.75; }
  .prose blockquote { border-left: 3px solid ${DK_ACCENT}; padding: 4px 0 4px 20px; margin: 0 0 1.4em; color: ${DK_MUTED}; font-style: italic; }
  .prose code { background: #1e293b; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; color: ${DK_ACCENT}; font-family: monospace; }
  .prose pre { background: #1e1e2e; border: 1px solid ${DK_BORDER}; border-radius: 10px; padding: 20px; overflow-x: auto; margin: 0 0 1.4em; }
  .prose pre code { background: none; padding: 0; color: #cdd6f4; }
  .prose hr { border: none; border-top: 1px solid ${DK_BORDER}; margin: 2.5em 0; }
  .prose .table-wrap { overflow-x: auto; margin: 0 0 1.4em; border-radius: 10px; border: 1px solid ${DK_BORDER}; }
  .prose table { width: 100%; border-collapse: collapse; }
  .prose th { background: ${DK_CARD}; color: ${DK_TEXT}; font-weight: 600; padding: 10px 14px; text-align: left; border-bottom: 1px solid ${DK_BORDER}; }
  .prose td { padding: 10px 14px; border-bottom: 1px solid ${DK_BORDER}; color: ${DK_MUTED}; }
  .prose tr:last-child td { border-bottom: none; }
  .prose tr:nth-child(even) td { background: ${DK_CARD}; }
  .prose img { max-width: 100%; border-radius: 8px; margin: 0 0 1.4em; display: block; }
  .toc-link { display: block; padding: 6px 10px; border-radius: 6px; color: ${DK_FAINT}; font-size: 13px; text-decoration: none; line-height: 1.4; border-left: 2px solid transparent; }
  .toc-link:hover { color: ${DK_ACCENT}; background: ${DK_ACCENT_BG}; border-left-color: ${DK_ACCENT}; }
  .post-layout { display: grid; grid-template-columns: 1fr 260px; gap: 56px; align-items: start; max-width: 1100px; margin: 0 auto; padding: 56px 24px 80px; }
  .toc-sidebar { position: sticky; top: 80px; }
  .toc-mobile { display: none; }
  @media (max-width: 960px) {
    .post-layout { grid-template-columns: 1fr; gap: 0; max-width: 720px; }
    .toc-sidebar { display: none; }
    .toc-mobile { display: block; margin-bottom: 40px; }
  }
  @media (max-width: 640px) {
    .post-layout { padding: 32px 16px 60px; }
  }
`;

const BASE = 'https://churnguardapp.com';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const postUrl = `${BASE}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: post.metaTitle || post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorRole,
    },
    datePublished: post.date,
    dateModified: post.date,
    publisher: {
      '@type': 'Organization',
      name: 'ChurnGuard',
      url: BASE,
      '@id': `${BASE}/#organization`,
    },
    url: postUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    image: `${BASE}/og-default.png`,
    isPartOf: { '@type': 'WebSite', '@id': `${BASE}/#website` },
    keywords: post.tags.join(', '),
    articleSection: post.tags[0] ?? 'SaaS',
    about: { '@type': 'Thing', name: post.tags[0] ?? 'SaaS churn prevention' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  };

  const faqSchema = post.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      }
    : null;

  const btnPrimary = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: DK_ACCENT, color: '#fff',
    padding: '12px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
    textDecoration: 'none',
  };
  const btnOutline = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(30,41,59,0.8)', border: `1px solid ${DK_BORDER}`, color: DK_TEXT,
    padding: '12px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
    textDecoration: 'none',
  };

  return (
    <DarkShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <style>{STYLES}</style>

      {/* ── Main layout ── */}
      <div className="post-layout">

        {/* ── Article ── */}
        <main>
          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ padding: '3px 10px', borderRadius: '999px', background: DK_ACCENT_BG, border: `1px solid ${DK_ACCENT_BR}`, fontSize: '12px', fontWeight: 500, color: DK_ACCENT }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 20px', color: DK_TEXT }}>
            {post.title}
          </h1>

          {/* Description */}
          <p style={{ fontSize: '18px', color: DK_MUTED, lineHeight: 1.6, margin: '0 0 32px' }}>
            {post.description}
          </p>

          {/* Byline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: DK_CARD, border: `1px solid ${DK_BORDER}`, borderRadius: '10px', marginBottom: '40px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: DK_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', color: '#fff', flexShrink: 0 }}>
              {post.author.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: DK_TEXT }}>{post.author}</div>
              {post.authorRole && <div style={{ fontSize: '12px', color: DK_FAINT }}>{post.authorRole}</div>}
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: DK_FAINT }}>{formatDate(post.date)}</div>
              <div style={{ fontSize: '13px', color: DK_FAINT }}>{post.readTime}</div>
            </div>
          </div>

          {/* Mobile ToC */}
          {post.headings.length > 0 && (
            <div className="toc-mobile" style={{ background: DK_CARD, border: `1px solid ${DK_BORDER}`, borderRadius: '10px', padding: '20px', marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, color: DK_FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                In This Article
              </div>
              {post.headings.map(h => (
                <a key={h.id} href={`#${h.id}`} className="toc-link">{h.text}</a>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

          {/* Author bio */}
          {post.authorBio && (
            <div style={{ marginTop: '64px', padding: '28px', background: DK_CARD, border: `1px solid ${DK_BORDER}`, borderRadius: '12px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: DK_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '20px', color: '#fff', flexShrink: 0 }}>
                {post.author.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 500, color: DK_TEXT, marginBottom: '2px' }}>{post.author}</div>
                {post.authorRole && <div style={{ fontSize: '13px', color: DK_ACCENT, marginBottom: '10px' }}>{post.authorRole}</div>}
                <p style={{ fontSize: '14px', color: DK_MUTED, lineHeight: 1.6, margin: 0 }}>{post.authorBio}</p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: '56px', padding: '32px', background: DK_ACCENT_BG, border: `1px solid ${DK_ACCENT_BR}`, borderRadius: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 500, color: DK_TEXT, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
              See your Revenue at Risk — free
            </h3>
            <p style={{ color: DK_MUTED, fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px' }}>
              Connect your Stripe account and get a full churn audit in 2 minutes. No signup, no credit card. ChurnGuard shows you exactly which customers are about to cancel and how much MRR is at stake.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/audit" style={btnPrimary}>
                Run Free Churn Audit →
              </Link>
              <Link href="/#pricing" style={btnOutline}>
                View Pricing
              </Link>
            </div>
          </div>

          {/* Back to blog */}
          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: `1px solid ${DK_BORDER}` }}>
            <Link href="/blog" style={{ color: DK_ACCENT, fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
              ← Back to all posts
            </Link>
          </div>
        </main>

        {/* ── ToC sidebar ── */}
        {post.headings.length > 0 && (
          <aside className="toc-sidebar">
            <div style={{ background: DK_CARD, border: `1px solid ${DK_BORDER}`, borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, color: DK_FAINT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                In This Article
              </div>
              {post.headings.map(h => (
                <a key={h.id} href={`#${h.id}`} className="toc-link">{h.text}</a>
              ))}
            </div>
            <div style={{ marginTop: '16px', padding: '20px', background: DK_ACCENT_BG, border: `1px solid ${DK_ACCENT_BR}`, borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: DK_TEXT, marginBottom: '6px' }}>See your churn risk</div>
              <p style={{ fontSize: '12px', color: DK_MUTED, lineHeight: 1.5, margin: '0 0 14px' }}>Free Stripe audit — no signup needed</p>
              <Link href="/audit" style={{ display: 'block', padding: '10px', borderRadius: '6px', background: DK_ACCENT, color: '#fff', fontWeight: 500, fontSize: '13px', textDecoration: 'none' }}>
                Run Free Audit →
              </Link>
            </div>
          </aside>
        )}
      </div>
    </DarkShell>
  );
}
