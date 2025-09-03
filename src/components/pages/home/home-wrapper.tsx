'use client';

import { LandingCarousel } from '@/components/pages/home/landing-carousel';
import { FeaturedProducts } from '@/components/pages/home/featured-products';
import { TrustIndicators } from '@/components/pages/home/trust-indicators';
import { ValuePropositions } from '@/components/pages/home/value-propositions';

import CategoriesWrapper from '@/components/pages/home/categories/categories-wrapper';

import { SocialPostsSection } from '@/components/pages/home/social-posts';

export function HomeWrapper() {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <LandingCarousel />

      {/* 1) Bestseller Products */}
      <FeaturedProducts limit={4} />

      {/* 2) Shop by Category */}
      <CategoriesWrapper />

      {/* 3) Why Choose Us */}
      <ValuePropositions />

      {/* 4) Trusted by Professionals */}
      <TrustIndicators />

      {/* Social Posts */}
      <SocialPostsSection limit={10} />
    </div>
  );
}
