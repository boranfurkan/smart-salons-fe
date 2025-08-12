'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Logo } from './logo';
import { NavLink } from './nav-link';
import { JoinButton } from './join-button';
import { CartButton } from './cart-button';
import { CategoriesDropdown } from './categories-dropdown';

interface DesktopNavbarProps {
  user: any;
  isAuthenticated: boolean;
  userInitial: string;
  categories: any[];
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
    <nav className="fixed left-1/2 top-6 z-50 hidden w-fit -translate-x-1/2 items-center gap-4 rounded-lg border border-neutral-200/70 bg-white/90 px-2 py-2 text-sm text-neutral-600 backdrop-blur-md shadow-md md:flex">
      <Logo />

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
      {/* Right-side actions inside bar */}
      <div className="mx-1 h-5 w-px bg-neutral-300/60" />
      {isAuthenticated && <CartButton count={0} />}
      {isAuthenticated ? (
        <Link
          href="/dashboard"
          className="ml-1 mr-1 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-neutral-800"
          aria-label="Profile"
          title={user?.firstName || user?.email || 'Profile'}
        >
          <span className="text-xs font-semibold">{userInitial}</span>
        </Link>
      ) : (
        <JoinButton href="/auth/signin">Login</JoinButton>
      )}

      <JoinButton href="/products">Shop</JoinButton>
    </nav>
  );
}
