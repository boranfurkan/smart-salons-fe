'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerUpdateShippingStatus } from '@/lib/api/generated/admin/admin';
import { OrderResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface UpdateShippingStatusDialogProps {
  order: OrderResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const updateShippingStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]),
  description: z.string().optional(),
  location: z.string().optional(),
});

type UpdateShippingStatusFormData = z.infer<typeof updateShippingStatusSchema>;

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

export function UpdateShippingStatusDialog({
  order,
  open,
  onOpenChange,
  onClose,
}: UpdateShippingStatusDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateShippingStatusFormData>({
    resolver: zodResolver(updateShippingStatusSchema),
    defaultValues: {
      status: order.status as UpdateShippingStatusFormData['status'],
      description: '',
      location: '',
    },
  });

  const updateShippingStatusMutation = useAdminControllerUpdateShippingStatus({
    mutation: {
      onSuccess: () => {
        toast.success('Shipping status updated successfully');
        handleClose();
      },
      onError: (error: unknown) => {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to update shipping status'
        );
        setIsSubmitting(false);
      },
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
    onClose();
    setIsSubmitting(false);
  };

  const onSubmit = async (data: UpdateShippingStatusFormData) => {
    setIsSubmitting(true);

    try {
      await updateShippingStatusMutation.mutateAsync({
        id: order.id,
        data: {
          status: data.status,
          description: data.description || undefined,
          location: data.location || undefined,
        },
      });
    } catch (error) {
      // Error handling is done in the mutation callback
      console.error('Error updating shipping status:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Update Shipping Status
            <Badge
              variant={getStatusBadgeVariant(order.status)}
              className={getStatusColor(order.status)}
            >
              Current: {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Order Number
                </p>
                <p className="text-sm">{order.orderNumber}</p>
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter update description..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter current location..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Status
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
