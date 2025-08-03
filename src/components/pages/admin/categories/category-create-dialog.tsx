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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerCreateCategory } from '@/lib/api/generated/admin/admin';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
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

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      isActive: true,
    },
  });

  const createCategoryMutation = useAdminControllerCreateCategory({
    mutation: {
      onSuccess: () => {
        toast.success('Category created successfully.');
        form.reset();
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
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
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
