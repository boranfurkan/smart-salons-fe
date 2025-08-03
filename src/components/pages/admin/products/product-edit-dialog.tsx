'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  useAdminControllerUpdateProduct,
  useAdminControllerGetAllCategories,
  useAdminControllerAddProductImages,
  useAdminControllerAddProductImagesByUrls,
  useAdminControllerDeleteProductImage,
} from '@/lib/api/generated/admin/admin';
import { ProductResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  slug: z.string().min(1, 'Slug is required'),
  price: z.string().min(1, 'Price is required'),
  discount: z.string().optional(),
  stock: z.number().min(0, 'Stock must be 0 or greater'),
  dimensions: z.string().optional(),
  deliveryDescription: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean(),
});

type UpdateProductFormData = z.infer<typeof updateProductSchema>;

interface ProductEditDialogProps {
  product: ProductResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProductEditDialog({
  product,
  open,
  onOpenChange,
  onSuccess,
}: ProductEditDialogProps) {
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [deletingImageIds, setDeletingImageIds] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  const { upload, isUploading } = useImageUpload({
    folder: 'products',
    maxFiles: 10,
    onSuccess: (result) => {
      let urls: string[];
      if ('images' in result) {
        urls = result.images.map((r) => r.url);
      } else {
        urls = [result.url];
      }
      setUploadedImageUrls((prev) => [...prev, ...urls]);
    },
  });

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      slug: product.slug,
      price: product.price,
      discount: product.discount || '',
      stock: product.stock,
      dimensions:
        typeof product.dimensions === 'string' ? product.dimensions : '',
      deliveryDescription:
        typeof product.deliveryDescription === 'string'
          ? product.deliveryDescription
          : '',
      categoryId: product.categoryId,
      isActive: product.isActive,
    },
  });

  const { data: categories, isLoading: categoriesLoading } =
    useAdminControllerGetAllCategories();

  const updateProductMutation = useAdminControllerUpdateProduct({
    mutation: {
      onSuccess: () => {
        toast.success('Product updated successfully.');
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to update product.'
        );
      },
    },
  });

  const addImagesByUrlsMutation = useAdminControllerAddProductImagesByUrls({
    mutation: {
      onSuccess: () => {
        toast.success('Images added successfully.');
        setUploadedImageUrls([]);
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to add images.');
      },
    },
  });

  const addImagesMutation = useAdminControllerAddProductImages({
    mutation: {
      onSuccess: () => {
        toast.success('Images added successfully.');
        setSelectedImages([]);
        setImagePreviews([]);
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to add images.');
      },
    },
  });

  const deleteImageMutation = useAdminControllerDeleteProductImage({
    mutation: {
      onSuccess: (_, variables) => {
        toast.success('Image deleted successfully.');
        setDeletingImageIds((prev) => prev.filter((id) => id !== variables.id));
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || 'Failed to delete image.'
        );
      },
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        slug: product.slug,
        price: product.price,
        discount: product.discount || '',
        stock: product.stock,
        dimensions:
          typeof product.dimensions === 'string' ? product.dimensions : '',
        deliveryDescription:
          typeof product.deliveryDescription === 'string'
            ? product.deliveryDescription
            : '',
        categoryId: product.categoryId,
        isActive: product.isActive,
      });
    }
  }, [product, form]);

  // Image handling functions
  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // First add to preview (for immediate feedback)
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length !== files.length) {
      toast.error('Please select only valid image files under 5MB.');
      return;
    }

    const newImages = [...selectedImages, ...validFiles].slice(0, 10); // Max 10 images
    setSelectedImages(newImages);

    // Generate previews
    const newPreviews = [...imagePreviews];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          setImagePreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear the file input
    event.target.value = '';
  };

  const removeNewImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const removeUploadedImage = (indexToRemove: number) => {
    setUploadedImageUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const deleteExistingImage = (imageId: string) => {
    setDeletingImageIds((prev) => [...prev, imageId]);
    deleteImageMutation.mutate({ id: imageId });
  };

  const uploadSelectedImages = async () => {
    if (selectedImages.length === 0) return;

    try {
      await upload(selectedImages);
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const addUploadedImagesToProduct = async () => {
    let allImageUrls = [...uploadedImageUrls]; // Start with already uploaded images

    // Upload any selected images that haven't been uploaded yet
    if (selectedImages.length > 0) {
      try {
        const uploadResult = await upload(selectedImages);

        // Extract URLs from upload result
        let newUrls: string[];
        if (Array.isArray(uploadResult)) {
          // Multiple images result (ImageUploadResponseDto[])
          newUrls = uploadResult.map((r) => r.url);
        } else {
          // Single image result (ImageUploadResponseDto)
          newUrls = [uploadResult.url];
        }

        allImageUrls = [...allImageUrls, ...newUrls];
        setSelectedImages([]);
        setImagePreviews([]);
      } catch (error) {
        toast.error('Failed to upload images. Please try again.');
        return; // Don't add images if upload fails
      }
    }

    if (allImageUrls.length === 0) return;

    addImagesByUrlsMutation.mutate({
      id: product.id,
      data: {
        imageUrls: allImageUrls,
      },
    });
  };

  const handleSubmit = (data: UpdateProductFormData) => {
    updateProductMutation.mutate({
      id: product.id,
      data,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    form.setValue('name', name);
    if (isGeneratingSlug) {
      const slug = generateSlug(name);
      form.setValue('slug', slug);
    }
  };

  const handleClose = () => {
    if (!updateProductMutation.isPending && !deleteImageMutation.isPending) {
      setSelectedImages([]);
      setImagePreviews([]);
      setDeletingImageIds([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Amazing Hair Product"
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
                        placeholder="amazing-hair-product"
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your product..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="29.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="5.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : (
                          categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input placeholder="10cm x 5cm x 2cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deliveryDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ships within 2-3 business days"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Add New Images</label>
                  <p className="text-sm text-muted-foreground">
                    Upload new product images (max 10 images, 5MB each)
                  </p>
                </div>
                {selectedImages.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={uploadSelectedImages}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Upload {selectedImages.length} Image
                    {selectedImages.length > 1 ? 's' : ''}
                  </Button>
                )}
              </div>

              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 relative">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* New Image Previews and Uploaded Images */}
              {(imagePreviews.length > 0 || uploadedImageUrls.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Uploaded Images (ready to be added to product) */}
                  {uploadedImageUrls.map((url, index) => (
                    <div key={`uploaded-${index}`} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-green-200">
                        <img
                          src={url}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeUploadedImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Uploaded
                      </div>
                    </div>
                  ))}
                  {/* Preview Images (not yet uploaded) */}
                  {imagePreviews.map((preview, index) => (
                    <div key={`preview-${index}`} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeNewImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Preview
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add uploaded images to product button */}
              {(uploadedImageUrls.length > 0 || selectedImages.length > 0) && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={addUploadedImagesToProduct}
                    disabled={addImagesByUrlsMutation.isPending || isUploading}
                    className="w-full"
                  >
                    {(addImagesByUrlsMutation.isPending || isUploading) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isUploading
                      ? 'Uploading...'
                      : `Add ${
                          uploadedImageUrls.length + selectedImages.length
                        } Image${
                          uploadedImageUrls.length + selectedImages.length > 1
                            ? 's'
                            : ''
                        } to Product`}
                  </Button>
                </div>
              )}
            </div>

            {/* Existing Images Management */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Current Product Images
                </label>
                <p className="text-sm text-muted-foreground">
                  Manage existing product images
                </p>
              </div>

              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={image.url}
                          alt={`Product image ${image.order}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteExistingImage(image.id)}
                        disabled={
                          deletingImageIds.includes(image.id) ||
                          deleteImageMutation.isPending
                        }
                      >
                        {deletingImageIds.includes(image.id) ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                      {image.isPrimary && (
                        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No images uploaded yet
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
                      Make this product visible to customers
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
                disabled={
                  updateProductMutation.isPending ||
                  deleteImageMutation.isPending
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  updateProductMutation.isPending ||
                  deleteImageMutation.isPending
                }
              >
                {updateProductMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Product
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
