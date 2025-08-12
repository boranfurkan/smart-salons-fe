'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { NavLink } from './nav-link';

interface CategoriesDropdownProps {
  catOpen: boolean;
  categories: any[];
  categoriesLoading: boolean;
}

export function CategoriesDropdown({
  catOpen,
  categories,
  categoriesLoading,
}: CategoriesDropdownProps) {
  return (
    <AnimatePresence>
      {catOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ translateX: '-50%' }}
          className="absolute left-1/2 top-12 z-50 text-black"
        >
          {/* hover buffer above to prevent flicker when moving cursor */}
          <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
          {/* pointer arrow */}
          <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white shadow" />

          <div className="w-[520px] max-w-[80vw] rounded-md bg-white p-4 shadow-xl">
            {categoriesLoading ? (
              <div className="text-sm text-neutral-500">Loading...</div>
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categories/${c.slug}`}
                    className="rounded border-2 border-neutral-200 bg-white p-3 text-sm transition-colors hover:bg-neutral-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-neutral-900">
                        {c.name}
                      </span>
                      {typeof c.productCount !== 'undefined' && (
                        <span className="text-xs text-neutral-500">
                          {c.productCount}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-neutral-500">No categories</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
