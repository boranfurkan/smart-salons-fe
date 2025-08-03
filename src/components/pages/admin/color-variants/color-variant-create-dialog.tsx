'use client';

import { useState, useRef } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  useAdminControllerAddColorVariant,
  useAdminControllerGetAllProducts,
  useAdminControllerAddColorVariantImagesByUrls,
} from '@/lib/api/generated/admin/admin';
import type {
  ImageUploadResponseDto,
  MultipleImageUploadResponseDto,
} from '@/lib/api/generated/smartSalonsAPI.schemas';

const createColorVariantSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  name: z.string().min(1, 'Color name is required'),
  hexCode: z
    .string()
    .min(1, 'Hex code is required')
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Please enter a valid hex color code (e.g., #FF0000)'
    ),
  stock: z.number().min(0, 'Stock cannot be negative'),
  price: z.string().optional(),
  discount: z.string().optional(),
  sku: z.string().optional(),
  isActive: z.boolean(),
});

type CreateColorVariantFormData = z.infer<typeof createColorVariantSchema>;

interface ColorVariantCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ColorVariantCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: ColorVariantCreateDialogProps) {
  const [colorPreview, setColorPreview] = useState('#000000');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const form = useForm<CreateColorVariantFormData>({
    resolver: zodResolver(createColorVariantSchema),
    defaultValues: {
      productId: '',
      name: '',
      hexCode: '#000000',
      stock: 0,
      price: '',
      discount: '',
      sku: '',
      isActive: true,
    },
  });

  const { data: products } = useAdminControllerGetAllProducts();

  const createColorVariantMutation = useAdminControllerAddColorVariant({
    mutation: {
      onSuccess: (response) => {
        toast.success('Color variant created successfully.');
        handleReset();
        onSuccess();
      },
      onError: (error: Error) => {
        toast.error(
          (error as any)?.response?.data?.message ||
            'Failed to create color variant.'
        );
      },
    },
  });

  const addImagesByUrlsMutation = useAdminControllerAddColorVariantImagesByUrls(
    {
      mutation: {
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              'Failed to add images to color variant.'
          );
        },
      },
    }
  );

  const handleSubmit = async (data: CreateColorVariantFormData) => {
    let allImageUrls = [...uploadedImageUrls]; // Start with already uploaded images

    // Upload any selected images that haven't been uploaded yet
    if (selectedFiles.length > 0) {
      try {
        const uploadResult = await upload(selectedFiles);

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
        setSelectedFiles([]);
        setUploadPreviews([]);
      } catch (error) {
        toast.error('Failed to upload images. Please try again.');
        return; // Don't create variant if image upload fails
      }
    }

    // Extract productId from form data and create color variant
    const { productId, ...colorVariantData } = data;
    createColorVariantMutation.mutate({
      id: productId,
      data: {
        ...colorVariantData,
        ...(allImageUrls.length > 0 && { imageUrls: allImageUrls }),
      },
    });
  };

  const uploadSelectedImages = async () => {
    if (selectedFiles.length === 0) return;

    try {
      await upload(selectedFiles);
      setSelectedFiles([]);
      setUploadPreviews([]);
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length !== files.length) {
      toast.error(
        'Some files were skipped. Only image files under 5MB are allowed.'
      );
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = (indexToRemove: number) => {
    setUploadedImageUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleReset = () => {
    form.reset();
    setColorPreview('#000000');
    setSelectedFiles([]);
    setUploadPreviews([]);
    setUploadedImageUrls([]);
  };

  const handleHexCodeChange = (value: string) => {
    form.setValue('hexCode', value);
    // Validate hex color format and update preview
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setColorPreview(value);
    }
  };

  const handleClose = () => {
    if (!createColorVariantMutation.isPending) {
      handleReset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Color Variant</DialogTitle>
          <DialogDescription>
            Create a new color variant for a product.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products?.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Ruby Red" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hexCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hex Color Code</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="#FF0000"
                        {...field}
                        onChange={(e) => handleHexCodeChange(e.target.value)}
                        className="flex-1"
                      />
                    </FormControl>
                    <div
                      className="w-10 h-10 rounded border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: colorPreview }}
                      title="Color preview"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Stock</FormLabel>
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
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. PRD-001-RED" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
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
                    <FormLabel>Discount (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'true')}
                    defaultValue={field.value ? 'true' : 'false'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Images (Optional)</label>
                {selectedFiles.length > 0 && (
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
                    Upload {selectedFiles.length} Image
                    {selectedFiles.length > 1 ? 's' : ''}
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={createColorVariantMutation.isPending}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Images
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Max 5MB per image
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Uploaded Images */}
                {uploadedImageUrls.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">
                      Uploaded Images:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedImageUrls.map((url, index) => (
                        <div
                          key={`uploaded-${index}`}
                          className="relative group"
                        >
                          <img
                            src={url}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-20 object-cover rounded border border-green-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                            Uploaded
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview Images (not yet uploaded) */}
                {uploadPreviews.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-2">
                      Selected Images (Preview):
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {uploadPreviews.map((preview, index) => (
                        <div
                          key={`preview-${index}`}
                          className="relative group"
                        >
                          <img
                            src={preview}
                            alt={`Upload preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            Preview
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploadPreviews.length === 0 &&
                  uploadedImageUrls.length === 0 && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No images selected
                      </p>
                    </div>
                  )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createColorVariantMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createColorVariantMutation.isPending}
              >
                {createColorVariantMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Color Variant
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
