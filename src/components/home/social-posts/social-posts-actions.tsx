'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Instagram, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const platforms = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/smartsalons',
    color:
      'hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white',
  },
  {
    name: 'TikTok',
    icon: () => (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    ),
    url: 'https://tiktok.com/@smartsalons',
    color: 'hover:bg-black hover:text-white',
  },
];

export function SocialPostsActions() {
  return (
    <motion.div
      className="text-center mt-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex flex-wrap justify-center gap-4">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <Button
              variant="outline"
              size="lg"
              asChild
              className={`group transition-all duration-300 ${platform.color}`}
            >
              <Link
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <platform.icon className="mr-2 w-4 h-4" />
                Follow on {platform.name}
                <ExternalLink className="ml-2 w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
