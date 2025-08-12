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

          <div className="w-[600px] max-w-[90vw] rounded-md bg-white border border-neutral-200 shadow-xl overflow-hidden">
            {categoriesLoading ? (
              <div className="p-6 text-sm text-neutral-500">Loading...</div>
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-3 divide-x divide-neutral-200">
                {categories.slice(0, 6).map((category) => (
                  <CategoryDropdownCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-sm text-neutral-500">No categories</div>
            )}

            {/* View All Categories Link */}
            {categories && categories.length > 0 && (
              <div className="border-t border-neutral-200 p-4 bg-neutral-50">
                <Link
                  href="/#categories"
                  className="group flex items-center justify-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <span>View All Categories</span>
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
  const imageUrl =
    typeof category.imageUrl === 'string' && category.imageUrl
      ? category.imageUrl
      : `https://picsum.photos/300/200?random=${category.id}`;

  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="group relative flex h-32 flex-col justify-end overflow-hidden p-4 transition-colors hover:bg-neutral-50">
        {/* Product Count Badge */}
        <div className="absolute left-2 top-2 z-10 flex items-center gap-1 text-xs text-neutral-500 transition-colors duration-300 group-hover:text-neutral-700">
          <Package className="w-3 h-3" />
          <span>{category.productCount}</span>
        </div>

        {/* Category Title */}
        <div className="relative z-10">
          <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 transition-transform duration-300 group-hover:-translate-y-1">
            {category.name}
          </h3>
        </div>

        {/* Background Image */}
        <div
          className="absolute bottom-0 left-0 right-0 top-0 opacity-0 blur-sm grayscale transition-all duration-300 group-hover:opacity-50 group-hover:blur-none group-hover:grayscale-0"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Hover corners effect */}
        <span className="absolute left-[1px] top-[1px] z-10 h-2 w-[1px] origin-top scale-0 bg-blue-500 transition-all duration-300 group-hover:scale-100" />
        <span className="absolute left-[1px] top-[1px] z-10 h-[1px] w-2 origin-left scale-0 bg-blue-500 transition-all duration-300 group-hover:scale-100" />
        <span className="absolute bottom-[1px] right-[1px] z-10 h-2 w-[1px] origin-bottom scale-0 bg-blue-500 transition-all duration-300 group-hover:scale-100" />
        <span className="absolute bottom-[1px] right-[1px] z-10 h-[1px] w-2 origin-right scale-0 bg-blue-500 transition-all duration-300 group-hover:scale-100" />
      </div>
    </Link>
  );
}
