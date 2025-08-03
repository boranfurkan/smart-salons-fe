'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerDeleteCarouselItem } from '@/lib/api/generated/admin/admin';
import { CarouselItemResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';
import Image from 'next/image';

interface CarouselDeleteDialogProps {
  carouselItem: CarouselItemResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function CarouselDeleteDialog({
  carouselItem,
  open,
  onOpenChange,
  onClose,
}: CarouselDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCarouselItemMutation = useAdminControllerDeleteCarouselItem({
    mutation: {
      onSuccess: () => {
        toast.success('Carousel item deleted successfully');
        onClose();
      },
      onError: (error: unknown) => {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to delete carousel item'
        );
        setIsDeleting(false);
      },
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteCarouselItemMutation.mutateAsync({
        id: carouselItem.id,
      });
    } catch (error) {
      // Error handling is done in the mutation callback
      console.error('Error deleting carousel item:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setIsDeleting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Carousel Item</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Are you sure you want to delete this carousel item? This action
                cannot be undone.
              </p>

              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={carouselItem.imageUrl}
                      alt={carouselItem.title}
                      fill
                      className="object-cover"
                      onError={() => {
                        console.error('Image failed to load');
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">
                        {carouselItem.title}
                      </h4>
                      <Badge
                        variant={
                          carouselItem.isActive ? 'default' : 'secondary'
                        }
                      >
                        {carouselItem.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {String(carouselItem.description || 'No description')}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>Order: {carouselItem.order}</span>
                      <span>•</span>
                      <span>
                        Created:{' '}
                        {new Date(carouselItem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {carouselItem.buttonText && carouselItem.buttonLink && (
                  <div className="pt-2 border-t border-muted">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Button:</span>{' '}
                      {String(carouselItem.buttonText)} →{' '}
                      {String(carouselItem.buttonLink)}
                    </div>
                  </div>
                )}
              </div>

              {carouselItem.isActive && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800 font-medium">
                    ⚠️ Warning: This is an active carousel item that is
                    currently visible to users.
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
