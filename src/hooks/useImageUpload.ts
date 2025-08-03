import { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/mutator';
import type {
  ImageUploadResponseDto,
  MultipleImageUploadResponseDto,
} from '@/lib/api/generated/smartSalonsAPI.schemas';

interface UseImageUploadOptions {
  maxFiles?: number;
  maxSizeMB?: number;
  folder?: 'products' | 'carousel' | 'social-posts' | 'general';
  onSuccess?: (
    result: ImageUploadResponseDto | MultipleImageUploadResponseDto
  ) => void;
  onError?: (error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    maxFiles = 10,
    maxSizeMB = 5,
    folder = 'products',
    onSuccess,
    onError,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFiles = (files: File[]): boolean => {
    if (files.length > maxFiles) {
      const error = `Maximum ${maxFiles} files allowed per upload`;
      onError?.(error);
      toast.error(error);
      return false;
    }

    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        const error = `Invalid file type for ${file.name}. Only images are allowed`;
        onError?.(error);
        toast.error(error);
        return false;
      }

      // Check file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        const error = `File ${file.name} is too large. Maximum size is ${maxSizeMB}MB`;
        onError?.(error);
        toast.error(error);
        return false;
      }
    }

    return true;
  };

  const uploadSingleImage = async (
    file: File
  ): Promise<ImageUploadResponseDto> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ImageUploadResponseDto>(
      `/admin/upload/image?folder=${folder}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  };

  const uploadMultipleImages = async (
    files: File[]
  ): Promise<MultipleImageUploadResponseDto> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiClient.post<MultipleImageUploadResponseDto>(
      `/admin/upload/images?folder=${folder}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  };

  const upload = async (
    files: File[] | File
  ): Promise<ImageUploadResponseDto[] | ImageUploadResponseDto> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileArray = Array.isArray(files) ? files : [files];

      if (!validateFiles(fileArray)) {
        return Promise.reject(new Error('File validation failed'));
      }

      setUploadProgress(30);

      let result: ImageUploadResponseDto | MultipleImageUploadResponseDto;

      if (fileArray.length === 1) {
        result = await uploadSingleImage(fileArray[0]);
        setUploadProgress(100);
        onSuccess?.(result);
        toast.success('Image uploaded successfully');
        return result;
      } else {
        result = await uploadMultipleImages(fileArray);
        setUploadProgress(100);
        onSuccess?.(result);
        toast.success(`${result.count} images uploaded successfully`);
        return result.images;
      }
    } catch (error: unknown) {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Upload failed';
      onError?.(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadFromFileInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<ImageUploadResponseDto[]> => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return [];
    }

    const results = await upload(files);
    return Array.isArray(results) ? results : [results];
  };

  return {
    upload,
    uploadFromFileInput,
    isUploading,
    uploadProgress,
    validateFiles,
  };
}

// Helper hook for getting image URLs from upload results
export function useImageUrls() {
  const extractUrls = (results: ImageUploadResponseDto[]): string[] => {
    return results.map((result) => result.url);
  };

  const extractUrl = (result: ImageUploadResponseDto): string => {
    return result.url;
  };

  return {
    extractUrls,
    extractUrl,
  };
}
