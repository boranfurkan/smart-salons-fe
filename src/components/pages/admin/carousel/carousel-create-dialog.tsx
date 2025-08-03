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
import { Switch } from '@/components/ui/switch';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerCreateCarouselItem } from '@/lib/api/generated/admin/admin';
import { useImageUpload } from '@/hooks/useImageUpload';
import Image from 'next/image';

interface CarouselCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const createCarouselItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Image is required'),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  order: z.number().min(0, 'Order must be 0 or greater').optional(),
  isActive: z.boolean(),
});

type CreateCarouselItemFormData = z.infer<typeof createCarouselItemSchema>;

export function CarouselCreateDialog({
  open,
  onOpenChange,
}: CarouselCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const { upload, isUploading } = useImageUpload();

  const form = useForm<CreateCarouselItemFormData>({
    resolver: zodResolver(createCarouselItemSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      buttonText: '',
      buttonLink: '',
      order: 0,
      isActive: true,
    },
  });

  const createCarouselItemMutation = useAdminControllerCreateCarouselItem({
    mutation: {
      onSuccess: () => {
        toast.success('Carousel item created successfully');
        handleClose();
      },
      onError: (error: unknown) => {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to create carousel item'
        );
        setIsSubmitting(false);
      },
    },
  });

  const handleClose = () => {
    form.reset();
    setSelectedImage(null);
    setImagePreview('');
    onOpenChange(false);
    setIsSubmitting(false);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CreateCarouselItemFormData) => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image first
      const uploadResult = await upload([selectedImage]);
      const uploadedImages = Array.isArray(uploadResult)
        ? uploadResult
        : [uploadResult];

      if (uploadedImages && uploadedImages.length > 0) {
        const imageUrl = uploadedImages[0].url;

        // Create carousel item with the uploaded image URL
        await createCarouselItemMutation.mutateAsync({
          data: {
            title: data.title,
            description: data.description || undefined,
            imageUrl: imageUrl,
            buttonText: data.buttonText || undefined,
            buttonLink: data.buttonLink || undefined,
            order: data.order || 0,
            isActive: data.isActive,
          },
        });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error creating carousel item:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Carousel Item</DialogTitle>
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
                <label className="text-sm font-medium">Carousel Image *</label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-32 bg-muted rounded overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview('');
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Select an image for the carousel
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
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
                {isUploading ? 'Uploading...' : 'Create Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
