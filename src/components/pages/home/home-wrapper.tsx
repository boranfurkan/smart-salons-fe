'use client';

import { LandingNavbar } from '@/components/layout/landing-navbar';
import { LandingCarousel } from '@/components/home/landing-carousel';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CategoriesSection } from '@/components/home/categories-section';
import { SocialPostsSection } from '@/components/home/social-posts-section';
import { Footer } from '@/components/layout/footer';

export function HomeWrapper() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Carousel */}
      <LandingCarousel />

      {/* Featured Products */}
      <FeaturedProducts limit={8} />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Social Posts */}
      <SocialPostsSection limit={6} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
