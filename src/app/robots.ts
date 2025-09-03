import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.salonssmart.uk';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/dashboard/',
        '/auth/reset-password/',
        '/verify-email/',
        '/_next/',
        '/temp/',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
