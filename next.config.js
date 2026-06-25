/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Proper cache headers — static marketing/blog pages are cacheable;
  // API routes and dashboard are not.
  async headers() {
    return [
      // API routes — never cache
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      // Dashboard and admin — never cache (user-specific data)
      {
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      // Blog posts — cache 1 hour at edge, revalidate in background
      {
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
      // Static marketing pages — cache 1 hour at edge
      {
        source: '/(|pricing|audit|docs|privacy|terms)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Image optimisation — allow Vercel OG images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'churnguardapp.com' },
    ],
  },
};
