import * as React from "react";
import { useR2Upload, type UploadedFile } from "./use-r2-upload";

interface UseUploadFileProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
  onUploadProgress?: (progress: number) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
  onUploadProgress,
}: UseUploadFileProps = {}) {
  console.log("useUploadFile hook called");
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();

  const {
    uploadFile: r2Upload,
    isUploading,
    progress,
  } = useR2Upload({
    onUploadProgress,
  });

  async function uploadFile(
    file: File,
    type: "avatar" | "novel" | "chapter" | "general" = "general"
  ) {
    setUploadingFile(file);
    setUploadedFile(undefined);

    try {
      const result = await r2Upload(file, type);
      setUploadedFile(result);
      onUploadComplete?.(result);
      return result;
    } catch (error) {
      onUploadError?.(error);
      // Toast is already handled in useR2Upload but we can add more specific handling here if needed
    } finally {
      setUploadingFile(undefined);
    }
  }

  async function deleteFile(key: string) {
    try {
      const res = await fetch("/api/upload/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!res.ok) throw new Error("Failed to delete file");
    } catch (error) {
      console.error("Delete error:", error);
      // We don't necessarily want to show an error to the user if background cleanup fails
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile,
    uploadingFile,
    deleteFile,
  };
}
