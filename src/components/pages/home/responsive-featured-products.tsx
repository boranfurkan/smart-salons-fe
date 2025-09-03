'use client';

import { usePublicControllerGetFeaturedProducts } from '@/lib/api/generated/public/public';
import { ProductsSectionSkeleton } from '@/components/shared/skeletons/landing-skeletons';
import { useResponsive } from '@/hooks/useResponsive';
import {
  HorizontalCarousel,
  CarouselItem,
} from '@/components/ui/horizontal-carousel';
import { MobileProductCard } from '@/components/shared/mobile-product-card';
import { ProductCard } from '@/components/products/product-card';
import { motion } from 'framer-motion';
import {
  AnimatedTextWrapper,
  HighlightedText,
} from '@/components/ui/animated-text';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ResponsiveFeaturedProductsProps {
  limit?: number;
}

export function ResponsiveFeaturedProducts({
  limit = 8,
}: ResponsiveFeaturedProductsProps) {
  const {
    data: products,
    isLoading,
    error,
  } = usePublicControllerGetFeaturedProducts({
    limit,
  });

  const { isMobile, isTablet } = useResponsive();

  if (isLoading) {
    return <ProductsSectionSkeleton />;
  }

  if (error || !products?.length) {
    return null;
  }

  // Mobile/Tablet horizontal carousel view
  if (isMobile || isTablet) {
    return (
      <section id="featured-products" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8">
            <AnimatedTextWrapper className="text-2xl sm:text-3xl mb-4">
              <HighlightedText color="#10b981">Featured</HighlightedText>{' '}
              Products
            </AnimatedTextWrapper>

            <motion.p
              className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover our most popular salon equipment trusted by professionals
              worldwide.
            </motion.p>

            <motion.div
              className="flex justify-center items-center flex-wrap gap-4 text-sm text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Free shipping
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                2-year warranty
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                30-day returns
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
              {products.map((product, index) => (
                <CarouselItem key={product.id} className="pr-4">
                  <MobileProductCard
                    product={product}
                    priority={index < 4}
                    index={index}
                  />
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
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              <Link href="/products">
                Shop All Products - Over 200+ Items
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              All orders ship within 24 hours • Free shipping over $200
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  // Desktop grid view (original layout)
  return (
    <section id="featured-products" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <AnimatedTextWrapper className="mb-4">
            <HighlightedText color="#10b981">Featured</HighlightedText> Products
          </AnimatedTextWrapper>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our most popular salon equipment trusted by over 15,000
            professionals worldwide. All products come with free shipping,
            2-year warranty, and 30-day money-back guarantee.
          </motion.p>

          <motion.div
            className="flex justify-center items-center gap-6 text-sm text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Free shipping on all orders
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              2-year warranty included
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              30-day returns
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard product={product} priority={index < 4} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            asChild
            size="lg"
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <Link href="/products">
              Shop All Products - Over 200+ Items
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            All orders ship within 24 hours • Free shipping over $200
          </p>
        </motion.div>
      </div>
    </section>
  );
}
