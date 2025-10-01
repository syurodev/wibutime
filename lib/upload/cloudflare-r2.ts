import type { UploadResult } from '@/lib/editor/types';

export interface UploadToR2Options {
  file: File;
  filename?: string;
  folder?: string;
}

export async function uploadToCloudflareR2(options: UploadToR2Options): Promise<UploadResult> {
  const { file, filename, folder = 'editor-images' } = options;

  // Generate unique filename if not provided
  const finalFilename = filename || `${Date.now()}-${crypto.randomUUID()}-${file.name}`;
  const key = folder ? `${folder}/${finalFilename}` : finalFilename;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('key', key);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const result = await response.json();
    return {
      url: result.url,
      key: result.key,
    };
  } catch (error) {
    console.error('Upload to R2 failed:', error);
    throw error;
  }
}

export async function uploadMultipleToR2(files: File[], folder?: string): Promise<UploadResult[]> {
  const uploadPromises = files.map(file =>
    uploadToCloudflareR2({ file, folder })
  );

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple upload failed:', error);
    throw error;
  }
}

export function validateImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed: ${validTypes.join(', ')}`);
  }

  if (file.size > maxSize) {
    throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 10MB`);
  }

  return true;
}