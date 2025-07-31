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
import { useAdminControllerDeleteColorVariant } from '@/lib/api/generated/admin/admin';
import { ColorVariantResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface ColorVariantDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  colorVariant: ColorVariantResponseDto | null;
}

export function ColorVariantDeleteDialog({
  open,
  onOpenChange,
  onSuccess,
  colorVariant,
}: ColorVariantDeleteDialogProps) {
  const deleteColorVariantMutation = useAdminControllerDeleteColorVariant({
    mutation: {
      onSuccess: () => {
        toast.success('Color variant deleted successfully.');
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to delete color variant.'
        );
      },
    },
  });

  const handleDelete = () => {
    if (!colorVariant?.id) return;
    deleteColorVariantMutation.mutate({ id: colorVariant.id });
  };

  const handleClose = () => {
    if (!deleteColorVariantMutation.isPending) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Color Variant</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the color variant "
            {colorVariant?.name}" ({colorVariant?.hexCode})?
            <br />
            <br />
            <strong className="text-destructive">
              Warning: This action cannot be undone. Any orders referencing this
              color variant may be affected.
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteColorVariantMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteColorVariantMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteColorVariantMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Color Variant
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
