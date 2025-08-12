'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Smart Salons"
      className="ml-1 mr-1 block overflow-hidden"
    >
      <motion.div
        whileHover={{ y: -20 }}
        transition={{ ease: 'backInOut', duration: 0.5 }}
        className="h-[20px]"
      >
        <span className="flex h-[20px] items-center text-neutral-600">
          Smart
        </span>
        <span className="flex h-[20px] items-center text-neutral-900">
          Salons
        </span>
      </motion.div>
    </Link>
  );
}
