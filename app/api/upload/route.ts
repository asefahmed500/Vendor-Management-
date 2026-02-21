import { NextRequest, NextResponse } from 'next/server';
import { authGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { uploadBuffer, validateFileType } from '@/lib/cloudinary/config';

/**
 * Helper function to sanitize error messages for production
 * In production, returns generic error message to avoid exposing sensitive information
 */
function getSanitizedErrorMessage(error: unknown): string {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment && error instanceof Error) {
    return error.message;
  }

  // In production, return generic error message
  return 'An error occurred while processing your request';
}

/**
 * POST /api/upload
 * Upload a file to Cloudinary
 *
 * Request body (FormData):
 * - file: File (required)
 * - folder: string (optional, default: 'vms-documents')
 *
 * Response:
 * - success: boolean
 * - data: { url, publicId, format, bytes, resourceType }
 * - error: string (if failed)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { authorized, user } = await authGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || undefined;

    // Validate file
    if (!file) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(file.name, file.type)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid file type. Allowed types: PDF, JPG, PNG, DOCX',
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760');
    if (file.size > maxSize) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadBuffer(buffer, file.name, {
      folder: folder || `vms-documents/${user.userId}`,
      resource_type: 'auto',
    });

    return NextResponse.json<ApiResponse<{
      url: string;
      publicId: string;
      secureUrl: string;
      format: string;
      bytes: number;
      resourceType: string;
    }>>(
      {
        success: true,
        data: {
          url: result.url,
          publicId: result.publicId,
          secureUrl: result.secureUrl,
          format: result.format,
          bytes: result.bytes,
          resourceType: result.resourceType,
        },
        message: 'File uploaded successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: getSanitizedErrorMessage(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload
 * Delete a file from Cloudinary
 *
 * Request body:
 * - publicId: string (required)
 *
 * Response:
 * - success: boolean
 * - error: string (if failed)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { authorized } = await authGuard(request);

    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const { deleteFile } = await import('@/lib/cloudinary/config');
    await deleteFile(publicId);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'File deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: getSanitizedErrorMessage(error) },
      { status: 500 }
    );
  }
}
