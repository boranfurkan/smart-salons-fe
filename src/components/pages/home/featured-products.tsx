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
            <HighlightedText color="#10b981">Featured</HighlightedText> Products
          </AnimatedTextWrapper>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our latest and most popular hair care equipment trusted by
            professionals worldwide
          </motion.p>
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
          <Button asChild size="lg" className="group">
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
