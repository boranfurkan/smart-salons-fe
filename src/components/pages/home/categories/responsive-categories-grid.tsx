'use client';

import { usePublicControllerGetCategories } from '@/lib/api/generated/public/public';
import { CategoriesSectionSkeleton } from '@/components/shared/skeletons/landing-skeletons';
import { useResponsive } from '@/hooks/useResponsive';
import {
  HorizontalCarousel,
  CarouselItem,
} from '@/components/ui/horizontal-carousel';
import { MobileCategoryCard } from '@/components/shared/mobile-category-card';
import { CategoryCard } from './category-card';
import { TitleCard } from './title-card';
import { motion } from 'framer-motion';
import {
  AnimatedTextWrapper,
  HighlightedText,
} from '@/components/ui/animated-text';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const ResponsiveCategoriesGrid = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = usePublicControllerGetCategories();

  const { isMobile, isTablet } = useResponsive();

  if (isLoading) {
    return <CategoriesSectionSkeleton />;
  }

  if (error || !categories?.length) {
    return null;
  }

  // Mobile/Tablet horizontal carousel view
  if (isMobile || isTablet) {
    return (
      <section id="categories" className="py-12 bg-neutral-900 text-neutral-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8">
            <AnimatedTextWrapper className="mb-4 text-white text-2xl sm:text-3xl">
              Shop by{' '}
              <HighlightedText color="#f59e0b">Category</HighlightedText>
            </AnimatedTextWrapper>
            <motion.p
              className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find exactly what you need from our comprehensive range of
              professional salon equipment.
            </motion.p>

            {/* Feature indicators */}
            <motion.div
              className="flex justify-center items-center flex-wrap gap-4 text-sm text-neutral-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                Professional grade
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                Competitive pricing
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                Fast delivery
              </div>
            </motion.div>
          </div>

          {/* Horizontal Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <HorizontalCarousel
              className="mb-8"
              options={{
                align: 'start',
                containScroll: 'trimSnaps',
                dragFree: true,
              }}
            >
              {categories.map((category, index) => (
                <CarouselItem key={category.id} className="pr-4">
                  <MobileCategoryCard category={category} index={index} />
                </CarouselItem>
              ))}
            </HorizontalCarousel>
          </motion.div>

          {/* View All Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-neutral-900"
            >
              <Link href="/products">
                Browse All Categories
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  // Desktop grid view (original layout)
  const rows = [];
  const categoriesWithTitle = [null, ...categories];

  for (let i = 0; i < categoriesWithTitle.length; i += 4) {
    rows.push(categoriesWithTitle.slice(i, i + 4));
  }

  return (
    <section id="categories" className="py-16 bg-neutral-900 text-neutral-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <AnimatedTextWrapper className="mb-4 text-white">
            Shop by <HighlightedText color="#f59e0b">Category</HighlightedText>
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

          <motion.div
            className="flex justify-center items-center gap-6 text-sm text-neutral-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
              Professional grade quality
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
              Competitive pricing
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
              Fast delivery
            </div>
          </motion.div>
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
              className={`grid grid-cols-1 divide-y divide-neutral-700 border border-neutral-700 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:divide-x sm:divide-y-0 ${
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
                  {category ? (
                    <CategoryCard category={category} />
                  ) : (
                    <TitleCard />
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
