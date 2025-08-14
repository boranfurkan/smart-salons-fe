import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/components/pages/products/detail/product-detail-view';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Product Details - Smart Salons`,
    description: 'View detailed information about this product',
  };
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
