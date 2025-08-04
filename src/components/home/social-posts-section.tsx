'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Instagram, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SocialPostsSectionSkeleton } from '@/components/shared/skeletons/landing-skeletons';
import { usePublicControllerGetSocialPosts } from '@/lib/api/generated/public/public';

interface SocialPostsSectionProps {
  limit?: number;
}

export function SocialPostsSection({ limit = 6 }: SocialPostsSectionProps) {
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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Follow Us on Social Media
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, tutorials, and
            behind-the-scenes content from our community
          </p>
        </motion.div>

        {/* Social Posts Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {posts.slice(0, 6).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <SocialPostCard post={post} />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              <Link
                href="https://instagram.com/smartsalons"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Instagram className="mr-2 w-4 h-4" />
                Follow on Instagram
                <ExternalLink className="ml-2 w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link
                href="https://tiktok.com/@smartsalons"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Play className="mr-2 w-4 h-4" />
                Follow on TikTok
                <ExternalLink className="ml-2 w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface SocialPostCardProps {
  post: {
    id: string;
    platform: string;
    postUrl: string;
    imageUrl?: string;
    videoUrl?: string;
    description?: string;
    publisher?: string;
    hashtags: string[];
  };
}

function SocialPostCard({ post }: SocialPostCardProps) {
  const displayImage =
    post.imageUrl || `https://picsum.photos/300/300?random=${post.id}`;

  const getPlatformIcon = () => {
    switch (post.platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'tiktok':
        return <Play className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getPlatformColor = () => {
    switch (post.platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'tiktok':
        return 'bg-black';
      case 'facebook':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-sky-500';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Link
      href={post.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <motion.div
        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Post Image/Video */}
        <Image
          src={displayImage}
          alt={post.description || `${post.platform} post`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Platform Badge */}
        <div className="absolute top-2 left-2">
          <Badge
            variant="secondary"
            className={`text-white border-0 ${getPlatformColor()}`}
          >
            {getPlatformIcon()}
            <span className="ml-1 text-xs font-medium">{post.platform}</span>
          </Badge>
        </div>

        {/* Video Indicator */}
        {post.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="w-6 h-6 text-gray-900" />
            </div>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="text-white">
            {post.publisher && (
              <p className="text-xs font-medium opacity-90 mb-1">
                @{post.publisher}
              </p>
            )}
            {post.description && (
              <p className="text-xs opacity-75 line-clamp-2 mb-1">
                {post.description}
              </p>
            )}
            {post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.hashtags.slice(0, 2).map((hashtag, index) => (
                  <span key={index} className="text-xs text-blue-300">
                    {hashtag}
                  </span>
                ))}
                {post.hashtags.length > 2 && (
                  <span className="text-xs text-blue-300">
                    +{post.hashtags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* External Link Icon */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
            <ExternalLink className="w-3 h-3 text-white" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
