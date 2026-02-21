import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface FileUploadResult {
  success: boolean;
  filePath?: string;
  url?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function validateFileType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

export function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  };
  return extensions[mimeType] || '';
}

export async function uploadFile(
  file: File,
  subfolder: string = 'documents'
): Promise<FileUploadResult> {
  try {
    if (!validateFileType(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed types: PDF, JPG, PNG, DOCX`,
      };
    }

    if (!validateFileSize(file.size)) {
      return {
        success: false,
        error: 'File size exceeds maximum limit of 10MB',
      };
    }

    const extension = getFileExtension(file.type);
    if (!extension) {
      return {
        success: false,
        error: 'Unable to determine file extension',
      };
    }

    const uniqueFilename = `${uuidv4()}${extension}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', subfolder);
    const filePath = join(uploadDir, uniqueFilename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const url = `/uploads/${subfolder}/${uniqueFilename}`;

    return {
      success: true,
      filePath,
      url,
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: 'Failed to upload file',
    };
  }
}

export async function deleteFile(relativePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const fullPath = join(process.cwd(), 'public', relativePath);
    await unlink(fullPath);
    return { success: true };
  } catch (error) {
    console.error('File delete error:', error);
    return {
      success: false,
      error: 'Failed to delete file',
    };
  }
}

export function getFileInfo(file: File): { name: string; size: number; type: string } {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  };
}
