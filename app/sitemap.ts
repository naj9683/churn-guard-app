import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

const BASE = 'https://churnguardapp.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE}/audit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/alternatives`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/alternatives/churnzero`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/alternatives/gainsight`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/alternatives/churnkey`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/alternatives/totango`,
      lastModified: new Date('2026-08-25'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/alternatives/baremetrics`,
      lastModified: new Date('2026-08-25'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/alternatives/planhat`,
      lastModified: new Date('2026-08-25'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/alternatives/vitally`,
      lastModified: new Date('2026-08-25'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/alternatives/custify`,
      lastModified: new Date('2026-08-25'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
