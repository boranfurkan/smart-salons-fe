'use client';

import { LandingCarousel } from '@/components/pages/home/landing-carousel';
import { ResponsiveFeaturedProducts } from '@/components/pages/home/responsive-featured-products';
import { ResponsiveTrustIndicators } from '@/components/pages/home/responsive-trust-indicators';
import { ResponsiveValuePropositions } from '@/components/pages/home/responsive-value-propositions';

import { ResponsiveCategoriesGrid } from '@/components/pages/home/categories/responsive-categories-grid';

import { SocialPostsSection } from '@/components/pages/home/social-posts';

export function HomeWrapper() {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <LandingCarousel />

      {/* Trust Indicators */}
      <ResponsiveTrustIndicators />

      {/* Featured Products */}
      <ResponsiveFeaturedProducts limit={8} />

      {/* Value Propositions */}
      <ResponsiveValuePropositions />

      {/* Categories Section */}
      <ResponsiveCategoriesGrid />

      {/* Social Posts */}
      <SocialPostsSection limit={10} />
    </div>
  );
}
