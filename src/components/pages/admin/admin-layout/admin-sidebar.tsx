'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Image,
  Settings,
  Upload,
  Tags,
  Palette,
  MessageSquare,
  Mail,
} from 'lucide-react';

interface AdminSidebarProps {
  currentPath: string;
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: Tags,
  },
  {
    title: 'Color Variants',
    href: '/admin/color-variants',
    icon: Palette,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    badge: '5',
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Carousel',
    href: '/admin/carousel',
    icon: Image,
  },
  {
    title: 'Social Posts',
    href: '/admin/social-posts',
    icon: MessageSquare,
  },
  {
    title: 'Newsletter',
    href: '/admin/newsletter',
    icon: Mail,
  },
  {
    title: 'Upload Files',
    href: '/admin/upload',
    icon: Upload,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar({ currentPath }: AdminSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-2">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4 lg:h-[70px] lg:px-6 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-bold">Smart Salons</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {sidebarItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="ml-auto h-6 px-2 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 flex-shrink-0">
        <div className="rounded-lg bg-muted p-3">
          <div className="text-xs text-muted-foreground">
            Smart Salons Admin v1.0
          </div>
        </div>
      </div>
    </div>
  );
}
