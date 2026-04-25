import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError, NotFoundError } from '@/lib/middleware/errorHandler';
import connectDB from '@/lib/db/connect';
import DocumentType from '@/lib/db/models/DocumentType';
import { serialize } from '@/lib/utils/serialization';
import { updateDocumentTypeSchema } from '@/lib/validation/schemas/document';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectDB();

    const documentType = await DocumentType.findById(id).lean();

    if (!documentType) {
      throw new NotFoundError('Document type not found');
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          documentType: serialize(documentType),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetDocumentType');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = updateDocumentTypeSchema.parse(body);
    const { id } = await params;

    await connectDB();

    const documentType = await DocumentType.findByIdAndUpdate(
      id,
      validated,
      { new: true }
    ).lean();

    if (!documentType) {
      throw new NotFoundError('Document type not found');
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          documentType: serialize(documentType),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'UpdateDocumentType');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
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
    ).lean();

    if (!documentType) {
      throw new NotFoundError('Document type not found');
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          documentType: serialize(documentType),
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
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const documentType = await DocumentType.findByIdAndDelete(id);

    if (!documentType) {
      throw new NotFoundError('Document type not found');
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
