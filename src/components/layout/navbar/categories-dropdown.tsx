'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Package } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
}

interface CategoriesDropdownProps {
  catOpen: boolean;
  categories: Category[];
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
          className="absolute left-1/2 top-12 z-50"
        >
          {/* hover buffer above to prevent flicker when moving cursor */}
          <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
          {/* pointer arrow */}
          <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white border-l border-t border-neutral-200 shadow-t" />

          <div className="w-[400px] max-w-[90vw] rounded-lg bg-white border border-neutral-200 shadow-xl overflow-hidden">
            {categoriesLoading ? (
              <div className="p-6 text-sm text-neutral-500">Loading...</div>
            ) : categories && categories.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto">
                {categories.slice(0, 8).map((category) => (
                  <CategoryDropdownCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-sm text-neutral-500">No categories</div>
            )}

            {/* View All Categories Link */}
            {categories && categories.length > 8 && (
              <div className="border-t border-neutral-200 p-4 bg-neutral-50">
                <Link
                  href="/products"
                  className="group flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>View All Categories ({categories.length})</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CategoryDropdownCard({ category }: { category: Category }) {
  return (
    <Link href={`/products?categoryId=${category.id}`}>
      <div className="group block p-4 transition-all duration-200 hover:bg-blue-50 border-b border-neutral-100 last:border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
              {category.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
              <Package className="w-3 h-3" />
              <span>{category.productCount} products</span>
            </div>
          </div>

          {/* Arrow indicator */}
          <svg
            className="w-4 h-4 text-neutral-400 group-hover:text-blue-500 transition-all duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
