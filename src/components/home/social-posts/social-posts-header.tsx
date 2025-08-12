'use client';

import { motion } from 'framer-motion';

export function SocialPostsHeader() {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Follow Our Journey
        <span className="text-gray-500 block text-lg font-normal mt-2">
          Latest updates from our social media
        </span>
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Stay connected with the latest trends, tutorials, and behind-the-scenes
        content from our vibrant beauty community
      </p>
    </motion.div>
  );
}
