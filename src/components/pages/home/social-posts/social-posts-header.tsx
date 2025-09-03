'use client';

import { motion } from 'framer-motion';
import { AnimatedTextWrapper } from '@/components/ui/animated-text';

export function SocialPostsHeader() {
  return (
    <div className="text-center mb-12">
      <AnimatedTextWrapper className="mb-4">
        Follow Our Journey
        <span className="text-gray-500 block text-lg font-normal mt-2">
          Latest updates from our social media
        </span>
      </AnimatedTextWrapper>
      <motion.p
        className="text-lg text-gray-600 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Stay connected with the latest trends, tutorials, and behind-the-scenes
        content from our vibrant beauty community
      </motion.p>
    </div>
  );
}
