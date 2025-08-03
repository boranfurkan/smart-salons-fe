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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerDeleteCategory } from '@/lib/api/generated/admin/admin';
import { CategoryResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface CategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  category: CategoryResponseDto | null;
}

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  onSuccess,
  category,
}: CategoryDeleteDialogProps) {
  const deleteCategoryMutation = useAdminControllerDeleteCategory({
    mutation: {
      onSuccess: () => {
        toast.success('Category deleted successfully.');
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to delete category.'
        );
      },
    },
  });

  const handleDelete = () => {
    if (!category?.id) return;
    deleteCategoryMutation.mutate({ id: category.id });
  };

  const handleClose = () => {
    if (!deleteCategoryMutation.isPending) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the category &quot;{category?.name}
            &quot;?
            <br />
            <br />
            <strong className="text-destructive">
              Warning: This action cannot be undone. If this category has
              products associated with it, they will be moved to an
              uncategorized state.
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCategoryMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteCategoryMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteCategoryMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
