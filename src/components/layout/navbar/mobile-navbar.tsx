'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Logo } from './logo';
import { CartButton } from './cart-button';
import { MobileNavLink } from './mobile-nav-link';

interface MobileNavbarProps {
  user: any;
  isAuthenticated: boolean;
  userInitial: string;
  categories: any[];
  categoriesLoading: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function MobileNavbar({
  user,
  isAuthenticated,
  userInitial,
  categories,
  categoriesLoading,
  mobileMenuOpen,
  setMobileMenuOpen,
}: MobileNavbarProps) {
  return (
    <nav className="fixed left-0 right-0 top-4 z-50 mx-4 flex items-center justify-between rounded-lg border border-neutral-200/70 bg-white/90 px-4 py-3 backdrop-blur-md shadow-md md:hidden">
      <Logo />

      <div className="flex items-center gap-3">
        {isAuthenticated && <CartButton count={0} />}

        {isAuthenticated && (
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-800"
            aria-label="Profile"
            title={user?.firstName || user?.email || 'Profile'}
          >
            <span className="text-xs font-semibold">{userInitial}</span>
          </Link>
        )}

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col space-y-4">
              <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </MobileNavLink>

              <div className="space-y-2">
                <span className="text-sm font-medium text-neutral-900 px-3">
                  Categories
                </span>
                <div className="ml-4 space-y-1">
                  {categoriesLoading ? (
                    <div className="text-sm text-neutral-500 px-3">
                      Loading...
                    </div>
                  ) : categories && categories.length > 0 ? (
                    categories.map((c) => (
                      <MobileNavLink
                        key={c.id}
                        href={`/categories/${c.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{c.name}</span>
                          {typeof c.productCount !== 'undefined' && (
                            <span className="text-xs text-neutral-500">
                              {c.productCount}
                            </span>
                          )}
                        </div>
                      </MobileNavLink>
                    ))
                  ) : (
                    <div className="text-sm text-neutral-500 px-3">
                      No categories
                    </div>
                  )}
                </div>
              </div>

              <MobileNavLink
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </MobileNavLink>

              <div className="pt-4 border-t border-neutral-200">
                {!isAuthenticated && (
                  <MobileNavLink
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </MobileNavLink>
                )}
                <MobileNavLink
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </MobileNavLink>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
