'use client';

import Link from 'next/link';
import { ArrowUpRight, Tag } from 'lucide-react';
import { usePublicControllerGetCategories } from '@/lib/api/generated/public/public';

export function CategoriesLinks() {
  const { data: categories } = usePublicControllerGetCategories();

  return (
    <div>
      <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-6">
        Shop Categories
      </h4>

      <ul className="space-y-3">
        {categories?.slice(0, 5).map((category) => (
          <li key={category.id}>
            <Link
              href={`/categories/${category.slug}`}
              className="group flex items-center justify-between text-neutral-300 hover:text-white transition-colors py-1"
            >
              <span>{category.name}</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        ))}

        {categories && categories.length > 5 && (
          <li>
            <Link
              href="/categories"
              className="group flex items-center justify-between text-blue-400 hover:text-blue-300 transition-colors py-1 font-medium"
            >
              <span>View All Categories</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </li>
        )}
      </ul>

      <div className="mt-8 p-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-blue-400" />
          <h5 className="text-sm font-medium text-white">
            Featured Collection
          </h5>
        </div>
        <p className="text-xs text-neutral-400 mb-3">
          Discover our most popular professional tools and equipment.
        </p>
        <Link
          href="/featured"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          Explore Featured
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
