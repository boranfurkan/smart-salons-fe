'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerDeleteProduct } from '@/lib/api/generated/admin/admin';
import { ProductResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface ProductDeleteDialogProps {
  product: ProductResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProductDeleteDialog({
  product,
  open,
  onOpenChange,
  onSuccess,
}: ProductDeleteDialogProps) {
  const deleteProductMutation = useAdminControllerDeleteProduct({
    mutation: {
      onSuccess: () => {
        toast.success(`Product "${product.name}" deleted successfully.`);
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to delete product.'
        );
      },
    },
  });

  const handleDelete = () => {
    deleteProductMutation.mutate({ id: product.id });
  };

  const handleClose = () => {
    if (!deleteProductMutation.isPending) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{product.name}"? This action cannot
            be undone and will permanently remove the product from your catalog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProductMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProductMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteProductMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Product
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
