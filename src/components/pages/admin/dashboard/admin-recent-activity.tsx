'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import {
  useAdminControllerGetAllOrders,
  useAdminControllerGetAllUsers,
} from '@/lib/api/generated/admin/admin';
import { ArrowRight, Package, UserPlus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function AdminRecentActivity() {
  const { data: orders, isLoading: ordersLoading } =
    useAdminControllerGetAllOrders();
  const { data: users, isLoading: usersLoading } =
    useAdminControllerGetAllUsers();

  // Get recent orders (last 5)
  const recentOrders =
    orders
      ?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      ?.slice(0, 5) || [];

  // Get recent users (last 5)
  const recentUsers =
    users
      ?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      ?.slice(0, 5) || [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (ordersLoading || usersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Recent Orders */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <ShoppingCart className="h-4 w-4" />
              Recent Orders
            </h3>
            <div className="space-y-3">
              {recentOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Order #{order.id.slice(-8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(order.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={getStatusColor(order.status)}
                    >
                      {order.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      $
                      {typeof order.totalAmount === 'string'
                        ? parseFloat(order.totalAmount).toFixed(2)
                        : Number(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
              <UserPlus className="h-4 w-4" />
              New Users
            </h3>
            <div className="space-y-3">
              {recentUsers.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user.firstName?.[0]?.toUpperCase() || 'U'}
                        {user.lastName?.[0]?.toUpperCase() || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(user.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={user.isEmailVerified ? 'default' : 'secondary'}
                  >
                    {user.isEmailVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
