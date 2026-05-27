import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorRole: string;
  tags: string[];
  readTime: string;
  featured: boolean;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

// ── Frontmatter parser ────────────────────────────────────────────────────────

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key   = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (!key) continue;
    if (value.startsWith('[')) {
      try { data[key] = JSON.parse(value.replace(/'/g, '"')); } catch { data[key] = []; }
    } else if (value === 'true')  { data[key] = true; }
    else if (value === 'false')   { data[key] = false; }
    else { data[key] = value.replace(/^"(.*)"$/, '$1'); }
  }

  return { data, content: match[2] };
}

// ── Markdown → HTML (minimal, handles our blog content patterns) ──────────────

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    if (/^### /.test(line)) {
      html.push(`<h3>${inlineMarkdown(escHtml(line.slice(4)))}</h3>`);
      i++; continue;
    }
    if (/^## /.test(line)) {
      html.push(`<h2>${inlineMarkdown(escHtml(line.slice(3)))}</h2>`);
      i++; continue;
    }
    if (/^# /.test(line)) {
      html.push(`<h1>${inlineMarkdown(escHtml(line.slice(2)))}</h1>`);
      i++; continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      html.push('<hr>');
      i++; continue;
    }

    // Fenced code block
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(escHtml(lines[i]));
        i++;
      }
      html.push(`<pre><code>${codeLines.join('\n')}</code></pre>`);
      i++; continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(inlineMarkdown(escHtml(lines[i].slice(2))));
        i++;
      }
      html.push(`<blockquote><p>${quoteLines.join('<br>')}</p></blockquote>`);
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(`<li>${inlineMarkdown(escHtml(lines[i].slice(2)))}</li>`);
        i++;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inlineMarkdown(escHtml(lines[i].replace(/^\d+\. /, '')))}</li>`);
        i++;
      }
      html.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      i++; continue;
    }

    // Paragraph — collect consecutive non-special lines
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,3} |---+$|```|> |[-*] |\d+\. )/.test(lines[i])) {
      paraLines.push(inlineMarkdown(escHtml(lines[i])));
      i++;
    }
    if (paraLines.length > 0) {
      html.push(`<p>${paraLines.join(' ')}</p>`);
    }
  }

  return html.join('\n');
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parsePost(filename: string): PostMeta {
  const slug = filename.replace(/\.md$/, '');
  const raw  = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
  const { data } = parseFrontmatter(raw);
  return {
    slug,
    title:       String(data.title       ?? ''),
    description: String(data.description ?? ''),
    date:        String(data.date        ?? ''),
    author:      String(data.author      ?? 'ChurnGuard'),
    authorRole:  String(data.authorRole  ?? ''),
    tags:        Array.isArray(data.tags) ? (data.tags as string[]) : [],
    readTime:    String(data.readTime    ?? '5 min read'),
    featured:    Boolean(data.featured),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(parsePost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | null {
  const filepath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, 'utf8');
  const { data, content } = parseFrontmatter(raw);
  return {
    slug,
    title:       String(data.title       ?? ''),
    description: String(data.description ?? ''),
    date:        String(data.date        ?? ''),
    author:      String(data.author      ?? 'ChurnGuard'),
    authorRole:  String(data.authorRole  ?? ''),
    tags:        Array.isArray(data.tags) ? (data.tags as string[]) : [],
    readTime:    String(data.readTime    ?? '5 min read'),
    featured:    Boolean(data.featured),
    contentHtml: markdownToHtml(content),
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
