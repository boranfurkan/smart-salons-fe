'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { LogoNavbar } from './logo';
import { NavLink } from './nav-link';
import { Button } from '@/components/ui/button';
import { CartButton } from './cart-button';
import { CategoriesDropdown } from './categories-dropdown';
import type { User } from '@/context/auth-context';

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
}

interface DesktopNavbarProps {
  user: User | null;
  isAuthenticated: boolean;
  userInitial: string;
  categories: Category[];
  categoriesLoading: boolean;
  catOpen: boolean;
  setCatOpen: (open: boolean) => void;
}

export function DesktopNavbar({
  user,
  isAuthenticated,
  userInitial,
  categories,
  categoriesLoading,
  catOpen,
  setCatOpen,
}: DesktopNavbarProps) {
  const catRef = useRef<HTMLDivElement | null>(null);

  return (
    <nav className="fixed left-1/2 top-4 z-50 hidden w-fit -translate-x-1/2 items-center gap-4 rounded-lg border border-neutral-900/50 bg-white/90 px-2 py-2 text-sm text-black backdrop-blur-md shadow-md md:flex">
      <LogoNavbar />
      <div className="mx-1 h-5 w-px bg-neutral-900/50" />

      <NavLink href="/">Home</NavLink>

      {/* Categories with small hover dropdown */}
      <div
        ref={catRef}
        className="relative"
        onMouseEnter={() => setCatOpen(true)}
        onMouseLeave={() => setCatOpen(false)}
      >
        <NavLink href="#">Categories</NavLink>
        <CategoriesDropdown
          catOpen={catOpen}
          categories={categories}
          categoriesLoading={categoriesLoading}
        />
      </div>

      <NavLink href="/products">All Products</NavLink>
      <div className="mx-1 h-5 w-px bg-neutral-900/50" />
      <div className="flex items-center gap-2">
        {isAuthenticated && <CartButton count={0} />}
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-neutral-800"
            aria-label="Profile"
            title={user?.firstName || user?.email || 'Profile'}
          >
            <span className="text-xs font-semibold">{userInitial}</span>
          </Link>
        ) : (
          <Button asChild variant="default" theme="light" size="sm">
            <Link href="/auth/signin">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
