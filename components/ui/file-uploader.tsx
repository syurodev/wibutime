"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUploadFile } from "@/hooks/use-upload-file";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils/get-image-url";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

interface FileUploaderProps {
  readonly value?: string;
  readonly onValueChange?: (url: string) => void;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly type?: "avatar" | "novel" | "chapter" | "general";
}

export function FileUploader({
  value,
  onValueChange,
  disabled,
  className,
  type = "general",
}: FileUploaderProps) {
  const { uploadFile, isUploading, progress, deleteFile } = useUploadFile({
    onUploadError: (error: any) => {
      toast.error(error.message || "Upload failed");
    },
  });

  console.log("FileUploader rendered", { value, disabled, isUploading });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // If there's an existing value, try to extract the key and delete it
      // If there's an existing value, try to delete it
      if (value) {
        let keyToDelete = value;
        if (value.startsWith("http")) {
          try {
            const url = new URL(value);
            keyToDelete = url.pathname.slice(1);
          } catch (e) {
            console.error("Error parsing URL for deletion:", e);
          }
        }
        await deleteFile(keyToDelete);
      }

      const result = await uploadFile(file, type);
      if (result) {
        onValueChange?.(result.key);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        let keyToDelete = value;
        if (value.startsWith("http")) {
          const url = new URL(value);
          keyToDelete = url.pathname.slice(1);
        }
        await deleteFile(keyToDelete);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
    onValueChange?.("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
      />

      <AspectRatio ratio={2 / 3}>
        {value ? (
          <div className="relative h-full w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={getImageUrl(value)}
              alt="Upload preview"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-full w-full flex-col gap-2 border-dashed"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {isUploading ? "Uploading..." : "Upload Image"}
            </span>
          </Button>
        )}
      </AspectRatio>

      {isUploading && (
        <div className="w-full space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}
