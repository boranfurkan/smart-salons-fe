'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAdminControllerGetAllOrders,
  useAdminControllerGetAllProducts,
} from '@/lib/api/generated/admin/admin';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

// Mock chart components since we don't have a charting library
function MockBarChart({ title, data }: { title: string; data: any[] }) {
  return (
    <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-50">
      <div className="text-center">
        <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xs text-gray-400">Chart visualization coming soon</p>
      </div>
    </div>
  );
}

function MockPieChart({ title, data }: { title: string; data: any[] }) {
  return (
    <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-50">
      <div className="text-center">
        <PieChart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xs text-gray-400">Chart visualization coming soon</p>
      </div>
    </div>
  );
}

export function AdminCharts() {
  const { data: orders, isLoading: ordersLoading } =
    useAdminControllerGetAllOrders();
  const { data: products, isLoading: productsLoading } =
    useAdminControllerGetAllProducts();

  // Process data for charts
  const salesData =
    orders?.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleString('default', {
        month: 'short',
      });
      const amount =
        typeof order.totalAmount === 'string'
          ? parseFloat(order.totalAmount)
          : Number(order.totalAmount || 0);

      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.revenue += amount;
        existing.orders += 1;
      } else {
        acc.push({ month, revenue: amount, orders: 1 });
      }
      return acc;
    }, [] as { month: string; revenue: number; orders: number }[]) || [];

  const categoryData =
    products?.reduce((acc, product) => {
      const category = product.category?.name || 'Uncategorized';
      const existing = acc.find((item) => item.category === category);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ category, count: 1 });
      }
      return acc;
    }, [] as { category: string; count: number }[]) || [];

  if (ordersLoading || productsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Analytics & Charts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
            <TabsTrigger value="products">Product Categories</TabsTrigger>
            <TabsTrigger value="orders">Order Status</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
                <MockBarChart title="Revenue by Month" data={salesData} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Sales Metrics</h3>
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Orders
                    </span>
                    <span className="font-semibold">{orders?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Average Order Value
                    </span>
                    <span className="font-semibold">
                      $
                      {salesData.length > 0
                        ? (
                            salesData.reduce(
                              (acc, item) => acc + item.revenue,
                              0
                            ) /
                            salesData.reduce(
                              (acc, item) => acc + item.orders,
                              0
                            )
                          ).toFixed(2)
                        : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Revenue
                    </span>
                    <span className="font-semibold">
                      $
                      {salesData
                        .reduce((acc, item) => acc + item.revenue, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Products by Category
                </h3>
                <MockPieChart
                  title="Category Distribution"
                  data={categoryData}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Category Statistics
                </h3>
                <div className="space-y-3 p-4 border rounded-lg">
                  {categoryData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (item.count / (products?.length || 1)) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-8">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Order Status Distribution
                </h3>
                <MockPieChart title="Order Status" data={[]} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Order Status Summary
                </h3>
                <div className="space-y-3 p-4 border rounded-lg">
                  {[
                    'PENDING',
                    'PROCESSING',
                    'SHIPPED',
                    'DELIVERED',
                    'CANCELLED',
                  ].map((status) => {
                    const count =
                      orders?.filter((order) => order.status === status)
                        .length || 0;
                    return (
                      <div
                        key={status}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm capitalize">
                          {status.toLowerCase()}
                        </span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
