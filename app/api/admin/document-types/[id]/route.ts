import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError } from '@/lib/middleware/errorHandler';
import connectDB from '@/lib/db/connect';
import DocumentType from '@/lib/db/models/DocumentType';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(['BUSINESS_REGISTRATION', 'TAX', 'BANKING', 'CERTIFICATES_LICENCES', 'INSURANCE', 'CUSTOM']).optional(),
  description: z.string().optional(),
  isRequired: z.boolean().optional(),
  isActive: z.boolean().optional(),
  allowedFormats: z.array(z.string()).optional(),
  maxSizeMB: z.number().min(1).max(50).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized } = await adminGuard(request);

    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = updateSchema.parse(body);
    const { id } = await params;

    await connectDB();

    const documentType = await DocumentType.findByIdAndUpdate(
      id,
      validated,
      { new: true }
    );

    if (!documentType) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Document type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          documentType: {
            ...documentType.toObject(),
            _id: documentType._id.toString(),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error' },
        { status: 400 }
      );
    }
    return handleApiError(error, 'UpdateDocumentType');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized } = await adminGuard(request);

    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = await params;

    await connectDB();

    const documentType = await DocumentType.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!documentType) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Document type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          documentType: {
            ...documentType.toObject(),
            _id: documentType._id.toString(),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'PatchDocumentType');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized } = await adminGuard(request);

    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const documentType = await DocumentType.findByIdAndDelete(id);

    if (!documentType) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Document type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Document type deleted',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'DeleteDocumentType');
  }
}
