import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/components/pages/products/detail/product-detail-view';
import { generateProductMetadata } from '@/lib/utils/seo';
import { config } from '@/constants/config';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const API_URL = config.BACKEND_API_URL;
    const response = await fetch(`${API_URL}/public/products/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: 'Product Not Found - Smart Salons',
      description: 'The product you are looking for was not found.',
    };
  }

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found - Smart Salons',
      description: 'The product you are looking for was not found.',
    };
  }

  return generateProductMetadata(product);
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  return <ProductDetailView slug={slug} />;
}
