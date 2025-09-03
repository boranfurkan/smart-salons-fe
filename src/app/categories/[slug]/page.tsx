import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryDetailView } from '@/components/pages/categories/category-detail-view';
import { generateCategoryMetadata } from '@/lib/utils/seo';
import { config } from '@/constants/config';

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  try {
    const API_URL = config.BACKEND_API_URL;
    const response = await fetch(`${API_URL}/public/categories/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: 'Category Not Found - Smart Salons',
      description: 'The category you are looking for was not found.',
    };
  }

  const category = await getCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found - Smart Salons',
      description: 'The category you are looking for was not found.',
    };
  }

  return generateCategoryMetadata(category);
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  return <CategoryDetailView slug={slug} />;
}
