'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useMeasure from 'react-use-measure';
import { SocialPostCard } from './social-post-card';
import { SocialPostsHeader } from './social-posts-header';
import { SocialPostsActions } from './social-posts-actions';
import type { SocialPost } from './types';

const CARD_WIDTH = 280;
const CARD_HEIGHT = 350;
const MARGIN = 16;
const CARD_SIZE = CARD_WIDTH + MARGIN;

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

interface SocialPostsCarouselProps {
  posts: SocialPost[];
}

export function SocialPostsCarousel({ posts }: SocialPostsCarouselProps) {
  const [ref, { width }] = useMeasure();
  const [offset, setOffset] = useState(0);

  // Determine how many cards to show based on screen width
  const getCardBuffer = () => {
    if (width > BREAKPOINTS.xl) return 4;
    if (width > BREAKPOINTS.lg) return 3;
    if (width > BREAKPOINTS.md) return 2;
    if (width > BREAKPOINTS.sm) return 2;
    return 1;
  };

  const CARD_BUFFER = getCardBuffer();

  const CAN_SHIFT_LEFT = offset < 0;
  const CAN_SHIFT_RIGHT =
    Math.abs(offset) < CARD_SIZE * (posts.length - CARD_BUFFER);

  const shiftLeft = () => {
    if (!CAN_SHIFT_LEFT) return;
    setOffset((prev) => prev + CARD_SIZE);
  };

  const shiftRight = () => {
    if (!CAN_SHIFT_RIGHT) return;
    setOffset((prev) => prev - CARD_SIZE);
  };

  if (!posts.length) {
    return null;
  }

  return (
    <section className="py-16" ref={ref}>
      <div className="container mx-auto px-4">
        <SocialPostsHeader />

        <div className="relative overflow-hidden">
          {/* Cards Container */}
          <div className="mx-auto max-w-7xl p-2">
            <motion.div
              animate={{
                x: offset,
              }}
              className="flex"
            >
              {posts.map((post) => (
                <SocialPostCard
                  key={post.id}
                  post={post}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                  margin={MARGIN}
                />
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          {posts.length > CARD_BUFFER && (
            <>
              <motion.button
                initial={false}
                animate={{
                  x: CAN_SHIFT_LEFT ? '0%' : '-100%',
                }}
                className="absolute left-0 top-[60%] z-30 rounded-r-xl bg-white/90 backdrop-blur-sm p-3 pl-2 text-2xl text-gray-700 shadow-lg transition-[padding] hover:bg-white hover:pl-3 hover:shadow-xl"
                onClick={shiftLeft}
                aria-label="Previous posts"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                initial={false}
                animate={{
                  x: CAN_SHIFT_RIGHT ? '0%' : '100%',
                }}
                className="absolute right-0 top-[60%] z-30 rounded-l-xl bg-white/90 backdrop-blur-sm p-3 pr-2 text-2xl text-gray-700 shadow-lg transition-[padding] hover:bg-white hover:pr-3 hover:shadow-xl"
                onClick={shiftRight}
                aria-label="Next posts"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}
        </div>

        <SocialPostsActions />
      </div>
    </section>
  );
}
