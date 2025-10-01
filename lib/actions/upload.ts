'use server';

export interface PresignedUploadResponse {
  presignedUrl: string;
  fields: Record<string, string>;
  finalUrl: string;
  key: string;
}

export interface UploadFileParams {
  fileName: string;
  fileType: string;
  fileSize: number;
}

/**
 * Server Action to generate presigned URL for direct R2 upload
 * This is currently mocked - replace with real R2 integration later
 */
export async function getPresignedUrl(params: UploadFileParams): Promise<PresignedUploadResponse> {
  const { fileName, fileType, fileSize } = params;

  // Validate file
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(fileType)) {
    throw new Error(`Invalid file type: ${fileType}. Allowed: ${validTypes.join(', ')}`);
  }

  if (fileSize > maxSize) {
    throw new Error(`File too large: ${(fileSize / 1024 / 1024).toFixed(2)}MB. Max: 10MB`);
  }

  // Generate unique key
  const timestamp = Date.now();
  const randomId = crypto.randomUUID();
  const fileExtension = fileName.split('.').pop() || 'jpg';
  const key = `editor-images/${timestamp}-${randomId}.${fileExtension}`;

  // Mock presigned URL and fields (simulate R2 response)
  const mockPresignedUrl = 'https://mock-r2-upload.example.com/upload';
  const mockFields = {
    key,
    'Content-Type': fileType,
    'x-amz-algorithm': 'AWS4-HMAC-SHA256',
    'x-amz-credential': 'mock-credential',
    'x-amz-date': new Date().toISOString(),
    'x-amz-signature': 'mock-signature',
    policy: 'mock-policy-base64',
  };

  // Final URL where file will be accessible
  const finalUrl = `https://your-r2-domain.com/${key}`;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    presignedUrl: mockPresignedUrl,
    fields: mockFields,
    finalUrl,
    key,
  };
}

/**
 * Batch presigned URLs for multiple files
 */
export async function getPresignedUrls(files: UploadFileParams[]): Promise<PresignedUploadResponse[]> {
  const promises = files.map(file => getPresignedUrl(file));
  return Promise.all(promises);
}