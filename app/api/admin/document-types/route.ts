import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError } from '@/lib/middleware/errorHandler';
import connectDB from '@/lib/db/connect';
import DocumentType from '@/lib/db/models/DocumentType';
import ActivityLog from '@/lib/db/models/ActivityLog';
import { serialize } from '@/lib/utils/serialization';
import { documentTypeSchema } from '@/lib/validation/schemas/document';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const documentTypes = await DocumentType.find({ isActive: true })
      .sort({ category: 1, name: 1 })
      .lean();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          documentTypes: serialize(documentTypes),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetDocumentTypes');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = documentTypeSchema.parse(body);

    await connectDB();

    const documentType = await DocumentType.create(validated);

    // Enterprise Audit Log
    await ActivityLog.create({
      performedBy: user.id,
      activityType: 'DOCUMENT_TYPE_CREATE',
      description: `Created new document type: ${documentType.name}`,
      metadata: { 
        documentTypeId: documentType._id.toString(), 
        name: documentType.name, 
        category: documentType.category 
      }
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          documentType: serialize(documentType),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, 'CreateDocumentType');
  }
}
