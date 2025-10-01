import { useEffect, useRef, useState } from 'react';
import type { PendingImageMap, PendingImageEntry } from '@/lib/editor/types';
import { uploadMultipleToR2, validateImageFile } from '@/lib/upload/cloudflare-r2';

export function usePendingImages() {
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
      validateImageFile(file);

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
      const uploadResults = await uploadMultipleToR2(files, 'editor-images');

      // Create mapping from pendingId to uploaded URL
      const urlMapping: Record<string, string> = {};
      const pendingIds = Object.keys(pendingImages);

      uploadResults.forEach((result, index) => {
        const pendingId = pendingIds[index];
        if (pendingId) {
          urlMapping[pendingId] = result.url;
        }
      });

      // Clear all pending images after successful upload
      clearAllPending();

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