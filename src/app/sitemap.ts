import { config } from '@/constants/config';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const API_URL = config.BACKEND_API_URL;
  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.salonssmart.uk';

  try {
    const response = await fetch(`${API_URL}/public/sitemap.xml`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return getStaticSitemap(BASE_URL);
    }

    const sitemapXml = await response.text();

    return parseSitemapXml(sitemapXml, BASE_URL);
  } catch (error) {
    console.error('Error fetching sitemap from backend:', error);
    return getStaticSitemap(BASE_URL);
  }
}

function getStaticSitemap(baseUrl: string): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}

function parseSitemapXml(
  xmlString: string,
  baseUrl: string
): MetadataRoute.Sitemap {
  const urlMatches = xmlString.match(/<url>[\s\S]*?<\/url>/g);

  if (!urlMatches) {
    return getStaticSitemap(baseUrl);
  }

  return urlMatches.map((urlBlock) => {
    const locMatch = urlBlock.match(/<loc>(.*?)<\/loc>/);
    const lastmodMatch = urlBlock.match(/<lastmod>(.*?)<\/lastmod>/);
    const changefreqMatch = urlBlock.match(/<changefreq>(.*?)<\/changefreq>/);
    const priorityMatch = urlBlock.match(/<priority>(.*?)<\/priority>/);

    return {
      url: locMatch ? locMatch[1] : baseUrl,
      lastModified: lastmodMatch ? new Date(lastmodMatch[1]) : new Date(),
      changeFrequency: (changefreqMatch ? changefreqMatch[1] : 'weekly') as
        | 'weekly'
        | 'daily'
        | 'monthly',
      priority: priorityMatch ? parseFloat(priorityMatch[1]) : 0.5,
    };
  });
}
