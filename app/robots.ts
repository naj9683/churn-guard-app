import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/admin/', '/signout'],
      },
    ],
    sitemap: 'https://churnguardapp.com/sitemap.xml',
  };
}
