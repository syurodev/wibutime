import imageCompression from "browser-image-compression";
import { useState } from "react";
import { toast } from "sonner";

export interface UploadedFile {
  key: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

interface UseR2UploadOptions {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
  onUploadProgress?: (progress: number) => void;
}

export function useR2Upload(options: UseR2UploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (
    file: File,
    type: "avatar" | "novel" | "chapter" | "general" = "general"
  ) => {
    setIsUploading(true);
    setProgress(0);

    try {
      let fileToUpload = file;

      // Compress image if it is an image
      if (file.type.startsWith("image/")) {
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          fileToUpload = await imageCompression(file, options);
        } catch (error) {
          console.warn(
            "Image compression failed, uploading original file",
            error
          );
        }
      }

      // 1. Get Presigned URL
      const res = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
          type,
        }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      const { url, key, publicUrl } = await res.json();

      // 2. Upload to R2
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", fileToUpload.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(percentComplete);
            options.onUploadProgress?.(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(fileToUpload);
      });

      const uploadedFile: UploadedFile = {
        key,
        url: publicUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      options.onUploadComplete?.(uploadedFile);
      return uploadedFile;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
      options.onUploadError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadFile,
    isUploading,
    progress,
  };
}
