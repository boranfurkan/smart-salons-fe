'use client';

import { SocialPostsCarousel } from './social-posts-carousel';
import { SocialPostsSectionSkeleton } from '@/components/shared/skeletons/landing-skeletons';
import { usePublicControllerGetSocialPosts } from '@/lib/api/generated/public/public';

interface SocialPostsSectionProps {
  limit?: number;
}

export function SocialPostsSection({ limit = 8 }: SocialPostsSectionProps) {
  const { data, isLoading, error } = usePublicControllerGetSocialPosts();

  if (isLoading) {
    return <SocialPostsSectionSkeleton />;
  }

  if (error || !data?.posts?.length) {
    console.error('Failed to load social posts:', error);
    console.warn('No social posts available');
    return null;
  }

  const { posts } = data;
  const limitedPosts = posts.slice(0, limit);

  return <SocialPostsCarousel posts={limitedPosts} />;
}
