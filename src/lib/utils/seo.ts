import { Metadata } from 'next';
import type {
  ProductDto,
  CategoryDto,
} from '@/lib/api/generated/smartSalonsAPI.schemas';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.salonssmart.uk';
const SITE_NAME = 'Smart Salons';
const DEFAULT_DESCRIPTION =
  'Discover premium hair salon furniture and equipment in the UK. Professional styling chairs, shampoo units, reception desks and more.';

export function generateProductMetadata(product: ProductDto): Metadata {
  const seo = product.seo;
  const title = seo?.metaTitle || `${product.name} - ${SITE_NAME}`;
  const description =
    seo?.metaDescription || product.description || DEFAULT_DESCRIPTION;
  const url = `${BASE_URL}/products/${product.slug}`;
  const ogImageUrl = seo?.ogImage || product.images?.[0]?.url;

  return {
    title,
    description,
    keywords: seo?.metaKeywords,
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url,
      siteName: SITE_NAME,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl as string,
              width: 1200,
              height: 630,
              alt: product.name,
            },
          ]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle || seo?.ogTitle || title,
      description: seo?.twitterDescription || seo?.ogDescription || description,
      images:
        seo?.twitterImage || ogImageUrl
          ? ([seo?.twitterImage || ogImageUrl] as string[])
          : undefined,
    },
    alternates: {
      canonical: seo?.canonicalUrl || url,
    },
  };
}

export function generateCategoryMetadata(category: CategoryDto): Metadata {
  const seo = category.seo;
  const title = seo?.metaTitle || `${category.name} - ${SITE_NAME}`;
  const description =
    seo?.metaDescription ||
    category.description ||
    `Explore ${category.name} products at ${SITE_NAME}`;
  const url = `${BASE_URL}/categories/${category.slug}`;
  const ogImageUrl = seo?.ogImage || category.imageUrl;

  return {
    title,
    description,
    keywords: seo?.metaKeywords,
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url,
      siteName: SITE_NAME,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl as string,
              width: 1200,
              height: 630,
              alt: category.name,
            },
          ]
        : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle || seo?.ogTitle || title,
      description: seo?.twitterDescription || seo?.ogDescription || description,
      images:
        seo?.twitterImage || ogImageUrl
          ? ([seo?.twitterImage || ogImageUrl] as string[])
          : undefined,
    },
    alternates: {
      canonical: seo?.canonicalUrl || url,
    },
  };
}

// JSON-LD structured data generators
export function generateProductJsonLd(product: ProductDto) {
  const baseUrl = BASE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.map((img) => img.url) || [],
    url: `${baseUrl}/products/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'GBP',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/products/${product.slug}`,
    },
    category: product.category.name,
    sku: product.id,
  };
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      // Add social media URLs here
    ],
  };
}
