'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid2X2, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';

const NavItem = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: any;
}) => {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== '/' && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-md text-[11px] ${
        active ? 'text-green-700' : 'text-gray-600'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

export function MobileBottomNav() {
  const { isAuthenticated } = useAuth();
  const { cartItemsCount } = useCart();

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <nav className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white/90 backdrop-blur shadow-md px-3 py-1 flex items-center gap-1">
        <NavItem href="/" label="Home" icon={Home} />
        <NavItem href="/products" label="Shop" icon={Grid2X2} />
        <div className="relative flex-1">
          <NavItem href="/cart" label="Cart" icon={ShoppingCart} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 right-6 bg-green-600 text-white text-[10px] rounded-full px-1.5 py-0.5">
              {cartItemsCount}
            </span>
          )}
        </div>
        <NavItem
          href={isAuthenticated ? '/dashboard' : '/auth/signin'}
          label={isAuthenticated ? 'Account' : 'Login'}
          icon={User}
        />
      </nav>
    </div>
  );
}

export default MobileBottomNav;
