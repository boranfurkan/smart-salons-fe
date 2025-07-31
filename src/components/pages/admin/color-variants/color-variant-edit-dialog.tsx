'use client';

import { useEffect, useState, useRef } from 'react';
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
import { Loader2, Upload, X, Image as ImageIcon, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  useAdminControllerUpdateColorVariant,
  useAdminControllerDeleteColorVariantImage,
  useAdminControllerAddColorVariantImagesByUrls,
} from '@/lib/api/generated/admin/admin';
import { ColorVariantResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

const editColorVariantSchema = z.object({
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

type EditColorVariantFormData = z.infer<typeof editColorVariantSchema>;

interface ColorVariantEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  colorVariant: ColorVariantResponseDto | null;
}

export function ColorVariantEditDialog({
  open,
  onOpenChange,
  onSuccess,
  colorVariant,
}: ColorVariantEditDialogProps) {
  const [colorPreview, setColorPreview] = useState('#000000');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
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

  const form = useForm<EditColorVariantFormData>({
    resolver: zodResolver(editColorVariantSchema),
    defaultValues: {
      name: '',
      hexCode: '#000000',
      stock: 0,
      price: '',
      discount: '',
      sku: '',
      isActive: true,
    },
  });

  const updateColorVariantMutation = useAdminControllerUpdateColorVariant({
    mutation: {
      onSuccess: () => {
        toast.success('Color variant updated successfully.');
        onSuccess();
      },
      onError: (error: Error) => {
        toast.error(
          (error as any)?.response?.data?.message ||
            'Failed to update color variant.'
        );
      },
    },
  });

  const deleteImageMutation = useAdminControllerDeleteColorVariantImage({
    mutation: {
      onSuccess: () => {
        toast.success('Image deleted successfully.');
        setDeletingImageId(null);
        onSuccess(); // Refresh the data
      },
      onError: (error: Error) => {
        toast.error(
          (error as any)?.response?.data?.message || 'Failed to delete image.'
        );
        setDeletingImageId(null);
      },
    },
  });

  const addImagesByUrlsMutation = useAdminControllerAddColorVariantImagesByUrls(
    {
      mutation: {
        onSuccess: () => {
          toast.success('Images added successfully.');
          setUploadedImageUrls([]);
          setSelectedFiles([]);
          setUploadPreviews([]);
          onSuccess(); // Refresh the data
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              'Failed to add images to color variant.'
          );
        },
      },
    }
  );

  // Update form when colorVariant changes
  useEffect(() => {
    if (colorVariant) {
      form.reset({
        name: colorVariant.name || '',
        hexCode: colorVariant.hexCode || '#000000',
        stock: colorVariant.stock || 0,
        price: colorVariant.price || '',
        discount: colorVariant.discount || '',
        sku: colorVariant.sku || '',
        isActive: colorVariant.isActive ?? true,
      });
      setColorPreview(colorVariant.hexCode || '#000000');
    }

    // Reset image state when variant changes
    setSelectedFiles([]);
    setUploadPreviews([]);
    setUploadedImageUrls([]);
    setDeletingImageId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [colorVariant, form]);

  const handleSubmit = (data: EditColorVariantFormData) => {
    if (!colorVariant?.id) return;

    updateColorVariantMutation.mutate({
      id: colorVariant.id,
      data,
    });
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

  const uploadSelectedImages = async () => {
    if (selectedFiles.length === 0) return;

    try {
      await upload(selectedFiles);
      setSelectedFiles([]);
      setUploadPreviews([]);

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images.');
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

  const addUploadedImagesToVariant = async () => {
    if (!colorVariant?.id || uploadedImageUrls.length === 0) return;

    addImagesByUrlsMutation.mutate({
      id: colorVariant.id,
      data: {
        imageUrls: uploadedImageUrls,
      },
    });
  };

  const deleteExistingImage = (imageId: string) => {
    if (!colorVariant?.id) return;

    setDeletingImageId(imageId);
    deleteImageMutation.mutate({
      variantId: colorVariant.id,
      imageId: imageId,
    });
  };

  const handleHexCodeChange = (value: string) => {
    form.setValue('hexCode', value);
    // Validate hex color format and update preview
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setColorPreview(value);
    }
  };

  const handleClose = () => {
    if (
      !updateColorVariantMutation.isPending &&
      !isUploading &&
      !deleteImageMutation.isPending
    ) {
      // Reset image state
      setSelectedFiles([]);
      setUploadPreviews([]);
      setUploadedImageUrls([]);
      setDeletingImageId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Color Variant</DialogTitle>
          <DialogDescription>
            Update the color variant information and manage images below.
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
                  <FormLabel>Stock Quantity</FormLabel>
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
                    value={field.value ? 'true' : 'false'}
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

            {/* Image Management Section */}
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-3">Images</h3>

                {/* Existing Images */}
                {colorVariant?.images && colorVariant.images.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <label className="text-xs font-medium text-muted-foreground">
                      Current Images
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorVariant.images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt={image.altText || colorVariant.name}
                            className="w-full h-20 object-cover rounded border"
                          />
                          {image.isPrimary && (
                            <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Primary
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteExistingImage(image.id)}
                            disabled={
                              deletingImageId === image.id ||
                              deleteImageMutation.isPending
                            }
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                          >
                            {deletingImageId === image.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Images */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={
                        updateColorVariantMutation.isPending || isUploading
                      }
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add Images
                    </Button>
                    {selectedFiles.length > 0 && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={uploadSelectedImages}
                        disabled={isUploading}
                      >
                        {isUploading && (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        )}
                        Upload {selectedFiles.length} image
                        {selectedFiles.length > 1 ? 's' : ''}
                      </Button>
                    )}
                    {uploadedImageUrls.length > 0 && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={addUploadedImagesToVariant}
                        disabled={addImagesByUrlsMutation.isPending}
                      >
                        {addImagesByUrlsMutation.isPending && (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        )}
                        Add {uploadedImageUrls.length} to Variant
                      </Button>
                    )}
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

                  {/* Uploaded Images (ready to be added to variant) */}
                  {uploadedImageUrls.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-green-600">
                        Uploaded Images (Ready to Add)
                      </label>
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
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-blue-600">
                        Selected Images (Preview)
                      </label>
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

                  {(!colorVariant?.images ||
                    colorVariant.images.length === 0) &&
                    uploadPreviews.length === 0 &&
                    uploadedImageUrls.length === 0 && (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No images for this color variant
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateColorVariantMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateColorVariantMutation.isPending}
              >
                {updateColorVariantMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Color Variant
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
