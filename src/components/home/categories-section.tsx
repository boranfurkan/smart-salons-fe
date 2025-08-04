'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoriesSectionSkeleton } from '@/components/shared/skeletons/landing-skeletons';
import { usePublicControllerGetCategories } from '@/lib/api/generated/public/public';

export function CategoriesSection() {
  const {
    data: categories,
    isLoading,
    error,
  } = usePublicControllerGetCategories();

  if (isLoading) {
    return <CategoriesSectionSkeleton />;
  }

  if (error || !categories?.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of professional hair care equipment
            and accessories
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description?: string;
    slug: string;
    imageUrl?: any; // Due to API generation issues, we'll handle this as any and cast
    productCount: number;
  };
}

function CategoryCard({ category }: CategoryCardProps) {
  // Use actual imageUrl or fallback to placeholder
  const imageUrl =
    typeof category.imageUrl === 'string' && category.imageUrl
      ? category.imageUrl
      : `https://picsum.photos/400/300?random=${category.id}`;

  return (
    <Link href={`/categories/${category.slug}`}>
      <motion.div
        className="group cursor-pointer relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300"
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Category Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Category Info Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="p-6 text-white">
              <h3 className="text-xl font-bold mb-1 group-hover:text-blue-200 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm opacity-90 mb-2">
                {category.productCount}{' '}
                {category.productCount === 1 ? 'product' : 'products'}
              </p>
              {category.description && (
                <p className="text-xs opacity-75 line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Arrow Icon */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Category Details */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h4>
              <p className="text-sm text-gray-500">
                {category.productCount} items
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
