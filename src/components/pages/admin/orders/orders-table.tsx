'use client';

import { useState } from 'react';
import { MoreHorizontal, Eye, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { keepPreviousData } from '@tanstack/react-query';
import { useAdminControllerGetAllOrders } from '@/lib/api/generated/admin/admin';
import { OrderResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';
import { OrderDetailsDialog } from './order-details-dialog';
import { UpdateShippingStatusDialog } from './update-shipping-status-dialog';
import { OrderStatusBadge } from './order-status-badge';

export function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(
    null
  );
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [shippingStatusOpen, setShippingStatusOpen] = useState(false);

  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useAdminControllerGetAllOrders({
    query: {
      placeholderData: keepPreviousData,
    },
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: OrderResponseDto) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleUpdateShipping = (order: OrderResponseDto) => {
    setSelectedOrder(order);
    setShippingStatusOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedOrder(null);
    setOrderDetailsOpen(false);
    setShippingStatusOpen(false);
    refetch();
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">
            Failed to load orders. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Orders Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 md:w-[300px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.user?.firstName} {order.user?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.user?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="font-medium">
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {order.orderItems?.length || 0} item
                            {order.orderItems?.length !== 1 ? 's' : ''}
                          </div>
                          <div className="text-muted-foreground">
                            Qty:{' '}
                            {order.orderItems?.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            ) || 0}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleUpdateShipping(order)}
                            >
                              <Package className="mr-2 h-4 w-4" />
                              Update Shipping
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedOrder && (
        <>
          <OrderDetailsDialog
            order={selectedOrder}
            open={orderDetailsOpen}
            onOpenChange={setOrderDetailsOpen}
            onClose={handleDialogClose}
          />
          <UpdateShippingStatusDialog
            order={selectedOrder}
            open={shippingStatusOpen}
            onOpenChange={setShippingStatusOpen}
            onClose={handleDialogClose}
          />
        </>
      )}
    </>
  );
}
