'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { ProductsSectionSkeleton } from '@/components/shared/skeletons/landing-skeletons';
import {
  AnimatedTextWrapper,
  HighlightedText,
} from '@/components/ui/animated-text';
import { usePublicControllerGetFeaturedProducts } from '@/lib/api/generated/public/public';

interface FeaturedProductsProps {
  limit?: number;
}

export function FeaturedProducts({ limit = 8 }: FeaturedProductsProps) {
  const {
    data: products,
    isLoading,
    error,
  } = usePublicControllerGetFeaturedProducts({
    limit,
  });

  if (isLoading) {
    return <ProductsSectionSkeleton />;
  }

  if (error || !products?.length) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <AnimatedTextWrapper className="mb-4">
            <HighlightedText color="#10b981">Bestselling</HighlightedText>{' '}
            Professional Equipment
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
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12"
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
          <Button asChild size="lg" variant="green">
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
