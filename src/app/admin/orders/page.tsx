'use client';

import { OrdersTable } from '@/components/pages/admin/orders/orders-table';

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>
      </div>
      <OrdersTable />
    </div>
  );
}
