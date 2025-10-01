import type { PresignedUploadResponse } from '@/lib/actions/upload';

export interface PresignedUploadResult {
  success: boolean;
  finalUrl: string;
  key: string;
  error?: string;
}

/**
 * Upload file using presigned URL
 * In real implementation, this would upload directly to R2
 * Currently mocked for development
 */
export async function uploadWithPresignedUrl(
  presignedUrl: string,
  fields: Record<string, string>,
  file: File,
  finalUrl: string
): Promise<PresignedUploadResult> {
  try {
    // Create FormData for presigned upload
    const formData = new FormData();

    // Add all the required fields first
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add the file last (required by S3/R2)
    formData.append('file', file);

    // Mock upload to presigned URL
    // In real implementation, this would be:
    // const response = await fetch(presignedUrl, { method: 'POST', body: formData });

    // Simulate upload time based on file size
    const uploadTime = Math.min(file.size / 100000, 2000); // Max 2 seconds
    await new Promise(resolve => setTimeout(resolve, uploadTime));

    // Mock successful response
    console.log('Mock presigned upload:', {
      presignedUrl,
      fields,
      fileName: file.name,
      fileSize: file.size,
      finalUrl
    });

    // Simulate occasional upload failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Mock upload failure - network error');
    }

    return {
      success: true,
      finalUrl,
      key: fields.key,
    };
  } catch (error) {
    console.error('Presigned upload failed:', error);
    return {
      success: false,
      finalUrl: '',
      key: fields.key || '',
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Complete upload workflow: get presigned URL + upload file
 */
export async function uploadFileWithPresigned(
  file: File,
  getPresignedUrlFn: (params: any) => Promise<PresignedUploadResponse>
): Promise<PresignedUploadResult> {
  try {
    // Step 1: Get presigned URL
    const presignedData = await getPresignedUrlFn({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    // Step 2: Upload file using presigned URL
    const result = await uploadWithPresignedUrl(
      presignedData.presignedUrl,
      presignedData.fields,
      file,
      presignedData.finalUrl
    );

    return result;
  } catch (error) {
    console.error('Complete upload workflow failed:', error);
    return {
      success: false,
      finalUrl: '',
      key: '',
      error: error instanceof Error ? error.message : 'Upload workflow failed',
    };
  }
}

/**
 * Upload multiple files in parallel
 */
export async function uploadMultipleWithPresigned(
  files: File[],
  getPresignedUrlFn: (params: any) => Promise<PresignedUploadResponse>
): Promise<PresignedUploadResult[]> {
  const uploadPromises = files.map(file =>
    uploadFileWithPresigned(file, getPresignedUrlFn)
  );

  return Promise.all(uploadPromises);
}

/**
 * Validate file before upload
 */
export function validateFileForUpload(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed: ${validTypes.join(', ')}`
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 10MB`
    };
  }

  return { valid: true };
}