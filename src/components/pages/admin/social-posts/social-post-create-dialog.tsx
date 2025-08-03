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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerCreateSocialPost } from '@/lib/api/generated/admin/admin';
import { useImageUpload } from '@/hooks/useImageUpload';
import Image from 'next/image';

interface SocialPostCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onRefetch: () => void;
}

const PLATFORMS = ['INSTAGRAM', 'TIKTOK', 'FACEBOOK', 'TWITTER'] as const;

const createSocialPostSchema = z.object({
  platform: z.enum(PLATFORMS, { message: 'Platform is required' }),
  postUrl: z.string().min(1, 'Post URL is required').url('Must be a valid URL'),
  imageUrl: z.string().optional(),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  publisher: z.string().optional(),
  hashtags: z.array(z.string()),
  isActive: z.boolean(),
});

type CreateSocialPostFormData = z.infer<typeof createSocialPostSchema>;

export function SocialPostCreateDialog({
  open,
  onOpenChange,
  onClose,
  onRefetch,
}: SocialPostCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [hashtagInput, setHashtagInput] = useState('');

  const { upload, isUploading } = useImageUpload();

  const form = useForm<CreateSocialPostFormData>({
    resolver: zodResolver(createSocialPostSchema),
    defaultValues: {
      platform: undefined,
      postUrl: '',
      imageUrl: '',
      videoUrl: '',
      description: '',
      publisher: '',
      hashtags: [],
      isActive: true,
    },
  });

  const hashtags = form.watch('hashtags');

  const createSocialPostMutation = useAdminControllerCreateSocialPost({
    mutation: {
      onSuccess: () => {
        toast.success('Social post created successfully');
        handleClose();
        onRefetch();
      },
      onError: (error: unknown) => {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to create social post'
        );
        setIsSubmitting(false);
      },
    },
  });

  const handleClose = () => {
    form.reset();
    setSelectedImage(null);
    setImagePreview('');
    setHashtagInput('');
    onOpenChange(false);
    onClose();
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

  const addHashtag = () => {
    const tag = hashtagInput.trim();
    if (tag && !hashtags.includes(tag)) {
      const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
      form.setValue('hashtags', [...hashtags, formattedTag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    form.setValue(
      'hashtags',
      hashtags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: CreateSocialPostFormData) => {
    setIsSubmitting(true);

    try {
      let imageUrl = data.imageUrl;

      // If an image is selected, upload it first
      if (selectedImage) {
        const uploadResult = await upload([selectedImage]);
        const uploadedImages = Array.isArray(uploadResult)
          ? uploadResult
          : [uploadResult];

        if (uploadedImages && uploadedImages.length > 0) {
          imageUrl = uploadedImages[0].url;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      // Create social post
      await createSocialPostMutation.mutateAsync({
        data: {
          platform: data.platform,
          postUrl: data.postUrl,
          imageUrl: imageUrl || undefined,
          videoUrl: data.videoUrl || undefined,
          description: data.description || undefined,
          publisher: data.publisher || undefined,
          hashtags: data.hashtags,
          isActive: data.isActive,
        },
      });
    } catch (error) {
      console.error('Error creating social post:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Social Post</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PLATFORMS.map((platform) => (
                            <SelectItem key={platform} value={platform}>
                              {platform.toLowerCase()}
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
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publisher</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., @smartsalons" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="postUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post URL *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://instagram.com/p/example"
                        {...field}
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the social post content..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Image (Optional)</label>
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
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById('image-input')?.click()
                          }
                          className="flex-1"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Change Image
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview('');
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById('image-input')?.click()
                          }
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/video.mp4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Hashtags</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter hashtag"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHashtag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addHashtag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeHashtag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
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
                      <p className="text-sm text-muted-foreground">
                        Make this post visible in the social feed
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
                {isUploading ? 'Uploading...' : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
