'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { Plate, usePlateEditor } from 'platejs/react';

import { EditorContainer, Editor } from '@/components/ui/editor';
import { EditorToolbar } from '@/components/ui/editor-toolbar';
import { BasicPlugins, createEmptyValue } from '@/lib/editor/plugins';
import { usePresignedUpload } from '@/hooks/use-presigned-upload';
import type { EditorProps, PendingImageMap } from '@/lib/editor/types';
import { cn } from '@/lib/utils';

export function PlateEditor({
  id,
  initialValue,
  onChange,
  onPendingImagesChange,
  valueOverride,
  readOnly = false,
  placeholder = 'Bắt đầu viết...',
  className,
  editorClassName,
}: EditorProps) {
  const {
    pendingImages,
    isUploading,
    addPendingImage,
    uploadAllPending,
    clearAllPending,
  } = usePresignedUpload();

  const editor = usePlateEditor({
    id,
    plugins: BasicPlugins,
    value: initialValue ?? createEmptyValue(),
  });

  // Handle value override (for controlled usage)
  useEffect(() => {
    if (!valueOverride || !editor) return;
    editor.tf.setValue(valueOverride);
    if (Object.keys(pendingImages).length > 0) {
      clearAllPending();
    }
  }, [editor, valueOverride, pendingImages, clearAllPending]);

  // Notify parent about pending images changes
  useEffect(() => {
    onPendingImagesChange?.(pendingImages);
  }, [pendingImages, onPendingImagesChange]);

  if (!editor) {
    return null;
  }

  const handleImageUpload = (files: FileList) => {
    const fileArray = Array.from(files);

    // Process each file individually
    fileArray.forEach(file => {
      // Create preview URL immediately for instant display
      const previewUrl = URL.createObjectURL(file);
      const pendingId = crypto.randomUUID();

      // Add to pending images tracking
      addPendingImage(file);

      // Insert image node with immediate preview
      editor.tf.insertNodes({
        id: crypto.randomUUID(),
        type: 'image',
        url: previewUrl, // Show immediately
        status: 'pending',
        pendingId,
        alt: file.name,
        children: [{ text: '' }],
      });

      // Add a paragraph after the image
      editor.tf.insertNodes({
        id: crypto.randomUUID(),
        type: 'p',
        children: [{ text: '' }],
      });
    });
  };

  const handleChange = ({ value }: { value: any }) => {
    onChange?.(value);
  };

  // Function to upload all pending images (called from parent when saving)
  const handleUploadPending = async () => {
    if (Object.keys(pendingImages).length === 0) {
      return {};
    }

    try {
      const urlMapping = await uploadAllPending();

      // Update all pending image nodes with uploaded URLs
      const editorValue = editor.tf.getValue();
      const updatedValue = updateImageUrls(editorValue, urlMapping);
      editor.tf.setValue(updatedValue);

      return urlMapping;
    } catch (error) {
      console.error('Failed to upload images:', error);
      throw error;
    }
  };

  // Store the upload function for external access (via ref if needed)
  const editorRef = React.useRef<PlateEditorRef>({
    uploadPendingImages: handleUploadPending,
  });

  editorRef.current.uploadPendingImages = handleUploadPending;

  return (
    <Plate editor={editor} onChange={handleChange}>
      {!readOnly && (
        <EditorToolbar
          className="mb-3 rounded-lg border bg-muted/40 px-3 py-3"
          onImageUpload={handleImageUpload}
        />
      )}

      <EditorContainer className={cn('rounded-lg border', className)}>
        <Editor
          variant="demo"
          className={cn('min-h-[280px] px-6 py-4', editorClassName)}
          placeholder={placeholder}
          disabled={readOnly}
        />
      </EditorContainer>

      {/* Upload status indicator */}
      {isUploading && (
        <div className="mt-2 text-sm text-muted-foreground">
          Đang upload ảnh với presigned URL...
        </div>
      )}
    </Plate>
  );
}

// Helper function to update image URLs after upload
function updateImageUrls(value: any[], urlMapping: Record<string, string>): any[] {
  return value.map(node => {
    if (node.type === 'image' && node.status === 'pending' && node.pendingId) {
      const uploadedUrl = urlMapping[node.pendingId];
      if (uploadedUrl) {
        return {
          ...node,
          url: uploadedUrl,
          status: 'uploaded',
          pendingId: undefined,
        };
      }
    }

    if (node.children && Array.isArray(node.children)) {
      return {
        ...node,
        children: updateImageUrls(node.children, urlMapping),
      };
    }

    return node;
  });
}

// Export a ref type for accessing upload function
export type PlateEditorRef = {
  uploadPendingImages: () => Promise<Record<string, string>>;
};