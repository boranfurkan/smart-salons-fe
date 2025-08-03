'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface OrderDetailsDialogProps {
  order: OrderResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'secondary';
    case 'CONFIRMED':
      return 'default';
    case 'PROCESSING':
      return 'default';
    case 'SHIPPED':
      return 'default';
    case 'DELIVERED':
      return 'default';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'text-yellow-600';
    case 'CONFIRMED':
      return 'text-blue-600';
    case 'PROCESSING':
      return 'text-purple-600';
    case 'SHIPPED':
      return 'text-orange-600';
    case 'DELIVERED':
      return 'text-green-600';
    case 'CANCELLED':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onClose,
}: OrderDetailsDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Details - {order.orderNumber}
            <Badge
              variant={getStatusBadgeVariant(order.status)}
              className={getStatusColor(order.status)}
            >
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Order Number
                  </p>
                  <p className="text-sm">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Order Date
                  </p>
                  <p className="text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    variant={getStatusBadgeVariant(order.status)}
                    className={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Amount
                  </p>
                  <p className="text-sm font-medium">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>
              {order.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Notes
                  </p>
                  <p className="text-sm">{String(order.notes)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          {order.user && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Name
                    </p>
                    <p className="text-sm">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm">{order.user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {typeof order.shippingAddress === 'object' ? (
                    <div className="space-y-1">
                      {Object.entries(
                        order.shippingAddress as Record<string, unknown>
                      ).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium text-muted-foreground capitalize">
                            {key}:{' '}
                          </span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{String(order.shippingAddress)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Address */}
          {order.billingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {typeof order.billingAddress === 'object' ? (
                    <div className="space-y-1">
                      {Object.entries(
                        order.billingAddress as Record<string, unknown>
                      ).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium text-muted-foreground capitalize">
                            {key}:{' '}
                          </span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{String(order.billingAddress)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          {order.orderItems && order.orderItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Order Items ({order.orderItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {String(item.product?.name) ||
                            'Product Name Not Available'}
                        </p>
                        {item.colorVariant && (
                          <p className="text-sm text-muted-foreground">
                            Color: {String(item.colorVariant.name)}
                            <span
                              className="inline-block w-3 h-3 rounded-full ml-2 border border-gray-300"
                              style={{
                                backgroundColor: String(
                                  item.colorVariant.hexCode
                                ),
                              }}
                            />
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Unit Price: ${parseFloat(item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium">
                          ${parseFloat(item.totalPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Updates */}
          {order.shippingUpdates && order.shippingUpdates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.shippingUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{update.status}</p>
                          {update.description && (
                            <p className="text-sm text-muted-foreground">
                              {String(update.description)}
                            </p>
                          )}
                          {update.location && (
                            <p className="text-sm text-muted-foreground">
                              Location: {String(update.location)}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(update.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
