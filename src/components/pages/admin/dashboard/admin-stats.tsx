'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  useAdminControllerGetAllProducts,
  useAdminControllerGetAllOrders,
  useAdminControllerGetAllUsers,
} from '@/lib/api/generated/admin/admin';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading,
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <Badge
              variant={trend.isPositive ? 'default' : 'destructive'}
              className="ml-auto"
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(trend.value)}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminStats() {
  const { data: products, isLoading: productsLoading } =
    useAdminControllerGetAllProducts();
  const { data: orders, isLoading: ordersLoading } =
    useAdminControllerGetAllOrders();
  const { data: users, isLoading: usersLoading } =
    useAdminControllerGetAllUsers();

  // Calculate revenue from orders (mock calculation)
  const totalRevenue =
    orders?.reduce((acc, order) => {
      const amount =
        typeof order.totalAmount === 'string'
          ? parseFloat(order.totalAmount)
          : order.totalAmount || 0;
      return acc + amount;
    }, 0) || 0;

  // Calculate pending orders
  const pendingOrders =
    orders?.filter(
      (order) => order.status === 'PENDING' || order.status === 'PROCESSING'
    ).length || 0;

  const stats = [
    {
      title: 'Total Products',
      value: products?.length || 0,
      description: 'Active products in catalog',
      icon: Package,
      trend: { value: 12, isPositive: true },
      loading: productsLoading,
    },
    {
      title: 'Total Orders',
      value: orders?.length || 0,
      description: `${pendingOrders} pending orders`,
      icon: ShoppingCart,
      trend: { value: 8, isPositive: true },
      loading: ordersLoading,
    },
    {
      title: 'Total Users',
      value: users?.length || 0,
      description: 'Registered customers',
      icon: Users,
      trend: { value: 15, isPositive: true },
      loading: usersLoading,
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      description: 'Total sales amount',
      icon: DollarSign,
      trend: { value: 23, isPositive: true },
      loading: ordersLoading,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
