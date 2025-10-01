import { useEffect, useRef, useState } from 'react';
import { getPresignedUrl } from '@/lib/actions/upload';
import { uploadFileWithPresigned, validateFileForUpload } from '@/lib/upload/presigned';
import type { PendingImageMap, PendingImageEntry } from '@/lib/editor/types';

export interface PresignedUploadState {
  pendingImages: PendingImageMap;
  isUploading: boolean;
  hasPendingImages: boolean;
}

export function usePresignedUpload() {
  const [pendingImages, setPendingImages] = useState<PendingImageMap>({});
  const [isUploading, setIsUploading] = useState(false);
  const previousPendingRef = useRef<PendingImageMap>({});

  // Cleanup blob URLs when component unmounts or images are removed
  useEffect(() => {
    const previous = previousPendingRef.current;

    // Revoke URLs for images that are no longer pending
    Object.entries(previous).forEach(([key, entry]) => {
      if (!pendingImages[key]) {
        URL.revokeObjectURL(entry.previewUrl);
      }
    });

    previousPendingRef.current = pendingImages;

    // Cleanup all URLs on unmount
    return () => {
      Object.values(previousPendingRef.current).forEach((entry) => {
        URL.revokeObjectURL(entry.previewUrl);
      });
    };
  }, [pendingImages]);

  const addPendingImage = (file: File): string | null => {
    try {
      // Validate file
      const validation = validateFileForUpload(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const pendingId = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);

      const entry: PendingImageEntry = {
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      setPendingImages(prev => ({
        ...prev,
        [pendingId]: entry
      }));

      return pendingId;
    } catch (error) {
      console.error('Failed to add pending image:', error);
      return null;
    }
  };

  const addPendingImages = (files: File[]): string[] => {
    const pendingIds: string[] = [];

    files.forEach(file => {
      const pendingId = addPendingImage(file);
      if (pendingId) {
        pendingIds.push(pendingId);
      }
    });

    return pendingIds;
  };

  const removePendingImage = (pendingId: string) => {
    const entry = pendingImages[pendingId];
    if (entry) {
      URL.revokeObjectURL(entry.previewUrl);
      setPendingImages(prev => {
        const { [pendingId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const uploadAllPending = async (): Promise<Record<string, string>> => {
    if (Object.keys(pendingImages).length === 0) {
      return {};
    }

    setIsUploading(true);

    try {
      const files = Object.values(pendingImages).map(entry => entry.file);
      const pendingIds = Object.keys(pendingImages);

      // Upload all files using presigned URLs
      const uploadPromises = files.map(file =>
        uploadFileWithPresigned(file, getPresignedUrl)
      );

      const uploadResults = await Promise.all(uploadPromises);

      // Create mapping from pendingId to uploaded URL
      const urlMapping: Record<string, string> = {};

      uploadResults.forEach((result, index) => {
        const pendingId = pendingIds[index];
        if (pendingId && result.success) {
          urlMapping[pendingId] = result.finalUrl;
        } else if (pendingId && !result.success) {
          console.error(`Upload failed for ${pendingId}:`, result.error);
          // Keep the blob URL for failed uploads
          const entry = pendingImages[pendingId];
          if (entry) {
            urlMapping[pendingId] = entry.previewUrl;
          }
        }
      });

      // Clear successfully uploaded images
      const successfulUploads = uploadResults
        .map((result, index) => result.success ? pendingIds[index] : null)
        .filter(Boolean) as string[];

      successfulUploads.forEach(pendingId => {
        const entry = pendingImages[pendingId];
        if (entry) {
          URL.revokeObjectURL(entry.previewUrl);
        }
      });

      setPendingImages(prev => {
        const updated = { ...prev };
        successfulUploads.forEach(pendingId => {
          delete updated[pendingId];
        });
        return updated;
      });

      return urlMapping;
    } catch (error) {
      console.error('Failed to upload pending images:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const clearAllPending = () => {
    Object.values(pendingImages).forEach(entry => {
      URL.revokeObjectURL(entry.previewUrl);
    });
    setPendingImages({});
  };

  const getPendingImage = (pendingId: string) => {
    return pendingImages[pendingId] || null;
  };

  const hasPendingImages = Object.keys(pendingImages).length > 0;

  return {
    pendingImages,
    isUploading,
    hasPendingImages,
    addPendingImage,
    addPendingImages,
    removePendingImage,
    uploadAllPending,
    clearAllPending,
    getPendingImage,
  };
}