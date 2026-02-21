import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadOptions {
  folder?: string;
  resource_type?: 'auto' | 'image' | 'raw' | 'video';
  allowed_formats?: string[];
  max_file_size?: number;
  transformation?: string;
}

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  resourceType: string;
  createdAt: Date;
}

/**
 * Upload a file buffer to Cloudinary
 */
export async function uploadBuffer(
  buffer: Buffer,
  originalName: string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const {
    folder = 'vms-documents',
    resource_type = 'auto',
    max_file_size = 10485760, // 10MB default
  } = options;

  // Check file size
  if (buffer.length > max_file_size) {
    throw new Error(`File size exceeds maximum allowed size of ${max_file_size} bytes`);
  }

  // Generate a unique filename
  const uniquePublicId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: uniquePublicId,
        folder,
        resource_type,
        format: originalName.split('.').pop(),
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary upload failed: No result returned'));
          return;
        }

        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          format: result.format || '',
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          resourceType: result.resource_type,
          createdAt: new Date(typeof result.created_at === 'number' ? result.created_at * 1000 : result.created_at),
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Upload a base64 string to Cloudinary
 */
export async function uploadBase64(
  base64: string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const { folder = 'vms-documents', resource_type = 'auto' } = options;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64,
      {
        folder,
        resource_type,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary upload failed: No result returned'));
          return;
        }

        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          format: result.format || '',
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          resourceType: result.resource_type,
          createdAt: new Date(typeof result.created_at === 'number' ? result.created_at * 1000 : result.created_at),
        });
      }
    );
  });
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFile(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(new Error(`Cloudinary delete failed: ${error.message}`));
        return;
      }
      resolve();
    });
  });
}

/**
 * Get file info from Cloudinary
 */
export async function getFileInfo(publicId: string): Promise<UploadApiResponse | null> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.explicit(publicId, {}, (error, result) => {
      if (error) {
        reject(new Error(`Cloudinary info failed: ${error.message}`));
        return;
      }
      resolve(result);
    });
  });
}

/**
 * Validate file type for Cloudinary upload
 */
export function validateFileType(fileName: string, mimeType: string): boolean {
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'docx'];
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const extension = fileName.split('.').pop()?.toLowerCase();
  return (
    (extension && allowedExtensions.includes(extension)) || allowedMimeTypes.includes(mimeType)
  );
}

/**
 * Generate a Cloudinary signature for unsigned uploads (optional)
 */
export function generateSignature(): { signature: string; timestamp: number } {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET || ''
  );

  return { signature, timestamp };
}

/**
 * Get Cloudinary upload preset name (for unsigned uploads)
 */
export function getUploadPreset(): string {
  return process.env.CLOUDINARY_UPLOAD_PRESET || 'vms_unsigned_upload';
}

export { cloudinary };
