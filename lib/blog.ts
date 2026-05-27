import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PostHeading {
  text: string;
  id: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  metaTitle: string;       // overrides title in <title> tag if set
  description: string;
  date: string;
  author: string;
  authorRole: string;
  authorBio: string;
  tags: string[];
  readTime: string;
  featured: boolean;
}

export interface Post extends PostMeta {
  contentHtml: string;
  headings: PostHeading[];
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

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

// ── Markdown → HTML ───────────────────────────────────────────────────────────

function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H3
    if (/^### /.test(line)) {
      const text = line.slice(4);
      html.push(`<h3>${inlineMarkdown(escHtml(text))}</h3>`);
      i++; continue;
    }
    // H2 — add id for jump links
    if (/^## /.test(line)) {
      const text = line.slice(3);
      const id = slugify(text);
      html.push(`<h2 id="${id}">${inlineMarkdown(escHtml(text))}</h2>`);
      i++; continue;
    }
    // H1
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

    // Markdown table (pipe-delimited)
    if (/^\|/.test(line.trim())) {
      const tableLines: string[] = [];
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 3) {
        const parseRow = (row: string) =>
          row.split('|')
            .slice(1, -1)          // drop first/last empty items
            .map(c => c.trim());
        const isSeparator = (row: string) => /^\|[\s|:-]+\|$/.test(row.trim());

        const headers   = parseRow(tableLines[0]);
        const dataRows  = tableLines.slice(1).filter(r => !isSeparator(r)).map(parseRow);

        const thead = `<thead><tr>${headers.map(h => `<th>${inlineMarkdown(escHtml(h))}</th>`).join('')}</tr></thead>`;
        const tbody = `<tbody>${dataRows.map(cols =>
          `<tr>${cols.map(c => `<td>${inlineMarkdown(escHtml(c))}</td>`).join('')}</tr>`
        ).join('')}</tbody>`;

        html.push(`<div class="table-wrap"><table>${thead}${tbody}</table></div>`);
      }
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
    if (line.trim() === '') { i++; continue; }

    // Paragraph
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' &&
      !/^(#{1,3} |---+$|```|> |[-*] |\d+\. |\|)/.test(lines[i])) {
      paraLines.push(inlineMarkdown(escHtml(lines[i])));
      i++;
    }
    if (paraLines.length > 0) {
      html.push(`<p>${paraLines.join(' ')}</p>`);
    }
  }

  return html.join('\n');
}

// ── Extract H2 headings for ToC ───────────────────────────────────────────────

function extractHeadings(md: string): PostHeading[] {
  return md.split('\n')
    .filter(l => /^## /.test(l))
    .map(l => {
      const text = l.slice(3).trim();
      return { text, id: slugify(text) };
    });
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function buildMeta(data: Record<string, unknown>, slug: string): PostMeta {
  const title = String(data.title ?? '');
  return {
    slug,
    title,
    metaTitle:   String(data.metaTitle  ?? title),
    description: String(data.description ?? ''),
    date:        String(data.date        ?? ''),
    author:      String(data.author      ?? 'ChurnGuard'),
    authorRole:  String(data.authorRole  ?? ''),
    authorBio:   String(data.authorBio   ?? ''),
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
    .map(filename => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
      const { data } = parseFrontmatter(raw);
      return buildMeta(data, filename.replace(/\.md$/, ''));
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | null {
  const filepath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, 'utf8');
  const { data, content } = parseFrontmatter(raw);
  return {
    ...buildMeta(data, slug),
    contentHtml: markdownToHtml(content),
    headings:    extractHeadings(content),
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
  } catch { return dateStr; }
}
