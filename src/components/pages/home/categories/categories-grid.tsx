'use client';

import { motion } from 'framer-motion';
import { CategoriesSectionSkeleton } from '@/components/shared/skeletons/landing-skeletons';
import { usePublicControllerGetCategories } from '@/lib/api/generated/public/public';
import { AnimatedTextWrapper } from '@/components/ui/animated-text';
import { CategoryCard } from './category-card';
import { TitleCard } from './title-card';

export const CategoriesGrid = () => {
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

  // Split categories into rows based on screen size
  // For mobile: 1 column, tablet: 2 columns, desktop: 3 columns, large: 4 columns
  const rows = [];
  const categoriesWithTitle = [null, ...categories]; // Add null for title card position

  // Create rows of 4 items for large screens
  for (let i = 0; i < categoriesWithTitle.length; i += 4) {
    rows.push(categoriesWithTitle.slice(i, i + 4));
  }

  return (
    <section id="categories" className="py-16 bg-neutral-900 text-neutral-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <AnimatedTextWrapper className="mb-2 text-white">
            Shop by Category
          </AnimatedTextWrapper>
          <motion.p
            className="text-lg text-neutral-300 max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Find exactly what you need from our comprehensive range of
            professional salon equipment. All categories feature premium quality
            products with competitive pricing.
          </motion.p>
          {/* Removed decorative dots above section titles as requested */}
        </div>

        {/* Categories Grid */}
        <motion.div
          className="mx-auto max-w-7xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid grid-cols-2 divide-y divide-neutral-700 border border-neutral-700 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:divide-x sm:divide-y-0 ${
                rowIndex > 0 ? 'border-t-0' : ''
              }`}
            >
              {row.map((category, colIndex) => (
                <motion.div
                  key={category?.id || `title-${rowIndex}-${colIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: (rowIndex * 4 + colIndex) * 0.1,
                  }}
                >
                  {category === null ? (
                    <TitleCard />
                  ) : (
                    <CategoryCard category={category} />
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
