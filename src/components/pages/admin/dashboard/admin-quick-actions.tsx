'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Package,
  Users,
  ShoppingCart,
  Image,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    title: 'Add Product',
    description: 'Create a new product in the catalog',
    icon: Package,
    href: '/admin/products/new',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    title: 'View Orders',
    description: 'Manage customer orders',
    icon: ShoppingCart,
    href: '/admin/orders',
    color: 'bg-green-50 text-green-600 border-green-200',
  },
  {
    title: 'Manage Users',
    description: 'View and manage user accounts',
    icon: Users,
    href: '/admin/users',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    title: 'Carousel Items',
    description: 'Manage homepage carousel',
    icon: Image,
    href: '/admin/carousel',
    color: 'bg-pink-50 text-pink-600 border-pink-200',
  },
  {
    title: 'Newsletter',
    description: 'Manage newsletter subscriptions',
    icon: FileText,
    href: '/admin/newsletter',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  },
];

export function AdminQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.href}
              variant="outline"
              asChild
              className={`h-auto p-4 justify-start text-left hover:${action.color
                .replace('bg-', 'bg-')
                .replace('50', '100')}`}
            >
              <Link href={action.href}>
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg border p-2 ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
