'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { NavLinkProps } from './types';

export function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link href={href} className="block overflow-hidden">
      <motion.div
        whileHover={{ y: -20 }}
        transition={{ ease: 'backInOut', duration: 0.5 }}
        className="h-[20px]"
      >
        <span className="flex h-[20px] items-center">{children}</span>
        <span className="flex h-[20px] items-center text-neutral-900">
          {children}
        </span>
      </motion.div>
    </Link>
  );
}
