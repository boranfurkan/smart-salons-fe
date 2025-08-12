'use client';

import { LandingCarousel } from '@/components/home/landing-carousel';
import { FeaturedProducts } from '@/components/home/featured-products';

import { Footer } from '@/components/layout/footer';
import CategoriesWrapper from '@/components/home/categories/categories-wrapper';

import { SocialPostsSection } from '@/components/home/social-posts';

export function HomeWrapper() {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <LandingCarousel />

      {/* Featured Products */}
      <FeaturedProducts limit={8} />

      {/* Categories Section */}
      <CategoriesWrapper />

      {/* Social Posts */}
      <SocialPostsSection limit={10} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
