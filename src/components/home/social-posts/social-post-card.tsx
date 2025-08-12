'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Facebook, Instagram, Play, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SocialPostCardProps } from './types';

const getStringValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'url' in value) {
    return (value as { url: string }).url;
  }
  return '';
};

export function SocialPostCard({
  post,
  width,
  height,
  margin,
}: SocialPostCardProps) {
  const displayImage =
    getStringValue(post.imageUrl) ||
    `https://picsum.photos/400/400?random=${post.id}`;

  const platform = getStringValue(post.platform);
  const description = getStringValue(post.description);
  const publisher = getStringValue(post.publisher);

  const getPlatformIcon = () => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'tiktok':
        return <Play className="w-4 h-4" />;
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getPlatformColor = () => {
    switch (platform.toLowerCase()) {
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
      style={{
        marginRight: margin,
      }}
      data-lenis-prevent
      data-prevent
    >
      <div
        className="relative shrink-0 cursor-pointer rounded-2xl bg-white shadow-md transition-all hover:scale-[1.015] hover:shadow overflow-hidden"
        style={{
          width,
          height,
          backgroundImage: `url(${displayImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={displayImage}
            alt={description || `${platform} post`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 transition-all duration-300 group-hover:from-black/80 group-hover:to-black/90" />

        {/* Platform Badge */}
        <div className="absolute top-4 left-4 z-20">
          <Badge
            variant="secondary"
            className={`text-white border-0 shadow-lg ${getPlatformColor()}`}
          >
            {getPlatformIcon()}
            <span className="ml-1.5 text-xs font-medium uppercase tracking-wide">
              {platform}
            </span>
          </Badge>
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-20 p-6 text-white flex flex-col justify-end">
          {publisher && (
            <motion.p
              className="text-sm font-semibold text-purple-300 mb-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {publisher}
            </motion.p>
          )}

          {description && (
            <motion.p
              className="text-lg font-bold mb-3 line-clamp-3 leading-tight"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}

          {post.hashtags.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {post.hashtags.slice(0, 3).map((hashtag, index) => (
                <span
                  key={index}
                  className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full backdrop-blur-sm"
                >
                  {hashtag}
                </span>
              ))}
              {post.hashtags.length > 3 && (
                <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  +{post.hashtags.length - 3}
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* External Link Icon */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}
