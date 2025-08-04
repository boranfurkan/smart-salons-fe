'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerCreateCategory } from '@/lib/api/generated/admin/admin';
import { useImageUpload } from '@/hooks/useImageUpload';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
});

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

interface CategoryCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CategoryCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: CategoryCreateDialogProps) {
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      imageUrl: '',
      isActive: true,
    },
  });

  const { upload, isUploading } = useImageUpload({
    folder: 'categories',
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

  const createCategoryMutation = useAdminControllerCreateCategory({
    mutation: {
      onSuccess: () => {
        toast.success('Category created successfully.');
        form.reset();
        setUploadedImageUrl('');
        onSuccess();
      },
      onError: (error: unknown) => {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to create category.'
        );
      },
    },
  });

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

  const handleSubmit = (data: CreateCategoryFormData) => {
    createCategoryMutation.mutate({ data });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    form.setValue('name', name);
    if (!form.getValues('slug') || isGeneratingSlug) {
      setIsGeneratingSlug(true);
      const slug = generateSlug(name);
      form.setValue('slug', slug);
      setTimeout(() => setIsGeneratingSlug(false), 300);
    }
  };

  const handleClose = () => {
    if (!createCategoryMutation.isPending) {
      form.reset();
      setUploadedImageUrl('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your products.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Hair Care"
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="hair-care"
                      {...field}
                      onChange={(e) => {
                        setIsGeneratingSlug(false);
                        field.onChange(e);
                      }}
                    />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this category..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Section */}
            <div className="space-y-2">
              <FormLabel>Category Image (Optional)</FormLabel>
              {uploadedImageUrl ? (
                <div className="relative">
                  <img
                    src={uploadedImageUrl}
                    alt="Category preview"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="category-image" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload category image
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PNG, JPG up to 5MB
                      </span>
                    </label>
                    <input
                      id="category-image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </div>
                  {isUploading && (
                    <div className="mt-2">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      <span className="text-xs text-gray-500">
                        Uploading...
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this category visible to customers
                    </div>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createCategoryMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createCategoryMutation.isPending}>
                {createCategoryMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
