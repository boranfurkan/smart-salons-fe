'use client';

import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerUpdateCarouselItem } from '@/lib/api/generated/admin/admin';
import { CarouselItemResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';
import { useImageUpload } from '@/hooks/useImageUpload';
import Image from 'next/image';

interface CarouselEditDialogProps {
  carouselItem: CarouselItemResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const updateCarouselItemSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Image is required').optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  order: z.number().min(0, 'Order must be 0 or greater').optional(),
  isActive: z.boolean().optional(),
});

type UpdateCarouselItemFormData = z.infer<typeof updateCarouselItemSchema>;

export function CarouselEditDialog({
  carouselItem,
  open,
  onOpenChange,
  onClose,
}: CarouselEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    carouselItem.imageUrl || ''
  );

  const { upload, isUploading } = useImageUpload({
    folder: 'carousel',
    maxFiles: 1,
    onSuccess: (result) => {
      if ('url' in result) {
        setUploadedImageUrl(result.url);
        form.setValue('imageUrl', result.url);
        toast.success('Image uploaded successfully');
      }
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const form = useForm<UpdateCarouselItemFormData>({
    resolver: zodResolver(updateCarouselItemSchema),
    defaultValues: {
      title: carouselItem.title,
      description: String(carouselItem.description || ''),
      imageUrl: carouselItem.imageUrl,
      buttonText: String(carouselItem.buttonText || ''),
      buttonLink: String(carouselItem.buttonLink || ''),
      order: carouselItem.order,
      isActive: carouselItem.isActive,
    },
  });

  // Reset uploadedImageUrl when carouselItem changes
  useEffect(() => {
    setUploadedImageUrl(carouselItem.imageUrl || '');
  }, [carouselItem.imageUrl]);

  const updateCarouselItemMutation = useAdminControllerUpdateCarouselItem({
    mutation: {
      onSuccess: () => {
        toast.success('Carousel item updated successfully');
        handleClose();
      },
      onError: (error: unknown) => {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to update carousel item'
        );
        setIsSubmitting(false);
      },
    },
  });

  const handleClose = () => {
    form.reset();
    setUploadedImageUrl(carouselItem.imageUrl || '');
    onOpenChange(false);
    onClose();
    setIsSubmitting(false);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await upload(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl('');
    form.setValue('imageUrl', '');
  };

  const onSubmit = async (data: UpdateCarouselItemFormData) => {
    setIsSubmitting(true);

    try {
      // Update carousel item with current form data
      await updateCarouselItemMutation.mutateAsync({
        id: carouselItem.id,
        data: {
          title: data.title,
          description: data.description || undefined,
          imageUrl: data.imageUrl,
          buttonText: data.buttonText || undefined,
          buttonLink: data.buttonLink || undefined,
          order: data.order,
          isActive: data.isActive,
        },
      });
    } catch (error) {
      console.error('Error updating carousel item:', error);
      setIsSubmitting(false);
    }
  };

  const currentImageUrl = uploadedImageUrl || carouselItem.imageUrl;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Carousel Item</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter carousel title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter carousel description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Carousel Image</label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="relative w-full h-32 bg-muted rounded overflow-hidden">
                      <Image
                        src={currentImageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={() => {
                          console.error('Image failed to load');
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById('image-input')?.click()
                        }
                        className="flex-1"
                        disabled={isUploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Change Image'}
                      </Button>
                      {uploadedImageUrl &&
                        uploadedImageUrl !== carouselItem.imageUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleRemoveImage}
                          >
                            Reset
                          </Button>
                        )}
                    </div>
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Shop Now" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Link</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., /products" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Show this item in the carousel
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Item Information
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p>
                      {new Date(carouselItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p>
                      {new Date(carouselItem.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUploading ? 'Uploading...' : 'Update Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
